"use strict";
/*********
*
* Code by Richard D. Morey,
* February 2021
*
*********/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const n_readlines_1 = __importDefault(require("n-readlines"));
const winston_1 = __importDefault(require("winston"));
const options = {
    shuffleInit: true,
    randomUnallocated: true,
    iterationLimit: 10000,
    timeLimit: 60
};
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'combined.log' }),
    ],
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
logger.log('info', 'Logger initialized.');
function assignStudent(s, p) {
    logger.log('info', `Assigning student ${s} to project ${p}`);
    const l = projects[p].lecturer;
    if (projectAssignments[p] === undefined) {
        projectAssignments[p] = [s];
    }
    else {
        projectAssignments[p].push(s);
    }
    if (lecturerAssignments[l] === undefined) {
        lecturerAssignments[l] = [s];
    }
    else {
        lecturerAssignments[l].push([s]);
    }
    studentAssignments[s] = p;
    const i = unallocated.indexOf(s);
    if (i !== -1)
        unallocated.splice(i, 1);
}
function breakAssignment(s, p) {
    logger.log('info', `Breaking assignment of student ${s} to project ${p}`);
    const l = projects[p].lecturer;
    let i;
    i = projectAssignments[p].indexOf(s);
    if (i !== -1)
        projectAssignments[p].splice(i, 1);
    i = lecturerAssignments[l].indexOf(s);
    if (i !== -1)
        lecturerAssignments[l].splice(i, 1);
    studentAssignments[s] = undefined;
    unallocated.push(s);
}
function worstStudentForProject(p) {
    logger.log('info', `Finding worst student for project ${p}`);
    const prefList = projectsPP[p].prefs;
    let maxIdx = -1;
    for (const s of projectAssignments[p]) {
        const idx = prefList.indexOf(s);
        if (idx === -1)
            return s;
        maxIdx = idx > maxIdx ? idx : maxIdx;
    }
    return prefList[maxIdx];
}
function worstStudentForLecturer(l) {
    logger.log('info', `Finding worst student for lecturer ${l}`);
    const prefList = lecturersPP[l].prefs;
    let maxIdx = -1;
    for (const s of lecturerAssignments[l]) {
        const idx = prefList.indexOf(s);
        if (idx === -1)
            return s;
        maxIdx = idx > maxIdx ? idx : maxIdx;
    }
    return prefList[maxIdx];
}
function deleteSuccessorPrefs(s, p) {
    logger.log('info', `Deleting successors of project ${p} for student ${s}`);
    const prefList = projectsPP[p].prefs;
    const n = prefList.length;
    if (n === 0)
        return;
    const idx = prefList.indexOf(s);
    if (idx === -1 || idx === n)
        return;
    for (let i = idx + 1; i < n; i++) {
        const successor = prefList[i];
        const i0 = students[successor].prefs.indexOf(p);
        if (i0 !== -1)
            students[successor].prefs.splice(i0, 1);
    }
}
function deleteSuccessorPrefsAll(s, l) {
    logger.log('info', `Deleting successors of student ${s} for lecturer ${l}`);
    const prefList = lecturers[l].prefs;
    const n = prefList.length;
    if (n === 0)
        return;
    const idx = prefList.indexOf(s);
    if (idx === -1 || idx === n)
        return;
    for (let i = idx + 1; i < n; i++) {
        for (const p of lecturers[l].projects) {
            const successor = prefList[i];
            const i0 = projectsPP[p].prefs.indexOf(s);
            if (i0 !== -1)
                projectsPP[p].prefs.splice(i0, 1);
            const i1 = students[successor].prefs.indexOf(p);
            if (i1 !== -1)
                students[successor].prefs.splice(i1, 1);
        }
    }
}
logger.log('info', 'Loading files');
const lectLines = new n_readlines_1.default('../perl/input/lecturers.txt');
const projLines = new n_readlines_1.default('../perl/input/projects.txt');
const studLines = new n_readlines_1.default('../perl/input/students.txt');
const fullProjects = new Set();
const fullLecturers = new Set();
const lecturers = {};
while (true) {
    const line = lectLines.next();
    if (!line)
        break;
    const a = line.toString('ascii').trim().split(/\s+/);
    const id = a.shift();
    if (id === undefined)
        continue;
    if (lecturers.id !== undefined)
        throw new Error(`Duplicate id in lecturers file: ${id}`);
    const cap = parseInt(a.shift() || '0', 10);
    if (cap < 1)
        fullLecturers.add(id);
    lecturers[id] = {
        'cap': cap, 'prefs': [...new Set(a)], 'projects': new Set()
    };
}
logger.log('info', 'Lecturers loaded');
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
    if (lecturers[lecturer] === undefined)
        throw new Error(`Lecturer ${lecturer} is named as supervisor of project ${id} but was not in the lecturers list.`);
    const capn = parseInt(cap || '0', 10);
    if (capn < 1)
        fullProjects.add(id);
    projects[id] = { 'cap': capn, 'lecturer': lecturer };
    lecturers[lecturer].projects.add(id);
}
logger.log('info', 'Projects loaded');
const students = {};
let unallocated = [];
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
        if (projects[p] === undefined)
            throw new Error(`Project ${p} is listed by student ${id} but was not in the projects list.`);
    }
    students[id] = { 'prefs': [...new Set(a)] };
    unallocated.push(id);
}
logger.log('info', 'Students loaded');
if (options.shuffleInit) {
    logger.log('info', 'Shuffling students');
    unallocated = lodash_1.shuffle(unallocated);
}
logger.log('info', 'Creating projected preferences');
const lecturersPP = lodash_1.cloneDeep(lecturers);
for (const s of unallocated) {
    for (const p of students[s].prefs) {
        if (lecturersPP[projects[p].lecturer].prefs.indexOf(s) === -1) {
            lecturersPP[projects[p].lecturer].prefs.push(s);
        }
    }
}
logger.log('info', 'Created lecturers projected preferences');
const projectsPP = {};
for (const p of Object.keys(projects)) {
    projectsPP[p] = { 'prefs': [] };
    for (const s of lecturersPP[projects[p].lecturer].prefs) {
        if (students[s].prefs.indexOf(p) !== -1) {
            projectsPP[p].prefs.push(s);
        }
    }
}
logger.log('info', 'Created projects projected preferences');
const lecturerAssignments = {};
const projectAssignments = {};
const studentAssignments = {};
const startTime = Date.now();
let iterations = 0;
logger.log('info', `Starting algorithm at ${startTime}`);
while (true) {
    if (!unallocated.length) {
        logger.log('info', 'Break: No remaining unallocated students');
        break;
    }
    if (iterations >= options.iterationLimit) {
        logger.log('info', `Break: iteration limit (${options.iterationLimit}) reached`);
        break;
    }
    if ((Date.now() - startTime) > options.timeLimit * 1000) {
        logger.log('info', `Break: time limit (${options.timeLimit}s) reached`);
        break;
    }
    iterations++;
    logger.log('info', `Next: iteration ${iterations}`);
    // Find a student with a project left in their list
    let student = null;
    let nProjects = 0;
    for (const s of unallocated) {
        nProjects = students[s].prefs.length;
        if (nProjects > 0) {
            student = s;
            break;
        }
    }
    // all unallocated students have empty preference lists
    if (student === null) {
        logger.log('info', `Break: all remaining students now have empty preference lists`);
        break;
    }
    const p = students[student].prefs[0];
    const pCap = projects[p].cap;
    const l = projects[p].lecturer;
    const lCap = lecturers[l].cap;
    // Assign student to p
    assignStudent(student, p);
    // check to see if project is overloaded
    if (projectAssignments[p].length > pCap) {
        logger.log('info', `Project ${p} is overloaded (cap ${projects[p].cap}; at ${projectAssignments[p].length})`);
        const worst = worstStudentForProject(p);
        breakAssignment(worst, p);
    }
    // check to see if lecturer is overloaded
    if (lecturerAssignments[l].length > lCap) {
        logger.log('info', `Lecturer ${l} is overloaded (cap ${lecturers[l].cap}; at ${lecturerAssignments[l].length})`);
        const worst = worstStudentForLecturer(l);
        breakAssignment(worst, p);
    }
    // check to see if project is full
    if (projectAssignments[p].length === pCap) {
        logger.log('info', `Project ${p} is full (${projectAssignments[p]})`);
        const worst = worstStudentForProject(p);
        deleteSuccessorPrefs(worst, p);
        fullProjects.add(p);
    }
    // check to see if lecturer is full
    if (lecturerAssignments[l].length === lCap) {
        logger.log('info', `Lecturer ${l} is full (${lecturerAssignments[l]})`);
        const worst = worstStudentForLecturer(l);
        deleteSuccessorPrefsAll(worst, l);
        fullLecturers.add(p);
    }
}
const endTime = Date.now();
logger.log('info', `Ended algorithm at ${endTime}; took ${endTime - startTime}ms. ${unallocated.length} students unallocated`);
// randomly allocate the unallocated students, if possible
if (options.randomUnallocated) {
    logger.log('info', 'Distributing unallocated students');
    while (true) {
        // check if there are unallocated students
        if (unallocated.length === 0) {
            logger.log('info', 'Break: no unallocated students');
            break;
        }
        // check to see if any projects are free
        let freeProjects = Object.keys(projects).filter(x => !fullProjects.has(x));
        // eliminate those whose lecturers are not free
        freeProjects = freeProjects.filter(x => !fullLecturers.has(projects[x].lecturer));
        if (freeProjects.length === 0) {
            logger.log('info', 'Break: no free projects/lecturers');
            break;
        }
        const p = freeProjects[Math.floor(Math.random() * freeProjects.length)];
        const pCap = projects[p].cap;
        const l = projects[p].lecturer;
        const lCap = lecturers[l].cap;
        // Assign s to p
        const s = unallocated[0];
        assignStudent(s, p);
        // check to see if project is full
        if (projectAssignments[p].length === pCap) {
            logger.log('info', `Project ${p} is full (${projectAssignments[p]})`);
            fullProjects.add(p);
        }
        // check to see if lecturer is full
        if (lecturerAssignments[l].length === lCap) {
            logger.log('info', `Lecturer ${l} is full (${lecturerAssignments[l]})`);
            fullLecturers.add(p);
        }
    }
}
for (const p of Object.keys(projects)) {
    const l = projects[p].lecturer;
    console.log(`${p} ${projects[p].cap} ${l} ${lecturers[l].cap}: ${projectAssignments[p]}`);
}
