<template>
  <div>
    <div
      id="app"
    >
      <modal name="my-first-modal">
        <div class="settings_container">
          <div class="setting_one">
            <label for="setting_ShuffleInit">Shuffle students first?</label>
            <input
              type="checkbox"
              id="setting_shuffleInit"
              v-model="shuffleInit"
            >
          </div>
          <div class="setting_one">
            <label for="setting_rndUnassigned">Randomly distribute unassigned students?</label>
            <input
              type="checkbox"
              id="setting_rndUnassigned"
              v-model="autoRndUnassigned"
            >
          </div>
          <div class="setting_one">
            <label for="setting_iterationLimit">Iteration limit:</label>
            <input
              v-model="iterationLimit"
              id="setting_iterationLimit"
              type="number"
            >
          </div>
          <div class="setting_one">
            <label for="setting_timeLimit">Time limit (seconds):</label>
            <input
              v-model="timeLimit"
              id="setting_timeLimit"
              type="number"
            >
          </div>
          <div class="setting_one">
            <label for="setting_logLevel">Log level:</label>
            <input
              v-model="logLevel"
              id="setting_logLevel"
              type="number"
            >
          </div>
          <div class="setting_one">
            <label for="setting_rgnSeed">Random seed:</label>
            <input
              v-model="rngSeed"
              id="setting_rngSeed"
              placeholder="Seed string"
            >
          </div>
          <!--button
            @click="hideSettings()"
          >
            Close
          </button-->
          <a
            href="/settings/"
            target="_blank"
            class="help_link"
          >
            <font-awesome-icon
              icon="info-circle"
              size="2x"
              :style="{ color: 'DarkBlue' }"
            />
          </a>
        </div>
      </modal>
      <button
        style="margin: 5px;"
        @click="showSettings()"
      >
        <font-awesome-icon
          icon="cogs"
          size="2x"
        /> Settings
      </button>
      <div class="files_container">
        <div
          v-for="(v, f, i) in files"
          :key="f"
        >
          <div
            class="dropzone"
            v-cloak
            @drop.prevent="addFile($event, f)"
            @dragover.prevent
            v-if="i === 0 || parsed[Object.keys(files)[i - 1]] !== undefined"
          >
            <font-awesome-icon
              icon="file-upload"
              size="2x"
            /> Drop {{ f }} file here
            <div
              v-if="v.name !== undefined"
              class="filename_container"
            >
              <a
                href="#"
                @click="removeFile(f)"
                title="Remove"
                class="remove_button"
              >
                &times;
              </a>
              {{ v.name }} ({{ v.size | kb }} kb)
            </div>
          </div>
        </div>
      </div>
      <div class="last_message">
        {{ lastMessage }}
      </div>
      <button
        :disabled="!buttons"
        @click="resetAll()"
        v-if="files.lecturers.name !== undefined"
      >
        <font-awesome-icon
          icon="eject"
          size="2x"
          :style="{ color: '#e4685d' }"
        /> Reset all
      </button>
      <button
        :disabled="!buttons"
        v-if="readyToAllocate"
        title="Allocate"
        @click="allocate()"
      >
        <font-awesome-icon
          icon="play"
          size="2x"
          :style="{ color: 'DarkGreen' }"
        /> Allocate
      </button>
      <button
        :disabled="!buttons"
        v-if="readyToDownload"
        title="Download"
        @click="download"
      >
        <font-awesome-icon
          icon="file-download"
          size="2x"
        /> Download
      </button>
      <hr>
      <textarea
        disabled
        class="logLines"
        v-model="logLines"
        ref="log"
      />
      <button
        @click="clearLog()"
        title="Clear log"
      >
        <font-awesome-icon
          icon="trash-alt"
          size="2x"
        /> Clear log
      </button>
      <a
        ref="adownload"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VModal from 'vue-js-modal'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCogs, faFileUpload, faFileDownload, faPlay, faEject, faTrashAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Worker from './allocate.worker.js'

library.add(faCogs, faFileUpload, faFileDownload, faPlay, faEject, faTrashAlt, faInfoCircle)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VModal)
Vue.config.productionTip = false

const worker = new Worker()

const initSPA = (lecturers, projects, students, options) => {
  worker.postMessage(
    {
      type: 'init',
      data: {
        lecturers: lecturers,
        projects: projects,
        students: students
      },
      options: options
    }
  )
}

const doSPA = () => {
  worker.postMessage({ type: 'allocate' })
}

const doRandomlyAllocate = () => {
  worker.postMessage({ type: 'randomlyAllocate' })
}

