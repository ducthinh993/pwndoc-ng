<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="relative">
        <component
          :is="themeIcon"
          class="size-4 transition-all duration-200"
          :class="{ 'animate-spin': isTransitioning }"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-48">
      <DropdownMenuItem
        :class="{ 'bg-accent': theme === THEMES.LIGHT }"
        @click="setTheme(THEMES.LIGHT)"
      >
        <Sun class="mr-2 size-4" />
        Light
        <span v-if="theme === THEMES.LIGHT" class="ml-auto">
          <Check class="size-4" />
        </span>
      </DropdownMenuItem>

      <DropdownMenuItem
        :class="{ 'bg-accent': theme === THEMES.DARK }"
        @click="setTheme(THEMES.DARK)"
      >
        <Moon class="mr-2 size-4" />
        Dark
        <span v-if="theme === THEMES.DARK" class="ml-auto">
          <Check class="size-4" />
        </span>
      </DropdownMenuItem>

      <DropdownMenuItem
        :class="{ 'bg-accent': theme === THEMES.SYSTEM }"
        @click="setTheme(THEMES.SYSTEM)"
      >
        <Monitor class="mr-2 size-4" />
        System
        <span v-if="theme === THEMES.SYSTEM" class="ml-auto">
          <Check class="size-4" />
        </span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <div class="px-2 py-1.5 text-xs text-muted-foreground">
        Current: {{ resolvedTheme }}
        <span v-if="isSystemMode" class="ml-1">
          ({{ systemPrefersDark ? 'Dark' : 'Light' }} system)
        </span>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sun, Moon, Monitor, Check } from 'lucide-vue-next'

const {
  theme,
  resolvedTheme,
  isDarkMode,
  isSystemMode,
  systemPrefersDark,
  setTheme,
  THEMES,
} = useTheme()

// Transition state for visual feedback
const isTransitioning = ref(false)

// Compute the appropriate icon based on current theme
const themeIcon = computed(() => {
  if (isSystemMode.value) {
    return Monitor
  }
  return isDarkMode.value ? Moon : Sun
})

// Watch for theme changes to trigger transition animation
watch(resolvedTheme, () => {
  isTransitioning.value = true
  setTimeout(() => {
    isTransitioning.value = false
  }, 200)
})
</script>

<style scoped>
/* Custom animation for theme transition */
@keyframes theme-transition {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(0.8); }
  100% { transform: rotate(360deg) scale(1); }
}

.animate-spin {
  animation: theme-transition 0.2s ease-in-out;
}
</style>
