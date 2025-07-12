<template>
  <Select v-model="lang">
    <SelectTrigger class="w-full">
      <SelectValue :placeholder="$t('language')" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="option in langOptions"
        :key="option.value"
        :value="option.value"
      >
        <div class="flex items-center space-x-2">
          <span class="text-lg">{{ getLanguageFlag(option.value) }}</span>
          <span>{{ option.label }}</span>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Composables
import { $t } from '@/boot/i18n'

const { locale } = useI18n()

// Reactive data
const lang = ref('')
const langOptions = ref([
  { value: 'en-US', label: 'English' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'zh-CN', label: '中文' },
  { value: 'de-DE', label: 'Deutsch' },
])

// Methods
const getLanguageFlag = (langCode) => {
  const flagMap = {
    'en-US': '🇺🇸',
    'fr-FR': '🇫🇷',
    'zh-CN': '🇨🇳',
    'de-DE': '🇩🇪',
  }
  return flagMap[langCode] || '🌐'
}

// Watch for language changes
watch(lang, (newLang) => {
  if (newLang) {
    locale.value = newLang
    localStorage.setItem('system_language', newLang)
  }
})

// Initialize language on component mount
onMounted(() => {
  const storedLanguage = localStorage.getItem('system_language')
  if (storedLanguage) {
    lang.value = storedLanguage
  } else {
    lang.value = 'en-US'
    localStorage.setItem('system_language', lang.value)
  }
})
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
