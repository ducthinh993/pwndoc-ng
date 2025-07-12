<template>
  <div class="flex h-screen bg-background">
    <!-- Left Sidebar -->
    <div class="w-96 border-r border-border flex flex-col">
      <!-- Splitter Component -->
      <div class="flex-1 flex flex-col">
        <!-- Top Section (Sections Navigation) -->
        <div :style="{ height: `${splitterRatio}%` }" class="flex flex-col min-h-0">
          <!-- Header with action buttons -->
          <div class="p-4 border-b border-border">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">{{ $t('sections') }}</h3>
              
              <div class="flex items-center space-x-2">
                <!-- Review/Approval buttons -->
                <template v-if="$settings.reviews.enabled">
                  <Button
                    v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                    size="sm"
                    variant="secondary"
                    @click="toggleAskReview"
                  >
                    {{ $t('btn.topButtonSection.submitReview') }}
                  </Button>
                  
                  <Button
                    v-if="[AUDIT_VIEW_STATE.REVIEW_EDITOR, AUDIT_VIEW_STATE.REVIEW_ADMIN, AUDIT_VIEW_STATE.REVIEW_ADMIN_APPROVED].includes(frontEndAuditState)"
                    size="sm"
                    variant="outline"
                    @click="toggleAskReview"
                  >
                    {{ $t('btn.topButtonSection.cancelReview') }}
                  </Button>
                  
                  <Button
                    v-if="[AUDIT_VIEW_STATE.REVIEW, AUDIT_VIEW_STATE.REVIEW_ADMIN].includes(frontEndAuditState)"
                    size="sm"
                    variant="default"
                    @click="toggleApproval"
                  >
                    {{ $t('btn.topButtonSection.approve') }}
                  </Button>
                  
                  <Button
                    v-if="[AUDIT_VIEW_STATE.REVIEW_APPROVED, AUDIT_VIEW_STATE.REVIEW_ADMIN_APPROVED, AUDIT_VIEW_STATE.APPROVED_APPROVED].includes(frontEndAuditState)"
                    size="sm"
                    variant="outline"
                    @click="toggleApproval"
                  >
                    {{ $t('btn.topButtonSection.removeApproval') }}
                  </Button>
                </template>
                
                <!-- Download report button -->
                <Button
                  variant="ghost"
                  size="sm"
                  @click="generateReport"
                >
                  <Download class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Navigation Items -->
          <div class="flex-1 overflow-y-auto p-2">
            <!-- General Information -->
            <div 
              class="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              :class="{ 'bg-primary text-primary-foreground': $route.path.includes('/general') }"
              @click="$router.push(`/audits/${auditId}/general`)"
            >
              <Settings class="h-5 w-5" />
              <span>{{ $t('generalInformation') }}</span>
            </div>
            
            <!-- User activity indicator for general -->
            <div v-if="generalUsers.length > 0" class="flex h-1 mb-2 mx-3">
              <div
                v-for="(user, idx) in generalUsers"
                :key="idx"
                class="flex-1 h-full"
                :style="{ backgroundColor: user.color }"
              />
            </div>

            <!-- Network Scan -->
            <div 
              v-if="!currentAuditType || !currentAuditType.hidden.includes('network')"
              class="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              :class="{ 'bg-primary text-primary-foreground': $route.path.includes('/network') }"
              @click="$router.push(`/audits/${auditId}/network`)"
            >
              <Globe class="h-5 w-5" />
              <span>{{ $t('networkScan') }}</span>
            </div>
            
            <!-- User activity indicator for network -->
            <div v-if="networkUsers.length > 0" class="flex h-1 mb-2 mx-3">
              <div
                v-for="(user, idx) in networkUsers"
                :key="idx"
                class="flex-1 h-full"
                :style="{ backgroundColor: user.color }"
              />
            </div>

            <!-- Charts -->
            <div 
              class="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              :class="{ 'bg-primary text-primary-foreground': $route.path.includes('/charts') }"
              @click="$router.push(`/audits/${auditId}/charts`)"
            >
              <PieChart class="h-5 w-5" />
              <span>{{ $t('charts') }}</span>
            </div>
            
            <!-- User activity indicator for charts -->
            <div v-if="chartUsers.length > 0" class="flex h-1 mb-2 mx-3">
              <div
                v-for="(user, idx) in chartUsers"
                :key="idx"
                class="flex-1 h-full"
                :style="{ backgroundColor: user.color }"
              />
            </div>

            <!-- Findings Section -->
            <div v-if="!currentAuditType || !currentAuditType.hidden.includes('findings')">
              <Separator class="my-4" />
              
              <!-- Findings Header -->
              <div class="flex items-center justify-between p-3">
                <div class="flex items-center space-x-3">
                  <List class="h-5 w-5" />
                  <span>{{ $t('findings') }} ({{ audit.findings.length || 0 }})</span>
                </div>
                
                <Button
                  v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                  size="sm"
                  variant="secondary"
                  @click="$router.push(`/audits/${auditId}/findings/add`)"
                >
                  <Plus class="h-4 w-4" />
                </Button>
              </div>

              <!-- Findings by Category -->
              <div v-for="categoryFindings in findingList" :key="categoryFindings.category" class="mb-4">
                <div class="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <h4 class="font-medium">{{ categoryFindings.category }}</h4>
                  
                  <!-- Sort options -->
                  <DropdownMenu v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT">
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ArrowUpDown class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-72">
                      <DropdownMenuItem>
                        <div class="flex items-center space-x-2">
                          <Switch
                            v-model:checked="categoryFindings.sortOption.sortAuto"
                            @update:checked="updateSortFindings"
                          />
                          <Label>{{ $t('automaticSorting') }}</Label>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>{{ $t('sortBy') }}</DropdownMenuLabel>
                      <DropdownMenuItem
                        v-for="option in getSortOptions(categoryFindings.sortOption.category)"
                        :key="option.value"
                        @click="categoryFindings.sortOption.sortValue = option.value; updateSortFindings()"
                      >
                        <div class="flex items-center space-x-2">
                          <div class="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                            <div
                              v-if="categoryFindings.sortOption.sortValue === option.value"
                              class="w-2 h-2 rounded-full bg-primary"
                            />
                          </div>
                          <span>{{ option.label }}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        @click="categoryFindings.sortOption.sortOrder = 'asc'; updateSortFindings()"
                      >
                        <ArrowUp class="h-4 w-4 mr-2" />
                        {{ $t('ascending') }}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        @click="categoryFindings.sortOption.sortOrder = 'desc'; updateSortFindings()"
                      >
                        <ArrowDown class="h-4 w-4 mr-2" />
                        {{ $t('descending') }}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <!-- Draggable Findings List -->
                <div class="ml-2">
                  <draggable
                    v-model="categoryFindings.findings"
                    @end="moveFindingPosition($event, categoryFindings.category)"
                    handle=".drag-handle"
                    ghost-class="opacity-50"
                    item-key="_id"
                    class="space-y-1"
                  >
                    <template #item="{ element: finding }">
                      <div
                        class="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                        :class="{ 'bg-primary text-primary-foreground': $route.params.findingId === finding._id }"
                        @click="$router.push(`/audits/${auditId}/findings/${finding._id}`)"
                      >
                        <!-- Drag handle -->
                        <div
                          v-if="!categoryFindings.sortOption.sortAuto && frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
                          class="drag-handle cursor-move"
                        >
                          <GripVertical class="h-4 w-4 text-muted-foreground" />
                        </div>
                        
                        <!-- Severity badge -->
                        <div 
                          class="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                          :style="{ backgroundColor: getFindingColor(finding) }"
                        >
                          {{ getFindingSeverity(finding).substring(0, 1) }}
                        </div>
                        
                        <!-- Finding title -->
                        <div class="flex-1 min-w-0">
                          <p class="truncate">{{ finding.title }}</p>
                        </div>
                        
                        <!-- Status indicator -->
                        <div v-if="finding.status === 0" class="flex-shrink-0">
                          <Check class="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      
                      <!-- User activity indicator -->
                      <div v-if="filteredFindingUsers(finding._id).length > 0" class="flex h-1 ml-10">
                        <div
                          v-for="user in filteredFindingUsers(finding._id)"
                          :key="user._id"
                          class="flex-1 h-full"
                          :style="{ backgroundColor: user.color }"
                        />
                      </div>
                    </template>
                  </draggable>
                </div>
              </div>
              
              <Separator class="my-4" />
            </div>

            <!-- Custom Sections -->
            <div v-for="section in audit.sections" :key="section._id" class="mb-2">
              <div 
                class="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                :class="{ 'bg-primary text-primary-foreground': $route.params.sectionId === section._id }"
                @click="$router.push(`/audits/${auditId}/sections/${section._id}`)"
              >
                <component :is="getSectionIcon(section)" class="h-5 w-5" />
                <span>{{ section.name }}</span>
              </div>
              
              <!-- User activity indicator for section -->
              <div v-if="filteredSectionUsers(section._id).length > 0" class="flex h-1 mb-2 mx-3">
                <div
                  v-for="(user, idx) in filteredSectionUsers(section._id)"
                  :key="user._id || idx"
                  class="flex-1 h-full"
                  :style="{ backgroundColor: user.color }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Splitter Handle -->
        <div class="flex justify-center py-1 bg-muted hover:bg-muted/80 cursor-row-resize" @mousedown="startSplitterDrag">
          <div class="w-8 h-1 bg-border rounded-full"></div>
        </div>

        <!-- Bottom Section (Connected Users) -->
        <div :style="{ height: `${100 - splitterRatio}%` }" class="flex flex-col min-h-0">
          <div class="p-4 border-b border-border">
            <div class="flex items-center space-x-3">
              <Users class="h-5 w-5" />
              <span class="font-medium">{{ $t('usersConnected') }}</span>
            </div>
          </div>
          
          <div class="flex-1 overflow-y-auto p-2">
            <div v-for="user in users" :key="user._id" class="flex items-center space-x-3 p-2 rounded-lg">
              <div 
                class="w-4 h-4 rounded"
                :style="{ backgroundColor: user.color }"
              />
              <span class="text-sm">
                {{ user.username }}
                <span v-if="user.me" class="text-muted-foreground">({{ $t('me') }})</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 min-w-0">
      <router-view 
        :key="$route.fullPath"
        :frontEndAuditState="frontEndAuditState"
        :parentState="audit.state"
        :parentApprovals="audit.approvals"
        :audit="audit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import draggable from 'vuedraggable'
