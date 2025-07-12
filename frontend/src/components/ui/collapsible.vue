<template>
  <div :class="cn('border-b border-border', className)">
    <button
      type="button"
      :class="cn(
        'flex w-full items-center justify-between py-4 px-0 font-medium transition-all hover:underline text-left',
        {
          'text-sm': size === 'sm',
          'text-base': size === 'default',
          'text-lg': size === 'lg',
        }
      )"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <slot name="header">
        {{ label }}
      </slot>
      <ChevronDownIcon
        :class="cn(
          'h-4 w-4 shrink-0 transition-transform duration-200',
          isOpen && 'rotate-180'
        )"
      />
    </button>
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 transform -translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform -translate-y-2"
    >
      <div
        v-show="isOpen"
        :class="cn('pb-4 pt-0')"
      >
        <slot>
          {{ content }}
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { cn } from '@/lib/utils'

// Simple ChevronDown icon component
const ChevronDownIcon = {
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  `,
}

interface Props {
  label?: string
  content?: string
  modelValue?: boolean
  defaultOpen?: boolean
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  defaultOpen: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = ref(props.modelValue ?? props.defaultOpen)

watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    isOpen.value = newValue
  }
})

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

function toggle() {
  isOpen.value = !isOpen.value
}

// Expose methods for external control
defineExpose({
  toggle,
  open: () => { isOpen.value = true },
  close: () => { isOpen.value = false },
})
</script>
