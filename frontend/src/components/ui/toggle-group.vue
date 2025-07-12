<template>
  <div
    :class="cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium',
      variantClasses,
      sizeClasses,
      className
    )"
    role="radiogroup"
    :aria-labelledby="ariaLabelledby"
  >
    <button
      v-for="(option, index) in options"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="modelValue === option.value"
      :disabled="disabled"
      :class="cn(
        'inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'first:rounded-l-md last:rounded-r-md',
        modelValue === option.value
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-transparent hover:bg-muted hover:text-muted-foreground',
        optionClasses
      )"
      @click="handleSelect(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant, type ColorVariant } from '@/lib/style-validators'

interface ToggleOption {
  label: string
  value: any
  disabled?: boolean
}

interface Props {
  modelValue?: any
  options: ToggleOption[]
  variant?: ColorVariant
  size?: SizeVariant
  disabled?: boolean
  ariaLabelledby?: string
  className?: string
  optionClasses?: string
}

interface Emits {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  options: () => [],
})

const emit = defineEmits<Emits>()

const variantClasses = computed(() => {
  const variants = {
    default: 'border border-input bg-background',
    outline: 'border border-input bg-transparent',
    secondary: 'border border-secondary bg-secondary/10',
    ghost: 'border-0 bg-transparent',
  }
  return variants[props.variant as keyof typeof variants] || variants.default
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-9',
    default: 'h-10',
    lg: 'h-11',
  }
  return sizes[props.size as keyof typeof sizes] || sizes.default
})

const handleSelect = (value: any) => {
  if (!props.disabled) {
    emit('update:modelValue', value)
    emit('change', value)
  }
}
</script>
