(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
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
            rngSeed: undefined
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
                    console.log(`${line.time} [${line.type}]: ${line.message}`);
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
    // projectsPP is L_k^j in Abraham et al.
    projectedPrefLkj() {
        this.projectsPP = {};
        for (const p of Object.keys(this.projects)) {
            this.projectsPP[p] = { 'prefs': [] };
            for (const s of this.lecturersPP[this.projects[p].lecturer].prefs) {
                if (this.students[s].prefs.indexOf(p) !== -1) {
                    this.projectsPP[p].prefs.push(s);
                }
            }
        }
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
            const p = freeProjects[Math.floor(this.rng() * freeProjects.length)];
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
    output() {
        const out = [];
        for (const p of Object.keys(this.projects)) {
            const pCap = this.projects[p].cap;
            const l = this.projects[p].lecturer;
            const lCap = this.lecturers[l].cap;
            if (this.projectAssignments[p] === undefined || this.projectAssignments[p].length === 0) {
                out.push({ student: 'NA', project: p, 'pCap': pCap, lecturer: l, 'lCap': lCap });
            }
            else {
                for (const s of this.projectAssignments[p]) {
                    out.push({ student: s, project: p, 'pCap': pCap, lecturer: l, 'lCap': lCap });
                }
            }
        }
        for (const s of this.unallocated) {
            out.push({ student: s, project: 'NA', pCap: 'NA', lecturer: 'NA', lCap: 'NA' });
        }
        return out;
    }
}
module.exports = {
    'SPAStudent': SPAStudent
};

},{"seedrandom":4}],3:[function(require,module,exports){
(function (global){(function (){
global.spa = require('./dist/spastudent.js');

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./dist/spastudent.js":2}],4:[function(require,module,exports){
// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = require('./lib/alea');

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = require('./lib/xor128');

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = require('./lib/xorwow');

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = require('./lib/xorshift7');

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = require('./lib/xor4096');

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = require('./lib/tychei');

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = require('./seedrandom');

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;

},{"./lib/alea":5,"./lib/tychei":6,"./lib/xor128":7,"./lib/xor4096":8,"./lib/xorshift7":9,"./lib/xorwow":10,"./seedrandom":11}],5:[function(require,module,exports){
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = String(data);
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],6:[function(require,module,exports){
// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],7:[function(require,module,exports){
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],8:[function(require,module,exports){
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);

},{}],9:[function(require,module,exports){
// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);


},{}],10:[function(require,module,exports){
// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],11:[function(require,module,exports){
/*
Copyright 2019 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (global, pool, math) {
//
// The following constants are related to IEEE 754 limits.
//

var width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = require('crypto');
  } catch (ex) {}
} else if ((typeof define) == 'function' && define.amd) {
  define(function() { return seedrandom; });
} else {
  // When included as a plain script, set up Math.seedrandom global.
  math['seed' + rngname] = seedrandom;
}


// End anonymous scope, and pass initial values.
})(
  // global: `self` in browsers (including strict mode and web workers),
  // otherwise `this` in Node and other environments
  (typeof self !== 'undefined') ? self : this,
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);

},{"crypto":1}]},{},[3]);
