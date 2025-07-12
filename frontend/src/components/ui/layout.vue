<template>
  <div 
    :class="cn(
      'min-h-screen bg-background font-sans antialiased',
      {
        'home-background': !isDark && backgroundClass === 'home-background',
      },
      className
    )"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  view?: string
  className?: string
  backgroundClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  view: 'hHr LpR lFf',
  backgroundClass: '',
})

// Get dark mode state from global context (assuming dark mode composable is available)
const isDark = inject('isDark', false)
</script>

<style scoped>
/* Home background styling - matches current Quasar styling */
.home-background {
  background-color: hsl(var(--color-layout-background));
}

/* Dark mode adjustments */
.dark .home-background {
  background-color: hsl(var(--color-background));
}
</style> 