import { ref, computed, watch } from 'vue'

// Theme state
const isDarkMode = ref(false)

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const stored = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (stored) {
    isDarkMode.value = stored === 'dark'
  } else {
    isDarkMode.value = systemPrefersDark
  }
  
  applyTheme()
}

// Apply theme to document
const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Toggle theme
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  applyTheme()
}

// Set specific theme
const setDarkMode = (dark) => {
  isDarkMode.value = dark
  localStorage.setItem('theme', dark ? 'dark' : 'light')
  applyTheme()
}

// Watch for theme changes and apply them
watch(isDarkMode, applyTheme)

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    isDarkMode.value = e.matches
  }
})

export function useTheme() {
  // Initialize theme on first use
  if (typeof window !== 'undefined' && !document.documentElement.classList.contains('dark') && !document.documentElement.classList.contains('light')) {
    initializeTheme()
  }
  
  return {
    isDarkMode: computed(() => isDarkMode.value),
    toggleDarkMode,
    setDarkMode,
    initializeTheme
  }
} 