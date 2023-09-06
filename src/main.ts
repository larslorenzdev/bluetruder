import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faBars, faInfoCircle)

import '@/main.scss'

createApp(App).mount('#app')
