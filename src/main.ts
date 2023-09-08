import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faInfoCircle,faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

library.add(faBars, faInfoCircle, faCaretDown, faCaretUp)

import '@/main.scss'

createApp(App).mount('#app')
