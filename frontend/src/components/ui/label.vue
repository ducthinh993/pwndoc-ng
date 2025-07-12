<template>
  <label
    :class="cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )"
    :for="htmlFor"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  htmlFor?: string
  className?: string
}

withDefaults(defineProps<Props>(), {})
</script>
