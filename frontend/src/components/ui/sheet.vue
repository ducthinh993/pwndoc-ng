<template>
  <!-- Overlay backdrop for mobile -->
  <Transition
    name="backdrop"
    appear
  >
    <div
      v-if="open && (overlay || isMobile)"
      :class="cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
        backdropClass
      )"
      @click="onBackdropClick"
    />
  </Transition>

  <!-- Sheet content -->
  <Transition
    :name="slideTransitionName"
    appear
  >
    <div
      v-if="open"
      :class="cn(
        baseSheetClasses,
        positionClasses,
        sizeClasses,
        {
          'shadow-lg': !embedded,
          'border-r': side === 'left' && !embedded,
          'border-l': side === 'right' && !embedded,
          'border-b': side === 'top' && !embedded,
          'border-t': side === 'bottom' && !embedded,
        },
        className
      )"
    >
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { baseSheetClasses } from '@/lib/component-classes'

interface Props {
  open?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full'
  overlay?: boolean
  persistent?: boolean
  embedded?: boolean
  noSwipeClose?: boolean
  noEscapeKey?: boolean
  className?: string
  backdropClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  side: 'left',
  size: 'default',
  overlay: true,
  persistent: false,
  embedded: false,
  noSwipeClose: false,
  noEscapeKey: false,
})

const emit = defineEmits<{
  'update:open': [open: boolean]
  'opened': []
  'closed': []
}>()

// Mobile detection
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // Handle escape key
  if (!props.noEscapeKey) {
    document.addEventListener('keydown', handleEscapeKey)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('keydown', handleEscapeKey)
})

// Position classes - matches q-drawer positioning
const positionClasses = computed(() => {
  const positions = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full',
  }

  const basePosition = 'fixed z-50'

  return cn(basePosition, positions[props.side])
})

// Size classes - exact mapping from Quasar drawer sizes
const sizeClasses = computed(() => {
  if (props.side === 'left' || props.side === 'right') {
    const widthMap = {
      sm: 'w-64',     // 256px
      default: 'w-80', // 320px - matches Quasar default
      lg: 'w-96',     // 384px
      xl: 'w-[480px]', // 480px
      full: 'w-full',
    }
    return widthMap[props.size]
  } else {
    const heightMap = {
      sm: 'h-64',     // 256px
      default: 'h-80', // 320px
      lg: 'h-96',     // 384px
      xl: 'h-[480px]', // 480px
      full: 'h-full',
    }
    return heightMap[props.size]
  }
})

// Transition name based on side - matches Quasar slide animations
const slideTransitionName = computed(() => {
  return `slide-${props.side}`
})

// Event handlers
const onBackdropClick = () => {
  if (!props.persistent) {
    emit('update:open', false)
    emit('closed')
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open && !props.persistent) {
    emit('update:open', false)
    emit('closed')
  }
}
</script>

<style scoped>
/* Backdrop transitions */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Left slide transitions - matches q-drawer slide-left */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(-100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

/* Right slide transitions - matches q-drawer slide-right */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

/* Top slide transitions - matches q-drawer slide-top */
.slide-top-enter-active,
.slide-top-leave-active {
  transition: transform 0.3s ease;
}

.slide-top-enter-from {
  transform: translateY(-100%);
}

.slide-top-leave-to {
  transform: translateY(-100%);
}

/* Bottom slide transitions - matches q-drawer slide-bottom */
.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: transform 0.3s ease;
}

.slide-bottom-enter-from {
  transform: translateY(100%);
}

.slide-bottom-leave-to {
  transform: translateY(100%);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .sheet-mobile {
    width: 100% !important;
    max-width: 100vw;
  }
}

/* Embedded mode - no shadows or borders */
.sheet-embedded {
  position: relative !important;
  box-shadow: none !important;
  border: none !important;
}
</style>
