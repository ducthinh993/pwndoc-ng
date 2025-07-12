<template>
  <div class="container mx-auto p-4">
    <Breadcrumb
      :buttons="true"
      :title="localAudit?.name ? `${localAudit.name} (${localAudit.auditType || 'Audit Type not set'})` : 'Loading...'"
      :state="parentState"
      :approvals="parentApprovals"
    >
      <template #buttons>
        <Button
          variant="outline"
          class="mr-2"
          @click="backupFinding"
        >
          <Archive class="mr-2 size-4" />
          {{ $t('btn.backupFinding') }}
        </Button>

        <Button
          v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
          variant="destructive"
          class="mr-2"
          @click="deleteFinding"
        >
          <Trash2 class="mr-2 size-4" />
          {{ $t('btn.delete') }}
        </Button>

        <Button
          v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
          :disabled="!readyToSave"
          @click="updateFinding"
        >
          <Save class="mr-2 size-4" />
          {{ $t('btn.save') }} (Ctrl+S)
        </Button>
      </template>
    </Breadcrumb>

    <div class="mx-auto mt-8 max-w-6xl">
      <!-- Tab Navigation -->
      <div class="rounded-lg border border-border bg-card">
        <div class="flex items-center justify-between border-b border-border p-4">
          <Tabs v-model="selectedTab" class="flex-1">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="definition">
                {{ $t('definition') }}
              </TabsTrigger>
              <TabsTrigger value="proofs">
                {{ $t('proofs') }}
              </TabsTrigger>
              <TabsTrigger value="details">
                {{ $t('details') }}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <!-- Status Toggle -->
          <div v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT" class="ml-4 flex items-center space-x-2">
            <Switch
              v-model:checked="isCompleted"
              @update:checked="updateFindingStatus"
            />
            <Label class="text-sm font-medium">{{ $t('completed') }}</Label>
            <Check v-if="isCompleted" class="size-4 text-green-600" />
          </div>
        </div>

        <!-- Tab Content -->
        <TabsContent value="definition" class="space-y-6 p-6">
          <!-- Definition Tab -->
          <Card>
            <CardContent class="pt-6">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
                <!-- Title -->
                <div class="md:col-span-3">
                  <Label for="finding-title">{{ $t('title') }} *</Label>
                  <Input
                    id="finding-title"
                    v-model="finding.title"
                    :readonly="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                    class="mt-1"
                  />
                </div>

                <!-- Vulnerability Type -->
                <div>
                  <Label for="vuln-type">{{ $t('type') }}</Label>
                  <Select
                    v-model="finding.vulnType"
                    :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                  >
                    <SelectTrigger class="mt-1">
                      <SelectValue :placeholder="$t('selectType')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="type in filteredVulnTypes"
                        :key="type.name"
                        :value="type.name"
                      >
                        {{ type.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Description -->
                <div class="md:col-span-4">
                  <Label class="text-sm font-medium">{{ $t('description') }}</Label>
                  <div class="mt-1 rounded-md border border-border">
                    <BasicEditor
                      ref="basiceditor_description"
                      v-model="finding.description"
                      :editable="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                      id-unique="basiceditor_description"
                      no-sync
                      @editor-change="markAsChanged"
                      @ready="readyToSave = true"
                    />
                  </div>
                </div>

                <!-- Observation -->
                <div class="md:col-span-4">
                  <Label class="text-sm font-medium">{{ $t('observation') }}</Label>
                  <div class="mt-1 rounded-md border border-border">
                    <BasicEditor
                      ref="basiceditor_observation"
                      v-model="finding.observation"
                      :editable="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                      id-unique="basiceditor_observation"
                      no-sync
                      @editor-change="markAsChanged"
                    />
                  </div>
                </div>

                <!-- References -->
                <div class="md:col-span-4">
                  <Label class="text-sm font-medium">{{ $t('references') }}</Label>
                  <TextareaArray
                    v-model="finding.references"
                    :readonly="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                    class="mt-1"
                  />
                </div>
              </div>
            </CardContent>

            <!-- Custom Fields -->
            <div v-if="finding.customFields && finding.customFields.length > 0">
              <Separator />
              <Collapsible default-open>
                <CollapsibleTrigger class="flex w-full items-center justify-between p-4 hover:bg-muted/50">
                  <h3 class="text-lg font-semibold">
                    {{ $t('customFields') }}
                  </h3>
                  <ChevronDown class="size-4 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent class="px-4 pb-4">
                  <CustomFields
                    ref="customfields"
                    v-model="finding.customFields"
                    :category="finding.category || ''"
                    :id-unique="finding._id"
                    :readonly="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                    :locale="audit?.language || 'en'"
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="proofs" class="p-6">
          <!-- Proofs Tab -->
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('proofOfConcept') }}</CardTitle>
              <CardDescription>{{ $t('proofOfConceptDescription') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="rounded-md border border-border">
                <BasicEditor
                  ref="basiceditor_poc"
                  v-model="finding.poc"
                  :editable="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                  id-unique="basiceditor_poc"
                  no-sync
                  @editor-change="markAsChanged"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" class="space-y-6 p-6">
          <!-- Details Tab -->

          <!-- Affected Assets -->
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('affectedAssets') }}</CardTitle>
              <CardDescription>{{ $t('affectedAssetsDescription') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="rounded-md border border-border">
                <BasicEditor
                  v-model="finding.scope"
                  :editable="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                  id-unique="basiceditor_scope"
                  @editor-change="markAsChanged"
                />
              </div>
            </CardContent>
          </Card>

          <!-- CVSS Calculator -->
          <Card class="bg-muted/30">
            <CardHeader>
              <CardTitle class="flex items-center space-x-2">
                <Calculator class="size-5" />
                <span>{{ $t('cvssCalculator') }}</span>
              </CardTitle>
              <CardDescription>{{ $t('cvssCalculatorDescription') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <CvssCalculator
                v-model="finding.cvssv3"
                :readonly="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
              />
            </CardContent>
          </Card>

          <!-- Remediation -->
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('remediation') }}</CardTitle>
              <CardDescription>{{ $t('remediationDescription') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <!-- Remediation Complexity -->
                <div>
                  <Label for="remediation-complexity">{{ $t('remediationComplexity') }}</Label>
                  <Select
                    v-model="finding.remediationComplexity"
                    :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                  >
                    <SelectTrigger class="mt-1">
                      <SelectValue :placeholder="$t('selectComplexity')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        {{ $t('low') }}
                      </SelectItem>
                      <SelectItem value="2">
                        {{ $t('medium') }}
                      </SelectItem>
                      <SelectItem value="3">
                        {{ $t('high') }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Priority -->
                <div>
                  <Label for="priority">{{ $t('priority') }}</Label>
                  <Select
                    v-model="finding.priority"
                    :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                  >
                    <SelectTrigger class="mt-1">
                      <SelectValue :placeholder="$t('selectPriority')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        {{ $t('low') }}
                      </SelectItem>
                      <SelectItem value="2">
                        {{ $t('medium') }}
                      </SelectItem>
                      <SelectItem value="3">
                        {{ $t('high') }}
                      </SelectItem>
                      <SelectItem value="4">
                        {{ $t('critical') }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Remediation Details -->
                <div class="md:col-span-2">
                  <Label class="text-sm font-medium">{{ $t('remediationDetails') }}</Label>
                  <div class="mt-1 rounded-md border border-border">
                    <BasicEditor
                      v-model="finding.remediation"
                      :editable="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                      id-unique="basiceditor_remediation"
                      @editor-change="markAsChanged"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </div>

    <!-- Unsaved Changes Dialog -->
    <Dialog v-model:open="showUnsavedDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ $t('msg.thereAreUnsavedChanges') }}</DialogTitle>
          <DialogDescription>
            {{ $t('msg.doYouWantToLeave') }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="cancelNavigation">
            {{ $t('btn.cancel') }}
          </Button>
          <Button variant="destructive" @click="confirmNavigation">
            {{ $t('btn.confirm') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { useToast } from '@/composables/useToast'
import _ from 'lodash'

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import Breadcrumb from '@/components/breadcrumb.vue'
import BasicEditor from '@/components/editor.vue'
import CvssCalculator from '@/components/cvsscalculator.vue'
import TextareaArray from '@/components/textarea-array.vue'
import CustomFields from '@/components/custom-fields.vue'

// Icons
import { Archive, Trash2, Save, Check, ChevronDown, Calculator } from 'lucide-vue-next'

// Services
import AuditService from '@/services/audit'
import DataService from '@/services/data'
import VulnService from '@/services/vulnerability'
import Utils from '@/services/utils'

// Composables
import { $t } from '@/boot/i18n'

// Props
const props = defineProps({
  audit: Object,
  frontEndAuditState: Number,
  parentState: String,
  parentApprovals: Array,
})

const route = useRoute()
const router = useRouter()
const { toast } = useToast()

// Reactive data
const finding = ref({
  title: '',
  vulnType: '',
  description: '',
  observation: '',
  references: [],
  status: 1,
  customFields: [],
  poc: '',
  scope: '',
  cvssv3: '',
  remediationComplexity: null,
  priority: null,
  remediation: '',
})

const localAudit = ref({ language: '' })
const findingOrig = ref({})
const selectedTab = ref('definition')
const proofsTabVisited = ref(false)
const detailsTabVisited = ref(false)
const vulnTypes = ref([])
const filteredVulnTypes = ref([])
const readyToSave = ref(false)
const needSave = ref(false)
const showUnsavedDialog = ref(false)
const pendingNavigation = ref(null)
const customFields = ref([])

const AUDIT_VIEW_STATE = Utils.AUDIT_VIEW_STATE

// Computed properties
const vulnTypesLang = computed(() => {
  return vulnTypes.value.filter(type => type.locale === localAudit.value.language)
})

const isCompleted = computed({
  get: () => finding.value.status === 0,
  set: (value) => {
    finding.value.status = value ? 0 : 1
  },
})

// Methods
const markAsChanged = () => {
  if (readyToSave.value) {
    needSave.value = true
  }
}

const updateFindingStatus = () => {
  markAsChanged()
}

const getCustomFields = async () => {
  try {
    const response = await DataService.getCustomFields()
    customFields.value = _.cloneDeep(response.data.datas)
  } catch (error) {
    console.error('Error fetching custom fields:', error)
  }
}

const getAudit = async () => {
  try {
    const response = await AuditService.getAudit(route.params.auditId)
    localAudit.value = response.data.datas
  } catch (error) {
    console.error('Error fetching audit:', error)
  }
}

const getVulnTypes = async () => {
  try {
    const response = await DataService.getVulnerabilityTypes()
    vulnTypes.value = response.data.datas
    filteredVulnTypes.value = vulnTypesLang.value
  } catch (error) {
    console.error('Error fetching vulnerability types:', error)
  }
}

const initCustomFieldsForFinding = () => {
  const categoryForFilter = finding.value.category || 'default'
  const languageForFilter = (props.audit && props.audit.language) || 'en'

  if (!finding.value.customFields || finding.value.customFields.length === 0) {
    const findingCustomField = _.cloneDeep(
      Utils.filterCustomFields(
        'finding',
        categoryForFilter,
        customFields.value,
        [],
        languageForFilter,
      ),
    )

    const existingKeys = new Set(findingCustomField.map(field => field.key))
    const vulnerabilityCustomField = _.cloneDeep(
      Utils.filterCustomFields(
        'vulnerability',
        categoryForFilter,
        customFields.value,
        [],
        languageForFilter,
      ),
    ).filter(field => !existingKeys.has(field.key))

    finding.value.customFields = [...findingCustomField, ...vulnerabilityCustomField]
  }
}

const getFinding = async () => {
  try {
    const response = await AuditService.getFinding(route.params.auditId, route.params.findingId)
    finding.value = response.data.datas

    initCustomFieldsForFinding()
    updateOrig()
  } catch (error) {
    console.error('Error fetching finding:', error)
  }
}

const updateFinding = async () => {
  try {
    syncEditors()

    await AuditService.updateFinding(route.params.auditId, route.params.findingId, finding.value)

    updateOrig()
    needSave.value = false

    toast({
      title: $t('success'),
      description: $t('findingUpdatedSuccessfully'),
      variant: 'default',
    })
  } catch (error) {
    toast({
      title: $t('error'),
      description: error.response?.data?.datas || $t('updateFindingError'),
      variant: 'destructive',
    })
  }
}

const deleteFinding = async () => {
  try {
    await AuditService.deleteFinding(route.params.auditId, route.params.findingId)

    toast({
      title: $t('success'),
      description: $t('findingDeletedSuccessfully'),
      variant: 'default',
    })

    router.push(`/audits/${route.params.auditId}/general`)
  } catch (error) {
    toast({
      title: $t('error'),
      description: error.response?.data?.datas || $t('deleteFindingError'),
      variant: 'destructive',
    })
  }
}

const backupFinding = async () => {
  try {
    await AuditService.backupFinding(route.params.auditId, route.params.findingId)

    toast({
      title: $t('success'),
      description: $t('findingBackedUpSuccessfully'),
      variant: 'default',
    })
  } catch (error) {
    toast({
      title: $t('error'),
      description: error.response?.data?.datas || $t('backupFindingError'),
      variant: 'destructive',
    })
  }
}

const syncEditors = () => {
  Utils.syncEditors({
    basiceditor_description: { $refs: { basiceditor_description: null } },
    basiceditor_observation: { $refs: { basiceditor_observation: null } },
    basiceditor_poc: { $refs: { basiceditor_poc: null } },
    basiceditor_scope: { $refs: { basiceditor_scope: null } },
    basiceditor_remediation: { $refs: { basiceditor_remediation: null } },
  })
}

const updateOrig = () => {
  findingOrig.value = _.cloneDeep(finding.value)
}

const unsavedChanges = () => {
  syncEditors()
  return !_.isEqual(finding.value, findingOrig.value)
}

const handleKeyDown = (e) => {
  if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
    e.preventDefault()
    if (props.frontEndAuditState === AUDIT_VIEW_STATE.EDIT) {
      updateFinding()
    }
  }
}

const cancelNavigation = () => {
  showUnsavedDialog.value = false
  pendingNavigation.value = null
}

const confirmNavigation = () => {
  showUnsavedDialog.value = false
  if (pendingNavigation.value) {
    pendingNavigation.value()
  }
}

// Route guards
onBeforeRouteLeave((to, from, next) => {
  if (unsavedChanges()) {
    pendingNavigation.value = next
    showUnsavedDialog.value = true
  } else {
    next()
  }
})

onBeforeRouteUpdate((to, from, next) => {
  if (unsavedChanges()) {
    pendingNavigation.value = next
    showUnsavedDialog.value = true
  } else {
    next()
  }
})

// Watch for tab changes
watch(selectedTab, (newTab) => {
  syncEditors()

  if (newTab === 'proofs') {
    proofsTabVisited.value = true
  } else if (newTab === 'details') {
    detailsTabVisited.value = true
  }

  nextTick(() => {
    updateOrig()
  })
})

// Initialize component
onMounted(async () => {
  await getCustomFields()
  await getFinding()
  await getAudit()
  await getVulnTypes()

  // Socket.io integration
  if (window.$socket) {
    window.$socket.emit('menu', {
      menu: 'editFinding',
      finding: route.params.findingId,
      room: route.params.auditId,
    })
  }

  document.addEventListener('keydown', handleKeyDown, false)
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown, false)
})
</script>

<style scoped>
.container {
  max-width: 100%;
}

@media (min-width: 768px) {
  .container {
    max-width: 1200px;
  }
}

/* Custom styles for editors */
:deep(.ProseMirror) {
  min-height: 150px;
  padding: 12px;
  outline: none;
}

:deep(.ProseMirror:focus) {
  outline: none;
  border-color: transparent;
}

/* Drag and drop styles for images */
.sortable-drag img {
  position: relative;
  max-width: 600px !important;
  max-height: 600px !important;
}

.paragraph-ghost .sortable-ghost img {
  max-width: 600px !important;
  max-height: 600px !important;
}
</style>