import _ from 'lodash'

// Components
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

// Icons
import { 
  Settings, 
  Globe, 
  PieChart, 
  List, 
  Plus, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  GripVertical, 
  Check, 
  Download, 
  Users,
  FileText
} from 'lucide-vue-next'

// Services
import AuditService from '@/services/audit'
import UserService from '@/services/user'
import DataService from '@/services/data'
import Utils from '@/services/utils'
import { CVSS31 } from '@/boot/cvss'

// Composables
import { $t } from '@/boot/i18n'

const route = useRoute()
const router = useRouter()
const { toast } = useToast()

// Reactive data
const auditId = ref('')
const findings = ref([])
const users = ref([])
const audit = ref({ findings: {}, sections: [], sortFindings: [] })
const sections = ref([])
const splitterRatio = ref(80)
const loading = ref(true)
const vulnCategories = ref([])
const customFields = ref([])
const auditTypes = ref([])
const findingList = ref([])
const frontEndAuditState = ref(Utils.AUDIT_VIEW_STATE.EDIT_READONLY)
const AUDIT_VIEW_STATE = Utils.AUDIT_VIEW_STATE

// Computed properties
const generalUsers = computed(() => users.value.filter(user => user.menu === 'general'))
const networkUsers = computed(() => users.value.filter(user => user.menu === 'network'))
const chartUsers = computed(() => users.value.filter(user => user.menu === 'charts'))
const findingUsers = computed(() => users.value.filter(user => user.menu === 'editFinding'))
const sectionUsers = computed(() => users.value.filter(user => user.menu === 'editSection'))

