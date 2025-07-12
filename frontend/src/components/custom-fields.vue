<template>
  <div class="space-y-6">
    <component
      :is="customElement"
      v-for="(computedField, idx) of computedFields"
      :key="idx"
      class="space-y-4"
    >
      <div class="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div
          v-for="(field, idx2) of computedField"
          :key="idx2"
          :class="`col-span-12 md:col-span-${field.customField.size || 12} ${field.customField.offset ? `md:col-start-${field.customField.offset + 1}` : ''}`"
        >
          <!-- Text Field with Rich Editor -->
          <div
            v-if="field.customField.fieldType === 'text'"
            :ref="`field-${idx}-${idx2}`"
            class="space-y-2"
          >
            <Label :for="`field-${field.customField._id}`" class="text-sm font-medium">
              {{ field.customField.label }}
              <span v-if="field.customField.required" class="ml-1 text-destructive">*</span>
            </Label>

            <div
              :class="cn(
                'border rounded-md overflow-hidden',
                isTextInCustomFields(field) ? 'bg-diff-changed border-diff-changed' : 'border-input'
              )"
            >
              <BasicEditor
                v-if="diff"
                :id="`field-${field.customField._id}`"
                v-model="field.text"
                :id-unique="field.customField._id + '-custom-' + idUnique"
                :diff="getTextDiffInCustomFields(field)"
                :editable="false"
                :collab="collab"
                class="min-h-[120px]"
                @editorchange="eventPropagation"
              />
              <BasicEditor
                v-else
                :id="`field-${field.customField._id}`"
                ref="basiceditor_custom"
                v-model="field.text"
                :id-unique="field.customField._id + '-custom-' + idUnique"
                :no-sync="noSyncEditor"
                :editable="!readonly"
                :collab="collab"
                class="min-h-[120px]"
                @editorchange="eventPropagation"
              />
            </div>

            <p v-if="field.customField.description" class="text-sm text-muted-foreground">
              {{ field.customField.description }}
            </p>

            <p v-if="field.customField.required && (!field.text || field.text.length === 0)" class="text-sm text-destructive">
              Field is required
            </p>
          </div>

          <!-- Input Field -->
          <div
            v-else-if="field.customField.fieldType === 'input'"
            :ref="`field-${idx}-${idx2}`"
            class="space-y-2"
          >
            <Label :for="`field-${field.customField._id}`" class="text-sm font-medium">
              {{ field.customField.label }}
              <span v-if="field.customField.required" class="ml-1 text-destructive">*</span>
            </Label>

            <Input
              :id="`field-${field.customField._id}`"
              v-model="field.text"
              :placeholder="field.customField.label"
              :disabled="readonly"
              :required="field.customField.required"
              :class="cn(
                isTextInCustomFields(field) ? 'bg-diff-changed border-diff-changed' : ''
              )"
            />

            <p v-if="field.customField.description" class="text-sm text-muted-foreground">
              {{ field.customField.description }}
            </p>

            <p v-if="field.customField.required && (!field.text || field.text.length === 0)" class="text-sm text-destructive">
              Field is required
            </p>
          </div>

          <!-- Date Field -->
          <div
            v-else-if="field.customField.fieldType === 'date'"
            :ref="`field-${idx}-${idx2}`"
            class="space-y-2"
          >
            <Label :for="`field-${field.customField._id}`" class="text-sm font-medium">
              {{ field.customField.label }}
              <span v-if="field.customField.required" class="ml-1 text-destructive">*</span>
            </Label>

            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="cn(
                    'w-full justify-start text-left font-normal',
                    !field.text && 'text-muted-foreground',
                    isTextInCustomFields(field) ? 'bg-diff-changed border-diff-changed' : ''
                  )"
                  :disabled="readonly"
                >
                  <CalendarIcon class="mr-2 size-4" />
                  {{ field.text ? formatDate(field.text) : `Select ${field.customField.label}` }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar
                  v-model="field.text"
                  :disabled="readonly"
                  format="YYYY-MM-DD"
                  first-day-of-week="1"
                />
              </PopoverContent>
            </Popover>

            <p v-if="field.customField.description" class="text-sm text-muted-foreground">
              {{ field.customField.description }}
            </p>

            <p v-if="field.customField.required && (!field.text || field.text.length === 0)" class="text-sm text-destructive">
              Field is required
            </p>
          </div>

          <!-- Select Field -->
          <div
            v-else-if="field.customField.fieldType === 'select'"
            :ref="`field-${idx}-${idx2}`"
            class="space-y-2"
          >
            <Label :for="`field-${field.customField._id}`" class="text-sm font-medium">
              {{ field.customField.label }}
              <span v-if="field.customField.required" class="ml-1 text-destructive">*</span>
            </Label>

            <Select
              :id="`field-${field.customField._id}`"
              v-model="field.text"
              :disabled="readonly"
              :class="cn(
                isTextInCustomFields(field) ? 'bg-diff-changed border-diff-changed' : ''
              )"
            >
              <SelectTrigger class="w-full">
                <SelectValue :placeholder="`Select ${field.customField.label}`" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in field.customField.options.filter(e => e.locale === locale)"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.value }}
                </SelectItem>
              </SelectContent>
            </Select>

            <p v-if="field.customField.description" class="text-sm text-muted-foreground">
              {{ field.customField.description }}
            </p>

            <p v-if="field.customField.required && (!field.text || field.text.length === 0)" class="text-sm text-destructive">
              Field is required
            </p>
          </div>

          <!-- Multi-Select Field -->
          <div
            v-else-if="field.customField.fieldType === 'select-multiple'"
            :ref="`field-${idx}-${idx2}`"
            class="space-y-2"
          >
            <Label :for="`field-${field.customField._id}`" class="text-sm font-medium">
              {{ field.customField.label }}
              <span v-if="field.customField.required" class="ml-1 text-destructive">*</span>
            </Label>

            <div
              :class="cn(
                'border rounded-md p-3 space-y-2',
                isTextInCustomFields(field) ? 'bg-diff-changed border-diff-changed' : 'border-input'
              )"
            >
              <!-- Selected items as badges -->
              <div v-if="field.text && field.text.length > 0" class="flex flex-wrap gap-2">
                <Badge
                  v-for="(item, itemIdx) in field.text"
                  :key="itemIdx"
                  variant="secondary"
                  class="px-2 py-1"
                >
                  {{ item }}
                  <button
                    v-if="!readonly"
                    class="ml-1 text-muted-foreground hover:text-foreground"
                    @click="removeMultiSelectItem(field, itemIdx)"
                  >
                    <X class="size-3" />
                  </button>
                </Badge>
              </div>

              <!-- Dropdown for adding items -->
              <Select
                v-if="!readonly"
                :model-value="''"
                @update:model-value="addMultiSelectItem(field, $event)"
              >
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Add item..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in field.customField.options.filter(e => e.locale === locale && !field.text?.includes(e.value))"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.value }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p v-if="field.customField.description" class="text-sm text-muted-foreground">
              {{ field.customField.description }}
            </p>

            <p v-if="field.customField.required && (!field.text || field.text.length === 0)" class="text-sm text-destructive">
              Field is required
            </p>
          </div>

          <!-- Checkbox Field -->
          <div
            v-else-if="field.customField.fieldType === 'checkbox'"
            :ref="`field-${idx}-${idx2}`"
            class="space-y-2"
          >
            <Label class="text-sm font-medium">
              {{ field.customField.label }}
              <span v-if="field.customField.required" class="ml-1 text-destructive">*</span>
            </Label>

            <div
              :class="cn(
                'border rounded-md p-3 space-y-3',
                isTextInCustomFields(field) ? 'bg-diff-changed border-diff-changed' : 'border-input'
              )"
            >
              <div
                v-for="option in getOptionsGroup(field.customField.options)"
                :key="option.value"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :id="`${field.customField._id}-${option.value}`"
                  :checked="field.text?.includes(option.value)"
                  :disabled="readonly"
                  @update:checked="updateCheckboxValue(field, option.value, $event)"
                />
                <Label
                  :for="`${field.customField._id}-${option.value}`"
                  class="cursor-pointer text-sm font-normal"
                >
                  {{ option.label }}
                </Label>
              </div>
            </div>

            <p v-if="field.customField.description" class="text-sm text-muted-foreground">
              {{ field.customField.description }}
            </p>

            <p v-if="field.customField.required && (!field.text || field.text.length === 0)" class="text-sm text-destructive">
              Field is required
            </p>
          </div>

          <!-- Radio Field -->
          <div
            v-else-if="field.customField.fieldType === 'radio'"
            :ref="`field-${idx}-${idx2}`"
            class="space-y-2"
          >
            <Label class="text-sm font-medium">
              {{ field.customField.label }}
              <span v-if="field.customField.required" class="ml-1 text-destructive">*</span>
            </Label>

            <RadioGroup
              v-model="field.text"
              :disabled="readonly"
              :class="cn(
                'border rounded-md p-3',
                isTextInCustomFields(field) ? 'bg-diff-changed border-diff-changed' : 'border-input'
              )"
            >
              <div
                v-for="option in getOptionsGroup(field.customField.options)"
                :key="option.value"
                class="flex items-center space-x-2"
              >
                <RadioGroupItem
                  :id="`${field.customField._id}-${option.value}`"
                  :value="option.value"
                />
                <Label
                  :for="`${field.customField._id}-${option.value}`"
                  class="cursor-pointer text-sm font-normal"
                >
                  {{ option.label }}
                </Label>
              </div>
            </RadioGroup>

            <p v-if="field.customField.description" class="text-sm text-muted-foreground">
              {{ field.customField.description }}
            </p>

            <p v-if="field.customField.required && (!field.text || field.text.length === 0)" class="text-sm text-destructive">
              Field is required
            </p>
          </div>
        </div>
      </div>
    </component>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'

// Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import BasicEditor from '@/components/editor'

// Icons
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  customElement: {
    type: String,
    default: 'div',
  },
  noSyncEditor: {
    type: Boolean,
    default: false,
  },
  diff: {
    type: Array,
    default: null,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  locale: {
    type: String,
    default: '',
  },
  collab: {
    type: Boolean,
    default: true,
  },
  idUnique: {
    type: String,
    default: '',
  },
})

// Emits
const emit = defineEmits(['editorchange'])

// Computed
const computedFields = computed(() => {
  const result = []
  let tmpArray = []

  props.modelValue.forEach(e => {
    if (e.customField.fieldType === 'space' && e.customField.size === 12) {
      // Full size space creates an empty component as separator
      result.push(tmpArray)
      result.push([])
      tmpArray = []
    } else {
      tmpArray.push(e)
    }
  })

  if (tmpArray.length > 0) {
    result.push(tmpArray)
  }

  return result
})

// Methods
const isTextInCustomFields = (field) => {
  if (props.diff) {
    return typeof props.diff.find(f => {
      return f.customField._id === field.customField._id && JSON.stringify(f.text) === JSON.stringify(field.text)
    }) === 'undefined'
  }
  return false
}

const eventPropagation = () => {
  emit('editorchange')
}

const getTextDiffInCustomFields = (field) => {
  let result = ''
  if (props.diff) {
    props.diff.find(f => {
      if (f.customField._id === field.customField._id) {
        result = f.text
      }
    })
  }
  return result
}

