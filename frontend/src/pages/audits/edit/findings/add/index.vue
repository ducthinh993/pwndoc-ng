<template>
  <div class="container mx-auto p-4">
    <Breadcrumb
      :buttons="true"
      :title="audit?.name ? `${audit.name} (${audit.auditType || 'Audit Type not set'})` : 'Loading...'"
      :state="parentState"
      :approvals="parentApprovals"
    />

    <div class="max-w-6xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <!-- Top Controls -->
          <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
            <!-- Language Selector -->
            <div class="w-full md:w-48">
              <Label for="language-select">{{ $t('language') }}</Label>
              <Select v-model="dtLanguage" @update:model-value="getVulnerabilities">
                <SelectTrigger>
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
            </div>

            <div class="flex-1"></div>

            <!-- Create Finding Input -->
            <div class="flex-1 md:max-w-md">
              <Label for="finding-title">{{ $t('title') }}</Label>
              <div class="flex space-x-2">
                <Input
                  id="finding-title"
                  v-model="findingTitle"
                  :placeholder="$t('enterFindingTitle')"
                  @keyup.enter="addFinding()"
                  class="flex-1"
                />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default">
                      {{ $t('btn.create') }}
                      <ChevronDown class="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{{ $t('selectCategory') }}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="addFinding()">
                      {{ $t('noCategory') }}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      v-for="category in vulnCategories"
                      :key="category.name"
                      @click="addFinding(category)"
                    >
                      {{ category.name }}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <!-- Search Filters -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div class="md:col-span-2">
              <Label for="search-title">{{ $t('search') }} {{ $t('title') }}</Label>
              <Input
                id="search-title"
                v-model="search.title"
                :placeholder="$t('searchByTitle')"
              />
            </div>
            
            <div>
              <Label for="search-category">{{ $t('search') }} {{ $t('category') }}</Label>
              <Select v-model="search.category">
                <SelectTrigger>
                  <SelectValue :placeholder="$t('allCategories')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{{ $t('allCategories') }}</SelectItem>
                  <SelectItem
                    v-for="category in vulnCategoriesOptions"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label for="search-type">{{ $t('search') }} {{ $t('vulnType') }}</Label>
              <Select v-model="search.vulnType">
                <SelectTrigger>
                  <SelectValue :placeholder="$t('allTypes')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{{ $t('allTypes') }}</SelectItem>
                  <SelectItem
                    v-for="type in vulnTypeOptions"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>

          <!-- Vulnerabilities Table -->
          <div v-else class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[50%]">{{ $t('title') }}</TableHead>
                  <TableHead class="w-[20%]">{{ $t('category') }}</TableHead>
                  <TableHead class="w-[20%]">{{ $t('vulnType') }}</TableHead>
                  <TableHead class="w-[10%]">{{ $t('action') }}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-for="vulnerability in paginatedVulnerabilities" :key="vulnerability._id">
                  <!-- Main row -->
                  <TableRow class="hover:bg-muted/50">
                    <TableCell>
                      <div class="flex items-center justify-between">
                        <span class="font-medium">{{ vulnerability.detail.title }}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="toggleExpand(vulnerability._id)"
                        >
                          <ChevronDown 
                            class="h-4 w-4 transition-transform"
                            :class="{ 'rotate-180': expandedRows.includes(vulnerability._id) }"
                          />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {{ vulnerability.category || $t('noCategory') }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {{ vulnerability.detail.vulnType || $t('undefined') }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="addFindingFromVuln(vulnerability)"
                        class="text-primary hover:text-primary"
                      >
                        <Plus class="h-4 w-4 mr-1" />
                        {{ $t('add') }}
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <!-- Expanded description row -->
                  <TableRow v-if="expandedRows.includes(vulnerability._id)" class="bg-muted/30">
                    <TableCell colspan="4" class="p-4">
                      <div class="prose prose-sm max-w-none">
                        <div class="text-sm text-muted-foreground mb-2 font-medium">
                          {{ $t('description') }}:
                        </div>
                        <div 
                          class="text-sm leading-relaxed"
                          v-html="htmlEncode(vulnerability.detail.description)"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </template>
              </TableBody>
            </Table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between pt-4">
            <div class="text-sm text-muted-foreground">
              <span>{{ filteredVulnerabilities.length }} / {{ vulnerabilities.length }} {{ $t('vulnerabilitiesNums') }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <span class="text-sm text-muted-foreground">{{ $t('resultsPerPage') }}</span>
              <Select v-model="vulnPagination.rowsPerPage">
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
                  @click="vulnPagination.page--"
                  :disabled="vulnPagination.page <= 1"
                >
                  <ChevronLeft class="h-4 w-4" />
                </Button>
                
                <div class="flex items-center space-x-1">
                  <Button
                    v-for="page in paginationPages"
                    :key="page"
                    variant="outline"
                    size="sm"
                    @click="vulnPagination.page = page"
                    :class="[
                      vulnPagination.page === page ? 'bg-primary text-primary-foreground' : ''
                    ]"
                  >
                    {{ page }}
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  @click="vulnPagination.page++"
                  :disabled="vulnPagination.page >= totalPages"
                >
                  <ChevronRight class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import _ from 'lodash'

// Components
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import Breadcrumb from '@/components/breadcrumb.vue'

// Icons
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next'

// Services
import VulnService from '@/services/vulnerability'
import AuditService from '@/services/audit'
import DataService from '@/services/data'
import Utils from '@/services/utils'

// Composables
import { $t } from '@/boot/i18n'

// Props
const props = defineProps({
  frontEndAuditState: Number,
  parentState: String,
  parentApprovals: Array
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
  remediation: ''
})

const findingTitle = ref('')
const vulnerabilities = ref([])
const filteredRowsCount = ref(0)
const loading = ref(false)
const languages = ref([])
const dtLanguage = ref('')
const vulnCategories = ref([])
const expandedRows = ref([])

const audit = ref({
  creator: {},
  name: '',
  auditType: '',
  client: {},
  company: {},
  collaborators: [],
  reviewers: [],
  date: '',
  date_start: '',
  date_end: '',
  scope: [],
  language: '',
  template: '',
  customFields: [],
  approvals: []
})

// Table configuration
const vulnPagination = ref({
  page: 1,
  rowsPerPage: 25,
  sortBy: 'title',
  pagesNumber: 1
})

const rowsPerPageOptions = ref([
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: 'All', value: 0 }
])

// Search filters
const search = ref({
  title: '',
  vulnType: '',
  category: ''
})

const htmlEncode = Utils.htmlEncode
const AUDIT_VIEW_STATE = Utils.AUDIT_VIEW_STATE

// Computed properties
const searchObject = computed(() => ({
  title: search.value.title,
  category: search.value.category,
  vulnType: search.value.vulnType
}))

const vulnCategoriesOptions = computed(() => {
  return _.uniq(_.map(vulnerabilities.value, vuln => vuln.category || $t('noCategory')))
})

const vulnTypeOptions = computed(() => {
  return _.uniq(vulnerabilities.value.map(vuln => vuln.detail?.vulnType || $t('undefined')))
})

const filteredVulnerabilities = computed(() => {
  let filtered = vulnerabilities.value

  // Filter by language
  if (dtLanguage.value) {
    filtered = filtered.filter(vuln => vuln.locale === dtLanguage.value)
  }

  // Filter by search criteria
  if (search.value.title) {
    filtered = filtered.filter(vuln => 
      vuln.detail.title.toLowerCase().includes(search.value.title.toLowerCase())
    )
  }

  if (search.value.category) {
    filtered = filtered.filter(vuln => 
      (vuln.category || $t('noCategory')) === search.value.category
    )
  }

  if (search.value.vulnType) {
    filtered = filtered.filter(vuln => 
      (vuln.detail?.vulnType || $t('undefined')) === search.value.vulnType
    )
  }

  return filtered
})

const totalPages = computed(() => {
  const { rowsPerPage } = vulnPagination.value
  if (rowsPerPage === 0) return 1
  return Math.ceil(filteredVulnerabilities.value.length / rowsPerPage)
})

const paginatedVulnerabilities = computed(() => {
  const { page, rowsPerPage } = vulnPagination.value
  
  if (rowsPerPage === 0) return filteredVulnerabilities.value
  
  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  
  return filteredVulnerabilities.value.slice(start, end)
})

const paginationPages = computed(() => {
  const current = vulnPagination.value.page
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

const getVulnerabilities = async () => {
  if (!dtLanguage.value) return
  
  loading.value = true
  try {
    const response = await VulnService.getVulnByLanguage(dtLanguage.value)
    vulnerabilities.value = response.data.datas
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error)
  } finally {
    loading.value = false
  }
}

const getAudit = async () => {
  try {
    const response = await AuditService.getAudit(route.params.auditId)
    audit.value = response.data.datas
    dtLanguage.value = audit.value.language
    await getVulnerabilities()
  } catch (error) {
    console.error('Error fetching audit:', error)
  }
}

const getVulnerabilityCategories = async () => {
  try {
    const response = await DataService.getVulnerabilityCategories()
    vulnCategories.value = response.data.datas
  } catch (error) {
    console.error('Error fetching vulnerability categories:', error)
  }
}

const toggleExpand = (vulnerabilityId) => {
  const index = expandedRows.value.indexOf(vulnerabilityId)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(vulnerabilityId)
  }
}

const addFinding = async (category) => {
  if (!findingTitle.value.trim()) {
    toast({
      title: $t('error'),
      description: $t('titleRequired'),
      variant: 'destructive'
    })
    return
  }

  try {
    const newFinding = {
      title: findingTitle.value,
      category: category?.name || '',
      status: 1
    }

    const response = await AuditService.createFinding(route.params.auditId, newFinding)
    findingTitle.value = ''
    
    toast({
      title: $t('success'),
      description: $t('findingCreatedSuccessfully'),
      variant: 'default'
    })

    // Navigate to edit the new finding
    router.push(`/audits/${route.params.auditId}/findings/${response.data.datas._id}`)
  } catch (error) {
    toast({
      title: $t('error'),
      description: error.response?.data?.datas || $t('createFindingError'),
      variant: 'destructive'
    })
  }
}

const addFindingFromVuln = async (vulnerability) => {
  try {
    const newFinding = {
      title: vulnerability.detail.title,
      vulnType: vulnerability.detail.vulnType || '',
      description: vulnerability.detail.description || '',
      observation: vulnerability.detail.observation || '',
      remediation: vulnerability.detail.remediation || '',
      category: vulnerability.category || '',
      references: vulnerability.detail.references || [],
      customFields: vulnerability.detail.customFields || [],
      status: 1
    }

    const response = await AuditService.createFinding(route.params.auditId, newFinding)
    
    toast({
      title: $t('success'),
      description: $t('findingCreatedFromVuln'),
      variant: 'default'
    })

    // Navigate to edit the new finding
    router.push(`/audits/${route.params.auditId}/findings/${response.data.datas._id}`)
  } catch (error) {
    toast({
      title: $t('error'),
      description: error.response?.data?.datas || $t('createFindingError'),
      variant: 'destructive'
    })
  }
}

// Initialize component
onMounted(() => {
  getLanguages()
  getAudit()
  getVulnerabilityCategories()

  // Socket.io integration
  if (window.$socket) {
    window.$socket.emit('menu', { menu: 'addFindings', room: route.params.auditId })
  }
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

.prose {
  max-width: none;
}
</style>