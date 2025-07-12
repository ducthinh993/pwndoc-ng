import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

import App from './App.vue'
import routes from './router/routes'

// Import i18n messages
import messages from './i18n'

// Import boot files
import axiosPlugin, { api } from './boot/axios'
import authPlugin from './boot/auth'
import settingsPlugin from './boot/settings'
import i18nPlugin from './boot/i18n'
import socketioPlugin from './boot/socketio'

// Import services
import UserService from './services/user'
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

// Install plugins
app.use(VueLodash, { lodash })
app.use(router)
app.use(i18n)

// Install boot plugins
axiosPlugin({ app })
authPlugin({ app })
settingsPlugin({ app })
i18nPlugin({ app })
socketioPlugin({ app })

// Make services available globally
app.config.globalProperties.$user = UserService
app.config.globalProperties.$settings = SettingsService

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error, info)
}

// Auth guard (simplified)
router.beforeEach(async (to, from, next) => {
  try {
    // Check if user is authenticated
    if (UserService.isAuth()) {
      next()
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

// Mount app
app.mount('#app')

// Add loaded class to prevent FOUC
document.getElementById('app')?.classList.add('loaded')

export default app 