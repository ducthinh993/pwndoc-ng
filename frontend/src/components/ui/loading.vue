<template>
  <teleport to="body">
    <div
      v-if="loading.state.isLoading"
      :class="cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-background/80 backdrop-blur-sm',
        loading.state.customClass
      )"
      :style="backgroundColor ? { backgroundColor } : {}"
    >
      <div class="flex flex-col items-center gap-4 rounded-lg border bg-background p-8 shadow-lg">
        <div class="size-12 animate-spin rounded-full border-b-2 border-primary" />
        <div
          v-if="loading.state.message"
          :class="cn(
            'text-center text-sm font-medium text-muted-foreground',
            'max-w-md'
          )"
        >
          <div v-if="loading.state.html" v-html="loading.state.message" />
          <div v-else>
            {{ loading.state.message }}
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { globalLoading } from '@/composables/useLoading'

const loading = globalLoading

const backgroundColor = computed(() => {
  if (!loading.state.backgroundColor) return undefined

  const colorMap: Record<string, string> = {
    'blue-grey-8': 'hsl(var(--color-grey-8))',
    'red-10': 'hsl(var(--color-error-solid))',
    'primary': 'hsl(var(--color-primary))',
    'secondary': 'hsl(var(--color-secondary))',
    'success': 'hsl(var(--color-success))',
    'warning': 'hsl(var(--color-warning))',
    'error': 'hsl(var(--color-destructive))',
    'info': 'hsl(var(--color-info))',
  }

  return colorMap[loading.state.backgroundColor] || loading.state.backgroundColor
})
</script>
