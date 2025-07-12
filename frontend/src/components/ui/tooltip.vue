<template>
  <div
    ref="triggerRef"
    class="inline-block"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Trigger Content -->
    <slot />
    
    <!-- Tooltip Portal -->
    <teleport to="body">
      <div
        v-if="isVisible"
        ref="tooltipRef"
        :class="cn(
          'absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm',
          'pointer-events-none select-none max-w-xs',
          'animate-in fade-in-0 zoom-in-95',
          'dark:bg-gray-800 dark:text-gray-100',
          {
            'text-xs px-2 py-1': size === 'sm',
            'text-sm px-3 py-2': size === 'default',
            'text-base px-4 py-3': size === 'lg',
          },
          tooltipClass
        )"
        :style="tooltipStyle"
        role="tooltip"
        :aria-describedby="tooltipId"
      >
        <!-- Tooltip Content -->
        <div>
          <slot name="content">
            {{ content }}
          </slot>
        </div>
        
        <!-- Tooltip Arrow -->
        <div
          v-if="showArrow"
          :class="cn('absolute w-2 h-2 bg-gray-900 transform rotate-45', 'dark:bg-gray-800', arrowClass)"
          :style="arrowStyle"
        />
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant } from '@/lib/style-validators'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'

interface TooltipProps {
  content?: string
  placement?: TooltipPlacement
  disabled?: boolean
  showArrow?: boolean
  delay?: number
  hideDelay?: number
  size?: SizeVariant
  maxWidth?: string
  offset?: number
  // Styling props
  tooltipClass?: string
  arrowClass?: string
}

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  disabled: false,
  showArrow: true,
  delay: 500,
  hideDelay: 0,
  size: 'default',
  maxWidth: '320px',
  offset: 8,
})

// Refs
const triggerRef = ref<HTMLElement>()
const tooltipRef = ref<HTMLElement>()

// State
const isVisible = ref(false)
const showTimeout = ref<NodeJS.Timeout>()
const hideTimeout = ref<NodeJS.Timeout>()

// Computed
const tooltipId = computed(() => `tooltip-${Math.random().toString(36).substr(2, 9)}`)

const tooltipStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})

// Methods
const show = async () => {
  if (props.disabled || !triggerRef.value) return
  
  clearTimeout(hideTimeout.value)
  
  showTimeout.value = setTimeout(async () => {
    isVisible.value = true
    await nextTick()
    updatePosition()
  }, props.delay)
}

const hide = () => {
  clearTimeout(showTimeout.value)
  
  hideTimeout.value = setTimeout(() => {
    isVisible.value = false
  }, props.hideDelay)
}

const updatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return
  
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  const positions = calculatePosition(triggerRect, tooltipRect, viewportWidth, viewportHeight)
  
  tooltipStyle.value = {
    left: `${positions.tooltip.x}px`,
    top: `${positions.tooltip.y}px`,
    maxWidth: props.maxWidth,
  }
  
  if (props.showArrow) {
    arrowStyle.value = {
      left: `${positions.arrow.x}px`,
      top: `${positions.arrow.y}px`,
    }
  }
}

const calculatePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  viewportWidth: number,
  viewportHeight: number
) => {
  const arrowSize = 8
  const offset = props.offset
  
  let tooltipX = 0
  let tooltipY = 0
  let arrowX = 0
  let arrowY = 0
  
  // Calculate base positions
  switch (props.placement) {
    case 'top':
    case 'top-start':
    case 'top-end':
      tooltipX = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
      tooltipY = triggerRect.top - tooltipRect.height - offset
      arrowX = tooltipRect.width / 2 - arrowSize / 2
      arrowY = tooltipRect.height
      break
      
    case 'bottom':
    case 'bottom-start':
    case 'bottom-end':
      tooltipX = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
      tooltipY = triggerRect.bottom + offset
      arrowX = tooltipRect.width / 2 - arrowSize / 2
      arrowY = -arrowSize / 2
      break
      
    case 'left':
    case 'left-start':
    case 'left-end':
      tooltipX = triggerRect.left - tooltipRect.width - offset
      tooltipY = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
      arrowX = tooltipRect.width
      arrowY = tooltipRect.height / 2 - arrowSize / 2
      break
      
    case 'right':
    case 'right-start':
    case 'right-end':
      tooltipX = triggerRect.right + offset
      tooltipY = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
      arrowX = -arrowSize / 2
      arrowY = tooltipRect.height / 2 - arrowSize / 2
      break
  }
  
  // Adjust for start/end variants
  if (props.placement.includes('start')) {
    if (props.placement.includes('top') || props.placement.includes('bottom')) {
      tooltipX = triggerRect.left
      arrowX = triggerRect.width / 2 - arrowSize / 2
    } else {
      tooltipY = triggerRect.top
      arrowY = triggerRect.height / 2 - arrowSize / 2
    }
  } else if (props.placement.includes('end')) {
    if (props.placement.includes('top') || props.placement.includes('bottom')) {
      tooltipX = triggerRect.right - tooltipRect.width
      arrowX = tooltipRect.width - (triggerRect.width / 2) - arrowSize / 2
    } else {
      tooltipY = triggerRect.bottom - tooltipRect.height
      arrowY = tooltipRect.height - (triggerRect.height / 2) - arrowSize / 2
    }
  }
  
  // Viewport boundary checks
  if (tooltipX < 0) tooltipX = 8
  if (tooltipX + tooltipRect.width > viewportWidth) tooltipX = viewportWidth - tooltipRect.width - 8
  if (tooltipY < 0) tooltipY = 8
  if (tooltipY + tooltipRect.height > viewportHeight) tooltipY = viewportHeight - tooltipRect.height - 8
  
  return {
    tooltip: { x: tooltipX, y: tooltipY },
    arrow: { x: arrowX, y: arrowY },
  }
}

// Event handlers
const handleMouseEnter = () => {
  show()
}

const handleMouseLeave = () => {
  hide()
}

const handleFocus = () => {
  show()
}

const handleBlur = () => {
  hide()
}

// Scroll and resize listeners
const handleScroll = () => {
  if (isVisible.value) {
    updatePosition()
  }
}

const handleResize = () => {
  if (isVisible.value) {
    updatePosition()
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  clearTimeout(showTimeout.value)
  clearTimeout(hideTimeout.value)
})

// Expose methods
defineExpose({
  show,
  hide,
  updatePosition,
})
</script>

<style scoped>
/* Tooltip animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoom-in-95 {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in {
  animation: fade-in 0.15s ease-out, zoom-in-95 0.15s ease-out;
}

.fade-in-0 {
  animation: fade-in 0.15s ease-out;
}

.zoom-in-95 {
  animation: zoom-in-95 0.15s ease-out;
}

/* Ensure tooltip is above other content */
.z-50 {
  z-index: 50;
}

/* Tooltip styling */
.bg-gray-900 {
  background-color: rgb(17 24 39);
}

.text-white {
  color: rgb(255 255 255);
}

.dark .bg-gray-800 {
  background-color: rgb(31 41 55);
}

.dark .text-gray-100 {
  color: rgb(243 244 246);
}

/* Arrow positioning */
.absolute {
  position: absolute;
}

.transform {
  transform: translateZ(0);
}

.rotate-45 {
  transform: rotate(45deg);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .max-w-xs {
    max-width: 16rem;
  }
}

/* Prevent tooltip from interfering with interactions */
.pointer-events-none {
  pointer-events: none;
}

.select-none {
  user-select: none;
}
</style> 