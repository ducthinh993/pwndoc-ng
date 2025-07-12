<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        :class="cn(
          'inline-flex items-center gap-2 text-left hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors',
          triggerClass
        )"
        @click="openEditor"
      >
        <slot name="trigger">
          <span>{{ displayValue || placeholder || 'Click to edit' }}</span>
          <EditIcon class="h-3 w-3 opacity-50" />
        </slot>
      </button>
    </PopoverTrigger>
    <PopoverContent :class="cn('w-80', contentClass)">
      <div class="space-y-3">
        <div class="space-y-2">
          <label v-if="label" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {{ label }}
          </label>
          <component
            :is="inputComponent"
            ref="inputRef"
            v-model="localValue"
            :placeholder="placeholder"
            :class="cn('w-full', inputClass)"
            @keydown.enter="saveValue"
            @keydown.escape="cancelEdit"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            @click="cancelEdit"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            @click="saveValue"
            :disabled="!hasChanges"
          >
            Save
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { cn } from '@/lib/utils'
import Popover from './popover.vue'
import { PopoverTrigger, PopoverContent } from './popover.vue'
import Button from './button.vue'
import Input from './input.vue'

// Simple Edit icon component
const EditIcon = {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
      <path d="m15 5 4 4"/>
    </svg>
  `
}

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  autoSave?: boolean
  inputComponent?: string | object
  triggerClass?: string
  contentClass?: string
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  inputComponent: Input,
  autoSave: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'save': [value: string | number]
  'cancel': []
}>()

const isOpen = ref(false)
const localValue = ref(props.modelValue)
const inputRef = ref()
const originalValue = ref(props.modelValue)

const displayValue = computed(() => {
  return props.modelValue?.toString() || ''
})

const hasChanges = computed(() => {
  return localValue.value !== originalValue.value
})

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
  originalValue.value = newValue
})

async function openEditor() {
  isOpen.value = true
  localValue.value = props.modelValue
  originalValue.value = props.modelValue
  
  await nextTick()
  if (inputRef.value?.focus) {
    inputRef.value.focus()
  }
}

function saveValue() {
  if (props.autoSave || hasChanges.value) {
    emit('update:modelValue', localValue.value)
    emit('save', localValue.value)
    originalValue.value = localValue.value
  }
  isOpen.value = false
}

function cancelEdit() {
  localValue.value = originalValue.value
  emit('cancel')
  isOpen.value = false
}

// Auto-save functionality
watch(localValue, (newValue) => {
  if (props.autoSave && isOpen.value) {
    emit('update:modelValue', newValue)
    emit('save', newValue)
  }
})
</script> 