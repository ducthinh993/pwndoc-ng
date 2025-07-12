<template>
  <div v-if="!loading" class="container mx-auto max-w-4xl px-4 py-6">
    <!-- General Settings -->
    <Card class="mb-6">
      <CardHeader class="rounded-t-lg bg-slate-500 text-white">
        <CardTitle class="text-xl">
          {{ $t('generalSettings') }}
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6 p-6">
        <!-- Language Selector -->
        <div>
          <h3 class="mb-2 font-semibold">
            {{ $t('changeDisplayLanguage') }}
          </h3>
          <p class="mb-4 text-sm text-muted-foreground">
            {{ $t('changeDisplayLanguageInfo') }}
          </p>
          <div class="w-64">
            <LanguageSelector />
          </div>
        </div>

        <!-- CVSS Extension -->
        <div>
          <h3 class="mb-2 font-semibold">
            {{ $t('extendCvssTemporalEnvironment') }}
          </h3>
          <div class="flex items-center space-x-3">
            <Switch
              :checked="settings.report.public.extendCvssTemporalEnvironment"
              :label="$t('btn.enable')"
              @update:checked="(value) => settings.report.public.extendCvssTemporalEnvironment = value"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Danger Settings -->
    <Card v-if="UserService.isAllowed('settings:read')" class="mb-6">
      <CardHeader class="rounded-t-lg bg-destructive text-destructive-foreground">
        <div class="flex items-center justify-between">
          <CardTitle class="text-xl">
            {{ $t('dangerSettings') }}
          </CardTitle>
          <Switch
            :checked="settings.danger.enabled"
            :disabled="!canEdit"
            class="bg-white"
            @update:checked="(value) => settings.danger.enabled = value"
          />
        </div>
      </CardHeader>
      <CardContent class="p-6">
        <div>
          <h3 class="mb-2 font-semibold">
            {{ $t('autoDeleteReport') }}
          </h3>
          <div class="w-64">
            <Input
              v-model.number="settings.danger.public.nbdaydelete"
              type="number"
              :disabled="!canEdit || !settings.danger.enabled"
              :placeholder="$t('numberDayBeforeDelete')"
            />
            <p class="mt-1 text-xs text-muted-foreground">
              {{ $t('numberDayBeforeDelete') }}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Reports Settings -->
    <Card v-if="UserService.isAllowed('settings:read')" class="mb-6">
      <CardHeader class="rounded-t-lg bg-slate-500 text-white">
        <CardTitle class="text-xl">
          {{ $t('reports') }}
        </CardTitle>
      </CardHeader>
      <CardContent v-if="UserService.isAllowed('settings:update')" class="space-y-6 p-6">
        <!-- Image Border -->
        <div>
          <h3 class="mb-2 font-semibold">
            {{ $t('reportsImagesBorder') }}
          </h3>
          <p class="mb-4 text-sm text-muted-foreground">
            {{ $t('addBorderToImages') }}
          </p>
          <div class="flex items-center space-x-4">
            <Switch
              :checked="settings.report.private.imageBorder"
              :label="$t('btn.enable')"
              @update:checked="(value) => settings.report.private.imageBorder = value"
            />
            <input
              v-model="settings.report.private.imageBorderColor"
              type="color"
              :disabled="!settings.report.private.imageBorder"
              class="h-8 w-12 rounded border border-input"
            >
            <span class="text-sm">
              {{ $t('currentColor') }}: {{ settings.report.private.imageBorderColor }}
            </span>
          </div>
        </div>

        <Separator />

        <!-- CVSS Colors -->
        <div>
          <h3 class="mb-2 font-semibold">
            {{ $t('cvssColors') }}
          </h3>
          <p class="mb-4 text-sm text-muted-foreground">
            {{ $t('changeCvssColorsDescription') }}
          </p>
          <div class="space-y-3">
            <div
              v-for="(colorKey, severity) in {
                criticalColor: 'critical',
                highColor: 'high',
                mediumColor: 'medium',
                lowColor: 'low',
                noneColor: 'informational'
              }"
              :key="severity"
              class="flex items-center space-x-4"
            >
              <label class="w-32 text-sm font-medium">{{ $t(severity) }}:</label>
              <input
                v-model="settings.report.public.cvssColors[colorKey]"
                type="color"
                class="h-8 w-12 rounded border border-input"
              >
              <span class="text-sm">
                {{ $t('currentColor') }}: {{ settings.report.public.cvssColors[colorKey] }}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Remediation Complexity Colors -->
        <div>
          <h3 class="mb-2 font-semibold">
            {{ $t('remediationColorsComplexity') }}
          </h3>
          <p class="mb-4 text-sm text-muted-foreground">
            {{ $t('changeRemediationColorsDescriptionComplexity') }}
          </p>
          <div class="space-y-3">
            <div
              v-for="(colorKey, complexity) in {
                highColor: 'complex',
                mediumColor: 'medium',
                lowColor: 'easy'
              }"
              :key="complexity"
              class="flex items-center space-x-4"
            >
              <label class="w-32 text-sm font-medium">{{ $t(complexity) }}:</label>
              <input
                v-model="settings.report.public.remediationColorsComplexity[colorKey]"
                type="color"
                class="h-8 w-12 rounded border border-input"
              >
              <span class="text-sm">
                {{ $t('currentColor') }}: {{ settings.report.public.remediationColorsComplexity[colorKey] }}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Remediation Priority Colors -->
        <div>
          <h3 class="mb-2 font-semibold">
            {{ $t('remediationColorsPriority') }}
          </h3>
          <p class="mb-4 text-sm text-muted-foreground">
            {{ $t('changeRemediationColorsDescriptionPriority') }}
          </p>
          <div class="space-y-3">
            <div
              v-for="(colorKey, priority) in {
                urgentColor: 'urgent',
                highColor: 'high',
                mediumColor: 'medium',
                lowColor: 'low'
              }"
              :key="priority"
              class="flex items-center space-x-4"
            >
              <label class="w-32 text-sm font-medium">{{ $t(priority) }}:</label>
              <input
                v-model="settings.report.public.remediationColorsPriority[colorKey]"
                type="color"
                class="h-8 w-12 rounded border border-input"
              >
              <span class="text-sm">
                {{ $t('currentColor') }}: {{ settings.report.public.remediationColorsPriority[colorKey] }}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Captions -->
        <div>
          <h3 class="mb-2 font-semibold">
            {{ $t('captions') }}
          </h3>
          <p class="mb-4 text-sm text-muted-foreground">
            {{ $t('captionsDescription') }}
          </p>
          <div class="max-w-md">
            <Select
              multiple
              :model-value="settings.report.public.captions"
              placeholder="Caption Labels"
              allow-create
              @update:model-value="(value) => settings.report.public.captions = value"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Reviews Settings -->
    <Card v-if="UserService.isAllowed('settings:read')" class="mb-6">
      <CardHeader class="rounded-t-lg bg-slate-500 text-white">
        <div class="flex items-center justify-between">
          <CardTitle class="text-xl">
            {{ $t('reviews') }}
          </CardTitle>
          <Switch
            :checked="settings.reviews.enabled"
            :disabled="!canEdit"
            class="bg-white"
            @update:checked="(value) => settings.reviews.enabled = value"
          />
        </div>
      </CardHeader>
      <CardContent class="space-y-6 p-6">
        <!-- Approval Behavior -->
        <div>
          <h3 class="mb-2 font-semibold">
            {{ $t('auditUpdateAfterApproval') }}
          </h3>
          <p class="mb-4 text-sm text-muted-foreground">
            {{ $t('changeApproveBehaviorIfAuditUpdated') }}
          </p>
          <ToggleGroup
            v-model="settings.reviews.private.removeApprovalsUponUpdate"
            :disabled="!canEdit || !settings.reviews.enabled"
            :options="[
              { label: $t('removeAllPriorApprovals'), value: true },
              { label: $t('keepAllPriorApprovals'), value: false }
            ]"
            class="w-full"
          />
        </div>

        <Separator />

        <!-- Mandatory Review -->
        <div>
          <h3 class="mb-2 font-semibold">
            {{ $t('mandatoryReview') }}
          </h3>
          <div class="mb-4 text-sm text-muted-foreground" v-html="$t('mandatoryReviewInfo')" />
          <div class="flex items-center space-x-4">
            <Switch
              :checked="settings.reviews.public.mandatoryReview"
              :disabled="!canEdit || !settings.reviews.enabled"
              :label="$t('btn.enable')"
              @update:checked="(value) => settings.reviews.public.mandatoryReview = value"
            />
            <div class="w-32">
              <Input
                v-model.number="settings.reviews.public.minReviewers"
                type="number"
                :disabled="!canEdit || !settings.reviews.enabled"
                :min="1"
                :max="99"
                :placeholder="$t('minimalNumberOfReviewers')"
              />
              <p class="mt-1 text-xs text-muted-foreground">
                {{ $t('minimalNumberOfReviewers') }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Action Buttons -->
    <Card v-if="canEdit" class="mb-6">
      <CardContent class="p-6">
        <div class="flex flex-wrap justify-center gap-4">
          <Button
            variant="default"
            class="min-w-[120px]"
            @click="updateSettings"
          >
            {{ $t('saveSettings') }}
          </Button>
          <Button
            variant="destructive"
            class="min-w-[120px]"
            @click="revertToDefaults"
          >
            {{ $t('revertSettingsToDefaults') }}
          </Button>
          <input
            ref="importSettingsRef"
            type="file"
            accept=".json"
            class="hidden"
            @change="importSettings($event.target.files)"
          >
          <Button
            variant="outline"
            class="min-w-[120px]"
            @click="$refs.importSettingsRef.click()"
          >
            <Upload class="mr-2 size-4" />
            {{ $t('importSettings') }}
          </Button>
          <Button
            variant="outline"
            class="min-w-[120px]"
            @click="exportSettings"
          >
            <Download class="mr-2 size-4" />
            {{ $t('exportSettings') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { Upload, Download } from 'lucide-vue-next'

import { useToast } from '@/composables/useToast'
import SettingsService from '@/services/settings'
import UserService from '@/services/user'
import LanguageSelector from '@/components/language-selector'

import { $t } from '@/boot/i18n'

export default defineComponent({
  name: 'SettingsPage',

  components: {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Input,
    Select,
    Switch,
    ToggleGroup,
    Separator,
    LanguageSelector,
    Upload,
    Download,
  },

  beforeRouteLeave(to, from, next) {
    if (this.unsavedChanges()) {
      // TODO: Replace with dialog component
      if (confirm(`${$t('msg.thereAreUnsavedChanges')  }\n${  $t('msg.doYouWantToLeave')}`)) {
        next()
      }
    } else {
      next()
    }
  },

  data() {
    return {
      loading: true,
      UserService,
      settings: {
        danger: { enabled: false, public: { nbdaydelete: 0 } },
        reviews: { enabled: false },
      },
      settingsOrig: {
        danger: { enabled: false },
        reviews: { enabled: false },
      },
      canEdit: false,
    }
  },

  mounted() {
    if (UserService.isAllowed('settings:read')) {
      this.getSettings()
      this.canEdit = this.UserService.isAllowed('settings:update')
      document.addEventListener('keydown', this._listener, false)
    } else {
      this.loading = false
    }
  },

  unmounted() {
    document.removeEventListener('keydown', this._listener, false)
  },

  methods: {
    _listener(e) {
      if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
        e.preventDefault()
        this.updateSettings()
      }
    },

    getSettings() {
      SettingsService.getSettings()
        .then((data) => {
          this.settings = this.$_.merge(
            {
              danger: { enabled: false, public: { nbdaydelete: 0 } },
              reviews: { enabled: false, public: { minReviewers: 1 } },
            },
            data.data.datas,
          )

          this.settingsOrig = this.$_.cloneDeep(this.settings)
          this.loading = false
        })
        .catch((err) => {
          const { error } = useToast()
          error(err.response?.data?.datas || err.message, $t('error'))
        })
    },

    updateSettings() {
      const min = 1
      const max = 99
      if (this.settings.reviews.public.minReviewers < min || this.settings.reviews.public.minReviewers > max) {
        this.settings.reviews.public.minReviewers = this.settings.reviews.public.minReviewers < min ? min : max
      }

      SettingsService.updateSettings(this.settings)
        .then((data) => {
          this.settingsOrig = this.$_.cloneDeep(this.settings)
          this.$settings.refresh()

          const { success } = useToast()
          success($t('msg.settingsUpdatedOk'))
        })
        .catch((err) => {
          const { error } = useToast()
          error(err.message || err.response?.data?.datas || 'Update failed', $t('error'))
        })
    },

    revertToDefaults() {
      if (confirm(`${$t('msg.revertingSettings')  }\n${  $t('msg.revertingSettingsConfirm')}`)) {
        SettingsService.revertDefaults()
          .then(() => {
            this.$settings.refresh()
            this.getSettings()

            const { success } = useToast()
            success($t('settingsUpdatedOk'))
          })
          .catch((err) => {
            const { error } = useToast()
            error(err.message || 'Revert failed', $t('error'))
          })
      }
    },

    importSettings(files) {
      if (!files || files.length === 0) return

      const fileReader = new FileReader()
      fileReader.onloadend = (e) => {
        try {
          const settings = JSON.parse(fileReader.result)
          if (typeof settings === 'object') {
            if (confirm(`${$t('msg.importingSettings')  }\n${  $t('msg.importingSettingsConfirm')}`)) {
              SettingsService.updateSettings(settings)
                .then(() => {
                  this.getSettings()
                  const { success } = useToast()
                  success($t('msg.settingsImportedOk'))
                })
                .catch((err) => {
                  const { error } = useToast()
                  error(err.message || 'Import failed', $t('error'))
                })
            }
          } else {
            throw new Error($t('err.jsonMustBeAnObject'))
          }
        } catch (err) {
          console.error(err)
          const errMsg = err.message ? $t('err.errorWhileParsingJsonContent', [err.message]) : $t('err.importingSettingsError')
          const { error } = useToast()
          error(errMsg, $t('error'))
        }
      }

      const fileContent = new Blob([files[0]], { type: 'application/json' })
      fileReader.readAsText(fileContent)
    },

    async exportSettings() {
      try {
        const response = await SettingsService.exportSettings()
        const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = decodeURIComponent(response.headers['content-disposition'].split('"')[1])
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (err) {
        const { error } = useToast()
        error(err.message || 'Export failed', $t('error'))
      }
    },

    unsavedChanges() {
      return JSON.stringify(this.settingsOrig) !== JSON.stringify(this.settings)
    },
  },
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
