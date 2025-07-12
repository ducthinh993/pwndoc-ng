<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96">
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
              class="h-5 w-5"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div v-if="item.title" class="font-medium leading-none mb-1">
              {{ item.title }}
            </div>
            <div class="text-sm opacity-90">
              {{ item.message }}
            </div>
          </div>
          <div class="shrink-0 flex gap-2">
            <button
              v-if="item.action"
              @click="item.action.onClick"
              class="text-sm font-medium underline hover:no-underline"
            >
              {{ item.action.label }}
            </button>
            <button
              @click="toast.dismiss(item.id)"
              class="text-muted-foreground hover:text-foreground"
            >
              <X class="h-4 w-4" />
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
  X 
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