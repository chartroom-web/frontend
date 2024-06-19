import './css/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import createWebSocket from './functions/websocket';

axios.defaults.withCredentials = true
const app = createApp(App)

app.config.globalProperties.$axios = axios

app.use(router)
app.use(Antd)

app.mount('#app')
