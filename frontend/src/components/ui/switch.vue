<template>
  <button
    :id="id"
    ref="switchRef"
    type="button"
    role="switch"
    :aria-checked="checked"
    :aria-labelledby="labelId"
    :disabled="disabled"
    :class="cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      checked 
        ? 'bg-primary' 
        : 'bg-input',
      className
    )"
    @click="toggle"
  >
    <span
      :class="cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
        checked ? 'translate-x-5' : 'translate-x-0'
      )"
    />
  </button>
  
  <label
    v-if="label"
    :id="labelId"
    :for="id"
    :class="cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      labelClass
    )"
  >
    {{ label }}
  </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  checked?: boolean
  disabled?: boolean
  label?: string
  id?: string
  className?: string
  labelClass?: string
}

interface Emits {
  (e: 'update:checked', value: boolean): void
  (e: 'change', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  checked: false,
  disabled: false,
})

const emit = defineEmits<Emits>()

const switchRef = ref<HTMLButtonElement>()

const id = computed(() => props.id || `switch-${Math.random().toString(36).substr(2, 9)}`)
const labelId = computed(() => `${id.value}-label`)

const toggle = () => {
  if (!props.disabled) {
    const newValue = !props.checked
    emit('update:checked', newValue)
    emit('change', newValue)
  }
}

const focus = () => {
  switchRef.value?.focus()
}

defineExpose({
  focus,
})
</script> 