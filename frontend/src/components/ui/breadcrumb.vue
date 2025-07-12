<template>
  <nav
    :class="cn('flex items-center space-x-1 text-sm text-muted-foreground', wrapperClass)"
    aria-label="Breadcrumb"
  >
    <ol class="flex items-center space-x-1">
      <li
        v-for="(item, index) in items"
        :key="getItemKey(item, index)"
        :class="cn('flex items-center', {
          'text-foreground': index === items.length - 1,
        })"
      >
        <!-- Separator (not for first item) -->
        <div
          v-if="index > 0"
          :class="cn('mr-2 flex-shrink-0 text-muted-foreground/60', separatorClass)"
        >
          <slot name="separator" :index="index" :item="item">
            <!-- Custom separator -->
            <component
              :is="separatorIcon"
              v-if="separatorIcon"
              class="size-4"
            />
            <!-- Default separator -->
            <svg
              v-else
              class="size-4"
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
          </slot>
        </div>

        <!-- Breadcrumb Item -->
        <component
          :is="getItemComponent(item, index)"
          :class="cn(
            'inline-flex items-center gap-1 transition-colors',
            {
              // Interactive states
              'hover:text-foreground cursor-pointer': isItemClickable(item, index),
              'text-foreground font-medium': index === items.length - 1,
              'text-muted-foreground': index !== items.length - 1,

              // Size variants
              'text-xs': size === 'sm',
              'text-sm': size === 'default',
              'text-base': size === 'lg',
            },
            itemClass
          )"
          :to="getItemTo(item)"
          :href="getItemHref(item)"
          :target="getItemTarget(item)"
          :rel="getItemRel(item)"
          @click="handleItemClick(item, index, $event)"
        >
          <!-- Item Icon -->
          <component
            :is="getItemIcon(item)"
            v-if="getItemIcon(item)"
            :class="cn('flex-shrink-0', {
              'h-3 w-3': size === 'sm',
              'h-4 w-4': size === 'default',
              'h-5 w-5': size === 'lg',
            })"
          />

          <!-- Item Label -->
          <span
            :class="cn('truncate', {
              'max-w-20': size === 'sm',
              'max-w-32': size === 'default',
              'max-w-40': size === 'lg',
            })"
          >
            <slot :name="`item-${index}`" :item="item" :index="index">
              {{ getItemLabel(item) }}
            </slot>
          </span>
        </component>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant } from '@/lib/style-validators'

interface BreadcrumbItem {
  label: string
  to?: string
  href?: string
  target?: string
  rel?: string
  icon?: any
  disabled?: boolean
  clickable?: boolean
  [key: string]: any
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  separatorIcon?: any
  size?: SizeVariant
  maxItems?: number
  // Styling props
  wrapperClass?: string
  itemClass?: string
  separatorClass?: string
}

interface BreadcrumbEmits {
  (e: 'itemClick', item: BreadcrumbItem, index: number, event: MouseEvent): void
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  items: () => [],
  size: 'default',
  maxItems: 0,
})

const emit = defineEmits<BreadcrumbEmits>()

// Computed
const displayItems = computed(() => {
  if (props.maxItems <= 0 || props.items.length <= props.maxItems) {
    return props.items
  }

  // Show first item, ellipsis, and last items
  const firstItem = props.items[0]
  const lastItems = props.items.slice(-(props.maxItems - 2))

  return [
    firstItem,
    { label: '...', disabled: true, isEllipsis: true },
    ...lastItems,
  ]
})

// Methods
const getItemKey = (item: BreadcrumbItem, index: number): string => {
  return item.key || `${item.label}-${index}`
}

const getItemComponent = (item: BreadcrumbItem, index: number): string => {
  // Don't make last item or disabled items clickable
  if (index === props.items.length - 1 || item.disabled || item.isEllipsis) {
    return 'span'
  }

  if (item.to) return 'router-link'
  if (item.href) return 'a'
  return 'button'
}

const getItemLabel = (item: BreadcrumbItem): string => {
  return item.label || ''
}

const getItemIcon = (item: BreadcrumbItem): any => {
  return item.icon
}

const getItemTo = (item: BreadcrumbItem): string | undefined => {
  return item.to
}

const getItemHref = (item: BreadcrumbItem): string | undefined => {
  return item.href
}

const getItemTarget = (item: BreadcrumbItem): string | undefined => {
  return item.target
}

const getItemRel = (item: BreadcrumbItem): string | undefined => {
  return item.rel
}

const isItemClickable = (item: BreadcrumbItem, index: number): boolean => {
  return !item.disabled &&
    !item.isEllipsis &&
    index !== props.items.length - 1 &&
    (item.clickable !== false)
}

const handleItemClick = (item: BreadcrumbItem, index: number, event: MouseEvent) => {
  if (item.disabled || item.isEllipsis) {
    event.preventDefault()
    return
  }

  // Don't emit for last item (current page)
  if (index === props.items.length - 1) {
    event.preventDefault()
    return
  }

  emit('itemClick', item, index, event)
}
</script>

<style scoped>
/* Smooth transitions */
.inline-flex {
  transition: color 0.2s ease-in-out;
}

/* Hover states */
.hover\:text-foreground:hover {
  color: hsl(var(--foreground));
}

/* Focus styles */
button:focus-visible,
a:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Text truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Max width constraints */
.max-w-20 {
  max-width: 5rem;
}

.max-w-32 {
  max-width: 8rem;
}

.max-w-40 {
  max-width: 10rem;
}

/* Separator styling */
.flex-shrink-0 svg {
  transition: transform 0.2s ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .space-x-1 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0.125rem;
  }

  .max-w-20 {
    max-width: 3rem;
  }

  .max-w-32 {
    max-width: 5rem;
  }

  .max-w-40 {
    max-width: 7rem;
  }
}

/* Ellipsis styling */
.breadcrumb-ellipsis {
  pointer-events: none;
  opacity: 0.7;
}
</style>
