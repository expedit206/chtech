import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './style.css'
// import from "lucide-vue-next";
// import  from "lucide-vue-next";
import App from './App.vue'

// Optionnel (config)
NProgress.configure({
  showSpinner: false, // enlève le petit cercle
  trickleSpeed: 200
})

import { createHead } from '@unhead/vue/client'
import router from './router'

const app = createApp(App)
const head = createHead()


app.use(createPinia())
app.use(router)
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  maxToasts: 5,
  newestOnTop: true
})
app.use(head)
app.mount('#app')
