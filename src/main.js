import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import {createHead} from '@vueuse/head'
import 'vue-toastification/dist/index.css'
import './style.css'
// import from "lucide-vue-next";
// import  from "lucide-vue-next";
import App from './App.vue'

import { createHead } from '@unhead/vue/client'
import router from './router'

const app = createApp(App)
const head = createHead()


app.use(createPinia())
app.use(router)
app.use(Toast)
app.use(head)
app.mount('#app')
