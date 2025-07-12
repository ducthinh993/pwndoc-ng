import { inject } from 'vue'

type Theme = 'light' | 'dark' | 'system'

interface ThemeConfig {
  theme: Theme
  systemTheme: 'light' | 'dark'
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export function useTheme(): ThemeConfig {
  const theme = inject<ThemeConfig>('theme')
  
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return theme
}

// Utility function to check if dark mode is active
export function isDarkMode(): boolean {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark'
}

// Utility function to get theme-aware classes
export function getThemeClasses(lightClass: string, darkClass: string): string {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark' ? darkClass : lightClass
}

// Export types for use in components
export type { Theme, ThemeConfig } 