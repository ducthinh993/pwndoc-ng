<template>
  <div
    :class="cn(
      'w-full mx-auto',
      {
        // Fluid container (full width)
        'max-w-none': fluid,

        // Fixed max widths per breakpoint (matching Quasar)
        'max-w-none sm:max-w-none md:max-w-[960px] lg:max-w-[1280px] xl:max-w-[1920px]': !fluid,

        // Padding variants
        'px-4': padding === 'default',
        'px-2': padding === 'sm',
        'px-6': padding === 'md',
        'px-8': padding === 'lg',
        'px-0': padding === 'none',

        // Responsive padding
        'px-4 sm:px-6 lg:px-8': padding === 'responsive',
      },
      className
    )"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

type PaddingSize = 'none' | 'sm' | 'default' | 'md' | 'lg' | 'responsive'

interface ContainerProps {
  fluid?: boolean
  padding?: PaddingSize
  className?: string
}

withDefaults(defineProps<ContainerProps>(), {
  fluid: false,
  padding: 'default',
})
</script>

<style scoped>
/* Ensure smooth transitions */
.w-full {
  transition: max-width 0.3s ease-in-out;
}

/* Custom breakpoint styles to match Quasar exactly */
@media (min-width: 600px) {
  .container-sm {
    max-width: 600px;
  }
}

@media (min-width: 960px) {
  .container-md {
    max-width: 960px;
  }
}

@media (min-width: 1280px) {
  .container-lg {
    max-width: 1280px;
  }
}

@media (min-width: 1920px) {
  .container-xl {
    max-width: 1920px;
  }
}
</style>
