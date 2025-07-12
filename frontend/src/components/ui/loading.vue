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
      <div class="flex flex-col items-center gap-4 p-8 bg-background rounded-lg border shadow-lg">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <div
          v-if="loading.state.message"
          :class="cn(
            'text-center text-sm font-medium text-muted-foreground',
            'max-w-md'
          )"
        >
          <div v-if="loading.state.html" v-html="loading.state.message"></div>
          <div v-else>{{ loading.state.message }}</div>
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
    'blue-grey-8': 'rgb(55 65 81)',
    'red-10': 'rgb(239 68 68)',
  }
  
  return colorMap[loading.state.backgroundColor] || loading.state.backgroundColor
})
</script> 