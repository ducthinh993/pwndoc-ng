<template>
  <div
    :class="cn(
      'inline-flex items-center gap-1 font-medium transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      {
        // Size variants
        'h-6 px-2 py-1 text-xs': size === 'sm',
        'h-7 px-2.5 py-1.5 text-xs': size === 'default',
        'h-8 px-3 py-2 text-sm': size === 'lg',
        
        // Style variants
        'bg-primary text-primary-foreground hover:bg-primary/80': variant === 'default',
        'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
        'bg-destructive text-destructive-foreground hover:bg-destructive/80': variant === 'destructive',
        'bg-success text-success-foreground hover:bg-success/80': variant === 'success',
        'bg-warning text-warning-foreground hover:bg-warning/80': variant === 'warning',
        'bg-info text-info-foreground hover:bg-info/80': variant === 'info',
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
        
        // Shape variants
        'rounded-full': shape === 'rounded',
        'rounded-md': shape === 'square',
        
        // Interactive states
        'cursor-pointer': clickable || removable,
        'opacity-50 cursor-not-allowed': disabled,
      },
      className
    )"
    :tabindex="(clickable || removable) && !disabled ? 0 : -1"
    role="button"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Leading Icon -->
    <slot name="icon" v-if="$slots.icon" />
    
    <!-- Icon (prop) -->
    <component
      v-if="icon"
      :is="icon"
      :class="cn('h-3 w-3', {
        'h-2.5 w-2.5': size === 'sm',
        'h-3 w-3': size === 'default',
        'h-4 w-4': size === 'lg',
      })"
    />
    
    <!-- Content -->
    <span
      v-if="$slots.default || label"
      :class="cn('truncate', {
        'max-w-20': size === 'sm',
        'max-w-24': size === 'default',
        'max-w-32': size === 'lg',
      })"
    >
      <slot>{{ label }}</slot>
    </span>
    
    <!-- Remove Button -->
    <button
      v-if="removable && !disabled"
      :class="cn(
        'ml-1 rounded-full p-0.5 hover:bg-black/20 focus:bg-black/20 focus:outline-none',
        'transition-colors duration-200',
        removeButtonClass
      )"
      @click.stop="handleRemove"
      @keydown.stop="handleRemoveKeydown"
      :aria-label="removeLabel"
    >
      <svg
        :class="cn('h-3 w-3', {
          'h-2.5 w-2.5': size === 'sm',
          'h-3 w-3': size === 'default',
          'h-4 w-4': size === 'lg',
        })"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <!-- Trailing Icon -->
    <slot name="trailing-icon" v-if="$slots['trailing-icon']" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant } from '@/lib/style-validators'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
type BadgeShape = 'rounded' | 'square'

interface BadgeProps {
  label?: string
  variant?: BadgeVariant
  size?: SizeVariant
  shape?: BadgeShape
  icon?: any
  clickable?: boolean
  removable?: boolean
  disabled?: boolean
  removeLabel?: string
  className?: string
  removeButtonClass?: string
}

interface BadgeEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'remove', event: MouseEvent): void
  (e: 'keydown', event: KeyboardEvent): void
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  size: 'default',
  shape: 'rounded',
  clickable: false,
  removable: false,
  disabled: false,
  removeLabel: 'Remove',
})

const emit = defineEmits<BadgeEmits>()

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  
  if (props.clickable) {
    emit('click', event)
  }
}

const handleRemove = (event: MouseEvent) => {
  if (props.disabled) return
  
  emit('remove', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  
  emit('keydown', event)
  
  // Handle Enter and Space for clickable badges
  if ((event.key === 'Enter' || event.key === ' ') && props.clickable) {
    event.preventDefault()
    emit('click', event as unknown as MouseEvent)
  }
}

const handleRemoveKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  
  // Handle Enter and Space for remove button
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('remove', event as unknown as MouseEvent)
  }
}

// Computed
const isInteractive = computed(() => {
  return (props.clickable || props.removable) && !props.disabled
})

// Expose methods
defineExpose({
  focus: () => {
    // Focus would be handled by parent component
  },
})
</script>

<style scoped>
/* Badge hover animations */
.inline-flex {
  transition: all 0.2s ease-in-out;
}

/* Focus ring styles */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

.focus\:ring-offset-2:focus {
  box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring));
}

/* Remove button hover state */
button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Badge variants with better contrast */
.bg-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.bg-secondary {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.bg-destructive {
  background-color: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}

.bg-green-600 {
  background-color: #16a34a;
  color: white;
}

.bg-yellow-600 {
  background-color: #ca8a04;
  color: white;
}

.bg-blue-600 {
  background-color: #2563eb;
  color: white;
}

/* Outline variant */
.border {
  border: 1px solid hsl(var(--border));
}

/* Disabled state */
.opacity-50 {
  opacity: 0.5;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

/* Responsive text truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Size-specific max widths */
.max-w-20 {
  max-width: 5rem;
}

.max-w-24 {
  max-width: 6rem;
}

.max-w-32 {
  max-width: 8rem;
}
</style> 