const currentAuditType = computed(() => {
  return auditTypes.value.find(e => e.name === audit.value.auditType)
})

// Methods
const getFindingColor = (finding) => {
  const severity = getFindingSeverity(finding)
  
  if (window.$settings?.report?.public?.cvssColors) {
    const severityColorName = `${severity.toLowerCase()}Color`
    const cvssColors = window.$settings.report.public.cvssColors
    return cvssColors[severityColorName] || cvssColors.noneColor
  } else {
    switch(severity) {
      case "Low": return "#22c55e"
      case "Medium": return "#f97316"
      case "High": return "#ef4444"
      case "Critical": return "#1f2937"
      default: return "#3b82f6"
    }
  }
}

const filteredFindingUsers = (findingId) => {
  return findingUsers.value.filter(user => user.finding === findingId)
}

const filteredSectionUsers = (sectionId) => {
  return sectionUsers.value.filter(user => user.section === sectionId)
}

const getFindingSeverity = (finding) => {
  let severity = "None"
  let cvss = CVSS31.calculateCVSSFromVector(finding.cvssv3)
  
  if (cvss.success) {
    const score = cvss.score
    if (score >= 9.0) severity = "Critical"
    else if (score >= 7.0) severity = "High"
    else if (score >= 4.0) severity = "Medium"
    else if (score >= 0.1) severity = "Low"
  }
  
  return severity
}

