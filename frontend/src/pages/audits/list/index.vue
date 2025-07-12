<template>
  <div class="container mx-auto p-4">
    <!-- No Languages/Audit Types Messages -->
    <div v-if="languages.length === 0" class="mx-auto mt-8 max-w-md">
      <Alert class="border-yellow-200 bg-yellow-50">
        <AlertCircle class="size-4" />
        <AlertDescription>
          {{ $t('noLanguage') }}
          <a href="/data/custom" class="text-blue-600 underline hover:text-blue-800">
            {{ $t('nav.data') }} -> {{ $t('customData') }} -> {{ $t('language') }}
          </a>
        </AlertDescription>
      </Alert>
    </div>

    <div v-if="auditTypes.length === 0" class="mx-auto mt-8 max-w-md">
      <Alert class="border-yellow-200 bg-yellow-50">
        <AlertCircle class="size-4" />
        <AlertDescription>
          {{ $t('noAudit') }}
          <a href="/data/custom" class="text-blue-600 underline hover:text-blue-800">
            {{ $t('nav.data') }} -> {{ $t('customData') }} -> {{ $t('auditTypes') }}
          </a>
        </AlertDescription>
      </Alert>
    </div>

    <!-- Main Table Section -->
    <div v-if="languages.length > 0 && auditTypes.length > 0" class="mx-auto mt-8 max-w-7xl">
      <Card>
        <CardHeader>
          <!-- Search and Filter Controls -->
          <div class="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div class="max-w-md flex-1">
              <div class="relative">
                <Input
                  v-model="search.finding"
                  :placeholder="$t('searchFinds')"
                  class="pr-20"
                  @keyup.enter="getAudits"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="size-6 p-0"
                    @click="getAudits"
                  >
                    <Search class="size-4" />
                  </Button>
                  <Button
                    v-if="search.finding"
                    variant="ghost"
                    size="sm"
                    class="ml-1 size-6 p-0"
                    @click="search.finding = ''; getAudits()"
                  >
                    <X class="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center space-x-2">
                <Switch id="my-audits" v-model:checked="myAudits" />
                <Label for="my-audits">{{ $t('myAudits') }}</Label>
              </div>

              <div v-if="UserService.isAllowed('audits:users-connected')" class="flex items-center space-x-2">
                <Switch id="display-connected" v-model:checked="displayConnected" />
                <Label for="display-connected">{{ $t('usersConnected') }}</Label>
              </div>

              <div v-if="$settings.reviews.enabled && (UserService.isAllowed('audits:review') || UserService.isAllowed('audits:review-all'))" class="flex items-center space-x-2">
                <Switch id="display-ready-review" v-model:checked="displayReadyForReview" />
                <Label for="display-ready-review">{{ $t('awaitingMyReview') }}</Label>
              </div>

              <Button
                class="bg-secondary hover:bg-secondary/80"
                @click="cleanCurrentAudit(); showCreateModal = true"
              >
                {{ $t('newAudit') }}
              </Button>
            </div>
          </div>

          <!-- Filter Row -->
          <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-6">
            <div>
              <Input
                v-model="search.name"
                :placeholder="$t('search') + ' ' + $t('name')"
                size="sm"
              />
            </div>
            <div>
              <Select v-model="search.company">
                <SelectTrigger class="h-8">
                  <SelectValue :placeholder="$t('search') + ' ' + $t('company')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {{ $t('all') }}
                  </SelectItem>
                  <SelectItem
                    v-for="company in companies"
                    :key="company._id"
                    :value="company.name"
                  >
                    {{ company.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select v-model="search.language">
                <SelectTrigger class="h-8">
                  <SelectValue :placeholder="$t('search') + ' ' + $t('language')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {{ $t('all') }}
                  </SelectItem>
                  <SelectItem
                    v-for="language in languages"
                    :key="language.locale"
                    :value="language.locale"
                  >
                    {{ language.language }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                v-model="search.users"
                :placeholder="$t('search') + ' ' + $t('participants')"
                size="sm"
              />
            </div>
            <div>
              <Input
                v-model="search.date"
                :placeholder="$t('search') + ' ' + $t('date')"
                size="sm"
              />
            </div>
            <div />
          </div>
        </CardHeader>

        <CardContent>
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="size-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>

          <!-- Data Table -->
          <div v-else class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    v-for="column in visibleColumns"
                    :key="column"
                    class="cursor-pointer hover:bg-muted/50"
                    @click="sortBy(column)"
                  >
                    <div class="flex items-center space-x-2">
                      <span>{{ getColumnLabel(column) }}</span>
                      <div class="flex flex-col">
                        <ChevronUp
                          :class="[
                            'size-3 text-muted-foreground',
                            pagination.sortBy === column && !pagination.descending ? 'text-primary' : ''
                          ]"
                        />
                        <ChevronDown
                          :class="[
                            '-mt-1 size-3 text-muted-foreground',
                            pagination.sortBy === column && pagination.descending ? 'text-primary' : ''
                          ]"
                        />
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="audit in paginatedAudits"
                  :key="audit._id"
                  class="cursor-pointer hover:bg-muted/50"
                  @dblclick="dblClick(audit)"
                >
                  <TableCell v-if="visibleColumns.includes('name')">
                    {{ audit.name }}
                  </TableCell>
                  <TableCell v-if="visibleColumns.includes('company')">
                    {{ audit.company?.name || '-' }}
                  </TableCell>
                  <TableCell v-if="visibleColumns.includes('language')">
                    {{ convertLocale(audit.language) }}
                  </TableCell>
                  <TableCell v-if="visibleColumns.includes('users')">
                    {{ convertParticipants(audit) }}
                  </TableCell>
                  <TableCell v-if="visibleColumns.includes('date')">
                    {{ formatDate(audit.createdAt) }}
                  </TableCell>
                  <TableCell v-if="visibleColumns.includes('connected')">
                    <Badge
                      v-if="UserService.isAllowed('audits:users-connected') && audit.connected?.length > 0"
                      variant="secondary"
                      class="bg-green-100 text-green-800"
                    >
                      {{ audit.connected.length }} {{ $t('users') }}
                    </Badge>
                  </TableCell>
                  <TableCell v-if="visibleColumns.includes('reviews')">
                    <AuditStateIcon
                      v-if="$settings.reviews.enabled"
                      :approvals="audit.approvals"
                      :state="audit.state"
                    />
                  </TableCell>
                  <TableCell v-if="visibleColumns.includes('action')">
                    <div class="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="$router.push(`/audits/${audit._id}/general`)"
                      >
                        <Edit class="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="generateReport(audit._id)"
                      >
                        <Download class="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="text-destructive hover:text-destructive"
                        @click="confirmDeleteAudit(audit)"
                      >
                        <Trash2 class="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between pt-4">
            <div class="text-sm text-muted-foreground">
              <span v-if="audits.length === 1">1 {{ $t('auditNum1') }}</span>
              <span v-else>{{ audits.length }} {{ $t('auditNums') }}</span>
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-sm text-muted-foreground">{{ $t('resultsPerPage') }}</span>
              <Select v-model="pagination.rowsPerPage">
                <SelectTrigger class="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in rowsPerPageOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>

              <div class="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  :disabled="pagination.page <= 1"
                  @click="pagination.page--"
                >
                  <ChevronLeft class="size-4" />
                </Button>

                <div class="flex items-center space-x-1">
                  <Button
                    v-for="page in paginationPages"
                    :key="page"
                    variant="outline"
                    size="sm"
                    :class="[
                      pagination.page === page ? 'bg-primary text-primary-foreground' : ''
                    ]"
                    @click="pagination.page = page"
                  >
                    {{ page }}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  :disabled="pagination.page >= totalPages"
                  @click="pagination.page++"
                >
                  <ChevronRight class="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Create Audit Modal -->
    <Dialog v-model:open="showCreateModal">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{{ $t('newAudit') }}</DialogTitle>
        </DialogHeader>

        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="audit-name">{{ $t('name') }}</Label>
            <Input
              id="audit-name"
              v-model="currentAudit.name"
              :class="{ 'border-destructive': errors.name }"
            />
            <p v-if="errors.name" class="text-sm text-destructive">
              {{ errors.name }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="audit-language">{{ $t('language') }}</Label>
            <Select v-model="currentAudit.language">
              <SelectTrigger :class="{ 'border-destructive': errors.language }">
                <SelectValue :placeholder="$t('selectLanguage')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="language in languages"
                  :key="language.locale"
                  :value="language.locale"
                >
                  {{ language.language }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.language" class="text-sm text-destructive">
              {{ errors.language }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="audit-type">{{ $t('auditType') }}</Label>
            <Select v-model="currentAudit.auditType">
              <SelectTrigger :class="{ 'border-destructive': errors.auditType }">
                <SelectValue :placeholder="$t('selectAuditType')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="auditType in auditTypes"
                  :key="auditType._id"
                  :value="auditType"
                >
                  {{ auditType.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.auditType" class="text-sm text-destructive">
              {{ errors.auditType }}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showCreateModal = false">
            {{ $t('cancel') }}
          </Button>
          <Button @click="createAudit">
            {{ $t('create') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{{ $t('confirmDeletion') }}</DialogTitle>
          <DialogDescription>
            {{ $t('auditDeleteConfirm', { name: auditToDelete?.name || '' }) }}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" @click="showDeleteDialog = false">
            {{ $t('cancel') }}
          </Button>
          <Button variant="destructive" @click="deleteAudit">
            {{ $t('delete') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

// Components
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

// Icons
import { Search, X, Edit, Download, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-vue-next'

// Custom Components
import AuditStateIcon from '@/components/audit-state-icon.vue'

// Services
import AuditService from '@/services/audit'
import DataService from '@/services/data'
import CompanyService from '@/services/company'
import UserService from '@/services/user'

// Composables
import { $t } from '@/boot/i18n'

const router = useRouter()
const { toast } = useToast()

// Reactive data
const audits = ref([])
const loading = ref(true)
const auditTypes = ref([])
const companies = ref([])
const languages = ref([])
const showCreateModal = ref(false)
const showDeleteDialog = ref(false)
const auditToDelete = ref(null)

// Table configuration
const dtHeaders = ref([
  { name: 'name', label: $t('name'), sortable: true },
  { name: 'company', label: $t('company'), sortable: true },
  { name: 'language', label: $t('language'), sortable: true },
  { name: 'users', label: $t('participants'), sortable: false },
  { name: 'date', label: $t('date'), sortable: true },
  { name: 'connected', label: $t('usersConnected'), sortable: false },
  { name: 'reviews', label: $t('reviews'), sortable: false },
  { name: 'action', label: '', sortable: false },
])

const visibleColumns = ref(['name', 'company', 'language', 'users', 'date', 'action'])

// Pagination
const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  sortBy: 'date',
  descending: true,
})

const rowsPerPageOptions = ref([
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: 'All', value: 0 },
])

// Search and filters
const search = ref({
  finding: '',
  name: '',
  language: '',
  company: '',
  users: '',
  date: '',
})

const myAudits = ref(false)
const displayConnected = ref(false)
const displayReadyForReview = ref(false)

// Form data
const currentAudit = ref({
  name: '',
  language: '',
  auditType: '',
})

const errors = ref({
  name: '',
  language: '',
  auditType: '',
})

// Computed properties
const filteredAudits = computed(() => {
  let filtered = audits.value

  // Apply search filters
  if (search.value.name) {
    filtered = filtered.filter(audit =>
      audit.name.toLowerCase().includes(search.value.name.toLowerCase()),
    )
  }

  if (search.value.company) {
    filtered = filtered.filter(audit =>
      audit.company?.name === search.value.company,
    )
  }

  if (search.value.language) {
    filtered = filtered.filter(audit =>
      audit.language === search.value.language,
    )
  }

  if (search.value.users) {
    filtered = filtered.filter(audit => {
      const participants = convertParticipants(audit)
      return participants.toLowerCase().includes(search.value.users.toLowerCase())
    })
  }

  if (search.value.date) {
    filtered = filtered.filter(audit => {
      const formattedDate = formatDate(audit.createdAt)
      return formattedDate.includes(search.value.date)
    })
  }

  // Apply toggle filters
  if (myAudits.value) {
    const currentUserId = UserService.getUserId()
    filtered = filtered.filter(audit =>
      audit.users?.some(user => user._id === currentUserId),
    )
  }

  if (displayConnected.value) {
    filtered = filtered.filter(audit => audit.connected?.length > 0)
  }

  if (displayReadyForReview.value) {
    filtered = filtered.filter(audit => audit.state === 'ready-for-review')
  }

  return filtered
})

const sortedAudits = computed(() => {
  const sorted = [...filteredAudits.value]
  const { sortBy, descending } = pagination.value

  if (sortBy && sortBy !== 'action') {
    sorted.sort((a, b) => {
      let aVal, bVal

      switch (sortBy) {
      case 'name':
        aVal = a.name || ''
        bVal = b.name || ''
        break
      case 'company':
        aVal = a.company?.name || ''
        bVal = b.company?.name || ''
        break
      case 'language':
        aVal = a.language || ''
        bVal = b.language || ''
        break
      case 'date':
        aVal = new Date(a.createdAt || 0)
        bVal = new Date(b.createdAt || 0)
        break
      default:
        aVal = a[sortBy] || ''
        bVal = b[sortBy] || ''
      }

      if (aVal < bVal) return descending ? 1 : -1
      if (aVal > bVal) return descending ? -1 : 1
      return 0
    })
  }

  return sorted
})

const paginatedAudits = computed(() => {
  const { page, rowsPerPage } = pagination.value

  if (rowsPerPage === 0) return sortedAudits.value

  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage

  return sortedAudits.value.slice(start, end)
})

const totalPages = computed(() => {
  const { rowsPerPage } = pagination.value
  if (rowsPerPage === 0) return 1
  return Math.ceil(sortedAudits.value.length / rowsPerPage)
})

const paginationPages = computed(() => {
  const current = pagination.value.page
  const total = totalPages.value
  const pages = []

  // Show first page
  if (current > 3) pages.push(1)
  if (current > 4) pages.push('...')

  // Show pages around current
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }

  // Show last page
  if (current < total - 3) pages.push('...')
  if (current < total - 2) pages.push(total)

  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

// Methods
const getLanguages = async () => {
  try {
    const response = await DataService.getLanguages()
    languages.value = response.data.datas
  } catch (error) {
    console.error('Error fetching languages:', error)
  }
}

const getAuditTypes = async () => {
  try {
    const response = await DataService.getAuditTypes()
    auditTypes.value = response.data.datas
  } catch (error) {
    console.error('Error fetching audit types:', error)
  }
}

const getCompanies = async () => {
  try {
    const response = await CompanyService.getCompanies()
    companies.value = response.data.datas
  } catch (error) {
    console.error('Error fetching companies:', error)
  }
}

const getAudits = async () => {
  loading.value = true
  try {
    const response = await AuditService.getAudits({
      findingTitle: search.value.finding,
    })
    audits.value = response.data.datas
  } catch (error) {
    console.error('Error fetching audits:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const convertLocale = (locale) => {
  const language = languages.value.find(lang => lang.locale === locale)
  return language ? language.language : locale
}

const convertParticipants = (audit) => {
  if (!audit.users || audit.users.length === 0) return '-'
  return audit.users.map(user => `${user.firstname  } ${  user.lastname}`).join(', ')
}

const getColumnLabel = (column) => {
  const header = dtHeaders.value.find(h => h.name === column)
  return header ? header.label : column
}

const sortBy = (column) => {
  const header = dtHeaders.value.find(h => h.name === column)
  if (!header?.sortable) return

  if (pagination.value.sortBy === column) {
    pagination.value.descending = !pagination.value.descending
  } else {
    pagination.value.sortBy = column
    pagination.value.descending = false
  }
}

const dblClick = (audit) => {
  router.push(`/audits/${audit._id}/general`)
}

const cleanCurrentAudit = () => {
  currentAudit.value = {
    name: '',
    language: '',
    auditType: '',
  }
  cleanErrors()
}

const cleanErrors = () => {
  errors.value = {
    name: '',
    language: '',
    auditType: '',
  }
}

const createAudit = async () => {
  cleanErrors()

  if (!currentAudit.value.name) {
    errors.value.name = $t('nameRequired')
  }
  if (!currentAudit.value.language) {
    errors.value.language = $t('languageRequired')
  }
  if (!currentAudit.value.auditType) {
    errors.value.auditType = $t('auditTypeRequired')
  }

  if (errors.value.name || errors.value.language || errors.value.auditType) {
    return
  }

  try {
    const auditData = {
      ...currentAudit.value,
      auditType: currentAudit.value.auditType.name,
    }

    const response = await AuditService.createAudit(auditData)
    showCreateModal.value = false
    await getAudits()
    router.push(`/audits/${response.data.datas.audit._id}`)
  } catch (error) {
    toast({
      title: $t('error'),
      description: error.response?.data?.datas || $t('createAuditError'),
      variant: 'destructive',
    })
  }
}

const confirmDeleteAudit = (audit) => {
  auditToDelete.value = audit
  showDeleteDialog.value = true
}

const deleteAudit = async () => {
  if (!auditToDelete.value) return

  try {
    await AuditService.deleteAudit(auditToDelete.value._id)
    showDeleteDialog.value = false
    auditToDelete.value = null
    await getAudits()

    toast({
      title: $t('success'),
      description: $t('auditDeletedSuccessfully'),
      variant: 'default',
    })
  } catch (error) {
    toast({
      title: $t('error'),
      description: error.response?.data?.datas || $t('deleteAuditError'),
      variant: 'destructive',
    })
  }
}

const generateReport = async (auditId) => {
  try {
    // Implementation for report generation
    await AuditService.generateReport(auditId)
    toast({
      title: $t('success'),
      description: $t('reportGeneratedSuccessfully'),
      variant: 'default',
    })
  } catch (error) {
    toast({
      title: $t('error'),
      description: error.response?.data?.datas || $t('generateReportError'),
      variant: 'destructive',
    })
  }
}

// Initialize component
onMounted(() => {
  // Set up visible columns based on permissions
  if (UserService.isAllowed('audits:users-connected')) {
    visibleColumns.value.push('connected')
  }
  if (window.$settings?.reviews?.enabled) {
    visibleColumns.value.push('reviews')
  }

  // Initialize data
  getAudits()
  getLanguages()
  getAuditTypes()
  getCompanies()
})

// Watch for route changes
watch(
  () => router.currentRoute.value.params.finding,
  (newFinding) => {
    search.value.finding = newFinding || ''
  },
  { immediate: true },
)
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
</style>
