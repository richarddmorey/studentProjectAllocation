/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/studentProjectAllocation/dist/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/main.js","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js?!./src/components/studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \"h1[data-v-499827ca] {\\n  color: darkslategrey;\\n  font-size: 2rem;\\n}\\n.dropzone[data-v-499827ca] {\\n  border: 2px dashed black;\\n  padding: 10px;\\n  min-width: 250px;\\n}\\ntextarea.logLines[data-v-499827ca] {\\n  width: 800px;\\n  height: 10em;\\n  white-space: pre;\\n  overflow-wrap: normal;\\n  overflow-x: scroll;\\n  overflow-y: scroll;\\n}\\n.files_container[data-v-499827ca] {\\n  display: flex;\\n  align-items: stretch;\\n  height: 7em;\\n}\\n.filename_container[data-v-499827ca] {\\n  margin: 5px;\\n}\\n.remove_button[data-v-499827ca] {\\n  background-color: #e4685d;\\n  border-radius: 42px;\\n  display: inline-block;\\n  cursor: pointer;\\n  color: #ffffff;\\n  font-family: Arial;\\n  font-size: 14px;\\n  padding: 2px 6px;\\n  text-decoration: none;\\n}\\n.last_message[data-v-499827ca] {\\n  background-color: #eee;\\n  border: 1px solid black;\\n  height: 1.5em;\\n  line-height: 1.5em;\\n  min-width: 250px;\\n}\\n.settings_container[data-v-499827ca] {\\n  margin: 10px;\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/studentAllocation.vue?./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js?!./src/components/studentAllocation.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./src/components/studentAllocation.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm.js\");\n/* harmony import */ var vue_js_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-js-modal */ \"./node_modules/vue-js-modal/dist/index.js\");\n/* harmony import */ var vue_js_modal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vue_js_modal__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ \"./node_modules/@fortawesome/fontawesome-svg-core/index.es.js\");\n/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ \"./node_modules/@fortawesome/free-solid-svg-icons/index.es.js\");\n/* harmony import */ var _fortawesome_vue_fontawesome__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/vue-fontawesome */ \"./node_modules/@fortawesome/vue-fontawesome/index.es.js\");\n/* harmony import */ var _allocate_worker_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./allocate.worker.js */ \"./src/components/allocate.worker.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_2__[\"library\"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__[\"faCogs\"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__[\"faFileUpload\"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__[\"faFileDownload\"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__[\"faPlay\"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__[\"faEject\"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__[\"faTrashAlt\"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_3__[\"faInfoCircle\"])\r\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].component('font-awesome-icon', _fortawesome_vue_fontawesome__WEBPACK_IMPORTED_MODULE_4__[\"FontAwesomeIcon\"])\r\n\r\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].use(vue_js_modal__WEBPACK_IMPORTED_MODULE_1___default.a)\r\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].config.productionTip = false\r\n\r\nconst worker = new _allocate_worker_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"]()\r\n\r\nconst initSPA = (lecturers, projects, students, options) => {\r\n  worker.postMessage(\r\n    {\r\n      type: 'init',\r\n      data: {\r\n        lecturers: lecturers,\r\n        projects: projects,\r\n        students: students\r\n      },\r\n      options: options\r\n    }\r\n  )\r\n}\r\n\r\nconst doSPA = () => {\r\n  worker.postMessage({ type: 'allocate' })\r\n}\r\n\r\nconst doRandomlyAllocate = () => {\r\n  worker.postMessage({ type: 'randomlyAllocate' })\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\r\n  name: 'StudentAllocation',\r\n  filters: {\r\n    kb: val => {\r\n      return Math.floor(val / 1024)\r\n    }\r\n  },\r\n  data () {\r\n    return {\r\n      autoRndUnassigned: true,\r\n      iterationLimit: 10000,\r\n      shuffleInit: true,\r\n      timeLimit: 60,\r\n      logLevel: 1,\r\n      rngSeed: Math.random().toString(36).substring(2, 15),\r\n      files: {\r\n        lecturers: {},\r\n        projects: {},\r\n        students: {}\r\n      },\r\n      unparsed: {},\r\n      parsed: {},\r\n      lastMessage: '',\r\n      logLines: '',\r\n      buttons: true,\r\n      readyToAllocate: false,\r\n      readyToDownload: false,\r\n      output: '',\r\n      scrollHeight: 0\r\n    }\r\n  },\r\n  mounted () {\r\n    worker.onmessage = event => {\r\n      const type = event.data.type\r\n      if (type === 'start') this.buttons = false\r\n      if (type === 'error') this.log([event.data.message])\r\n      if (type === 'log') this.log(event.data.message)\r\n      if (type === 'ready') {\r\n        this.buttons = true\r\n        if (event.data.message === 'allocate') {\r\n          this.readyToAllocate = true\r\n        } else if (event.data.message === 'out') {\r\n          const out = event.data.data\r\n          const colnames = Object.keys(out[0]).map(x => {\r\n            x = x.toString()\r\n            if (x.includes(',')) return `\"${x.replace('\"', '\"\"')}\"`\r\n            return x\r\n          }).join(',')\r\n          this.output = colnames + '\\n' +\r\n            out.map(x => {\r\n              const v = Object.values(x)\r\n              return v.map(x => {\r\n                if (x === null) return ''\r\n                x = x.toString()\r\n                if (x.includes(',')) return `\"${x.replace('\"', '\"\"')}\"`\r\n                return x\r\n              }).join(',')\r\n            }).join('\\n')\r\n          this.readyToDownload = true\r\n        }\r\n      }\r\n    }\r\n    this.interval = setInterval(() => {\r\n      this.scrollHeight = this.$refs.log.scrollHeight\r\n    }, 250)\r\n  },\r\n  destroyed () {\r\n    clearInterval(this.interval)\r\n  },\r\n  watch: {\r\n    readyToAllocate: function (val) {\r\n      this.readyToDownload = false\r\n      if (val) {\r\n        this.effectiveCaps()\r\n        const minUnallocated = Object.keys(this.parsed.students).length - this.totalCap\r\n        this.log([`***** Total effective cap is ${this.totalCap} spaces for students. At least ${minUnallocated} students will be unallocated`])\r\n        this.log(['***** Ready to allocate'])\r\n      }\r\n    },\r\n    scrollHeight () {\r\n      this.$refs.log.scrollTop = this.$refs.log.scrollHeight\r\n    },\r\n    iterationLimit () {\r\n      if (this.spa !== undefined) this.spa.options.iterationLimit = this.iterationLimit\r\n    },\r\n    timeLimit () {\r\n      if (this.spa !== undefined) this.spa.options.timeLimit = this.timeLimit\r\n    }\r\n  },\r\n  methods: {\r\n    log (m) {\r\n      const len = m.length\r\n      const mAll = m.join('\\n')\r\n      this.logLines = `${this.logLines}\\n${mAll}`\r\n      this.lastMessage = m[len - 1]\r\n    },\r\n    addFile (e, f) {\r\n      this.readyToAllocate = false\r\n      const droppedFiles = e.dataTransfer.files\r\n      if (!droppedFiles) return\r\n      // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/\r\n      this.files[f] = droppedFiles[0]\r\n      const reader = new FileReader()\r\n      const self = this\r\n      reader.onloadend = function (e) {\r\n        self.unparsed[f] = reader.result\r\n        self.validateFile(f)\r\n        if (f === 'lecturers' || f === 'projects') {\r\n          self.removeFile('students', false)\r\n        }\r\n        if (f === 'lecturers') {\r\n          self.removeFile('projects', false)\r\n        }\r\n      }\r\n      reader.readAsText(this.files[f])\r\n    },\r\n    resetAll () {\r\n      this.removeFile('lecturers', false)\r\n      this.lastMessage = ''\r\n      this.clearLog()\r\n    },\r\n    removeFile (f, message = true) {\r\n      this.readyToAllocate = false\r\n      const k = Object.keys(this.files)\r\n      const j = k.indexOf(f)\r\n      for (let i = j; i < k.length; i++) {\r\n        this.files[k[i]] = {};\r\n        ['unparsed', 'parsed'].forEach(x => {\r\n          this[x][k[i]] = undefined\r\n        })\r\n      }\r\n      if (message) {\r\n        this.clearLog()\r\n        this.log([`${f} file removed.`])\r\n      }\r\n    },\r\n    validateFile (f) {\r\n      this.readyToAllocate = false\r\n      if (f === 'lecturers') {\r\n        try {\r\n          this.readLecturersFile()\r\n        } catch (err) {\r\n          this.log([err.toString()])\r\n          this.removeFile('lecturers', false)\r\n          return\r\n        }\r\n        this.log([`* ${Object.keys(this.parsed.lecturers).length} lecturers read`])\r\n      } else if (f === 'projects') {\r\n        try {\r\n          this.readProjectsFile()\r\n        } catch (err) {\r\n          this.log([err.toString()])\r\n          this.removeFile('projects', false)\r\n          return\r\n        }\r\n        this.log([`* ${Object.keys(this.parsed.projects).length} projects read`])\r\n      } else if (f === 'students') {\r\n        try {\r\n          this.readStudentsFile()\r\n        } catch (err) {\r\n          this.log([err.toString()])\r\n          this.removeFile('students', false)\r\n          return\r\n        }\r\n        this.log([`* ${Object.keys(this.parsed.students).length} students read`])\r\n        const opts = {\r\n          shuffleInit: this.shuffleInit,\r\n          iterationLimit: this.iterationLimit,\r\n          timeLimit: this.timeLimit,\r\n          rngSeed: this.rngSeed,\r\n          logLevel: this.logLevel\r\n        }\r\n        try {\r\n          initSPA(this.parsed.lecturers, this.parsed.projects, this.parsed.students, opts)\r\n        } catch (err) {\r\n          this.log([err.toString()])\r\n          this.removeFile('students', false)\r\n        }\r\n      }\r\n    },\r\n    readLecturersFile () {\r\n      const c = this.unparsed.lecturers.split(/\\n/)\r\n      const lecturers = {}\r\n      for (const line of c) {\r\n        if (!/[^\\s]/.test(line)) continue // Nothing in string except white space\r\n        const a = line.trim().split(/\\s+/)\r\n        const id = a.shift()\r\n        if (id === undefined) continue\r\n        if (lecturers[id] !== undefined) throw new Error(`Duplicate id in lecturers file: ${id}`)\r\n        const cap = parseInt(a.shift() || '0', 10)\r\n        lecturers[id] = {\r\n          cap: cap,\r\n          prefs: [...new Set(a)],\r\n          projects: [],\r\n          pcap: 0\r\n        }\r\n      }\r\n      this.parsed.lecturers = lecturers\r\n    },\r\n    readProjectsFile () {\r\n      const c = this.unparsed.projects.split(/\\n/)\r\n      const projects = {}\r\n      for (const line of c) {\r\n        if (!/[^\\s]/.test(line)) continue // Nothing in string except white space\r\n        const [id, cap, lecturer] = line.trim().split(/\\s+/)\r\n        if (id === undefined) continue\r\n        if (projects.id !== undefined) throw new Error(`Duplicate id in projects file: ${id}`)\r\n        if (this.parsed.lecturers[lecturer] === undefined) throw new Error(`Lecturer ${lecturer} is named as supervisor of project ${id} but was not in the lecturers list.`)\r\n        const capn = parseInt(cap || '0', 10)\r\n        projects[id] = { cap: capn, lecturer: lecturer }\r\n        this.parsed.lecturers[lecturer].projects.push(id)\r\n        this.parsed.lecturers[lecturer].pcap += capn\r\n      }\r\n      this.parsed.projects = projects\r\n    },\r\n    readStudentsFile () {\r\n      const c = this.unparsed.students.split(/\\n/)\r\n      const students = {}\r\n      for (const line of c) {\r\n        if (!/[^\\s]/.test(line)) continue // Nothing in string except white space\r\n        const a = line.trim().split(/\\s+/)\r\n        if (a.length === 0) continue\r\n        const id = a.shift()\r\n        if (id === undefined) continue\r\n        if (students.id !== undefined) throw new Error(`Duplicate id in students file: ${id}`)\r\n        for (const p of a) {\r\n          if (this.parsed.projects[p] === undefined) throw new Error(`Project ${p} is listed by student ${id} but was not in the projects list.`)\r\n        }\r\n        students[id] = { prefs: [...new Set(a)] }\r\n      }\r\n      this.parsed.students = students\r\n    },\r\n    effectiveCaps () {\r\n      let totalCap = 0\r\n      for (const l of Object.keys(this.parsed.lecturers)) {\r\n        const lcap = this.parsed.lecturers[l].cap\r\n        const pcap = this.parsed.lecturers[l].pcap\r\n        const ecap = lcap < pcap ? lcap : pcap\r\n        this.parsed.lecturers[l].effectiveCap = ecap\r\n        totalCap += ecap\r\n      }\r\n      this.totalCap = totalCap\r\n    },\r\n    allocate () {\r\n      this.readyToDownload = false\r\n      try {\r\n        doSPA()\r\n        if (this.autoRndUnassigned) doRandomlyAllocate()\r\n      } catch (err) {\r\n        this.log(err.toString())\r\n      }\r\n    },\r\n    download () {\r\n      const blob = new Blob([this.output], { type: 'text/csv' })\r\n      const url = window.URL.createObjectURL(blob)\r\n      this.$refs.adownload.href = url\r\n      this.$refs.adownload.download = 'spa_output.txt'\r\n      this.$refs.adownload.click()\r\n      window.URL.revokeObjectURL(url)\r\n    },\r\n    clearLog () {\r\n      this.logLines = ''\r\n    },\r\n    showSettings () {\r\n      this.$modal.show('my-first-modal')\r\n    },\r\n    hideSettings () {\r\n      this.$modal.hide('my-first-modal')\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack:///./src/components/studentAllocation.vue?./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/studentAllocation.vue?vue&type=template&id=499827ca&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/studentAllocation.vue?vue&type=template&id=499827ca&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\", [\n    _c(\n      \"div\",\n      { attrs: { id: \"app\" } },\n      [\n        _c(\"modal\", { attrs: { name: \"my-first-modal\" } }, [\n          _c(\"div\", { staticClass: \"settings_container\" }, [\n            _c(\"div\", { staticClass: \"setting_one\" }, [\n              _c(\"label\", { attrs: { for: \"setting_ShuffleInit\" } }, [\n                _vm._v(\"Shuffle students first?\")\n              ]),\n              _vm._v(\" \"),\n              _c(\"input\", {\n                directives: [\n                  {\n                    name: \"model\",\n                    rawName: \"v-model\",\n                    value: _vm.shuffleInit,\n                    expression: \"shuffleInit\"\n                  }\n                ],\n                attrs: { type: \"checkbox\", id: \"setting_shuffleInit\" },\n                domProps: {\n                  checked: Array.isArray(_vm.shuffleInit)\n                    ? _vm._i(_vm.shuffleInit, null) > -1\n                    : _vm.shuffleInit\n                },\n                on: {\n                  change: function($event) {\n                    var $$a = _vm.shuffleInit,\n                      $$el = $event.target,\n                      $$c = $$el.checked ? true : false\n                    if (Array.isArray($$a)) {\n                      var $$v = null,\n                        $$i = _vm._i($$a, $$v)\n                      if ($$el.checked) {\n                        $$i < 0 && (_vm.shuffleInit = $$a.concat([$$v]))\n                      } else {\n                        $$i > -1 &&\n                          (_vm.shuffleInit = $$a\n                            .slice(0, $$i)\n                            .concat($$a.slice($$i + 1)))\n                      }\n                    } else {\n                      _vm.shuffleInit = $$c\n                    }\n                  }\n                }\n              })\n            ]),\n            _vm._v(\" \"),\n            _c(\"div\", { staticClass: \"setting_one\" }, [\n              _c(\"label\", { attrs: { for: \"setting_rndUnassigned\" } }, [\n                _vm._v(\"Randomly distribute unassigned students?\")\n              ]),\n              _vm._v(\" \"),\n              _c(\"input\", {\n                directives: [\n                  {\n                    name: \"model\",\n                    rawName: \"v-model\",\n                    value: _vm.autoRndUnassigned,\n                    expression: \"autoRndUnassigned\"\n                  }\n                ],\n                attrs: { type: \"checkbox\", id: \"setting_rndUnassigned\" },\n                domProps: {\n                  checked: Array.isArray(_vm.autoRndUnassigned)\n                    ? _vm._i(_vm.autoRndUnassigned, null) > -1\n                    : _vm.autoRndUnassigned\n                },\n                on: {\n                  change: function($event) {\n                    var $$a = _vm.autoRndUnassigned,\n                      $$el = $event.target,\n                      $$c = $$el.checked ? true : false\n                    if (Array.isArray($$a)) {\n                      var $$v = null,\n                        $$i = _vm._i($$a, $$v)\n                      if ($$el.checked) {\n                        $$i < 0 && (_vm.autoRndUnassigned = $$a.concat([$$v]))\n                      } else {\n                        $$i > -1 &&\n                          (_vm.autoRndUnassigned = $$a\n                            .slice(0, $$i)\n                            .concat($$a.slice($$i + 1)))\n                      }\n                    } else {\n                      _vm.autoRndUnassigned = $$c\n                    }\n                  }\n                }\n              })\n            ]),\n            _vm._v(\" \"),\n            _c(\"div\", { staticClass: \"setting_one\" }, [\n              _c(\"label\", { attrs: { for: \"setting_iterationLimit\" } }, [\n                _vm._v(\"Iteration limit:\")\n              ]),\n              _vm._v(\" \"),\n              _c(\"input\", {\n                directives: [\n                  {\n                    name: \"model\",\n                    rawName: \"v-model\",\n                    value: _vm.iterationLimit,\n                    expression: \"iterationLimit\"\n                  }\n                ],\n                attrs: { id: \"setting_iterationLimit\", type: \"number\" },\n                domProps: { value: _vm.iterationLimit },\n                on: {\n                  input: function($event) {\n                    if ($event.target.composing) {\n                      return\n                    }\n                    _vm.iterationLimit = $event.target.value\n                  }\n                }\n              })\n            ]),\n            _vm._v(\" \"),\n            _c(\"div\", { staticClass: \"setting_one\" }, [\n              _c(\"label\", { attrs: { for: \"setting_timeLimit\" } }, [\n                _vm._v(\"Time limit (seconds):\")\n              ]),\n              _vm._v(\" \"),\n              _c(\"input\", {\n                directives: [\n                  {\n                    name: \"model\",\n                    rawName: \"v-model\",\n                    value: _vm.timeLimit,\n                    expression: \"timeLimit\"\n                  }\n                ],\n                attrs: { id: \"setting_timeLimit\", type: \"number\" },\n                domProps: { value: _vm.timeLimit },\n                on: {\n                  input: function($event) {\n                    if ($event.target.composing) {\n                      return\n                    }\n                    _vm.timeLimit = $event.target.value\n                  }\n                }\n              })\n            ]),\n            _vm._v(\" \"),\n            _c(\"div\", { staticClass: \"setting_one\" }, [\n              _c(\"label\", { attrs: { for: \"setting_logLevel\" } }, [\n                _vm._v(\"Log level:\")\n              ]),\n              _vm._v(\" \"),\n              _c(\"input\", {\n                directives: [\n                  {\n                    name: \"model\",\n                    rawName: \"v-model\",\n                    value: _vm.logLevel,\n                    expression: \"logLevel\"\n                  }\n                ],\n                attrs: { id: \"setting_logLevel\", type: \"number\" },\n                domProps: { value: _vm.logLevel },\n                on: {\n                  input: function($event) {\n                    if ($event.target.composing) {\n                      return\n                    }\n                    _vm.logLevel = $event.target.value\n                  }\n                }\n              })\n            ]),\n            _vm._v(\" \"),\n            _c(\"div\", { staticClass: \"setting_one\" }, [\n              _c(\"label\", { attrs: { for: \"setting_rgnSeed\" } }, [\n                _vm._v(\"Random seed:\")\n              ]),\n              _vm._v(\" \"),\n              _c(\"input\", {\n                directives: [\n                  {\n                    name: \"model\",\n                    rawName: \"v-model\",\n                    value: _vm.rngSeed,\n                    expression: \"rngSeed\"\n                  }\n                ],\n                attrs: { id: \"setting_rngSeed\", placeholder: \"Seed string\" },\n                domProps: { value: _vm.rngSeed },\n                on: {\n                  input: function($event) {\n                    if ($event.target.composing) {\n                      return\n                    }\n                    _vm.rngSeed = $event.target.value\n                  }\n                }\n              })\n            ]),\n            _vm._v(\" \"),\n            _c(\n              \"a\",\n              {\n                staticClass: \"help_link\",\n                attrs: { href: \"/settings/\", target: \"_blank\" }\n              },\n              [\n                _c(\"font-awesome-icon\", {\n                  style: { color: \"DarkBlue\" },\n                  attrs: { icon: \"info-circle\", size: \"2x\" }\n                })\n              ],\n              1\n            )\n          ])\n        ]),\n        _vm._v(\" \"),\n        _c(\n          \"button\",\n          {\n            staticStyle: { margin: \"5px\" },\n            on: {\n              click: function($event) {\n                return _vm.showSettings()\n              }\n            }\n          },\n          [\n            _c(\"font-awesome-icon\", { attrs: { icon: \"cogs\", size: \"2x\" } }),\n            _vm._v(\" Settings\\n    \")\n          ],\n          1\n        ),\n        _vm._v(\" \"),\n        _c(\n          \"div\",\n          { staticClass: \"files_container\" },\n          _vm._l(_vm.files, function(v, f, i) {\n            return _c(\"div\", { key: f }, [\n              i === 0 || _vm.parsed[Object.keys(_vm.files)[i - 1]] !== undefined\n                ? _c(\n                    \"div\",\n                    {\n                      staticClass: \"dropzone\",\n                      on: {\n                        drop: function($event) {\n                          $event.preventDefault()\n                          return _vm.addFile($event, f)\n                        },\n                        dragover: function($event) {\n                          $event.preventDefault()\n                        }\n                      }\n                    },\n                    [\n                      _c(\"font-awesome-icon\", {\n                        attrs: { icon: \"file-upload\", size: \"2x\" }\n                      }),\n                      _vm._v(\" Drop \" + _vm._s(f) + \" file here\\n          \"),\n                      v.name !== undefined\n                        ? _c(\"div\", { staticClass: \"filename_container\" }, [\n                            _c(\n                              \"a\",\n                              {\n                                staticClass: \"remove_button\",\n                                attrs: { href: \"#\", title: \"Remove\" },\n                                on: {\n                                  click: function($event) {\n                                    return _vm.removeFile(f)\n                                  }\n                                }\n                              },\n                              [_vm._v(\"\\n              ×\\n            \")]\n                            ),\n                            _vm._v(\n                              \"\\n            \" +\n                                _vm._s(v.name) +\n                                \" (\" +\n                                _vm._s(_vm._f(\"kb\")(v.size)) +\n                                \" kb)\\n          \"\n                            )\n                          ])\n                        : _vm._e()\n                    ],\n                    1\n                  )\n                : _vm._e()\n            ])\n          }),\n          0\n        ),\n        _vm._v(\" \"),\n        _c(\"div\", { staticClass: \"last_message\" }, [\n          _vm._v(\"\\n      \" + _vm._s(_vm.lastMessage) + \"\\n    \")\n        ]),\n        _vm._v(\" \"),\n        _vm.files.lecturers.name !== undefined\n          ? _c(\n              \"button\",\n              {\n                attrs: { disabled: !_vm.buttons },\n                on: {\n                  click: function($event) {\n                    return _vm.resetAll()\n                  }\n                }\n              },\n              [\n                _c(\"font-awesome-icon\", {\n                  style: { color: \"#e4685d\" },\n                  attrs: { icon: \"eject\", size: \"2x\" }\n                }),\n                _vm._v(\" Reset all\\n    \")\n              ],\n              1\n            )\n          : _vm._e(),\n        _vm._v(\" \"),\n        _vm.readyToAllocate\n          ? _c(\n              \"button\",\n              {\n                attrs: { disabled: !_vm.buttons, title: \"Allocate\" },\n                on: {\n                  click: function($event) {\n                    return _vm.allocate()\n                  }\n                }\n              },\n              [\n                _c(\"font-awesome-icon\", {\n                  style: { color: \"DarkGreen\" },\n                  attrs: { icon: \"play\", size: \"2x\" }\n                }),\n                _vm._v(\" Allocate\\n    \")\n              ],\n              1\n            )\n          : _vm._e(),\n        _vm._v(\" \"),\n        _vm.readyToDownload\n          ? _c(\n              \"button\",\n              {\n                attrs: { disabled: !_vm.buttons, title: \"Download\" },\n                on: { click: _vm.download }\n              },\n              [\n                _c(\"font-awesome-icon\", {\n                  attrs: { icon: \"file-download\", size: \"2x\" }\n                }),\n                _vm._v(\" Download\\n    \")\n              ],\n              1\n            )\n          : _vm._e(),\n        _vm._v(\" \"),\n        _c(\"hr\"),\n        _vm._v(\" \"),\n        _c(\"textarea\", {\n          directives: [\n            {\n              name: \"model\",\n              rawName: \"v-model\",\n              value: _vm.logLines,\n              expression: \"logLines\"\n            }\n          ],\n          ref: \"log\",\n          staticClass: \"logLines\",\n          attrs: { disabled: \"\" },\n          domProps: { value: _vm.logLines },\n          on: {\n            input: function($event) {\n              if ($event.target.composing) {\n                return\n              }\n              _vm.logLines = $event.target.value\n            }\n          }\n        }),\n        _vm._v(\" \"),\n        _c(\n          \"button\",\n          {\n            attrs: { title: \"Clear log\" },\n            on: {\n              click: function($event) {\n                return _vm.clearLog()\n              }\n            }\n          },\n          [\n            _c(\"font-awesome-icon\", {\n              attrs: { icon: \"trash-alt\", size: \"2x\" }\n            }),\n            _vm._v(\" Clear log\\n    \")\n          ],\n          1\n        ),\n        _vm._v(\" \"),\n        _c(\"a\", { ref: \"adownload\" })\n      ],\n      1\n    )\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/studentAllocation.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js?!./src/components/studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options!./src/components/studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/sass-loader/dist/cjs.js!../../node_modules/vue-loader/lib??vue-loader-options!./studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true& */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js?!./src/components/studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true&\");\nif(typeof content === 'string') content = [[module.i, content, '']];\nif(content.locals) module.exports = content.locals;\n// add the styles to the DOM\nvar add = __webpack_require__(/*! ../../node_modules/vue-style-loader/lib/addStylesClient.js */ \"./node_modules/vue-style-loader/lib/addStylesClient.js\").default\nvar update = add(\"3813eb93\", content, false, {});\n// Hot Module Replacement\nif(false) {}\n\n//# sourceURL=webpack:///./src/components/studentAllocation.vue?./node_modules/vue-style-loader!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./src/components/allocate.worker.js":
/*!*******************************************!*\
  !*** ./src/components/allocate.worker.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Worker_fn; });\nfunction Worker_fn() {\n  return new Worker(__webpack_require__.p + \"allocate.worker.927e4895ff816ce8c5a2.worker.js\");\n}\n\n\n//# sourceURL=webpack:///./src/components/allocate.worker.js?");

/***/ }),

/***/ "./src/components/studentAllocation.vue":
/*!**********************************************!*\
  !*** ./src/components/studentAllocation.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _studentAllocation_vue_vue_type_template_id_499827ca_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./studentAllocation.vue?vue&type=template&id=499827ca&scoped=true& */ \"./src/components/studentAllocation.vue?vue&type=template&id=499827ca&scoped=true&\");\n/* harmony import */ var _studentAllocation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./studentAllocation.vue?vue&type=script&lang=js& */ \"./src/components/studentAllocation.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _studentAllocation_vue_vue_type_style_index_0_id_499827ca_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true& */ \"./src/components/studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true&\");\n/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(\n  _studentAllocation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _studentAllocation_vue_vue_type_template_id_499827ca_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _studentAllocation_vue_vue_type_template_id_499827ca_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  \"499827ca\",\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/studentAllocation.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/studentAllocation.vue?");

