<template>
  <div class="relative inline-block">
    <!-- Trigger -->
    <div
      ref="triggerRef"
      @click="handleTriggerClick"
      @keydown="handleTriggerKeydown"
    >
      <slot name="trigger" :open="isOpen" :toggle="toggle">
        <button
          :class="cn(
            'inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            triggerClass
          )"
          :disabled="disabled"
        >
          <slot name="trigger-content">
            {{ triggerText }}
          </slot>
        </button>
      </slot>
    </div>

    <!-- Popover Portal -->
    <teleport to="body">
      <div
        v-if="isOpen"
        ref="popoverRef"
        :class="cn(
          'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
          'animate-in fade-in-0 zoom-in-95',
          {
            'w-72': size === 'sm',
            'w-80': size === 'default',
            'w-96': size === 'lg',
          },
          popoverClass
        )"
        :style="popoverStyle"
        @click.stop
        @keydown="handlePopoverKeydown"
      >
        <!-- Popover Arrow -->
        <div
          v-if="showArrow"
          :class="cn('absolute h-2 w-2 bg-popover border-l border-t border-border transform rotate-45', arrowClass)"
          :style="arrowStyle"
        />

        <!-- Popover Content -->
        <div :class="cn('relative z-10', contentClass)">
          <slot :close="close" :is-open="isOpen">
            <!-- Default Edit Form -->
            <div v-if="editable" class="space-y-3 p-3">
              <div class="space-y-2">
                <label
                  v-if="label"
                  :for="inputId"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {{ label }}
                </label>
                <input
                  :id="inputId"
                  ref="editInputRef"
                  v-model="editValue"
                  type="text"
                  :placeholder="placeholder"
                  :class="cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                    'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    inputClass
                  )"
                  @keydown="handleInputKeydown"
                >
              </div>

              <div class="flex items-center justify-end space-x-2">
                <button
                  :class="cn(
                    'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    'hover:bg-accent hover:text-accent-foreground',
                    cancelButtonClass
                  )"
                  @click="handleCancel"
                >
                  {{ cancelText }}
                </button>
                <button
                  :class="cn(
                    'inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors',
                    'hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    saveButtonClass
                  )"
                  @click="handleSave"
                >
                  {{ saveText }}
                </button>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant } from '@/lib/style-validators'

type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'

interface PopoverProps {
  modelValue?: boolean
  value?: string
  triggerText?: string
  label?: string
  placeholder?: string
  placement?: PopoverPlacement
  disabled?: boolean
  editable?: boolean
  showArrow?: boolean
  size?: SizeVariant
  offset?: number
  saveText?: string
  cancelText?: string
  // Styling props
  triggerClass?: string
  popoverClass?: string
  contentClass?: string
  arrowClass?: string
  inputClass?: string
  saveButtonClass?: string
  cancelButtonClass?: string
}

interface PopoverEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:value', value: string): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'save', value: string): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<PopoverProps>(), {
  modelValue: false,
  value: '',
  triggerText: 'Open',
  placement: 'bottom',
  disabled: false,
  editable: false,
  showArrow: true,
  size: 'default',
  offset: 8,
  saveText: 'Save',
  cancelText: 'Cancel',
})

const emit = defineEmits<PopoverEmits>()

// Refs
const triggerRef = ref<HTMLElement>()
const popoverRef = ref<HTMLElement>()
const editInputRef = ref<HTMLInputElement>()

// State
const isOpen = ref(props.modelValue)
const editValue = ref(props.value)

// Computed
const inputId = computed(() => `popover-input-${Math.random().toString(36).substr(2, 9)}`)

const popoverStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})

// Methods
const open = async () => {
  if (props.disabled) return

  isOpen.value = true
  editValue.value = props.value
  emit('update:modelValue', true)
  emit('open')

  await nextTick()
  updatePosition()

  // Focus input if editable
  if (props.editable && editInputRef.value) {
    editInputRef.value.focus()
    editInputRef.value.select()
  }
}

const close = () => {
  isOpen.value = false
  emit('update:modelValue', false)
  emit('close')
}

