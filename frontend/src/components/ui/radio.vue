<template>
  <div :class="cn('flex items-center space-x-2', wrapperClass)">
    <div class="relative flex items-center">
      <input
        :id="inputId"
        ref="inputRef"
        type="radio"
        :checked="checked"
        :disabled="disabled"
        :required="required"
        :name="name"
        :value="value"
        :class="cn(
          'peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          {
            'h-3 w-3': size === 'sm',
            'h-4 w-4': size === 'default',
            'h-5 w-5': size === 'lg',
            'border-destructive': error,
            'border-muted': disabled,
          },
          radioClass
        )"
        :data-state="checked ? 'checked' : 'unchecked'"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        v-bind="$attrs"
      />
      
      <!-- Radio Dot -->
      <div
        :class="cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center text-current',
          'opacity-0 peer-data-[state=checked]:opacity-100',
          'transition-opacity duration-150',
          iconClass
        )"
      >
        <div
          :class="cn('rounded-full bg-current', {
            'h-1.5 w-1.5': size === 'sm',
            'h-2 w-2': size === 'default',
            'h-2.5 w-2.5': size === 'lg',
          })"
        />
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
import { ref, computed } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant } from '@/lib/style-validators'

interface RadioProps {
  modelValue?: string | number | boolean
  value?: string | number | boolean
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
  radioClass?: string
  iconClass?: string
  labelClass?: string
  descriptionClass?: string
  errorMessageClass?: string
}

interface RadioEmits {
  (e: 'update:modelValue', value: string | number | boolean): void
  (e: 'change', value: string | number | boolean, event: Event): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

const props = withDefaults(defineProps<RadioProps>(), {
  size: 'default',
  disabled: false,
  required: false,
  error: false,
})

const emit = defineEmits<RadioEmits>()

// Refs
const inputRef = ref<HTMLInputElement>()

// Computed
const inputId = computed(() => `radio-${Math.random().toString(36).substr(2, 9)}`)

const checked = computed(() => {
  return props.modelValue === props.value
})

// Methods
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked && props.value !== undefined) {
    emit('update:modelValue', props.value)
    emit('change', props.value, event)
  }
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Expose methods
defineExpose({
  focus,
  blur,
  inputRef,
})
</script>

<style scoped>
/* Custom radio styling */
input[type="radio"] {
  appearance: none;
  background-color: transparent;
  margin: 0;
  font: inherit;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-radius: 50%;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}

input[type="radio"]:checked {
  background-color: hsl(var(--primary));
  border-color: hsl(var(--primary));
}

input[type="radio"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input[type="radio"]:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Animation for state changes */
.peer-data-\[state\=checked\]\:opacity-100 {
  transition: opacity 0.15s ease-in-out;
}

/* Ensure proper stacking */
.peer-data-\[state\=checked\]\:bg-primary {
  background-color: hsl(var(--primary));
}

.peer-data-\[state\=checked\]\:text-primary-foreground {
  color: hsl(var(--primary-foreground));
}
</style> 