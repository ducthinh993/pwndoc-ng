<template>
  <div :class="cn('flex items-center space-x-2', wrapperClass)">
    <div class="relative flex items-center">
      <input
        :id="inputId"
        ref="inputRef"
        type="checkbox"
        :checked="checked"
        :indeterminate="indeterminate"
        :disabled="disabled"
        :required="required"
        :name="name"
        :value="value"
        :class="cn(
          'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
          {
            'h-3 w-3': size === 'sm',
            'h-4 w-4': size === 'default',
            'h-5 w-5': size === 'lg',
            'border-destructive': error,
            'border-muted': disabled,
          },
          checkboxClass
        )"
        :data-state="getDataState()"
        v-bind="$attrs"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >

      <!-- Check Icon -->
      <div
        :class="cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center text-current',
          'opacity-0 peer-data-[state=checked]:opacity-100',
          'transition-opacity duration-150',
          iconClass
        )"
      >
        <svg
          :class="cn('h-3 w-3', {
            'h-2 w-2': size === 'sm',
            'h-3 w-3': size === 'default',
            'h-4 w-4': size === 'lg',
          })"
          fill="currentColor"
          viewBox="0 0 12 12"
        >
          <path
            d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
          />
        </svg>
      </div>

      <!-- Indeterminate Icon -->
      <div
        :class="cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center text-current',
          'opacity-0 peer-data-[state=indeterminate]:opacity-100',
          'transition-opacity duration-150',
          iconClass
        )"
      >
        <svg
          :class="cn('h-3 w-3', {
            'h-2 w-2': size === 'sm',
            'h-3 w-3': size === 'default',
            'h-4 w-4': size === 'lg',
          })"
          fill="currentColor"
          viewBox="0 0 12 12"
        >
          <rect
            x="2"
            y="5"
            width="8"
            height="2"
            rx="1"
          />
        </svg>
      </div>
    </div>

    <div v-if="label || $slots.default" class="grid gap-1.5 leading-none">
      <label
        :for="inputId"
        :class="cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          'cursor-pointer',
          {
            'text-destructive': error,
            'text-muted-foreground': disabled,
          },
          labelClass
        )"
      >
        <slot>{{ label }}</slot>
      </label>

      <p
        v-if="description"
        :class="cn(
          'text-xs text-muted-foreground',
          {
            'text-destructive': error,
          },
          descriptionClass
        )"
      >
        {{ description }}
      </p>
    </div>
  </div>

  <!-- Error Message -->
  <p
    v-if="error && errorMessage"
    :class="cn('mt-1 text-xs text-destructive', errorMessageClass)"
  >
    {{ errorMessage }}
  </p>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant } from '@/lib/style-validators'

interface CheckboxProps {
  modelValue?: boolean | 'indeterminate'
  checked?: boolean
  indeterminate?: boolean
  value?: string | number
  label?: string
  description?: string
  name?: string
  size?: SizeVariant
  disabled?: boolean
  required?: boolean
  error?: boolean
  errorMessage?: string
  // Styling props
  wrapperClass?: string
  checkboxClass?: string
  iconClass?: string
  labelClass?: string
  descriptionClass?: string
  errorMessageClass?: string
}

interface CheckboxEmits {
  (e: 'update:modelValue', value: boolean | 'indeterminate'): void
  (e: 'change', value: boolean, event: Event): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  size: 'default',
  disabled: false,
  required: false,
  error: false,
  indeterminate: false,
})

const emit = defineEmits<CheckboxEmits>()

// Refs
const inputRef = ref<HTMLInputElement>()

// Computed
const inputId = computed(() => `checkbox-${Math.random().toString(36).substr(2, 9)}`)

const checked = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue === true
  }
  return props.checked || false
})

const indeterminate = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue === 'indeterminate'
  }
  return props.indeterminate || false
})

// Methods
const getDataState = () => {
  if (indeterminate.value) return 'indeterminate'
  if (checked.value) return 'checked'
  return 'unchecked'
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newValue = target.checked

  emit('update:modelValue', newValue)
  emit('change', newValue, event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const toggle = () => {
  if (props.disabled) return

  const newValue = !checked.value
  emit('update:modelValue', newValue)
  emit('change', newValue, new Event('change'))
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Watch for indeterminate changes
watch(indeterminate, async (newValue) => {
  await nextTick()
  if (inputRef.value) {
    inputRef.value.indeterminate = newValue
  }
})

// Set initial indeterminate state
watch(
  inputRef,
  (el) => {
    if (el) {
      el.indeterminate = indeterminate.value
    }
  },
  { immediate: true },
)

// Expose methods
defineExpose({
  toggle,
  focus,
  blur,
  inputRef,
})
</script>

<style scoped>
/* Custom checkbox styling */
input[type="checkbox"] {
  appearance: none;
  background-color: transparent;
  margin: 0;
  font: inherit;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-radius: 0.125rem;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}

input[type="checkbox"]:checked {
  background-color: hsl(var(--primary));
  border-color: hsl(var(--primary));
}

input[type="checkbox"]:indeterminate {
  background-color: hsl(var(--primary));
  border-color: hsl(var(--primary));
}

input[type="checkbox"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input[type="checkbox"]:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Animation for state changes */
.peer-data-\[state\=checked\]\:opacity-100,
.peer-data-\[state\=indeterminate\]\:opacity-100 {
  transition: opacity 0.15s ease-in-out;
}

/* Ensure proper stacking */
.peer-data-\[state\=checked\]\:bg-primary {
  background-color: hsl(var(--primary));
}

.peer-data-\[state\=indeterminate\]\:bg-primary {
  background-color: hsl(var(--primary));
}

.peer-data-\[state\=checked\]\:text-primary-foreground {
  color: hsl(var(--primary-foreground));
}

.peer-data-\[state\=indeterminate\]\:text-primary-foreground {
  color: hsl(var(--primary-foreground));
}
</style>
