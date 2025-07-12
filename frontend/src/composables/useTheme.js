import { ref, computed, watch, onMounted, inject } from 'vue'

// Theme types
const THEME_STORAGE_KEY = 'pwndoc-theme'
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

// Global theme state
const currentTheme = ref(THEMES.SYSTEM)
const systemPrefersDark = ref(false)

// Initialize system preference detection
const initializeSystemPreference = () => {
  if (typeof window === 'undefined') return

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemPrefersDark.value = mediaQuery.matches

  // Listen for system preference changes
  const handleSystemChange = (e) => {
    systemPrefersDark.value = e.matches
  }

  mediaQuery.addEventListener('change', handleSystemChange)

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleSystemChange)
  }
}

// Computed resolved theme
const resolvedTheme = computed(() => {
  if (currentTheme.value === THEMES.SYSTEM) {
    return systemPrefersDark.value ? THEMES.DARK : THEMES.LIGHT
  }
  return currentTheme.value
})

// Apply theme to document
const applyTheme = () => {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  const isDark = resolvedTheme.value === THEMES.DARK

  // Update class list
  root.classList.toggle('dark', isDark)
  root.classList.toggle('light', !isDark)

  // Update color scheme for better browser integration
  root.style.colorScheme = isDark ? 'dark' : 'light'

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isDark ? '#0d0d0d' : '#ffffff')
  }
}

// Load theme from storage
const loadStoredTheme = () => {
  if (typeof window === 'undefined') return

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored && Object.values(THEMES).includes(stored)) {
    currentTheme.value = stored
  }
}

// Save theme to storage
const saveTheme = (theme) => {
  if (typeof window === 'undefined') return

  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

// Initialize theme system
const initializeTheme = () => {
  initializeSystemPreference()
  loadStoredTheme()
  applyTheme()
}

// Watch for theme changes
watch(resolvedTheme, applyTheme, { immediate: true })

// Main composable
export function useTheme() {
  // Initialize on first use
  if (typeof window !== 'undefined' && !document.documentElement.classList.contains('dark') && !document.documentElement.classList.contains('light')) {
    initializeTheme()
  }

  // Set specific theme
  const setTheme = (theme) => {
    if (!Object.values(THEMES).includes(theme)) {
      console.warn(`Invalid theme: ${theme}. Must be one of: ${Object.values(THEMES).join(', ')}`)
      return
    }

    currentTheme.value = theme
    saveTheme(theme)
  }

  // Toggle between light and dark (skipping system)
  const toggleDarkMode = () => {
    const newTheme = resolvedTheme.value === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    setTheme(newTheme)
  }

  // Cycle through all themes (light -> dark -> system)
  const cycleTheme = () => {
    const themeOrder = [THEMES.LIGHT, THEMES.DARK, THEMES.SYSTEM]
    const currentIndex = themeOrder.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }

  return {
    // State
    theme: computed(() => currentTheme.value),
    resolvedTheme: computed(() => resolvedTheme.value),
    isDarkMode: computed(() => resolvedTheme.value === THEMES.DARK),
    isLightMode: computed(() => resolvedTheme.value === THEMES.LIGHT),
    isSystemMode: computed(() => currentTheme.value === THEMES.SYSTEM),
    systemPrefersDark: computed(() => systemPrefersDark.value),

    // Actions
    setTheme,
    toggleDarkMode,
    cycleTheme,
    initializeTheme,

    // Constants
    THEMES,

    // Utility functions
    isDark: (theme) => theme === THEMES.DARK,
    isLight: (theme) => theme === THEMES.LIGHT,
    isSystem: (theme) => theme === THEMES.SYSTEM,
  }
}

// Legacy compatibility functions for existing code
export const DarkMode = {
  set(darkMode) {
    const { setTheme } = useTheme()
    setTheme(darkMode ? THEMES.DARK : THEMES.LIGHT)
  },

  get isActive() {
    const { isDarkMode } = useTheme()
    return isDarkMode.value
  },

  toggle() {
    const { toggleDarkMode } = useTheme()
    toggleDarkMode()
  },
}

// Auto-initialize when module is loaded
if (typeof window !== 'undefined') {
  initializeTheme()
}
