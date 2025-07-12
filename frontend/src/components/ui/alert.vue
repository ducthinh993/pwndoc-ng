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
      <div class="flex-1 min-w-0">
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
  XCircle 
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
    warning: 'border-orange-500/50 bg-orange-50 text-orange-900 dark:bg-orange-950 dark:text-orange-100',
    success: 'border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100',
    info: 'border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100',
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