<template>
  <button
    :class="cn(
      'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:bg-accent hover:text-accent-foreground',
      'border border-input bg-background',
      {
        'h-8 w-8': size === 'sm',
        'h-10 w-10': size === 'default',
        'h-12 w-12': size === 'lg',
      },
      className
    )"
    @click="toggleTheme"
    :aria-label="getAriaLabel()"
    :title="getTooltipText()"
    :disabled="disabled"
  >
    <!-- Sun Icon (Light Mode) -->
    <svg
      v-if="resolvedTheme === 'light'"
      :class="cn('transition-all', {
        'h-3 w-3': size === 'sm',
        'h-4 w-4': size === 'default',
        'h-5 w-5': size === 'lg',
      })"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>

    <!-- Moon Icon (Dark Mode) -->
    <svg
      v-else
      :class="cn('transition-all', {
        'h-3 w-3': size === 'sm',
        'h-4 w-4': size === 'default',
        'h-5 w-5': size === 'lg',
      })"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { useTheme } from '@/composables/useTheme'
import { type SizeVariant } from '@/lib/style-validators'

interface ThemeToggleProps {
  size?: SizeVariant
  disabled?: boolean
  className?: string
}

const props = withDefaults(defineProps<ThemeToggleProps>(), {
  size: 'default',
  disabled: false,
})

const { theme, resolvedTheme, toggleTheme } = useTheme()

const getAriaLabel = () => {
  return resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
}

const getTooltipText = () => {
  return resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
}
</script>

<style scoped>
/* Icon transition animations */
svg {
  transition: transform 0.2s ease-in-out;
}

button:hover svg {
  transform: scale(1.1);
}

button:active svg {
  transform: scale(0.95);
}

/* Smooth theme transition */
button {
  transition: all 0.2s ease-in-out;
}

/* Focus styles */
button:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover svg {
  transform: none;
}
</style> 