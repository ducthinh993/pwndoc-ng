<template>
  <div
    :class="cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      {
        'h-8 w-8': size === 'sm',
        'h-10 w-10': size === 'default',
        'h-12 w-12': size === 'lg',
        'h-16 w-16': size === 'xl',
      },
      className
    )"
    :style="{
      backgroundColor: color ? getColorValue(color) : undefined,
      color: textColor ? getColorValue(textColor) : undefined,
    }"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      :class="cn('aspect-square h-full w-full object-cover')"
    />
    <div
      v-else
      :class="cn(
        'flex h-full w-full items-center justify-center text-sm font-medium',
        {
          'text-xs': size === 'sm',
          'text-sm': size === 'default',
          'text-base': size === 'lg',
          'text-lg': size === 'xl',
        }
      )"
    >
      <slot>
        {{ fallbackText }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  src?: string
  alt?: string
  size?: 'sm' | 'default' | 'lg' | 'xl'
  color?: string
  textColor?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  alt: '',
})

const fallbackText = computed(() => {
  if (props.alt) {
    return props.alt
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }
  return ''
})

// Helper function to handle semantic color names and convert to CSS values
function getColorValue(color: string): string {
  const semanticColors: Record<string, string> = {
    primary: 'hsl(var(--color-primary))',
    secondary: 'hsl(var(--color-secondary))',
    success: 'hsl(var(--color-success))',
    warning: 'hsl(var(--color-warning))',
    error: 'hsl(var(--color-destructive))',
    info: 'hsl(var(--color-info))',
    
    // Legacy compatibility
    positive: 'hsl(var(--color-success))',
    negative: 'hsl(var(--color-destructive))',
    green: 'hsl(var(--color-success))',
    red: 'hsl(var(--color-destructive))',
    blue: 'hsl(var(--color-info))',
    orange: 'hsl(var(--color-warning))',
    white: '#ffffff',
    black: '#000000',
  }
  
  return semanticColors[color] || color
}
</script> 