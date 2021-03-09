import { SPAStudent } from 'studentAllocation'

var spa
var log
var lastLog = Number.NEGATIVE_INFINITY
var logInterval = 500 // ms

addEventListener('message', async event => {
    const messageType = event.data.type
    switch (messageType) {
        case 'init':
            {
                log = []
                const lecturers = event.data.data.lecturers
                const projects = event.data.data.projects
                const students = event.data.data.students
                const options = event.data.options
                options.callback = (i, time, type, m) => {
                    let message = `${i}  ${m}`
                    if (i === undefined) message = `***** ${m}`
                    log.push(message)
                    const n = Date.now()
                    if ((n - lastLog) > logInterval) {
                        postMessage({ type: 'log', message: log })
                        lastLog = n
                        log = []
                    }
                }
                try {
                    postMessage({ type: 'start', message: 'init' })
                    spa = new SPAStudent(lecturers, projects, students, options)
                    postMessage({ type: 'log', message: log })
                    log = []
                    postMessage({ type: 'ready', message: 'allocate' })
                } catch (err) {
                    postMessage({ type: 'error', message: err.toString() })
                }
                break
            }
        case 'allocate':
            {
                try {
                    postMessage({ type: 'start', message: 'allocate' })
                    spa.SPAStudent()
                    postMessage({ type: 'log', message: log })
                    log = []
                    postMessage({ type: 'ready', message: 'out', data: spa.output() })
                } catch (err) {
                    postMessage({ type: 'error', message: err.toString() })
                }
                break
            }
        case 'randomlyAllocate':
            {
                try {
                    postMessage({ type: 'start', message: 'randomize' })
                    spa.randomizeUnallocated()
                    postMessage({ type: 'log', message: log })
                    log = []
                    postMessage({ type: 'ready', message: 'out', data: spa.output() })
                } catch (err) {
                    postMessage({ type: 'error', message: err.toString() })
                }
                break
            }
        default:
            postMessage({ type: 'error', message: 'Invalid action type.' })
            break
    }
})