const getOptionsGroup = (options) => {
  return options
    .filter(e => e.locale === props.locale)
    .map(e => ({ label: e.value, value: e.value }))
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const addMultiSelectItem = (field, value) => {
  if (!value) return

  if (!field.text) {
    field.text = []
  }

  if (!field.text.includes(value)) {
    field.text.push(value)
  }
}

const removeMultiSelectItem = (field, index) => {
  if (field.text && field.text.length > index) {
    field.text.splice(index, 1)
  }
}

const updateCheckboxValue = (field, value, checked) => {
  if (!field.text) {
    field.text = []
  }

  if (checked) {
    if (!field.text.includes(value)) {
      field.text.push(value)
    }
  } else {
    const index = field.text.indexOf(value)
    if (index > -1) {
      field.text.splice(index, 1)
    }
  }
}

// Validation methods
const validate = () => {
  // Implement validation logic if needed
  // This would need to be adapted based on the specific validation requirements
}

const requiredFieldsEmpty = () => {
  return props.modelValue.some(e =>
    e.customField.fieldType !== 'space' &&
    e.customField.required &&
    (!e.text || e.text.length === 0),
  )
}

// Expose methods for parent components
defineExpose({
  validate,
  requiredFieldsEmpty,
})
</script>

<style>
</style>
