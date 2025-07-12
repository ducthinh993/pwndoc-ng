<template>
  <div
    :class="cn(
      'relative w-full',
      {
        'opacity-50 pointer-events-none': disabled,
      },
      wrapperClass
    )"
  >
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="cn(
        'block text-sm font-medium text-foreground mb-1',
        labelClass
      )"
    >
      {{ label }}
      <span v-if="required" class="ml-1 text-destructive">*</span>
    </label>

    <!-- Select Trigger -->
    <div
      ref="triggerRef"
      :class="cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
        'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'cursor-pointer',
        {
          'border-destructive focus:ring-destructive': error,
          'h-8 px-2 py-1 text-xs': size === 'sm',
          'h-12 px-4 py-3 text-base': size === 'lg',
          'ring-2 ring-ring': isOpen,
        },
        triggerClass
      )"
      :tabindex="disabled ? -1 : 0"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-labelledby="labelId"
      @click="toggleDropdown"
      @keydown="handleTriggerKeydown"
    >
      <!-- Selected Value Display -->
      <div class="flex flex-1 items-center gap-1 overflow-hidden">
        <template v-if="multiple && selectedValues.length > 0">
          <!-- Multiple Selection Chips -->
          <div
            v-for="value in selectedValues.slice(0, maxChips)"
            :key="value"
            :class="cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs bg-secondary text-secondary-foreground',
              chipClass
            )"
          >
            <span class="truncate">{{ getOptionLabel(value) }}</span>
            <button
              v-if="!disabled && clearable"
              class="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20"
              :aria-label="`Remove ${getOptionLabel(value)}`"
              @click.stop="removeValue(value)"
            >
              <svg
                class="size-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <span v-if="selectedValues.length > maxChips" class="text-xs text-muted-foreground">
            +{{ selectedValues.length - maxChips }} more
          </span>
        </template>

        <template v-else-if="!multiple && selectedValues.length > 0">
          <!-- Single Selection -->
          <span class="truncate">{{ getOptionLabel(selectedValues[0]) }}</span>
        </template>

        <template v-else>
          <!-- Placeholder -->
          <span class="truncate text-muted-foreground">{{ placeholder }}</span>
        </template>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- Clear Button -->
        <button
          v-if="clearable && selectedValues.length > 0 && !disabled"
          :class="cn(
            'flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted',
            'transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
            clearButtonClass
          )"
          :aria-label="clearLabel"
          @click.stop="clearSelection"
        >
          <svg
            class="size-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Dropdown Arrow -->
        <svg
          :class="cn(
            'h-4 w-4 transition-transform duration-200',
            {
              'rotate-180': isOpen,
            },
            arrowClass
          )"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <!-- Error Message -->
    <p
      v-if="error && errorMessage"
      :class="cn(
        'mt-1 text-sm text-destructive',
        errorMessageClass
      )"
    >
      {{ errorMessage }}
    </p>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      ref="dropdownRef"
      :class="cn(
        'absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-hidden',
        'animate-in fade-in-0 zoom-in-95',
        dropdownClass
      )"
    >
      <!-- Search Input -->
      <div
        v-if="searchable"
        :class="cn(
          'p-2 border-b border-border',
          searchWrapperClass
        )"
      >
        <input
          ref="searchRef"
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          :class="cn(
            'w-full px-3 py-1 text-sm border border-input rounded-sm',
            'focus:outline-none focus:ring-1 focus:ring-ring',
            searchInputClass
          )"
          @keydown="handleSearchKeydown"
        >
      </div>

      <!-- Options List -->
      <div
        ref="optionsRef"
        :class="cn(
          'overflow-y-auto max-h-48',
          optionsClass
        )"
        role="listbox"
        :aria-multiselectable="multiple"
      >
        <template v-if="filteredOptions.length > 0">
          <div
            v-for="(option, index) in filteredOptions"
            :key="getOptionValue(option)"
            :class="cn(
              'relative cursor-pointer select-none py-2 px-3 text-sm',
              'hover:bg-accent hover:text-accent-foreground',
              'focus:bg-accent focus:text-accent-foreground',
              {
                'bg-accent text-accent-foreground': index === highlightedIndex,
                'bg-primary text-primary-foreground': isSelected(getOptionValue(option)),
              },
              optionClass
            )"
            role="option"
            :aria-selected="isSelected(getOptionValue(option))"
            @click="selectOption(option)"
            @mouseover="highlightedIndex = index"
          >
            <div class="flex w-full items-center justify-between">
              <span class="truncate">{{ getOptionLabel(option) }}</span>
              <svg
                v-if="isSelected(getOptionValue(option))"
                class="size-4 text-current"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </template>

        <template v-else>
          <div
            :class="cn(
              'relative cursor-default select-none py-2 px-3 text-sm text-muted-foreground',
              emptyClass
            )"
          >
            {{ noOptionsMessage }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant } from '@/lib/style-validators'

interface Option {
  label: string
  value: any
  disabled?: boolean
  [key: string]: any
}