export default {
  name: 'StudentAllocation',
  filters: {
    kb: val => {
      return Math.floor(val / 1024)
    }
  },
  data () {
    return {
      autoRndUnassigned: true,
      iterationLimit: 10000,
      shuffleInit: true,
      timeLimit: 60,
      logLevel: 1,
      rngSeed: Math.random().toString(36).substring(2, 15),
      files: {
        lecturers: {},
        projects: {},
        students: {}
      },
      unparsed: {},
      parsed: {},
      lastMessage: '',
      logLines: '',
      buttons: true,
      readyToAllocate: false,
      readyToDownload: false,
      output: '',
      scrollHeight: 0
    }
  },
  mounted () {
    worker.onmessage = event => {
      const type = event.data.type
      if (type === 'start') this.buttons = false
      if (type === 'error') this.log([event.data.message])
      if (type === 'log') this.log(event.data.message)
      if (type === 'ready') {
        this.buttons = true
        if (event.data.message === 'allocate') {
          this.readyToAllocate = true
        } else if (event.data.message === 'out') {
          const out = event.data.data
          const colnames = Object.keys(out[0]).map(x => {
            x = x.toString()
            if (x.includes(',')) return `"${x.replace('"', '""')}"`
            return x
          }).join(',')
          this.output = colnames + '\n' +
            out.map(x => {
              const v = Object.values(x)
              return v.map(x => {
                if (x === null) return ''
                x = x.toString()
                if (x.includes(',')) return `"${x.replace('"', '""')}"`
                return x
              }).join(',')
            }).join('\n')
          this.readyToDownload = true
        }
      }
    }
    this.interval = setInterval(() => {
      this.scrollHeight = this.$refs.log.scrollHeight
    }, 250)
  },
  destroyed () {
    clearInterval(this.interval)
  },
  watch: {
    readyToAllocate: function (val) {
      this.readyToDownload = false
      if (val) {
        this.effectiveCaps()
        const minUnallocated = Object.keys(this.parsed.students).length - this.totalCap
        this.log([`***** Total effective cap is ${this.totalCap} spaces for students. At least ${minUnallocated} students will be unallocated`])
        this.log(['***** Ready to allocate'])
      }
    },
    scrollHeight () {
      this.$refs.log.scrollTop = this.$refs.log.scrollHeight
    },
    iterationLimit () {
      if (this.spa !== undefined) this.spa.options.iterationLimit = this.iterationLimit
    },
    timeLimit () {
      if (this.spa !== undefined) this.spa.options.timeLimit = this.timeLimit
    }
  },
  methods: {
    log (m) {
      const len = m.length
      const mAll = m.join('\n')
      this.logLines = `${this.logLines}\n${mAll}`
      this.lastMessage = m[len - 1]
    },
    addFile (e, f) {
      this.readyToAllocate = false
      const droppedFiles = e.dataTransfer.files
      if (!droppedFiles) return
      // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
      this.files[f] = droppedFiles[0]
      const reader = new FileReader()
      const self = this
      reader.onloadend = function (e) {
        self.unparsed[f] = reader.result
        self.validateFile(f)
        if (f === 'lecturers' || f === 'projects') {
          self.removeFile('students', false)
        }
        if (f === 'lecturers') {
          self.removeFile('projects', false)
        }
      }
      reader.readAsText(this.files[f])
    },
    resetAll () {
      this.removeFile('lecturers', false)
      this.lastMessage = ''
      this.clearLog()
    },
    removeFile (f, message = true) {
      this.readyToAllocate = false
      const k = Object.keys(this.files)
      const j = k.indexOf(f)
      for (let i = j; i < k.length; i++) {
        this.files[k[i]] = {};
        ['unparsed', 'parsed'].forEach(x => {
          this[x][k[i]] = undefined
        })
      }
      if (message) {
        this.clearLog()
        this.log([`${f} file removed.`])
      }
    },
    validateFile (f) {
      this.readyToAllocate = false
      if (f === 'lecturers') {
        try {
          this.readLecturersFile()
        } catch (err) {
          this.log([err.toString()])
          this.removeFile('lecturers', false)
          return
        }
        this.log([`* ${Object.keys(this.parsed.lecturers).length} lecturers read`])
      } else if (f === 'projects') {
        try {
          this.readProjectsFile()
        } catch (err) {
          this.log([err.toString()])
          this.removeFile('projects', false)
          return
        }
        this.log([`* ${Object.keys(this.parsed.projects).length} projects read`])
      } else if (f === 'students') {
        try {
          this.readStudentsFile()
        } catch (err) {
          this.log([err.toString()])
          this.removeFile('students', false)
          return
        }
        this.log([`* ${Object.keys(this.parsed.students).length} students read`])
        const opts = {
          shuffleInit: this.shuffleInit,
          iterationLimit: this.iterationLimit,
          timeLimit: this.timeLimit,
          rngSeed: this.rngSeed,
          logLevel: this.logLevel
        }
        try {
          initSPA(this.parsed.lecturers, this.parsed.projects, this.parsed.students, opts)
        } catch (err) {
          this.log([err.toString()])
          this.removeFile('students', false)
        }
      }
    },
    readLecturersFile () {
      const c = this.unparsed.lecturers.split(/\n/)
      const lecturers = {}
      for (const line of c) {
        if (!/[^\s]/.test(line)) continue // Nothing in string except white space
        const a = line.trim().split(/\s+/)
        const id = a.shift()
        if (id === undefined) continue
        if (lecturers[id] !== undefined) throw new Error(`Duplicate id in lecturers file: ${id}`)
        const cap = parseInt(a.shift() || '0', 10)
        lecturers[id] = {
          cap: cap,
          prefs: [...new Set(a)],
          projects: [],
          pcap: 0
        }
      }
      this.parsed.lecturers = lecturers
    },
    readProjectsFile () {
      const c = this.unparsed.projects.split(/\n/)
      const projects = {}
      for (const line of c) {
        if (!/[^\s]/.test(line)) continue // Nothing in string except white space
        const [id, cap, lecturer] = line.trim().split(/\s+/)
        if (id === undefined) continue
        if (projects.id !== undefined) throw new Error(`Duplicate id in projects file: ${id}`)
        if (this.parsed.lecturers[lecturer] === undefined) throw new Error(`Lecturer ${lecturer} is named as supervisor of project ${id} but was not in the lecturers list.`)
        const capn = parseInt(cap || '0', 10)
        projects[id] = { cap: capn, lecturer: lecturer }
        this.parsed.lecturers[lecturer].projects.push(id)
        this.parsed.lecturers[lecturer].pcap += capn
      }
      this.parsed.projects = projects
    },
    readStudentsFile () {
      const c = this.unparsed.students.split(/\n/)
      const students = {}
      for (const line of c) {
        if (!/[^\s]/.test(line)) continue // Nothing in string except white space
        const a = line.trim().split(/\s+/)
        if (a.length === 0) continue
        const id = a.shift()
        if (id === undefined) continue
        if (students.id !== undefined) throw new Error(`Duplicate id in students file: ${id}`)
        for (const p of a) {
          if (this.parsed.projects[p] === undefined) throw new Error(`Project ${p} is listed by student ${id} but was not in the projects list.`)
        }
        students[id] = { prefs: [...new Set(a)] }
      }
      this.parsed.students = students
    },
    effectiveCaps () {
      let totalCap = 0
      for (const l of Object.keys(this.parsed.lecturers)) {
        const lcap = this.parsed.lecturers[l].cap
        const pcap = this.parsed.lecturers[l].pcap
        const ecap = lcap < pcap ? lcap : pcap
        this.parsed.lecturers[l].effectiveCap = ecap
        totalCap += ecap
      }
      this.totalCap = totalCap
    },
    allocate () {
      this.readyToDownload = false
      try {
        doSPA()
        if (this.autoRndUnassigned) doRandomlyAllocate()
      } catch (err) {
        this.log(err.toString())
      }
    },
    download () {
      const blob = new Blob([this.output], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      this.$refs.adownload.href = url
      this.$refs.adownload.download = 'spa_output.txt'
      this.$refs.adownload.click()
      window.URL.revokeObjectURL(url)
    },
    clearLog () {
      this.logLines = ''
    },
    showSettings () {
      this.$modal.show('my-first-modal')
    },
    hideSettings () {
      this.$modal.hide('my-first-modal')
    }
  }
}
</script>

<style lang="scss" scoped>
$gray: darkslategrey;
h1 {
  color: $gray;
  font-size: 2rem;
}

.dropzone {
  border: 2px dashed black;
  padding: 10px;
  min-width: 250px;
}

textarea.logLines {
  width: 800px;
  height: 10em;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: scroll;
  overflow-y: scroll;
}

.files_container {
  display: flex;
  align-items: stretch;
  height: 7em;
}

.filename_container {
  margin: 5px;
}

.remove_button {
  background-color:#e4685d;
  border-radius:42px;
  display:inline-block;
  cursor:pointer;
  color:#ffffff;
  font-family:Arial;
  font-size:14px;
  padding:2px 6px;
  text-decoration:none;
}

.last_message {
  background-color: #eee;
  border: 1px solid black;
  height: 1.5em;
  line-height: 1.5em;
  min-width: 250px;
}

.settings_container {
  margin: 10px;
}
</style>