const getSectionIcon = (section) => {
  const sectionData = sections.value.find(e => e.field === section.field)
  
  // Map common icons to Lucide icons
  const iconMap = {
    'fa fa-cog': Settings,
    'fa fa-globe': Globe,
    'fa fa-chart-pie': PieChart,
    'fa fa-list': List,
    'fa fa-file-text': FileText,
    'notes': FileText
  }
  
  const iconName = sectionData?.icon || 'notes'
  return iconMap[iconName] || FileText
}

const getSortOptions = (category) => {
  // Return available sort options for findings
  return [
    { label: $t('cvssScore'), value: 'cvssScore' },
    { label: $t('title'), value: 'title' },
    { label: $t('severity'), value: 'severity' },
    { label: $t('position'), value: 'position' }
  ]
}

const getMenuSection = () => {
  const routeName = route.name
  
  if (routeName === 'general') {
    return { menu: 'general', room: auditId.value }
  } else if (routeName === 'network') {
    return { menu: 'network', room: auditId.value }
  } else if (routeName === 'charts') {
    return { menu: 'charts', room: auditId.value }
  } else if (routeName === 'addFindings') {
    return { menu: 'addFindings', room: auditId.value }
  } else if (routeName === 'editFinding' && route.params.findingId) {
    return { menu: 'editFinding', finding: route.params.findingId, room: auditId.value }
  } else if (routeName === 'editSection' && route.params.sectionId) {
    return { menu: 'editSection', section: route.params.sectionId, room: auditId.value }
  }
  
  return { menu: 'undefined', room: auditId.value }
}

const handleSocket = () => {
  const socket = window.$socket
  if (!socket) return
  
  socket.emit('join', { username: UserService.user.username, room: auditId.value })
  
  socket.on('roomUsers', (socketUsers) => {
    let userIndex = 0
    users.value = socketUsers.map((user, index) => {
      if (user.username === UserService.user.username) {
        user.color = "#77C84E"
        user.me = true
        userIndex = index
      }
      return user
    })
    users.value.unshift(users.value.splice(userIndex, 1)[0])
  })
  
  socket.on('updateUsers', () => {
    socket.emit('updateUsers', { room: auditId.value })
  })
  
  socket.on('updateAudit', () => {
    getAudit()
  })
  
  socket.on('disconnect', () => {
    socket.emit('join', { username: UserService.user.username, room: auditId.value })
    socket.emit('menu', getMenuSection())
  })
}

const isUserAReviewer = () => {
  const isAuthor = audit.value.creator._id === UserService.user.id
  const isCollaborator = audit.value.collaborators.some(element => element._id === UserService.user.id)
  const isReviewer = audit.value.reviewers.some(element => element._id === UserService.user.id)
  const hasReviewAll = UserService.isAllowed('audits:review-all')
  
  return !(isAuthor || isCollaborator) && (isReviewer || hasReviewAll)
}

const isUserAnEditor = () => {
  const isAuthor = audit.value.creator._id === UserService.user.id
  const isCollaborator = audit.value.collaborators.some(element => element._id === UserService.user.id)
  const hasUpdateAll = UserService.isAllowed('audits:update-all')
  
  return (isAuthor || isCollaborator || hasUpdateAll)
}

const userHasAlreadyApproved = () => {
  return audit.value.approvals.some(element => element._id === UserService.user.id)
}

const getUIState = () => {
  if (!window.$settings?.reviews?.enabled || audit.value.state === "EDIT") {
    frontEndAuditState.value = isUserAnEditor() ? Utils.AUDIT_VIEW_STATE.EDIT : Utils.AUDIT_VIEW_STATE.EDIT_READONLY
  } else if (audit.value.state === "REVIEW") {
    if (!isUserAReviewer()) {
      frontEndAuditState.value = isUserAnEditor() ? Utils.AUDIT_VIEW_STATE.REVIEW_EDITOR : Utils.AUDIT_VIEW_STATE.REVIEW_READONLY
      return
    }
    if (isUserAnEditor()) {
      frontEndAuditState.value = userHasAlreadyApproved() ? Utils.AUDIT_VIEW_STATE.REVIEW_ADMIN_APPROVED : Utils.AUDIT_VIEW_STATE.REVIEW_ADMIN
      return
    }
    frontEndAuditState.value = userHasAlreadyApproved() ? Utils.AUDIT_VIEW_STATE.REVIEW_APPROVED : Utils.AUDIT_VIEW_STATE.REVIEW
  } else if (audit.value.state === "APPROVED") {
    if (!isUserAReviewer()) {
      frontEndAuditState.value = Utils.AUDIT_VIEW_STATE.APPROVED_READONLY
    } else {
      frontEndAuditState.value = userHasAlreadyApproved() ? Utils.AUDIT_VIEW_STATE.APPROVED_APPROVED : Utils.AUDIT_VIEW_STATE.APPROVED
    }
  }
}

const getAudit = async () => {
  try {
    // Get vulnerability categories first
    const vulnCategoriesResponse = await DataService.getVulnerabilityCategories()
    vulnCategories.value = vulnCategoriesResponse.data.datas
    
    // Get audit data
    const auditResponse = await AuditService.getAudit(auditId.value)
    audit.value = auditResponse.data.datas
    
    getUIState()
    await getSections()
    
    if (loading.value) {
      handleSocket()
    }
    
    loading.value = false
  } catch (error) {
    if (error.response.status === 403) {
      router.push({ name: '403', params: { error: error.response.data.datas } })
    } else if (error.response.status === 404) {
      router.push({ name: '404', params: { error: error.response.data.datas } })
    }
  }
}

const getCustomFields = async () => {
  try {
    const response = await DataService.getCustomFields()
    customFields.value = response.data.datas
  } catch (error) {
    console.error('Error fetching custom fields:', error)
  }
}

