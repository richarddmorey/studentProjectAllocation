"use strict";
/*********
*  Code by Richard D. Morey,
*  February 2021
*
*  Based on the SPA-student algorithm of:
*  Abraham, D.J., Irving, R.W. and Manlove, D.F. (2007)
*  Two algorithms for the student-project allocation problem.
*  Journal of Discrete Algorithms, 5(1), pp. 73-90.
*  (doi:10.1016/j.jda.2006.03.006)
*********/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seedrandom_1 = __importDefault(require("seedrandom"));
// https://stackoverflow.com/a/12646864/1129889
function shuffle(array, rng) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
class SPAStudent {
    constructor(lecturers, projects, students, options) {
        if (lecturers === undefined || projects === undefined || students === undefined)
            throw new Error("Arguments lecturers, projects, and students must all be defined.");
        const options0 = {
            shuffleInit: true,
            iterationLimit: 10000,
            timeLimit: 60,
            logToConsole: false,
            validateInput: true,
            rngSeed: undefined,
            callback: (i, time, type, m) => { return; }
        };
        Object.assign(options0, options);
        this.options = options0;
        this.rng = seedrandom_1.default(this.options.rngSeed);
        this.log = [];
        this.logger = {
            log: (type, message) => {
                const line = { 'type': type, 'message': message, time: Date.now() };
                this.log.push(line);
                if (this.options.logToConsole)
                    console.log(`${line.time} // ${this.iterations} [${line.type}]: ${line.message}`);
                if (this.options.callback && {}.toString.call(this.options.callback) === '[object Function]') {
                    this.options.callback(this.iterations, line.time, line.type, line.message);
                }
            }
        };
        if (this.options.validateInput) {
            const v = this.validateInput(lecturers, projects, students);
            if (!v)
                throw new Error(`Could not validate input.`);
        }
        this.lecturers = lecturers;
        this.projects = projects;
        this.students = students;
        this.fullProjects = new Set();
        for (const p of Object.keys(projects))
            if (this.projects[p].cap < 1)
                this.fullProjects.add(p);
        this.fullLecturers = new Set();
        for (const l of Object.keys(lecturers))
            if (this.lecturers[l].cap < 1)
                this.fullLecturers.add(l);
        this.unallocated = Object.keys(this.students);
        this.unallocatedAfterSPA = [];
        if (this.options.shuffleInit) {
            this.logger.log('info', 'Shuffling students');
            shuffle(this.unallocated, this.rng);
        }
        this.logger.log('info', 'Creating projected preferences');
        this.projectedPrefLk();
        this.projectedPrefLkj();
        this.lecturerAssignments = {};
        this.projectAssignments = {};
        this.studentAssignments = {};
        this.iterations = 0;
        this.startTime = null;
        this.endTime = null;
    }
    validateInput(lecturers, projects, students) {
        const pkeys = Object.keys(projects);
        const skeys = Object.keys(students);
        const lkeys = Object.keys(lecturers);
        if (lkeys.length < 1)
            throw new Error("Must have at least one lecturer.");
        if (skeys.length < 1)
            throw new Error("Must have at least one student.");
        if (pkeys.length < 2)
            throw new Error("Must have at least two projects.");
        for (const p of pkeys) {
            if (isNaN(projects[p].cap))
                throw new Error(`Cap for project ${p} is not a number.`);
            const l = projects[p].lecturer;
            if (isNaN(lecturers[l].cap))
                throw new Error(`Cap for lecturer ${l} is not a number.`);
            if (lecturers[l] === undefined)
                throw new Error(`Project ${p} lists lecturer ${l} as supervisor, but ${l} was not found in the lecturer list.`);
        }
        for (const s of skeys) {
            for (const p of students[s].prefs) {
                if (projects[p] === undefined)
                    throw new Error(`Student ${s} lists project ${p} as preference, but ${p} was not found in the projects list.`);
            }
        }
        return true;
    }
    /************
    *  lecturersPP is L_k in Abraham et al. Notice that we add the students
    *  that are not in the lecturer's ranking, because in practice we might
    *  not have the lecturer preferences before the ranking. Section 2.1,
    *  paragraph 2, L_k is called a "strict order" of the B_k values. If we
    *  don't have that, we create it assuming that the lecturers are
    *  indifferent to the order of students they did not rank. Due to the
    *  way the code below works, the students will be in the order determined
    *  by the student list.
    *************/
    projectedPrefLk() {
        this.lecturersPP = {};
        for (const l of Object.keys(this.lecturers))
            this.lecturersPP[l] = { prefs: this.lecturers[l].prefs };
        for (const s of this.unallocated) {
            for (const p of this.students[s].prefs) {
                if (this.lecturersPP[this.projects[p].lecturer].prefs.indexOf(s) === -1) {
                    this.lecturersPP[this.projects[p].lecturer].prefs.push(s);
                }
            }
        }
        this.logger.log('info', 'Created lecturers projected preferences');
    }
    // projectsPP is L_k^j in Abraham et al. It also creates a project list for
    // every lecturer.
    projectedPrefLkj() {
        this.projectsPP = {};
        for (const p of Object.keys(this.projects)) {
            const l = this.projects[p].lecturer;
            if (this.lecturers[l].projects === undefined) {
                this.lecturers[l].projects = [p];
            }
            else {
                this.lecturers[l].projects.push(p);
            }
            this.projectsPP[p] = { 'prefs': [] };
            for (const s of this.lecturersPP[l].prefs) {
                if (this.students[s].prefs.indexOf(p) !== -1) {
                    this.projectsPP[p].prefs.push(s);
                }
            }
        }
        this.logger.log('info', 'Created projects projected preferences');
    }
    assignStudent(s, p) {
        const l = this.projects[p].lecturer;
        this.logger.log('info', `Assigning student ${s} to project ${p} of ${l}`);
        if (this.projectAssignments[p] === undefined) {
            this.projectAssignments[p] = [s];
        }
        else {
            this.projectAssignments[p].push(s);
        }
        if (this.lecturerAssignments[l] === undefined) {
            this.lecturerAssignments[l] = [s];
        }
        else {
            this.lecturerAssignments[l].push(s);
        }
        this.studentAssignments[s] = p;
        const i = this.unallocated.indexOf(s);
        if (i !== -1)
            this.unallocated.splice(i, 1);
    }
    breakAssignment(s) {
        const p = this.studentAssignments[s];
        const l = this.projects[p].lecturer;
        this.logger.log('info', `Breaking assignment of student ${s} to project ${p} of ${l}`);
        let i;
        i = this.projectAssignments[p].indexOf(s);
        if (i !== -1)
            this.projectAssignments[p].splice(i, 1);
        i = this.lecturerAssignments[l].indexOf(s);
        if (i !== -1)
            this.lecturerAssignments[l].splice(i, 1);
        this.studentAssignments[s] = undefined;
        this.unallocated.push(s);
    }
    worstStudentForProject(p) {
        this.logger.log('info', `Finding worst student for project ${p}`);
        const prefList = this.projectsPP[p].prefs;
        let maxIdx = -1;
        for (const s of this.projectAssignments[p]) {
            const idx = prefList.indexOf(s);
            if (idx === -1)
                return s;
            maxIdx = idx > maxIdx ? idx : maxIdx;
        }
        return prefList[maxIdx];
    }
    worstStudentForLecturer(l) {
        this.logger.log('info', `Finding worst student for lecturer ${l}`);
        const prefList = this.lecturersPP[l].prefs;
        let maxIdx = -1;
        for (const s of this.lecturerAssignments[l]) {
            const idx = prefList.indexOf(s);
            if (idx === -1)
                return s;
            maxIdx = idx > maxIdx ? idx : maxIdx;
        }
        return prefList[maxIdx];
    }
    deletePrefs(s, p) {
        this.logger.log('info', `Deleting ${p} for student ${s}`);
        const i0 = this.students[s].prefs.indexOf(p);
        if (i0 !== -1)
            this.students[s].prefs.splice(i0, 1);
        const i1 = this.projectsPP[p].prefs.indexOf(s);
        if (i1 !== -1)
            this.projectsPP[p].prefs.splice(i1, 1);
    }
    deleteSuccessorPrefs(s, p) {
        this.logger.log('info', `Deleting successors of project ${p} for student ${s}`);
        const prefList = this.projectsPP[p].prefs;
        const n = prefList.length;
        if (n === 0)
            return;
        const idx = prefList.indexOf(s);
        if (idx === -1 || idx === n)
            return;
        for (let i = n - 1; i > idx; i--) {
            const successor = prefList[i];
            this.deletePrefs(successor, p);
        }
    }
    deleteSuccessorPrefsAll(s, l) {
        this.logger.log('info', `Deleting successors of student ${s} for lecturer ${l}`);
        const prefList = this.lecturersPP[l].prefs;
        const n = prefList.length;
        if (n === 0)
            return;
        const idx = prefList.indexOf(s);
        if (idx === -1 || idx === n)
            return;
        for (const p of this.lecturers[l].projects) {
            for (let i = n - 1; i > idx; i--) {
                const successor = prefList[i];
                this.deletePrefs(successor, p);
            }
        }
    }
    // One iteration of the algorithm
    next() {
        if (!this.unallocated.length) {
            this.logger.log('info', 'Break: No remaining unallocated students');
            return 1;
        }
        this.iterations++;
        this.logger.log('info', `Next: iteration ${this.iterations}`);
        // Find a student with a project left in their list
        let student = null;
        let nProjects = 0;
        for (const s of this.unallocated) {
            nProjects = this.students[s].prefs.length;
            if (nProjects > 0) {
                student = s;
                break;
            }
        }
        // all unallocated students have empty preference lists
        if (student === null) {
            this.logger.log('info', `Break: all remaining students now have empty preference lists`);
            return 1;
        }
        const p = this.students[student].prefs[0];
        const pCap = parseInt(this.projects[p].cap, 10);
        const l = this.projects[p].lecturer;
        const lCap = parseInt(this.lecturers[l].cap, 10);
        // Assign student to p
        this.assignStudent(student, p);
        // check to see if project is overloaded
        if (this.projectAssignments[p].length > pCap) {
            this.logger.log('info', `Project ${p} is overloaded (cap ${this.projects[p].cap}; at ${this.projectAssignments[p].length})`);
            const worst = this.worstStudentForProject(p);
            this.breakAssignment(worst);
        }
        // check to see if lecturer is overloaded
        if (this.lecturerAssignments[l].length > lCap) {
            this.logger.log('info', `Lecturer ${l} is overloaded (cap ${this.lecturers[l].cap}; at ${this.lecturerAssignments[l].length})`);
            const worst = this.worstStudentForLecturer(l);
            this.breakAssignment(worst);
        }
        // check to see if project is full
        if (this.projectAssignments[p].length === pCap) {
            this.logger.log('info', `Project ${p} is full (${this.projectAssignments[p]})`);
            const worst = this.worstStudentForProject(p);
            this.deleteSuccessorPrefs(worst, p);
            this.fullProjects.add(p);
        }
        // check to see if lecturer is full
        if (this.lecturerAssignments[l].length === lCap) {
            this.logger.log('info', `Lecturer ${l} is full (${this.lecturerAssignments[l]})`);
            const worst = this.worstStudentForLecturer(l);
            this.deleteSuccessorPrefsAll(worst, l);
            this.fullLecturers.add(l);
        }
        return 0;
    }
    SPAStudent() {
        this.startTime = Date.now();
        this.logger.log('info', `Starting algorithm at ${this.startTime}`);
        while (true) {
            if (this.iterations >= this.options.iterationLimit) {
                this.logger.log('info', `Break: iteration limit (${this.options.iterationLimit}) reached`);
                break;
            }
            if ((Date.now() - this.startTime) > this.options.timeLimit * 1000) {
                this.logger.log('info', `Break: time limit (${this.options.timeLimit}s) reached`);
                break;
            }
            if (this.next())
                break;
        }
        this.endTime = Date.now();
        this.logger.log('info', `Ended algorithm at ${this.endTime}; took ${this.endTime - this.startTime}ms. ${this.unallocated.length} students unallocated`);
        this.unallocatedAfterSPA = [...this.unallocated];
    }
    randomizeUnallocated() {
        this.logger.log('info', 'Distributing unallocated students');
        while (true) {
            // check if there are unallocated students
            if (this.unallocated.length === 0) {
                this.logger.log('info', 'Break: no unallocated students');
                break;
            }
            // check to see if any projects are free
            let freeProjects = Object.keys(this.projects).filter(x => !this.fullProjects.has(x));
            // eliminate those whose lecturers are not free
            freeProjects = freeProjects.filter(x => !this.fullLecturers.has(this.projects[x].lecturer));
            if (freeProjects.length === 0) {
                this.logger.log('info', 'Break: no free projects/lecturers');
                break;
            }
            const p = freeProjects[Math.floor(this.rng() * freeProjects.length)];
            const pCap = parseInt(this.projects[p].cap, 10);
            const l = this.projects[p].lecturer;
            const lCap = parseInt(this.lecturers[l].cap, 10);
            // Assign s to p
            const s = this.unallocated[0];
            this.assignStudent(s, p);
            // check to see if project is full
            if (this.projectAssignments[p].length === pCap) {
                this.logger.log('info', `Project ${p} is full (${this.projectAssignments[p]})`);
                this.fullProjects.add(p);
            }
            // check to see if lecturer is full
            if (this.lecturerAssignments[l].length === lCap) {
                this.logger.log('info', `Lecturer ${l} is full (${this.lecturerAssignments[l]})`);
                this.fullLecturers.add(l);
            }
        }
    }
    output() {
        const out = [];
        for (const p of Object.keys(this.projects)) {
            const pCap = parseInt(this.projects[p].cap, 10);
            const l = this.projects[p].lecturer;
            const lCap = parseInt(this.lecturers[l].cap, 10);
            if (this.projectAssignments[p] === undefined || this.projectAssignments[p].length === 0) {
                out.push({ student: null, project: p, 'pCap': pCap, lecturer: l, 'lCap': lCap });
            }
            else {
                for (const s of this.projectAssignments[p]) {
                    out.push({ student: s, project: p, 'pCap': pCap, lecturer: l, 'lCap': lCap });
                }
            }
        }
        for (const s of this.unallocated) {
            out.push({ student: s, project: null, pCap: null, lecturer: null, lCap: null });
        }
        return out;
    }
}
module.exports = {
    'SPAStudent': SPAStudent
};
