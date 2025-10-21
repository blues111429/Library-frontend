import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import BaseModal from './components/BaseModal.vue'

const app = createApp(App)
const pinia = createPinia();

app.use(router)
app.use(pinia)
app.component('BaseModal', BaseModal);
app.mount('#app')