const getSections = async () => {
  try {
    const response = await DataService.getSections()
    sections.value = response.data.datas
  } catch (error) {
    console.error('Error fetching sections:', error)
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

const generateReport = async () => {
  try {
    const response = await AuditService.generateReport(auditId.value)
    // Handle file download
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${audit.value.name || 'report'}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating report:', error)
  }
}

const toggleAskReview = async () => {
  try {
    const newState = audit.value.state === "EDIT" ? "REVIEW" : "EDIT"
    await AuditService.updateReadyForReview(auditId.value, { state: newState })
    
    audit.value.state = newState
    getUIState()
    
    toast({
      title: $t('success'),
      description: $t('msg.auditReviewUpdateOk'),
      variant: 'default'
    })
  } catch (error) {
    toast({
      title: $t('error'),
      description: error.response?.data?.datas || error.message,
      variant: 'destructive'
    })
  }
}

const toggleApproval = async () => {
  try {
    await AuditService.toggleApproval(auditId.value)
    
    toast({
      title: $t('success'),
      description: $t('msg.auditApprovalUpdateOk'),
      variant: 'default'
    })
  } catch (error) {
    toast({
      title: $t('error'),
      description: error.response?.data?.datas || error.message,
      variant: 'destructive'
    })
  }
}

const moveFindingPosition = async (event, category) => {
  try {
    const { oldIndex, newIndex } = event
    if (oldIndex === newIndex) return
    
    const categoryData = findingList.value.find(item => item.category === category)
    if (!categoryData) return
    
    const finding = categoryData.findings[newIndex]
    
    await AuditService.updateFindingPosition(auditId.value, finding._id, {
      position: newIndex,
      category: category
    })
  } catch (error) {
    console.error('Error updating finding position:', error)
  }
}

const updateSortFindings = async () => {
  try {
    await AuditService.updateSortFindings(auditId.value, audit.value.sortFindings)
    
    toast({
      title: $t('success'),
      description: $t('msg.sortFindingsUpdated'),
      variant: 'default'
    })
  } catch (error) {
    console.error('Error updating sort findings:', error)
  }
}

// Splitter functionality
const startSplitterDrag = (event) => {
  const startY = event.clientY
  const startRatio = splitterRatio.value
  
  const handleMouseMove = (e) => {
    const deltaY = e.clientY - startY
    const containerHeight = e.target.closest('.flex-col').offsetHeight
    const deltaRatio = (deltaY / containerHeight) * 100
    
    const newRatio = Math.max(20, Math.min(80, startRatio + deltaRatio))
    splitterRatio.value = newRatio
  }
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// Watch for audit findings changes
watch(
  () => audit.value.findings,
  (newVal) => {
    if (!newVal) return
    
    const result = _.chain(audit.value.findings)
      .groupBy("category")
      .map((value, key) => {
        if (key === 'undefined') key = 'No Category'
        
        let sortOption = audit.value.sortFindings.find(option => option.category === key)
        
        if (!sortOption) {
          sortOption = vulnCategories.value.find(e => e.name === key)
          if (sortOption) {
            sortOption.category = sortOption.name
          } else {
            sortOption = { category: key, sortValue: 'cvssScore', sortOrder: 'desc', sortAuto: true }
          }
          
          audit.value.sortFindings.push({
            category: sortOption.category,
            sortValue: sortOption.sortValue,
            sortOrder: sortOption.sortOrder,
            sortAuto: sortOption.sortAuto
          })
        }
        
        return { category: key, findings: value, sortOption: sortOption }
      })
      .value()
    
    findingList.value = result
  },
  { deep: true, immediate: true }
)

// Initialize component
onMounted(() => {
  auditId.value = route.params.auditId
  getCustomFields()
  getAuditTypes()
  getAudit()
})

// Cleanup
onUnmounted(() => {
  if (!loading.value && window.$socket) {
    window.$socket.emit('leave', { username: UserService.user.username, room: auditId.value })
    window.$socket.off()
  }
})
</script>

<style scoped>
.drag-ghost {
  opacity: 0.5;
}

.multi-colors-bar {
  height: 4px;
}

.cursor-move {
  cursor: move;
}

.cursor-row-resize {
  cursor: row-resize;
}
</style>
  