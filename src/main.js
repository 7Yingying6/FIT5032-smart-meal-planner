import { createApp } from 'vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.vue'
import { Icon } from '@iconify/vue'

const app = createApp(App)
app.use(router)
app.component('Icon', Icon)
app.mount('#app')
