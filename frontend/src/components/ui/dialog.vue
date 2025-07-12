<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      :class="cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        overlayClass
      )"
      @click="handleOverlayClick"
    >
      <!-- Backdrop -->
      <div
        :class="cn(
          'fixed inset-0 bg-black/50 transition-opacity',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
        )"
        :data-state="modelValue ? 'open' : 'closed'"
      />
      
      <!-- Dialog Content -->
      <div
        ref="dialogRef"
        :class="cn(
          'relative z-50 w-full max-w-lg bg-background border border-border rounded-lg shadow-lg',
          'transition-all duration-200 ease-in-out',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]',
          {
            'max-w-xs': size === 'xs',
            'max-w-sm': size === 'sm',
            'max-w-lg': size === 'default',
            'max-w-xl': size === 'lg',
            'max-w-2xl': size === 'xl',
            'max-w-4xl': size === '2xl',
            'max-w-6xl': size === '3xl',
            'max-w-full': size === 'full',
          },
          contentClass
        )"
        :data-state="modelValue ? 'open' : 'closed'"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="descriptionId"
        @click.stop
      >
        <!-- Header -->
        <div
          v-if="$slots.header || title"
          :class="cn(
            'flex items-center justify-between p-6 border-b border-border',
            headerClass
          )"
        >
          <div class="flex flex-col space-y-1.5">
            <h2
              v-if="title"
              :id="titleId"
              :class="cn(
                'text-lg font-semibold leading-none tracking-tight text-foreground',
                titleClass
              )"
            >
              {{ title }}
            </h2>
            <p
              v-if="description"
              :id="descriptionId"
              :class="cn(
                'text-sm text-muted-foreground',
                descriptionClass
              )"
            >
              {{ description }}
            </p>
          </div>
          <slot name="header" />
          <button
            v-if="showCloseButton"
            @click="handleClose"
            :class="cn(
              'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity',
              'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:pointer-events-none',
              closeButtonClass
            )"
            :disabled="!closable"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span class="sr-only">Close</span>
          </button>
        </div>
        
        <!-- Content -->
        <div
          :class="cn(
            'p-6',
            {
              'pt-0': $slots.header || title,
              'pb-0': $slots.footer,
            },
            bodyClass
          )"
        >
          <slot />
        </div>
        
        <!-- Footer -->
        <div
          v-if="$slots.footer"
          :class="cn(
            'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0',
            footerClass
          )"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant } from '@/lib/style-validators'

interface DialogProps {
  modelValue?: boolean
  title?: string
  description?: string
  size?: SizeVariant | '2xl' | '3xl' | 'full'
  closable?: boolean
  showCloseButton?: boolean
  persistent?: boolean
  overlayClass?: string
  contentClass?: string
  headerClass?: string
  bodyClass?: string
  footerClass?: string
  titleClass?: string
  descriptionClass?: string
  closeButtonClass?: string
}

interface DialogEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'open'): void
}

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  size: 'default',
  closable: true,
  showCloseButton: true,
  persistent: false,
})

const emit = defineEmits<DialogEmits>()

const dialogRef = ref<HTMLElement>()

// Generate unique IDs for ARIA attributes
const titleId = computed(() => `dialog-title-${Math.random().toString(36).substr(2, 9)}`)
const descriptionId = computed(() => `dialog-description-${Math.random().toString(36).substr(2, 9)}`)

// Focus management
const previouslyFocusedElement = ref<HTMLElement | null>(null)

// Handle overlay click
const handleOverlayClick = () => {
  if (props.closable && !props.persistent) {
    handleClose()
  }
}

// Handle close
const handleClose = () => {
  if (props.closable) {
    emit('update:modelValue', false)
    emit('close')
  }
}

// Handle escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue && props.closable && !props.persistent) {
    handleClose()
  }
}

// Focus management
const manageFocus = async () => {
  if (props.modelValue) {
    // Store the previously focused element
    previouslyFocusedElement.value = document.activeElement as HTMLElement
    
    // Wait for the dialog to be rendered
    await nextTick()
    
    // Focus the dialog content
    if (dialogRef.value) {
      const focusableElement = dialogRef.value.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      
      if (focusableElement) {
        focusableElement.focus()
      } else {
        dialogRef.value.focus()
      }
    }
  } else {
    // Restore focus to previously focused element
    if (previouslyFocusedElement.value) {
      previouslyFocusedElement.value.focus()
      previouslyFocusedElement.value = null
    }
  }
}

// Trap focus within dialog
const trapFocus = (event: KeyboardEvent) => {
  if (!props.modelValue || !dialogRef.value) return

  if (event.key === 'Tab') {
    const focusableElements = dialogRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus()
        event.preventDefault()
      }
    }
  }
}

// Watch for model value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      emit('open')
      manageFocus()
    } else {
      manageFocus()
    }
  },
  { immediate: true }
)

// Add/remove event listeners
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  document.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.removeEventListener('keydown', trapFocus)
})

// Expose ref for parent component access
defineExpose({
  dialogRef,
})
</script>

<style scoped>
/* Custom animations for dialog */
@keyframes dialog-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes dialog-zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes dialog-zoom-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

@keyframes dialog-slide-in-from-top {
  from {
    opacity: 0;
    transform: translateY(-48%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dialog-slide-out-to-top {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-48%);
  }
}

.animate-in {
  animation: dialog-fade-in 0.2s ease-out, dialog-zoom-in 0.2s ease-out, dialog-slide-in-from-top 0.2s ease-out;
}

.animate-out {
  animation: dialog-fade-out 0.2s ease-out, dialog-zoom-out 0.2s ease-out, dialog-slide-out-to-top 0.2s ease-out;
}

.fade-in-0 {
  animation: dialog-fade-in 0.2s ease-out;
}

.fade-out-0 {
  animation: dialog-fade-out 0.2s ease-out;
}

.zoom-in-95 {
  animation: dialog-zoom-in 0.2s ease-out;
}

.zoom-out-95 {
  animation: dialog-zoom-out 0.2s ease-out;
}

.slide-in-from-top-48 {
  animation: dialog-slide-in-from-top 0.2s ease-out;
}

.slide-out-to-top-48 {
  animation: dialog-slide-out-to-top 0.2s ease-out;
}
</style> 