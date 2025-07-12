<template>
  <button
    :class="cn(baseButtonClasses, variantClasses, sizeClasses, stateClasses, className)"
    :disabled="disabled"
    :type="type"
    v-bind="$attrs"
  >
    <component
      :is="iconComponent"
      v-if="icon && iconPosition === 'left'"
      :name="icon"
      :class="cn('shrink-0', iconSizeClasses)"
    />
    <slot />
    <component
      :is="iconComponent"
      v-if="icon && iconPosition === 'right'"
      :name="icon"
      :class="cn('shrink-0', iconSizeClasses)"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { baseButtonClasses } from '@/lib/component-classes'
import { type SizeVariant, type ColorVariant, validateSize, validateColor } from '@/lib/style-validators'

interface Props {
  variant?: ColorVariant
  size?: SizeVariant
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  iconComponent?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  iconComponent: 'q-icon',
  type: 'button',
})

// Validate props to ensure type safety
if (!validateColor(props.variant)) {
  console.warn(`Invalid button variant: ${props.variant}`)
}

if (!validateSize(props.size)) {
  console.warn(`Invalid button size: ${props.size}`)
}

// Variant classes - exact mapping from Quasar button styles
const variantClasses = computed(() => {
  const variants = {
    // Default variant - matches q-btn default (primary color)
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
    
    // Primary variant - same as default for consistency
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
    
    // Secondary variant - matches q-btn secondary
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary',
    
    // Destructive variant - matches q-btn negative/danger
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
    
    // Outline variant - matches q-btn outline
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
    
    // Ghost variant - matches q-btn flat/ghost
    ghost: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
    
    // Link variant - matches q-btn link style
    link: 'text-primary underline-offset-4 hover:underline focus-visible:ring-primary',
  }
  return variants[props.variant]
})

// Size classes - exact mapping from Quasar button sizes
const sizeClasses = computed(() => {
  const sizes = {
    // Extra small - matches q-btn size="xs"
    xs: 'h-8 px-2 text-xs gap-1',
    
    // Small - matches q-btn size="sm"
    sm: 'h-9 px-3 text-sm gap-1.5',
    
    // Default - matches q-btn default size
    default: 'h-10 px-4 py-2 text-sm gap-2',
    
    // Large - matches q-btn size="lg"
    lg: 'h-11 px-8 text-base gap-2',
    
    // Extra large - matches q-btn size="xl"
    xl: 'h-12 px-10 text-lg gap-2.5',
  }
  return sizes[props.size]
})

// Icon size classes based on button size
const iconSizeClasses = computed(() => {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    default: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }
  return iconSizes[props.size]
})

// State classes for interactive states and loading
const stateClasses = computed(() => ({
  // Disabled state - matches q-btn disabled styling
  'opacity-50 cursor-not-allowed': props.disabled,
  
  // Loading state - matches q-btn loading styling
  'cursor-wait': props.loading,
  
  // Focus visible ring offset for non-outline variants
  'focus-visible:ring-offset-2': props.variant !== 'outline',
  
  // Additional state for outline variant
  'border-2': props.variant === 'outline',
}))
</script>

<style scoped>
/* Additional component-specific styles if needed */
.button-loading {
  position: relative;
}

.button-loading::after {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0.1;
  border-radius: inherit;
}
</style> 