/***/ }),

/***/ "./src/components/studentAllocation.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./src/components/studentAllocation.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib??vue-loader-options!./studentAllocation.vue?vue&type=script&lang=js& */ \"./node_modules/vue-loader/lib/index.js?!./src/components/studentAllocation.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/studentAllocation.vue?");

/***/ }),

/***/ "./src/components/studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true&":
/*!********************************************************************************************************!*\
  !*** ./src/components/studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true& ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_style_index_0_id_499827ca_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-style-loader!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/sass-loader/dist/cjs.js!../../node_modules/vue-loader/lib??vue-loader-options!./studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true& */ \"./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js?!./src/components/studentAllocation.vue?vue&type=style&index=0&id=499827ca&lang=scss&scoped=true&\");\n/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_style_index_0_id_499827ca_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_style_index_0_id_499827ca_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);\n/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_style_index_0_id_499827ca_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_style_index_0_id_499827ca_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));\n /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_style_index_0_id_499827ca_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); \n\n//# sourceURL=webpack:///./src/components/studentAllocation.vue?");

/***/ }),

/***/ "./src/components/studentAllocation.vue?vue&type=template&id=499827ca&scoped=true&":
/*!*****************************************************************************************!*\
  !*** ./src/components/studentAllocation.vue?vue&type=template&id=499827ca&scoped=true& ***!
  \*****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_template_id_499827ca_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./studentAllocation.vue?vue&type=template&id=499827ca&scoped=true& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/studentAllocation.vue?vue&type=template&id=499827ca&scoped=true&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_template_id_499827ca_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_studentAllocation_vue_vue_type_template_id_499827ca_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/studentAllocation.vue?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm.js\");\n/* harmony import */ var _components_studentAllocation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/studentAllocation */ \"./src/components/studentAllocation.vue\");\n\r\n\r\n\r\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].component('studentAllocation', _components_studentAllocation__WEBPACK_IMPORTED_MODULE_1__[\"default\"])\r\n\r\n/* eslint-disable no-new */\r\nnew vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\r\n    el: '#app'\r\n})\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });