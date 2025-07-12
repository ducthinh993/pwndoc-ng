<template>
  <div
    :class="cn(
      'relative w-full rounded-lg border p-4',
      variantClasses,
      className
    )"
    role="alert"
  >
    <div class="flex items-start gap-3">
      <div v-if="showIcon" class="shrink-0">
        <component
          :is="iconComponent"
          :class="cn('h-5 w-5', iconClasses)"
        />
      </div>
      <div class="min-w-0 flex-1">
        <div v-if="title" class="mb-1 font-medium leading-none tracking-tight">
          {{ title }}
        </div>
        <div :class="cn('text-sm', { 'opacity-90': title })">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
} from 'lucide-vue-next'

interface Props {
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info'
  title?: string
  showIcon?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showIcon: true,
})

const variantClasses = computed(() => {
  const variants = {
    default: 'border-border bg-background text-foreground',
    destructive: 'border-destructive/50 bg-destructive/10 text-destructive',
    warning: 'border-warning-emphasis bg-warning-subtle text-warning-strong',
    success: 'border-success-emphasis bg-success-subtle text-success-strong',
    info: 'border-info-emphasis bg-info-subtle text-info-strong',
  }
  return variants[props.variant]
})

const iconComponent = computed(() => {
  const icons = {
    default: Info,
    destructive: XCircle,
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info,
  }
  return icons[props.variant]
})

const iconClasses = computed(() => {
  const classes = {
    default: 'text-foreground',
    destructive: 'text-destructive',
    warning: 'text-orange-600',
    success: 'text-green-600',
    info: 'text-blue-600',
  }
  return classes[props.variant]
})
</script>
