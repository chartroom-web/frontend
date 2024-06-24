import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import createWebSocket from './functions/websocket'
import { Carousel3dPlugin } from '@nanoandrew4/vue3-carousel-3d'
import '@nanoandrew4/vue3-carousel-3d/dist/style.css'

import './css/index.css'

axios.defaults.withCredentials = true
const app = createApp(App)
app.use(Carousel3dPlugin)

app.config.globalProperties.$axios = axios

app.use(router)
app.use(Antd)

app.mount('#app')
