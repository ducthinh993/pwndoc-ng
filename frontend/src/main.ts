import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import axios from 'axios'
import { io } from 'socket.io-client'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

import App from './App.vue'
import routes from './router/routes'

// Import i18n messages
import messages from './i18n'

// Import services
import AuthService from './services/utils'
import SettingsService from './services/settings'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Create i18n instance
const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages,
})

// Create Vue app
const app = createApp(App)

// Configure axios
axios.defaults.baseURL = '/api'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Add axios to global properties
app.config.globalProperties.$axios = axios

// Configure Socket.IO
const socket = io('/', {
  autoConnect: false,
  secure: true,
  rejectUnauthorized: false,
})

// Add socket to global properties
app.config.globalProperties.$socket = socket

// Add lodash
app.use(VueLodash, { lodash })

// Add router and i18n
app.use(router)
app.use(i18n)

// Auth guard
router.beforeEach(async (to, from, next) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const user = await AuthService.getUser()
      if (user) {
        next()
      } else {
        localStorage.removeItem('token')
        next('/login')
      }
    } else if (to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  } catch (error) {
    console.error('Auth guard error:', error)
    if (to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  }
})

// Initialize settings
SettingsService.getSettings()
  .then(() => {
    // Mount app after settings are loaded
    app.mount('#app')
  })
  .catch(error => {
    console.error('Failed to load settings:', error)
    // Mount app anyway
    app.mount('#app')
  })

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error, info)
}

// Make services available globally
app.config.globalProperties.$auth = AuthService
app.config.globalProperties.$settings = SettingsService

export default app 