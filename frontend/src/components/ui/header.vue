<template>
  <header 
    :class="cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      {
        'bg-fixed-primary border-b-0': variant === 'primary',
        'shadow-sm': elevated,
      },
      className
    )"
  >
    <div :class="cn('container flex items-center', containerClasses)">
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'primary'
  elevated?: boolean
  bordered?: boolean
  height?: string | number
  className?: string
  containerClasses?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  elevated: false,
  bordered: true,
  height: '64px',
})
</script>

<style scoped>
/* Header specific styles */
.bg-fixed-primary {
  background: hsl(var(--color-primary));
  color: hsl(var(--color-primary-foreground));
}

/* Container adjustments */
.container {
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style> 