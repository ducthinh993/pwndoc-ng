<template>
  <div
    :class="cn(
      'p-3 border rounded-md bg-background',
      className
    )"
  >
    <input
      type="date"
      :value="modelValue"
      :class="cn(
        'w-full px-3 py-2 border border-input rounded-md bg-background text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      )"
      @input="handleInput"
    >
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string
  className?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emits>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
