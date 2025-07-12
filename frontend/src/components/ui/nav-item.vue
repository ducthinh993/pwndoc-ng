<template>
  <component
    :is="tag"
    :class="cn(
      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      {
        // Active state
        'bg-accent text-accent-foreground': active,
        'hover:bg-accent hover:text-accent-foreground': !active && !disabled,

        // Disabled state
        'opacity-50 cursor-not-allowed': disabled,
        'cursor-pointer': !disabled && (clickable || to || href),

        // Nested levels
        'pl-6': level === 1,
        'pl-9': level === 2,
        'pl-12': level === 3,
        'pl-15': level === 4,

        // Dense variant
        'py-1': dense,
        'py-2': !dense,

        // Size variants
        'text-xs px-2 py-1': size === 'sm',
        'text-sm px-3 py-2': size === 'default',
        'text-base px-4 py-3': size === 'lg',
      },
      className
    )"
    :to="to"
    :href="href"
    :target="target"
    :rel="rel"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Leading Icon -->
    <div
      v-if="icon || $slots.icon"
      :class="cn('flex-shrink-0', {
        'h-4 w-4': size === 'sm',
        'h-5 w-5': size === 'default',
        'h-6 w-6': size === 'lg',
      })"
    >
      <slot name="icon">
        <component
          :is="icon"
          v-if="icon"
          :class="cn('h-full w-full', {
            'text-muted-foreground': !active,
            'text-current': active,
          })"
        />
      </slot>
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <!-- Main content -->
      <div class="flex items-center justify-between">
        <div class="min-w-0 flex-1">
          <!-- Title -->
          <div
            v-if="title || $slots.default"
            :class="cn('truncate', {
              'text-foreground': active,
              'text-muted-foreground': !active,
            })"
          >
            <slot>{{ title }}</slot>
          </div>

          <!-- Caption -->
          <div
            v-if="caption || $slots.caption"
            :class="cn('text-xs text-muted-foreground mt-0.5 truncate', {
              'opacity-70': active,
            })"
          >
            <slot name="caption">
              {{ caption }}
            </slot>
          </div>
        </div>

        <!-- Side content -->
        <div v-if="$slots.side" class="ml-2 shrink-0">
          <slot name="side" />
        </div>

        <!-- Chevron for expandable items -->
        <div
          v-if="expandable"
          :class="cn('flex-shrink-0 ml-2 transition-transform duration-200', {
            'rotate-90': expanded,
          })"
        >
          <svg
            class="size-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Trailing Icon -->
    <div
      v-if="trailingIcon || $slots.trailing"
      :class="cn('flex-shrink-0 ml-2', {
        'h-4 w-4': size === 'sm',
        'h-5 w-5': size === 'default',
        'h-6 w-6': size === 'lg',
      })"
    >
      <slot name="trailing">
        <component
          :is="trailingIcon"
          v-if="trailingIcon"
          :class="cn('h-full w-full', {
            'text-muted-foreground': !active,
            'text-current': active,
          })"
        />
      </slot>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant } from '@/lib/style-validators'

interface NavItemProps {
  title?: string
  caption?: string
  icon?: any
  trailingIcon?: any
  to?: string
  href?: string
  target?: string
  rel?: string
  active?: boolean
  disabled?: boolean
  clickable?: boolean
  expandable?: boolean
  expanded?: boolean
  dense?: boolean
  level?: number
  size?: SizeVariant
  tag?: string
  className?: string
}

interface NavItemEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'expand', expanded: boolean): void
}

const props = withDefaults(defineProps<NavItemProps>(), {
  active: false,
  disabled: false,
  clickable: false,
  expandable: false,
  expanded: false,
  dense: false,
  level: 0,
  size: 'default',
  tag: 'div',
})

const emit = defineEmits<NavItemEmits>()

// Computed
const tag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return props.tag
})

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.disabled) return

  emit('click', event)

  if (props.expandable) {
    emit('expand', !props.expanded)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick(event as unknown as MouseEvent)
  }
}
</script>

<style scoped>
/* Smooth transitions */
.group {
  transition: all 0.2s ease-in-out;
}

/* Focus styles */
.group:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Hover animations */
.group:hover:not(:disabled) {
  transform: translateX(2px);
}

/* Active state */
.bg-accent {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

/* Disabled state */
.group:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Nested indentation */
.pl-6 {
  padding-left: 1.5rem;
}

.pl-9 {
  padding-left: 2.25rem;
}

.pl-12 {
  padding-left: 3rem;
}

.pl-15 {
  padding-left: 3.75rem;
}

/* Icon transitions */
.group svg {
  transition: transform 0.2s ease-in-out;
}

/* Chevron rotation */
.rotate-90 {
  transform: rotate(90deg);
}

/* Text truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .group {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .pl-6 {
    padding-left: 1.25rem;
  }

  .pl-9 {
    padding-left: 2rem;
  }

  .pl-12 {
    padding-left: 2.75rem;
  }

  .pl-15 {
    padding-left: 3.5rem;
  }
}
</style>
