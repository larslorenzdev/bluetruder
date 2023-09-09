import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faInfoCircle,faCaretDown, faCaretUp, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

library.add(faBars, faInfoCircle, faCaretDown, faCaretUp, faCircleQuestion)

import '@/main.scss'
import {createPinia} from "pinia";

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .mount('#app')
