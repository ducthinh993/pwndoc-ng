import { getCurrentInstance } from 'vue'

export function useSettings() {
  const instance = getCurrentInstance()

  if (!instance) {
    throw new Error('useSettings must be used within a component')
  }

  return instance.appContext.config.globalProperties.$settings
}
