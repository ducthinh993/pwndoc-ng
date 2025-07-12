<template>
  <div>
    <Breadcrumb
      :title="audit ? `${audit.name} (${audit.auditType || 'Audit Type not set'})` : 'Loading...'"
      :state="parentState"
      :approvals="parentApprovals"
    >
      <template #buttons>
        <Button
          v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
          variant="default"
          class="bg-green-600 text-white hover:bg-green-700"
          @click="updateAuditGeneral"
        >
          {{ $t('btn.save') }} (ctrl+s)
        </Button>
      </template>
    </Breadcrumb>

    <div class="grid grid-cols-1 gap-6 p-6">
      <div class="mx-auto w-full max-w-4xl">
        <Card>
          <!-- Basic Information Section -->
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>{{ $t('name') }} *</Label>
                <Input
                  v-model="audit.name"
                  :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                  required
                />
              </div>
              <div />

              <div>
                <Label>{{ $t('language') }}</Label>
                <Select v-model="audit.language" :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT">
                  <SelectTrigger>
                    <SelectValue :placeholder="$t('language')" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="lang in languages"
                      :key="lang.locale"
                      :value="lang.locale"
                    >
                      {{ lang.language }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{{ $t('template') }}</Label>
                <Select v-model="audit.template" :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT">
                  <SelectTrigger>
                    <SelectValue :placeholder="$t('template')" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="template in templates"
                      :key="template._id"
                      :value="template._id"
                    >
                      {{ template.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <!-- Company and Client Section -->
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>{{ $t('company') }}</Label>
                <div class="relative">
                  <Input
                    v-model="companySearchInput"
                    :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                    :placeholder="audit.company?.name || 'Search company...'"
                    @input="filterSelectCompany"
                    @focus="showCompanyDropdown = true"
                  />
                  <div
                    v-if="showCompanyDropdown && filteredCompanies.length > 0"
                    class="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
                  >
                    <button
                      v-for="company in filteredCompanies"
                      :key="company._id"
                      type="button"
                      class="w-full px-3 py-2 text-left hover:bg-gray-100"
                      @click="selectCompany(company)"
                    >
                      {{ company.name }}
                    </button>
                  </div>
                </div>
                <Button
                  v-if="audit.company"
                  variant="ghost"
                  size="sm"
                  class="mt-1"
                  @click="clearCompany"
                >
                  Clear
                </Button>
              </div>

              <div>
                <Label>{{ $t('client') }}</Label>
                <div class="relative">
                  <Input
                    v-model="clientSearchInput"
                    :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                    :placeholder="audit.client?.email || 'Search client...'"
                    @input="filterSelectClient"
                    @focus="showClientDropdown = true"
                  />
                  <div
                    v-if="showClientDropdown && filteredClients.length > 0"
                    class="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
                  >
                    <button
                      v-for="client in filteredClients"
                      :key="client.email"
                      type="button"
                      class="w-full px-3 py-2 text-left hover:bg-gray-100"
                      @click="selectClient(client)"
                    >
                      {{ client.email }}
                    </button>
                  </div>
                </div>
                <Button
                  v-if="audit.client"
                  variant="ghost"
                  size="sm"
                  class="mt-1"
                  @click="clearClient"
                >
                  Clear
                </Button>
              </div>

              <!-- Reviewers Section -->
              <div v-if="settings.reviews.enabled" class="md:col-span-2">
                <Label>{{ $t('reviewers') }}</Label>
                <div class="mb-2 flex flex-wrap gap-2">
                  <Badge
                    v-for="reviewer in audit.reviewers"
                    :key="reviewer.username"
                    variant="secondary"
                    class="bg-blue-gray-500 text-white"
                  >
                    {{ reviewer.firstname }} {{ reviewer.lastname }}
                    <button
                      v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                      type="button"
                      class="ml-1 text-xs hover:text-red-300"
                      @click="removeReviewer(reviewer)"
                    >
                      ×
                    </button>
                  </Badge>
                </div>
                <Select
                  v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                  :model-value="''"
                  @update:model-value="addReviewer"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add reviewer..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="reviewer in availableReviewers"
                      :key="reviewer.username"
                      :value="reviewer.username"
                    >
                      {{ reviewer.firstname }} {{ reviewer.lastname }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Collaborators Section -->
              <div class="md:col-span-2">
                <Label>{{ $t('collaborators') }}</Label>
                <div class="mb-2 flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    class="bg-blue-gray-500 text-white"
                  >
                    {{ audit.creator?.firstname }} {{ audit.creator?.lastname }}
                  </Badge>
                  <Badge
                    v-for="collaborator in audit.collaborators"
                    :key="collaborator.username"
                    variant="secondary"
                    class="bg-blue-gray-500 text-white"
                  >
                    {{ collaborator.firstname }} {{ collaborator.lastname }}
                    <button
                      v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                      type="button"
                      class="ml-1 text-xs hover:text-red-300"
                      @click="removeCollaborator(collaborator)"
                    >
                      ×
                    </button>
                  </Badge>
                </div>
                <Select
                  v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                  :model-value="''"
                  @update:model-value="addCollaborator"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add collaborator..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="collaborator in availableCollaborators"
                      :key="collaborator.username"
                      :value="collaborator.username"
                    >
                      {{ collaborator.firstname }} {{ collaborator.lastname }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <!-- Dates Section -->
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>{{ $t('startDate') }}</Label>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      class="w-full justify-start text-left font-normal"
                      :class="{ 'text-muted-foreground': !audit.date_start }"
                      :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                    >
                      <CalendarIcon class="mr-2 size-4" />
                      {{ audit.date_start || 'Pick a date' }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="audit.date_start"
                      :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                      initial-focus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>{{ $t('endDate') }}</Label>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      class="w-full justify-start text-left font-normal"
                      :class="{ 'text-muted-foreground': !audit.date_end }"
                      :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                    >
                      <CalendarIcon class="mr-2 size-4" />
                      {{ audit.date_end || 'Pick a date' }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="audit.date_end"
                      :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                      initial-focus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>{{ $t('reportingDate') }}</Label>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      class="w-full justify-start text-left font-normal"
                      :class="{ 'text-muted-foreground': !audit.date }"
                      :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                    >
                      <CalendarIcon class="mr-2 size-4" />
                      {{ audit.date || 'Pick a date' }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar
                      v-model="audit.date"
                      :disabled="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                      initial-focus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>

          <!-- Scope Section -->
          <CardContent>
            <TextareaArray
              v-model="audit.scope"
              :label="$t('auditScope')"
              :no-empty-line="true"
              :readonly="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
            />
          </CardContent>

          <!-- Custom Fields Section -->
          <Collapsible
            v-if="audit.customFields && audit.customFields.length > 0"
            :default-open="true"
            class="bg-blue-gray-500 text-white"
          >
            <template #header>
              {{ $t('customFields') }}
            </template>
            <CardContent>
              <CustomFields
                ref="customfields"
                v-model="audit.customFields"
                :readonly="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
                :locale="audit.language"
              />
            </CardContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useSettings } from '@/composables/useSettings'
import Breadcrumb from '@/components/breadcrumb.vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import Input from '@/components/ui/input.vue'
import Label from '@/components/ui/label.vue'
import Select from '@/components/ui/select.vue'
import Badge from '@/components/ui/badge.vue'
import Popover from '@/components/ui/popover.vue'
import Calendar from '@/components/ui/calendar.vue'
import TextareaArray from '@/components/textarea-array.vue'
import CustomFields from '@/components/custom-fields.vue'
import Collapsible from '@/components/ui/collapsible.vue'

// Services
import AuditService from '@/services/audit'
import ClientService from '@/services/client'
import CompanyService from '@/services/company'
import CollabService from '@/services/collaborator'
import ReviewerService from '@/services/reviewer'
import TemplateService from '@/services/template'
import DataService from '@/services/data'
import Utils from '@/services/utils'

// Icons
const CalendarIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  `,
}

interface Language {
  locale: string
  language: string
}

interface Template {
  _id: string
  name: string
}

interface Company {
  _id: string
  name: string
}

interface Client {
  email: string
  company?: Company
}

interface User {
  _id?: string
  username: string
  firstname: string
  lastname: string
}

interface Audit {
  name: string
  language: string
  template: string
  auditType?: string
  date_start?: string
  date_end?: string
  date?: string
  scope?: string[]
  customFields?: any[]
  company: Company | null
  client: Client | null
  creator: User | null
  reviewers: User[]
  collaborators: User[]
}

const props = defineProps<{
  frontEndAuditState: number
  parentState: string
  parentApprovals: any[]
}>()

const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const settings = useSettings()

const auditId = ref<string | null>(null)
const audit = ref<Audit>({
  name: '',
  language: '',
  template: '',
  company: null,
  client: null,
  creator: null,
  reviewers: [],
  collaborators: [],
})
const auditOrig = ref({})

const clients = ref<Client[]>([])
const companies = ref<Company[]>([])
const collaborators = ref<User[]>([])
const reviewers = ref<User[]>([])
const templates = ref<Template[]>([])
const languages = ref<Language[]>([])
const auditTypes = ref([])
const customFields = ref([])

const companySearchInput = ref('')
const clientSearchInput = ref('')
const showCompanyDropdown = ref(false)
const showClientDropdown = ref(false)
const filteredCompanies = ref<Company[]>([])
const filteredClients = ref<Client[]>([])
const selectClientsFromCompany = ref<Client[]>([])

const AUDIT_VIEW_STATE = Utils.AUDIT_VIEW_STATE

const availableReviewers = computed(() => {
  const currentReviewerIds = audit.value.reviewers.map(r => r.username)
  return reviewers.value.filter(r => !currentReviewerIds.includes(r.username))
})

const availableCollaborators = computed(() => {
  const currentCollaboratorIds = audit.value.collaborators.map(c => c.username)
  return collaborators.value.filter(c => !currentCollaboratorIds.includes(c.username))
})

const handleKeydown = (e: KeyboardEvent) => {
  if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
    e.preventDefault()
    if (props.frontEndAuditState === AUDIT_VIEW_STATE.EDIT) {
      updateAuditGeneral()
    }
  }
}

const updateAuditGeneral = async () => {
  try {
    await AuditService.updateAuditGeneral(auditId.value, audit.value)
    auditOrig.value = JSON.parse(JSON.stringify(audit.value))
    toast({
      title: 'Success',
      message: 'Audit updated successfully',
      type: 'success',
    })
  } catch (err: any) {
    toast({
      title: 'Error',
      message: err.response?.data?.datas || 'Failed to update audit',
      type: 'error',
    })
  }
}

const getAuditGeneral = async () => {
  try {
    const customFieldsData = await DataService.getCustomFields()
    customFields.value = customFieldsData.data.datas

    const auditData = await AuditService.getAuditGeneral(auditId.value)
    audit.value = auditData.data.datas
    auditOrig.value = JSON.parse(JSON.stringify(audit.value))

    await Promise.all([
      getCollaborators(),
      getReviewers(),
      getClients(),
    ])
  } catch (err) {
    console.error(err)
  }
}

const getClients = async () => {
  try {
    const data = await ClientService.getClients()
    clients.value = data.data.datas
    await getCompanies()
  } catch (err) {
    console.error(err)
  }
}

const getCompanies = async () => {
  try {
    const data = await CompanyService.getCompanies()
    companies.value = data.data.datas
    filteredCompanies.value = companies.value
    filterClients('init')
  } catch (err) {
    console.error(err)
  }
}

const getCollaborators = async () => {
  try {
    const data = await CollabService.getCollabs()
    const creatorId = audit.value.creator?._id || ''
    collaborators.value = data.data.datas.filter((e: any) => e._id !== creatorId)
  } catch (err) {
    console.error(err)
  }
}

const getReviewers = async () => {
  try {
    const data = await ReviewerService.getReviewers()
    const creatorId = audit.value.creator?._id || ''
    reviewers.value = data.data.datas.filter((e: any) => e._id !== creatorId)
  } catch (err) {
    console.error(err)
  }
}

const getTemplates = async () => {
  try {
    const data = await TemplateService.getTemplates()
    templates.value = data.data.datas
  } catch (err) {
    console.error(err)
  }
}

const getLanguages = async () => {
  try {
    const data = await DataService.getLanguages()
    languages.value = data.data.datas
  } catch (err) {
    console.error(err)
  }
}

const getAuditTypes = async () => {
  try {
    const data = await DataService.getAuditTypes()
    auditTypes.value = data.data.datas
  } catch (err) {
    console.error(err)
  }
}

const filterClients = (step?: string) => {
  if (audit.value.company?.name) {
    selectClientsFromCompany.value = clients.value.filter((client: Client) =>
      client.company?.name === audit.value.company?.name,
    )
  } else {
    selectClientsFromCompany.value = [...clients.value]
  }
  filteredClients.value = selectClientsFromCompany.value
}

const selectCompany = (company: Company) => {
  audit.value.company = company
  companySearchInput.value = company.name
  showCompanyDropdown.value = false
  filterClients()
}

const selectClient = (client: Client) => {
  audit.value.client = client
  clientSearchInput.value = client.email
  showClientDropdown.value = false

  if (client.company) {
    const company = companies.value.find((c: Company) => c.name === client.company?.name)
    if (company) {
      audit.value.company = company
      companySearchInput.value = company.name
    }
  }
}

const clearCompany = () => {
  audit.value.company = null
  companySearchInput.value = ''
  filterClients()
}

const clearClient = () => {
  audit.value.client = null
  clientSearchInput.value = ''
}

const filterSelectCompany = () => {
  const needle = companySearchInput.value.toLowerCase()
  filteredCompanies.value = companies.value.filter((company: Company) =>
    company.name.toLowerCase().includes(needle),
  )
}

const filterSelectClient = () => {
  const needle = clientSearchInput.value.toLowerCase()
  filteredClients.value = selectClientsFromCompany.value.filter((client: Client) =>
    client.email.toLowerCase().includes(needle),
  )
}

const addReviewer = (username: string) => {
  const reviewer = reviewers.value.find((r: User) => r.username === username)
  if (reviewer && !audit.value.reviewers.find((r: User) => r.username === username)) {
    audit.value.reviewers.push(reviewer)
  }
}

const removeReviewer = (reviewer: User) => {
  const index = audit.value.reviewers.findIndex((r: User) => r.username === reviewer.username)
  if (index > -1) {
    audit.value.reviewers.splice(index, 1)
  }
}

const addCollaborator = (username: string) => {
  const collaborator = collaborators.value.find((c: User) => c.username === username)
  if (collaborator && !audit.value.collaborators.find((c: User) => c.username === username)) {
    audit.value.collaborators.push(collaborator)
  }
}

const removeCollaborator = (collaborator: User) => {
  const index = audit.value.collaborators.findIndex((c: User) => c.username === collaborator.username)
  if (index > -1) {
    audit.value.collaborators.splice(index, 1)
  }
}

onMounted(() => {
  auditId.value = route.params.auditId as string
  getAuditGeneral()
  getTemplates()
  getLanguages()
  getAuditTypes()

  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => audit.value.company, () => {
  filterClients()
}, { deep: true })

</script>

<style scoped>
/* Additional custom styles if needed */
</style>
