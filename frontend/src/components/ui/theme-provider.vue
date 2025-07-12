<template>
  <div :class="themeClasses" :data-theme="theme">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, provide, inject } from 'vue'

type Theme = 'light' | 'dark' | 'system'

interface ThemeConfig {
  theme: Theme
  systemTheme: 'light' | 'dark'
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

interface ThemeProviderProps {
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

const props = withDefaults(defineProps<ThemeProviderProps>(), {
  defaultTheme: 'system',
  storageKey: 'pwndoc-theme',
  enableSystem: true,
  disableTransitionOnChange: false,
})

// Theme state
const theme = ref<Theme>(props.defaultTheme)
const systemTheme = ref<'light' | 'dark'>('light')

// Computed values
const resolvedTheme = computed(() => {
  if (theme.value === 'system') {
    return systemTheme.value
  }
  return theme.value
})

const themeClasses = computed(() => {
  const baseClasses = ['min-h-screen', 'bg-background', 'text-foreground', 'transition-colors']

  if (resolvedTheme.value === 'dark') {
    baseClasses.push('dark')
  }

  return baseClasses.join(' ')
})

// Methods
const setTheme = (newTheme: Theme) => {
  if (props.disableTransitionOnChange) {
    // Disable transitions temporarily
    const css = document.createElement('style')
    css.appendChild(
      document.createTextNode(
        '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}',
      ),
    )
    document.head.appendChild(css)

    // Force reflow
    document.body.offsetHeight

    // Remove after a frame
    setTimeout(() => {
      document.head.removeChild(css)
    }, 1)
  }

  theme.value = newTheme

  // Update localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(props.storageKey, newTheme)
  }

  // Update document class
  updateDocumentClass()
}

const toggleTheme = () => {
  if (theme.value === 'light') {
    setTheme('dark')
  } else if (theme.value === 'dark') {
    setTheme(props.enableSystem ? 'system' : 'light')
  } else {
    setTheme('light')
  }
}

const updateDocumentClass = () => {
  if (typeof window === 'undefined') return

  const root = document.documentElement

  // Remove existing theme classes
  root.classList.remove('light', 'dark')

  // Add current theme class
  root.classList.add(resolvedTheme.value)

  // Set color scheme for better browser integration
  root.style.colorScheme = resolvedTheme.value
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const setupSystemThemeListener = () => {
  if (typeof window === 'undefined' || !props.enableSystem) return

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handleChange = (e: MediaQueryListEvent) => {
    systemTheme.value = e.matches ? 'dark' : 'light'
  }

  mediaQuery.addEventListener('change', handleChange)
  systemTheme.value = mediaQuery.matches ? 'dark' : 'light'

  return () => {
    mediaQuery.removeEventListener('change', handleChange)
  }
}

const loadStoredTheme = () => {
  if (typeof window === 'undefined') return

  const stored = localStorage.getItem(props.storageKey)
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    theme.value = stored as Theme
  }
}

// Theme context
const themeConfig: ThemeConfig = {
  get theme() { return theme.value },
  get systemTheme() { return systemTheme.value },
  get resolvedTheme() { return resolvedTheme.value },
  setTheme,
  toggleTheme,
}

// Provide theme context
provide('theme', themeConfig)

// Watch for theme changes
watch(resolvedTheme, updateDocumentClass, { immediate: true })

// Initialize on mount
onMounted(() => {
  loadStoredTheme()
  setupSystemThemeListener()
  updateDocumentClass()
})

// Expose methods
defineExpose({
  theme: computed(() => theme.value),
  resolvedTheme: computed(() => resolvedTheme.value),
  setTheme,
  toggleTheme,
})
</script>

<style scoped>
/* Theme transition styles */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Ensure proper inheritance */
:deep(*) {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Dark mode specific styles */
.dark {
  color-scheme: dark;
}

/* Light mode specific styles */
:not(.dark) {
  color-scheme: light;
}
</style>