const toggle = () => {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

const updatePosition = () => {
  if (!triggerRef.value || !popoverRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const popoverRect = popoverRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const positions = calculatePosition(triggerRect, popoverRect, viewportWidth, viewportHeight)

  popoverStyle.value = {
    left: `${positions.popover.x}px`,
    top: `${positions.popover.y}px`,
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
  popoverRect: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
) => {
  const arrowSize = 8
  const offset = props.offset

  let popoverX = 0
  let popoverY = 0
  let arrowX = 0
  let arrowY = 0

  // Calculate base positions
  switch (props.placement) {
  case 'top':
  case 'top-start':
  case 'top-end':
    popoverX = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2)
    popoverY = triggerRect.top - popoverRect.height - offset
    arrowX = popoverRect.width / 2 - arrowSize / 2
    arrowY = popoverRect.height
    break

  case 'bottom':
  case 'bottom-start':
  case 'bottom-end':
    popoverX = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2)
    popoverY = triggerRect.bottom + offset
    arrowX = popoverRect.width / 2 - arrowSize / 2
    arrowY = -arrowSize / 2
    break

  case 'left':
  case 'left-start':
  case 'left-end':
    popoverX = triggerRect.left - popoverRect.width - offset
    popoverY = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2)
    arrowX = popoverRect.width
    arrowY = popoverRect.height / 2 - arrowSize / 2
    break

  case 'right':
  case 'right-start':
  case 'right-end':
    popoverX = triggerRect.right + offset
    popoverY = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2)
    arrowX = -arrowSize / 2
    arrowY = popoverRect.height / 2 - arrowSize / 2
    break
  }

  // Adjust for start/end variants
  if (props.placement.includes('start')) {
    if (props.placement.includes('top') || props.placement.includes('bottom')) {
      popoverX = triggerRect.left
      arrowX = triggerRect.width / 2 - arrowSize / 2
    } else {
      popoverY = triggerRect.top
      arrowY = triggerRect.height / 2 - arrowSize / 2
    }
  } else if (props.placement.includes('end')) {
    if (props.placement.includes('top') || props.placement.includes('bottom')) {
      popoverX = triggerRect.right - popoverRect.width
      arrowX = popoverRect.width - (triggerRect.width / 2) - arrowSize / 2
    } else {
      popoverY = triggerRect.bottom - popoverRect.height
      arrowY = popoverRect.height - (triggerRect.height / 2) - arrowSize / 2
    }
  }

  // Viewport boundary checks
  if (popoverX < 8) popoverX = 8
  if (popoverX + popoverRect.width > viewportWidth - 8) popoverX = viewportWidth - popoverRect.width - 8
  if (popoverY < 8) popoverY = 8
  if (popoverY + popoverRect.height > viewportHeight - 8) popoverY = viewportHeight - popoverRect.height - 8

  return {
    popover: { x: popoverX, y: popoverY },
    arrow: { x: arrowX, y: arrowY },
  }
}

// Event handlers
const handleTriggerClick = () => {
  toggle()
}

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle()
  }
}

const handlePopoverKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

const handleInputKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleSave()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  }
}

const handleSave = () => {
  emit('update:value', editValue.value)
  emit('save', editValue.value)
  close()
}

const handleCancel = () => {
  editValue.value = props.value
  emit('cancel')
  close()
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (
    isOpen.value &&
    popoverRef.value &&
    !popoverRef.value.contains(event.target as Node) &&
    triggerRef.value &&
    !triggerRef.value.contains(event.target as Node)
  ) {
    close()
  }
}

// Scroll and resize handlers
const handleScroll = () => {
  if (isOpen.value) {
    updatePosition()
  }
}

const handleResize = () => {
  if (isOpen.value) {
    updatePosition()
  }
}

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
})

watch(() => props.value, (newValue) => {
  editValue.value = newValue
})

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})

// Expose methods
defineExpose({
  open,
  close,
  toggle,
  updatePosition,
})
</script>

<style scoped>
/* Popover animations */
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
  animation: fade-in 0.2s ease-out, zoom-in-95 0.2s ease-out;
}

.fade-in-0 {
  animation: fade-in 0.2s ease-out;
}

.zoom-in-95 {
  animation: zoom-in-95 0.2s ease-out;
}

/* Ensure popover is above other content */
.z-50 {
  z-index: 50;
}

/* Popover styling */
.bg-popover {
  background-color: hsl(var(--popover));
}

.text-popover-foreground {
  color: hsl(var(--popover-foreground));
}

.border-border {
  border-color: hsl(var(--border));
}

/* Arrow styling */
.transform {
  transform: translateZ(0);
}

.rotate-45 {
  transform: rotate(45deg);
}

/* Focus styles */
button:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

input:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Smooth transitions */
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .w-72 {
    width: 16rem;
  }

  .w-80 {
    width: 18rem;
  }

  .w-96 {
    width: 20rem;
  }
}
</style>
