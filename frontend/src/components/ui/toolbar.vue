<template>
  <div 
    :class="cn(
      'flex items-center justify-between w-full',
      {
        'h-14': size === 'default',
        'h-12': size === 'sm',
        'h-16': size === 'lg',
        'px-4': !customPadding,
        'min-h-[56px]': dense,
      },
      className
    )"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  size?: 'sm' | 'default' | 'lg'
  dense?: boolean
  customPadding?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  dense: false,
  customPadding: false,
})
</script>

<style scoped>
/* Toolbar specific styles to match Quasar q-toolbar */
.toolbar {
  background: inherit;
  color: inherit;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .toolbar {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style> 