interface SelectProps {
  modelValue?: any | any[]
  options?: Option[] | any[]
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  noOptionsMessage?: string
  clearLabel?: string
  size?: SizeVariant
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  disabled?: boolean
  required?: boolean
  error?: boolean
  errorMessage?: string
  maxChips?: number
  optionLabel?: string | ((option: any) => string)
  optionValue?: string | ((option: any) => any)
  // Styling props
  wrapperClass?: string
  triggerClass?: string
  labelClass?: string
  chipClass?: string
  clearButtonClass?: string
  arrowClass?: string
  dropdownClass?: string
  searchWrapperClass?: string
  searchInputClass?: string
  optionsClass?: string
  optionClass?: string
  emptyClass?: string
  errorMessageClass?: string
}

interface SelectEmits {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
  (e: 'clear'): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'search', query: string): void
}

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select an option...',
  searchPlaceholder: 'Search...',
  noOptionsMessage: 'No options available',
  clearLabel: 'Clear selection',
  size: 'default',
  multiple: false,
  searchable: false,
  clearable: false,
  disabled: false,
  required: false,
  error: false,
  maxChips: 3,
  optionLabel: 'label',
  optionValue: 'value',
  options: () => [],
})

const emit = defineEmits<SelectEmits>()

// Refs
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const searchRef = ref<HTMLInputElement>()
const optionsRef = ref<HTMLElement>()

// State
const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)

// Computed
const inputId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)
const labelId = computed(() => `select-label-${Math.random().toString(36).substr(2, 9)}`)

const selectedValues = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return props.modelValue !== undefined && props.modelValue !== null ? [props.modelValue] : []
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }

  return props.options.filter(option => {
    const label = getOptionLabel(option).toLowerCase()
    return label.includes(searchQuery.value.toLowerCase())
  })
})

// Helper functions
const getOptionLabel = (option: any): string => {
  if (typeof props.optionLabel === 'function') {
    return props.optionLabel(option)
  }
  if (typeof option === 'object' && option !== null) {
    return option[props.optionLabel] || String(option)
  }
  return String(option)
}

const getOptionValue = (option: any): any => {
  if (typeof props.optionValue === 'function') {
    return props.optionValue(option)
  }
  if (typeof option === 'object' && option !== null) {
    return option[props.optionValue] !== undefined ? option[props.optionValue] : option
  }
  return option
}

const isSelected = (value: any): boolean => {
  return selectedValues.value.includes(value)
}

// Actions
const toggleDropdown = () => {
  if (props.disabled) return

  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

const openDropdown = async () => {
  isOpen.value = true
  highlightedIndex.value = -1
  emit('open')

  await nextTick()

  if (props.searchable && searchRef.value) {
    searchRef.value.focus()
  }
}

const closeDropdown = () => {
  isOpen.value = false
  searchQuery.value = ''
  highlightedIndex.value = -1
  emit('close')

  if (triggerRef.value) {
    triggerRef.value.focus()
  }
}

const selectOption = (option: any) => {
  const value = getOptionValue(option)

  if (props.multiple) {
    const currentValues = [...selectedValues.value]
    const index = currentValues.indexOf(value)

    if (index > -1) {
      currentValues.splice(index, 1)
    } else {
      currentValues.push(value)
    }

    emit('update:modelValue', currentValues)
    emit('change', currentValues)
  } else {
    emit('update:modelValue', value)
    emit('change', value)
    closeDropdown()
  }
}

const removeValue = (value: any) => {
  if (props.multiple) {
    const currentValues = selectedValues.value.filter(v => v !== value)
    emit('update:modelValue', currentValues)
    emit('change', currentValues)
  }
}

const clearSelection = () => {
  const newValue = props.multiple ? [] : null
  emit('update:modelValue', newValue)
  emit('change', newValue)
  emit('clear')
}

// Keyboard navigation
const handleTriggerKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
  case 'Enter':
  case ' ':
    event.preventDefault()
    toggleDropdown()
    break
  case 'ArrowDown':
    event.preventDefault()
    if (!isOpen.value) {
      openDropdown()
    }
    break
  case 'Escape':
    if (isOpen.value) {
      closeDropdown()
    }
    break
  }
}

const handleSearchKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
  case 'ArrowDown':
    event.preventDefault()
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1)
    scrollToHighlighted()
    break
  case 'ArrowUp':
    event.preventDefault()
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
    scrollToHighlighted()
    break
  case 'Enter':
    event.preventDefault()
    if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
      selectOption(filteredOptions.value[highlightedIndex.value])
    }
    break
  case 'Escape':
    closeDropdown()
    break
  }
}

const scrollToHighlighted = () => {
  if (optionsRef.value && highlightedIndex.value >= 0) {
    const optionElement = optionsRef.value.children[highlightedIndex.value] as HTMLElement
    if (optionElement) {
      optionElement.scrollIntoView({ block: 'nearest' })
    }
  }
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (isOpen.value &&
    !triggerRef.value?.contains(event.target as Node) &&
    !dropdownRef.value?.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  emit('search', newQuery)
  highlightedIndex.value = -1
})

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose methods
defineExpose({
  open: openDropdown,
  close: closeDropdown,
  toggle: toggleDropdown,
  clear: clearSelection,
  focus: () => triggerRef.value?.focus(),
})
</script>

<style scoped>
.animate-in {
  animation: fade-in 0.2s ease-out, zoom-in 0.2s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoom-in {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}

.fade-in-0 {
  animation: fade-in 0.2s ease-out;
}

.zoom-in-95 {
  animation: zoom-in 0.2s ease-out;
}
</style>
