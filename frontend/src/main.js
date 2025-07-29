import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './style.css'
import clickOutside from './directives/clickOutside'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.directive('click-outside', clickOutside)

// Initialize auth state before mounting
async function initializeApp() {
const authStore = useAuthStore()
  await authStore.initializeAuth()
app.mount('#app')
}

initializeApp()
