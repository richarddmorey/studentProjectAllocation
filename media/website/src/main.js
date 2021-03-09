import Vue from 'vue'
import StudentAllocation from './components/studentAllocation'

Vue.component('studentAllocation', StudentAllocation)

/* eslint-disable no-new */
new Vue({
    el: '#app'
})