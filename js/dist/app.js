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
const lodash_1 = require("lodash");
const n_readlines_1 = __importDefault(require("n-readlines"));
const winston_1 = __importDefault(require("winston"));
const fs_1 = __importDefault(require("fs"));
class SPAStudent {
    constructor(lecturersFile, projectsFile, studentsFile, options) {
        const options0 = {
            shuffleInit: true,
            iterationLimit: 10000,
            timeLimit: 60,
            logLevel: 'info'
        };
        Object.assign(options0, options);
        this.options = options0;
        this.logger = winston_1.default.createLogger({
            level: this.options.logLevel,
            format: winston_1.default.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
                new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
                new winston_1.default.transports.File({ filename: 'combined.log' }),
            ],
        });
        this.logger.add(new winston_1.default.transports.Console({
            format: winston_1.default.format.simple(),
        }));
        this.fullProjects = new Set();
        this.fullLecturers = new Set();
        this.logger.log('info', 'Loading files');
        this.readLecturersFile(lecturersFile);
        this.readProjectsFile(projectsFile);
        this.readStudentsFile(studentsFile);
        this.unallocated = Object.keys(this.students);
        if (this.options.shuffleInit) {
            this.logger.log('info', 'Shuffling students');
            this.unallocated = lodash_1.shuffle(this.unallocated);
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
    readLecturersFile(lecturersFile) {
        const lectLines = new n_readlines_1.default(lecturersFile);
        const lecturers = {};
        while (true) {
            const line = lectLines.next();
            if (!line)
                break;
            const a = line.toString('ascii').trim().split(/\s+/);
            const id = a.shift();
            if (id === undefined)
                continue;
            if (lecturers[id] !== undefined)
                throw new Error(`Duplicate id in lecturers file: ${id}`);
            const cap = parseInt(a.shift() || '0', 10);
            if (cap < 1)
                this.fullLecturers.add(id);
            lecturers[id] = {
                'cap': cap, 'prefs': [...new Set(a)], 'projects': new Set()
            };
        }
        this.logger.log('info', 'Lecturers loaded');
        this.lecturers = lecturers;
    }
    readProjectsFile(projectsFile) {
        const projLines = new n_readlines_1.default(projectsFile);
        const projects = {};
        while (true) {
            const line = projLines.next();
            if (!line)
                break;
            const [id, cap, lecturer] = line.toString('ascii').trim().split(/\s+/);
            if (id === undefined)
                continue;
            if (projects.id !== undefined)
                throw new Error(`Duplicate id in projects file: ${id}`);
            if (this.lecturers[lecturer] === undefined)
                throw new Error(`Lecturer ${lecturer} is named as supervisor of project ${id} but was not in the lecturers list.`);
            const capn = parseInt(cap || '0', 10);
            if (capn < 1)
                this.fullProjects.add(id);
            projects[id] = { 'cap': capn, 'lecturer': lecturer };
            this.lecturers[lecturer].projects.add(id);
        }
        this.logger.log('info', 'Projects loaded');
        this.projects = projects;
    }
    readStudentsFile(studentsFile) {
        const studLines = new n_readlines_1.default('../perl/input/students.txt');
        const students = {};
        while (true) {
            const line = studLines.next();
            if (!line)
                break;
            const a = line.toString('ascii').trim().split(/\s+/);
            const id = a.shift();
            if (id === undefined)
                continue;
            if (students.id !== undefined)
                throw new Error(`Duplicate id in students file: ${id}`);
            for (const p of a) {
                if (this.projects[p] === undefined)
                    throw new Error(`Project ${p} is listed by student ${id} but was not in the projects list.`);
            }
            students[id] = { 'prefs': [...new Set(a)] };
        }
        this.logger.log('info', 'Students loaded');
        this.students = students;
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
        this.lecturersPP = lodash_1.cloneDeep(this.lecturers);
        for (const s of this.unallocated) {
            for (const p of this.students[s].prefs) {
                if (this.lecturersPP[this.projects[p].lecturer].prefs.indexOf(s) === -1) {
                    this.lecturersPP[this.projects[p].lecturer].prefs.push(s);
                }
            }
        }
        this.logger.log('info', 'Created lecturers projected preferences');
    }
    // projectsPP is L_k^j in Abraham et al.
    projectedPrefLkj() {
        const projectsPP = {};
        for (const p of Object.keys(this.projects)) {
            projectsPP[p] = { 'prefs': [] };
            for (const s of this.lecturersPP[this.projects[p].lecturer].prefs) {
                if (this.students[s].prefs.indexOf(p) !== -1) {
                    projectsPP[p].prefs.push(s);
                }
            }
        }
        this.projectsPP = projectsPP;
        this.logger.log('info', 'Created projects projected preferences');
    }
    assignStudent(s, p) {
        this.logger.log('info', `Assigning student ${s} to project ${p}`);
        const l = this.projects[p].lecturer;
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
            this.lecturerAssignments[l].push([s]);
        }
        this.studentAssignments[s] = p;
        const i = this.unallocated.indexOf(s);
        if (i !== -1)
            this.unallocated.splice(i, 1);
    }
    breakAssignment(s, p) {
        this.logger.log('info', `Breaking assignment of student ${s} to project ${p}`);
        const l = this.projects[p].lecturer;
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
        const pCap = this.projects[p].cap;
        const l = this.projects[p].lecturer;
        const lCap = this.lecturers[l].cap;
        // Assign student to p
        this.assignStudent(student, p);
        // check to see if project is overloaded
        if (this.projectAssignments[p].length > pCap) {
            this.logger.log('info', `Project ${p} is overloaded (cap ${this.projects[p].cap}; at ${this.projectAssignments[p].length})`);
            const worst = this.worstStudentForProject(p);
            this.breakAssignment(worst, p);
        }
        // check to see if lecturer is overloaded
        if (this.lecturerAssignments[l].length > lCap) {
            this.logger.log('info', `Lecturer ${l} is overloaded (cap ${this.lecturers[l].cap}; at ${this.lecturerAssignments[l].length})`);
            const worst = this.worstStudentForLecturer(l);
            this.breakAssignment(worst, p);
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
            this.fullLecturers.add(p);
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
            const p = freeProjects[Math.floor(Math.random() * freeProjects.length)];
            const pCap = this.projects[p].cap;
            const l = this.projects[p].lecturer;
            const lCap = this.lecturers[l].cap;
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
                this.fullLecturers.add(p);
            }
        }
    }
    output(path) {
        if (fs_1.default.existsSync(path)) {
            throw new Error(`File ${path} exists. Will not overwrite.`);
            return 1;
        }
        const dump = fs_1.default.createWriteStream(path, {
            flags: 'a' // 'a' means appending (old data will be preserved)
        });
        dump.write('student project project_cap lecturer lecturer_cap\n'); // append string to your file
        for (const p of Object.keys(this.projects)) {
            const pCap = this.projects[p].cap;
            const l = this.projects[p].lecturer;
            const lCap = this.lecturers[l].cap;
            if (this.projectAssignments[p] === undefined || this.projectAssignments[p].length === 0) {
                dump.write(`NA ${p} ${pCap} ${l} ${lCap}\n`);
            }
            else {
                for (const s of this.projectAssignments[p]) {
                    dump.write(`${s} ${p} ${pCap} ${l} ${lCap}\n`);
                }
            }
        }
        for (const s of this.unallocated) {
            dump.write(`${s} NA NA NA NA\n`);
        }
        dump.end();
        return 0;
    }
}
module.exports = {
    'SPAStudent': SPAStudent
};
