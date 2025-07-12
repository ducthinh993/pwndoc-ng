<template>
  <div :class="cn('relative', wrapperClasses)">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="cn(labelClasses)"
    >
      {{ label }}
      <span v-if="required" class="ml-1 text-destructive">*</span>
    </label>

    <!-- Input field -->
    <input
      :id="inputId"
      ref="inputRef"
      :class="cn(baseInputClasses, sizeClasses, errorClasses, focusClasses, className)"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :min="min"
      :max="max"
      :step="step"
      :pattern="pattern"
      :maxlength="maxlength"
      v-bind="$attrs"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
      @keyup.enter="onEnter"
    >

    <!-- Prefix icon -->
    <div
      v-if="prefixIcon"
      :class="cn('absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none', prefixIconClasses)"
    >
      <component :is="iconComponent" :name="prefixIcon" />
    </div>

    <!-- Suffix icon -->
    <div
      v-if="suffixIcon || clearable"
      :class="cn('absolute right-3 top-1/2 transform -translate-y-1/2', suffixIconClasses)"
    >
      <!-- Clear button -->
      <button
        v-if="clearable && modelValue && !disabled"
        type="button"
        :class="cn('hover:text-foreground text-muted-foreground transition-colors')"
        @click="onClear"
      >
        <component :is="iconComponent" name="close" />
      </button>

      <!-- Suffix icon -->
      <component
        :is="iconComponent"
        v-else-if="suffixIcon"
        :name="suffixIcon"
        :class="cn('text-muted-foreground')"
      />
    </div>

    <!-- Error message -->
    <p
      v-if="error && errorMessage"
      :class="cn('text-sm text-destructive mt-1')"
    >
      {{ errorMessage }}
    </p>

    <!-- Helper text -->
    <p
      v-else-if="hint && !error"
      :class="cn('text-sm text-muted-foreground mt-1')"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { cn } from '@/lib/utils'
import { baseInputClasses } from '@/lib/component-classes'
import { type SizeVariant, validateSize } from '@/lib/style-validators'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  size?: SizeVariant
  label?: string
  placeholder?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  prefixIcon?: string
  suffixIcon?: string
  iconComponent?: string
  autocomplete?: string
  min?: string | number
  max?: string | number
  step?: string | number
  pattern?: string
  maxlength?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'default',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  iconComponent: 'q-icon',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'enter': [event: KeyboardEvent]
  'clear': []
}>()

// Generate unique input ID
const inputId = `input-${Math.random().toString(36).substring(2, 9)}`

// Refs
const inputRef = ref<HTMLInputElement>()

// Validate props
if (!validateSize(props.size)) {
  console.warn(`Invalid input size: ${props.size}`)
}

// Wrapper classes for the entire input component
const wrapperClasses = computed(() => ({
  'opacity-50': props.disabled,
}))

// Label classes - matches q-input label styling
const labelClasses = computed(() =>
  cn(
    'block text-sm font-medium mb-2',
    {
      'text-destructive': props.error,
      'text-foreground': !props.error && !props.disabled,
      'text-muted-foreground': props.disabled,
    },
  ),
)

// Size classes - exact mapping from Quasar input sizes
const sizeClasses = computed(() => {
  const sizes = {
    // Extra small - matches q-input dense
    xs: 'h-8 px-2 py-1 text-xs',

    // Small - matches q-input size="sm"
    sm: 'h-9 px-3 py-2 text-sm',

    // Default - matches q-input default size
    default: 'h-10 px-3 py-2 text-sm',

    // Large - matches q-input size="lg"
    lg: 'h-11 px-4 py-3 text-base',

    // Extra large - matches q-input size="xl"
    xl: 'h-12 px-4 py-3 text-lg',
  }

  const sizeClass = sizes[props.size]

  // Adjust padding for icons
  const paddingAdjustments = {
    'pl-10': props.prefixIcon,
    'pr-10': props.suffixIcon || props.clearable,
  }

  return cn(sizeClass, paddingAdjustments)
})

// Error classes - matches q-input error styling
const errorClasses = computed(() => ({
  'border-destructive focus-visible:ring-destructive': props.error,
  'border-input': !props.error,
}))

// Focus classes - matches q-input focus styling
const focusClasses = computed(() => ({
  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2': !props.error,
  'focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2': props.error,
}))

// Icon classes based on input size
const prefixIconClasses = computed(() => {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    default: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }
  return `text-muted-foreground ${iconSizes[props.size]}`
})

const suffixIconClasses = computed(() => {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    default: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }
  return iconSizes[props.size]
})

// Event handlers
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value

  // Handle number type conversion
  if (props.type === 'number' && value !== '') {
    value = Number(value)
  }

  emit('update:modelValue', value)
}

const onFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const onBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const onEnter = (event: KeyboardEvent) => {
  emit('enter', event)
}

const onClear = () => {
  emit('update:modelValue', '')
  emit('clear')

  // Focus the input after clearing
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// Expose input ref for parent components
defineExpose({
  inputRef,
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select(),
})
</script>

<style scoped>
/* Additional component-specific styles if needed */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Disabled state styling */
input:disabled {
  cursor: not-allowed;
}

/* Placeholder styling */
input::placeholder {
  opacity: 1;
}
</style>
