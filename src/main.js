import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import BaseModal from './components/BaseModal.vue'

const app = createApp(App)
app.use(router)
app.component('BaseModal', BaseModal);
app.mount('#app')