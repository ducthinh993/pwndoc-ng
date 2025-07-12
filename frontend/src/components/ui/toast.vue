<template>
  <teleport to="body">
    <div class="fixed right-4 top-4 z-50 flex w-96 flex-col gap-2">
      <transition-group
        name="toast"
        tag="div"
        class="flex flex-col gap-2"
      >
        <div
          v-for="item in toast.items"
          :key="item.id"
          :class="cn(
            'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
            'bg-background text-foreground',
            'animate-in slide-in-from-right-full',
            variantClasses(item.type)
          )"
        >
          <div class="shrink-0">
            <component
              :is="iconComponent(item.type)"
              class="size-5"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div v-if="item.title" class="mb-1 font-medium leading-none">
              {{ item.title }}
            </div>
            <div class="text-sm opacity-90">
              {{ item.message }}
            </div>
          </div>
          <div class="flex shrink-0 gap-2">
            <button
              v-if="item.action"
              class="text-sm font-medium underline hover:no-underline"
              @click="item.action.onClick"
            >
              {{ item.action.label }}
            </button>
            <button
              class="text-muted-foreground hover:text-foreground"
              @click="toast.dismiss(item.id)"
            >
              <X class="size-4" />
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { useToast } from '@/composables/useToast'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-vue-next'

const toast = useToast()

const variantClasses = (type: string) => {
  const variants = {
    success: 'border-success-emphasis bg-success-subtle text-success-strong',
    error: 'border-error-emphasis bg-error-subtle text-error-strong',
    warning: 'border-warning-emphasis bg-warning-subtle text-warning-strong',
    info: 'border-info-emphasis bg-info-subtle text-info-strong',
  }
  return variants[type as keyof typeof variants] || variants.info
}

const iconComponent = (type: string) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  }
  return icons[type as keyof typeof icons] || Info
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
