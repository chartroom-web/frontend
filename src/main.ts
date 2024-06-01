import './css/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'


axios.defaults.withCredentials = true
const app = createApp(App)

app.config.globalProperties.$axios = axios

app.use(router)

app.mount('#app')
