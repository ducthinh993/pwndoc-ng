<template>
  <div class="space-y-2">
    <label
      v-if="label"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {{ label }}
    </label>
    <textarea
      v-model="dataString"
      :readonly="readonly"
      :disabled="readonly"
      :class="cn(
        'flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
        'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 resize-y',
        readonly && 'bg-muted cursor-not-allowed'
      )"
      rows="4"
      @input="updateParent"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { cn } from '@/lib/utils'

export default defineComponent({
  name: 'TextareaArrayShadcn',
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    noEmptyLine: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const dataString = ref('')

    const updateParent = () => {
      if (props.noEmptyLine) {
        emit('update:modelValue', dataString.value.split('\n').filter(e => e !== ''))
      } else {
        emit('update:modelValue', dataString.value.split('\n'))
      }
    }

    // Initialize dataString from modelValue
    onMounted(() => {
      if (props.modelValue) {
        dataString.value = props.modelValue.join('\n')
      }
    })

    // Watch for external changes to modelValue
    watch(
      () => props.modelValue,
      (val) => {
        const str = val ? val.join('\n') : ''
        if (str === dataString.value) {
          return
        }
        dataString.value = str
      },
      { deep: true },
    )

    return {
      dataString,
      updateParent,
      cn,
    }
  },
})
</script>

<style scoped>
/* Additional styling if needed */
</style>
