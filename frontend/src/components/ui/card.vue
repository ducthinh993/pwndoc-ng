<template>
  <div :class="cn(baseCardClasses, variantClasses, sizeClasses, className)">
    <!-- Card Header -->
    <div
      v-if="$slots.header || title || subtitle"
      :class="cn('flex flex-col space-y-1.5', headerClasses, headerPaddingClasses)"
    >
      <slot name="header">
        <div v-if="title || subtitle" class="space-y-1">
          <h3 v-if="title" :class="cn('text-lg font-semibold leading-none tracking-tight', titleClasses)">
            {{ title }}
          </h3>
          <p v-if="subtitle" :class="cn('text-sm text-muted-foreground', subtitleClasses)">
            {{ subtitle }}
          </p>
        </div>
      </slot>
    </div>
    
    <!-- Card Content -->
    <div
      v-if="$slots.default"
      :class="cn(contentClasses, contentPaddingClasses, { 'pt-0': $slots.header || title || subtitle })"
    >
      <slot />
    </div>
    
    <!-- Card Actions/Footer -->
    <div
      v-if="$slots.actions || $slots.footer"
      :class="cn('flex items-center', actionsClasses, actionsPaddingClasses, { 'pt-0': $slots.default || $slots.header || title || subtitle })"
    >
      <slot name="actions">
        <slot name="footer" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { baseCardClasses } from '@/lib/component-classes'
import { type SizeVariant, validateSize } from '@/lib/style-validators'

interface Props {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat'
  size?: SizeVariant
  title?: string
  subtitle?: string
  className?: string
  headerClasses?: string
  contentClasses?: string
  actionsClasses?: string
  titleClasses?: string
  subtitleClasses?: string
  bordered?: boolean
  square?: boolean
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  bordered: true,
  square: false,
  tag: 'div',
})

// Validate props
if (!validateSize(props.size)) {
  console.warn(`Invalid card size: ${props.size}`)
}

// Variant classes - exact mapping from Quasar card styles
const variantClasses = computed(() => {
  const variants = {
    // Default variant - matches q-card default with border and shadow
    default: cn(
      'border bg-card text-card-foreground shadow-sm',
      {
        'border-0': !props.bordered,
        'rounded-none': props.square,
      }
    ),
    
    // Outlined variant - matches q-card outlined (border only, no shadow)
    outlined: cn(
      'border-2 bg-card text-card-foreground',
      {
        'border-0': !props.bordered,
        'rounded-none': props.square,
      }
    ),
    
    // Elevated variant - matches q-card with stronger shadow
    elevated: cn(
      'bg-card text-card-foreground shadow-lg',
      {
        'border': props.bordered,
        'rounded-none': props.square,
      }
    ),
    
    // Flat variant - matches q-card flat (no border, no shadow)
    flat: cn(
      'bg-card text-card-foreground',
      {
        'border': props.bordered,
        'rounded-none': props.square,
      }
    ),
  }
  
  return variants[props.variant]
})

// Size classes - controls overall card sizing
const sizeClasses = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    default: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }
  return sizes[props.size]
})

// Padding classes based on size - matches q-card-section padding
const headerPaddingClasses = computed(() => {
  const paddingMap = {
    xs: 'p-3',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-7',
    xl: 'p-8',
  }
  return paddingMap[props.size]
})

const contentPaddingClasses = computed(() => {
  const paddingMap = {
    xs: 'p-3',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-7',
    xl: 'p-8',
  }
  return paddingMap[props.size]
})

const actionsPaddingClasses = computed(() => {
  const paddingMap = {
    xs: 'p-3',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-7',
    xl: 'p-8',
  }
  return paddingMap[props.size]
})
</script>

<style scoped>
/* Card specific styles */
.card-hover {
  transition: all 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Dark mode adjustments */
.dark .card-hover:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* Card sections separator */
.card-section + .card-section {
  border-top: 1px solid hsl(var(--color-border));
}
</style> 