<template>
  <div class="flex flex-col gap-6 p-6">
    <!-- Header with Add Button -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">{{ $t('templates') }}</h1>
      <Button 
        v-if="UserService.isAllowed('templates:create')"
        @click="openCreateModal"
        class="bg-secondary hover:bg-secondary/90"
      >
        {{ $t('createTemplate') }}
      </Button>
    </div>

    <!-- Search Filters -->
    <Card>
      <CardHeader>
        <CardTitle>{{ $t('search') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="search-name">{{ $t('name') }}</Label>
            <Input
              id="search-name"
              v-model="search.name"
              :placeholder="$t('search')"
              clearable
            />
          </div>
          <div class="space-y-2">
            <Label for="search-ext">{{ $t('extension') }}</Label>
            <Input
              id="search-ext"
              v-model="search.ext"
              :placeholder="$t('search')"
              clearable
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Data Table -->
    <Card>
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-4 font-medium cursor-pointer hover:bg-muted/50" @click="sortBy('name')">
                  {{ $t('name') }}
                  <ChevronUpIcon v-if="pagination.sortBy === 'name' && !pagination.descending" class="w-4 h-4 inline ml-1" />
                  <ChevronDownIcon v-if="pagination.sortBy === 'name' && pagination.descending" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="text-left p-4 font-medium cursor-pointer hover:bg-muted/50" @click="sortBy('ext')">
                  {{ $t('extension') }}
                  <ChevronUpIcon v-if="pagination.sortBy === 'ext' && !pagination.descending" class="w-4 h-4 inline ml-1" />
                  <ChevronDownIcon v-if="pagination.sortBy === 'ext' && pagination.descending" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="text-left p-4 font-medium w-32">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="text-center">
                <td colspan="3" class="p-8">
                  <div class="flex justify-center items-center">
                    <LoadingSpinner class="w-6 h-6 mr-2" />
                    {{ $t('loading') }}
                  </div>
                </td>
              </tr>
              <tr v-else-if="paginatedTemplates.length === 0" class="text-center">
                <td colspan="3" class="p-8 text-muted-foreground">
                  {{ $t('noDataAvailable') }}
                </td>
              </tr>
              <tr 
                v-else
                v-for="template in paginatedTemplates" 
                :key="template._id"
                class="border-b hover:bg-muted/50 cursor-pointer"
                @dblclick="editTemplate(template)"
              >
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <DocumentIcon class="w-5 h-5 text-muted-foreground" />
                    {{ template.name }}
                  </div>
                </td>
                <td class="p-4">
                  <Badge variant="secondary">{{ template.ext }}</Badge>
                </td>
                <td class="p-4">
                  <div class="flex gap-2">
                    <Button
                      v-if="UserService.isAllowed('templates:update')"
                      size="sm"
                      variant="ghost"
                      @click="editTemplate(template)"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      @click="downloadTemplate(template)"
                    >
                      <ArrowDownTrayIcon class="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      v-if="UserService.isAllowed('templates:delete')"
                      size="sm"
                      variant="ghost"
                      @click="confirmDeleteTemplate(template)"
                    >
                      <TrashIcon class="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
      
      <!-- Pagination -->
      <CardContent class="pt-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-muted-foreground">
            <span v-if="filteredTemplates.length === 1">
              1 {{ $t('quantifier') }}{{ $t('template') }}
            </span>
            <span v-else>
              {{ filteredTemplates.length }} {{ $t('quantifier') }}{{ $t('templates') }}
            </span>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Label for="rows-per-page">{{ $t('resultsPerPage') }}</Label>
              <Select 
                v-model="pagination.rowsPerPage" 
                @update:model-value="pagination.page = 1"
              >
                <SelectTrigger id="rows-per-page" class="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="0">{{ $t('all') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="pagination.page = Math.max(1, pagination.page - 1)"
                :disabled="pagination.page === 1"
              >
                <ChevronLeftIcon class="w-4 h-4" />
              </Button>
              
              <span class="text-sm">
                {{ pagination.page }} / {{ totalPages }}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                @click="pagination.page = Math.min(totalPages, pagination.page + 1)"
                :disabled="pagination.page === totalPages"
              >
                <ChevronRightIcon class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Create Template Modal -->
    <Dialog :open="showCreateModal" @update:open="showCreateModal = $event">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ $t('createTemplate') }}</DialogTitle>
        </DialogHeader>
        
        <form @submit.prevent="createTemplate" class="space-y-4">
          <div class="space-y-2">
            <Label for="create-name">{{ $t('name') }} *</Label>
            <Input
              id="create-name"
              v-model="currentTemplate.name"
              :error="!!errors.name"
              required
              autofocus
              @keyup.enter="createTemplate"
            />
            <p v-if="errors.name" class="text-sm text-destructive">
              {{ errors.name }}
            </p>
          </div>
          
          <div class="space-y-2">
            <Label for="create-file">{{ $t('file') }} *</Label>
            <div class="space-y-2">
              <div
                class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
                :class="{ 'border-destructive': errors.file }"
                @drop="handleFileDrop"
                @dragover="handleDragOver"
                @dragenter="handleDragEnter"
                @dragleave="handleDragLeave"
              >
                <input
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  accept=".doc,.docx,.docm,.ppt,.pptx"
                  @change="handleFileSelect"
                />
                
                <div v-if="!currentTemplate.file" class="flex flex-col items-center gap-2">
                  <CloudArrowUpIcon class="w-10 h-10 text-muted-foreground" />
                  <p class="text-sm text-muted-foreground">
                    {{ $t('dragDropFile') }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ $t('supportedFormats') }}: DOC, DOCX, DOCM, PPT, PPTX
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    @click="$refs.fileInput.click()"
                  >
                    {{ $t('selectFile') }}
                  </Button>
                </div>
                
                <div v-else class="flex items-center gap-2">
                  <DocumentIcon class="w-6 h-6 text-green-600" />
                  <span class="text-sm font-medium">{{ selectedFileName }}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    @click="removeFile"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p v-if="errors.file" class="text-sm text-destructive">
                {{ errors.file }}
              </p>
            </div>
          </div>
        </form>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="showCreateModal = false"
          >
            {{ $t('btn.cancel') }}
          </Button>
          <Button
            type="submit"
            @click="createTemplate"
            :disabled="creatingTemplate"
            class="bg-secondary hover:bg-secondary/90"
          >
            <LoadingSpinner v-if="creatingTemplate" class="w-4 h-4 mr-2" />
            {{ $t('btn.create') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Template Modal -->
    <Dialog :open="showEditModal" @update:open="showEditModal = $event">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ $t('editTemplate') }}</DialogTitle>
        </DialogHeader>
        
        <form @submit.prevent="updateTemplate" class="space-y-4">
          <div class="space-y-2">
            <Label for="edit-name">{{ $t('name') }} *</Label>
            <Input
              id="edit-name"
              v-model="currentTemplate.name"
              :error="!!errors.name"
              required
              @keyup.enter="updateTemplate"
            />
            <p v-if="errors.name" class="text-sm text-destructive">
              {{ errors.name }}
            </p>
          </div>
          
          <div class="space-y-2">
            <Label for="edit-file">{{ $t('file') }} ({{ $t('optional') }})</Label>
            <div class="space-y-2">
              <div
                class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
                :class="{ 'border-destructive': errors.file }"
                @drop="handleFileDrop"
                @dragover="handleDragOver"
                @dragenter="handleDragEnter"
                @dragleave="handleDragLeave"
              >
                <input
                  ref="editFileInput"
                  type="file"
                  class="hidden"
                  accept=".doc,.docx,.docm,.ppt,.pptx"
                  @change="handleFileSelect"
                />
                
                <div v-if="!currentTemplate.file" class="flex flex-col items-center gap-2">
                  <CloudArrowUpIcon class="w-10 h-10 text-muted-foreground" />
                  <p class="text-sm text-muted-foreground">
                    {{ $t('dragDropFileUpdate') }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ $t('supportedFormats') }}: DOC, DOCX, DOCM, PPT, PPTX
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    @click="$refs.editFileInput.click()"
                  >
                    {{ $t('selectFile') }}
                  </Button>
                </div>
                
                <div v-else class="flex items-center gap-2">
                  <DocumentIcon class="w-6 h-6 text-green-600" />
                  <span class="text-sm font-medium">{{ selectedFileName }}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    @click="removeFile"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p v-if="errors.file" class="text-sm text-destructive">
                {{ errors.file }}
              </p>
            </div>
          </div>
        </form>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="showEditModal = false"
          >
            {{ $t('btn.cancel') }}
          </Button>
          <Button
            type="submit"
            @click="updateTemplate"
            :disabled="updatingTemplate"
            class="bg-secondary hover:bg-secondary/90"
          >
            <LoadingSpinner v-if="updatingTemplate" class="w-4 h-4 mr-2" />
            {{ $t('btn.update') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="showDeleteModal" @update:open="showDeleteModal = $event">
      <DialogContent class="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{{ $t('msg.confirmSuppression') }}</DialogTitle>
          <DialogDescription>
            {{ $t('template') }} «{{ templateToDelete?.name }}» {{ $t('msg.deleteNotice') }}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="showDeleteModal = false"
          >
            {{ $t('btn.cancel') }}
          </Button>
          <Button
            type="button"
            variant="destructive"
            @click="deleteTemplate"
            :disabled="deletingTemplate"
          >
            <LoadingSpinner v-if="deletingTemplate" class="w-4 h-4 mr-2" />
            {{ $t('btn.confirm') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

import TemplateService from '@/services/template'
import UserService from '@/services/user'

export default {
  name: 'TemplatesPage',
  components: {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Badge,
    LoadingSpinner,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    PencilIcon,
    TrashIcon,
    DocumentIcon,
    CloudArrowUpIcon,
    ArrowDownTrayIcon,
    XMarkIcon
  },
  setup() {
    const toast = useToast()
    
    // Services
    const { isAllowed } = UserService
    
    // Reactive data
    const templates = ref([])
    const loading = ref(true)
    const creatingTemplate = ref(false)
    const updatingTemplate = ref(false)
    const deletingTemplate = ref(false)
    
    // Modal state
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const showDeleteModal = ref(false)
    
    // Search filters
    const search = ref({
      name: '',
      ext: ''
    })
    
    // Pagination
    const pagination = ref({
      page: 1,
      rowsPerPage: 25,
      sortBy: 'name',
      descending: false
    })
    
    // Current template for forms
    const currentTemplate = ref({
      name: '',
      file: '',
      ext: ''
    })
    
    // Template to delete
    const templateToDelete = ref(null)
    
    // Form errors
    const errors = ref({
      name: '',
      file: ''
    })
    
    // File handling
    const selectedFileName = ref('')
    const templateId = ref('')
    
    // Computed properties
    const filteredTemplates = computed(() => {
      if (!search.value.name && !search.value.ext) {
        return templates.value
      }
      
      return templates.value.filter(template => {
        const nameMatch = !search.value.name || 
          template.name.toLowerCase().includes(search.value.name.toLowerCase())
        const extMatch = !search.value.ext || 
          template.ext.toLowerCase().includes(search.value.ext.toLowerCase())
        
        return nameMatch && extMatch
      })
    })
    
    const sortedTemplates = computed(() => {
      const sorted = [...filteredTemplates.value].sort((a, b) => {
        let aVal, bVal
        
        switch (pagination.value.sortBy) {
          case 'name':
            aVal = a.name || ''
            bVal = b.name || ''
            break
          case 'ext':
            aVal = a.ext || ''
            bVal = b.ext || ''
            break
          default:
            aVal = a.name || ''
            bVal = b.name || ''
        }
        
        const result = aVal.localeCompare(bVal)
        return pagination.value.descending ? -result : result
      })
      
      return sorted
    })
    
    const paginatedTemplates = computed(() => {
      const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
      const end = pagination.value.rowsPerPage === 0 ? 
        sortedTemplates.value.length : 
        start + pagination.value.rowsPerPage
      
      return sortedTemplates.value.slice(start, end)
    })
    
    const totalPages = computed(() => {
      if (pagination.value.rowsPerPage === 0) return 1
      return Math.ceil(filteredTemplates.value.length / pagination.value.rowsPerPage)
    })
    
    // Methods
    const getTemplates = async () => {
      loading.value = true
      try {
        const response = await TemplateService.getTemplates()
        templates.value = response.data.datas
      } catch (error) {
        console.error('Error fetching templates:', error)
        toast.error($t('msg.errorFetchingTemplates'))
      } finally {
        loading.value = false
      }
    }
    
    const openCreateModal = () => {
      cleanCurrentTemplate()
      showCreateModal.value = true
    }
    
    const createTemplate = async () => {
      cleanErrors()
      
      if (!currentTemplate.value.name) {
        errors.value.name = $t('msg.nameRequired')
      }
      if (!currentTemplate.value.file) {
        errors.value.file = $t('msg.fileRequired')
      }
      
      if (errors.value.name || errors.value.file) {
        return
      }
      
      creatingTemplate.value = true
      try {
        await TemplateService.createTemplate(currentTemplate.value)
        await getTemplates()
        showCreateModal.value = false
        toast.success($t('msg.templateCreatedOk'))
      } catch (error) {
        console.error('Error creating template:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorCreatingTemplate'))
      } finally {
        creatingTemplate.value = false
      }
    }
    
    const editTemplate = (template) => {
      if (!UserService.isAllowed('templates:update')) return
      
      cleanCurrentTemplate()
      currentTemplate.value.name = template.name
      templateId.value = template._id
      showEditModal.value = true
    }
    
    const updateTemplate = async () => {
      cleanErrors()
      
      if (!currentTemplate.value.name) {
        errors.value.name = $t('msg.nameRequired')
      }
      
      if (errors.value.name) {
        return
      }
      
      updatingTemplate.value = true
      try {
        await TemplateService.updateTemplate(templateId.value, currentTemplate.value)
        await getTemplates()
        showEditModal.value = false
        toast.success($t('msg.templateUpdatedOk'))
      } catch (error) {
        console.error('Error updating template:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorUpdatingTemplate'))
      } finally {
        updatingTemplate.value = false
      }
    }
    
    const downloadTemplate = async (template) => {
      try {
        const response = await TemplateService.downloadTemplate(template._id)
        const blob = new Blob([response.data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${template.name}.${template.ext || 'docx'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error downloading template:', error)
        if (error.response?.status === 404) {
          toast.error($t('msg.templateNotFound'))
        } else {
          toast.error($t('msg.errorDownloadingTemplate'))
        }
      }
    }
    
    const confirmDeleteTemplate = (template) => {
      templateToDelete.value = template
      showDeleteModal.value = true
    }
    
    const deleteTemplate = async () => {
      if (!templateToDelete.value) return
      
      deletingTemplate.value = true
      try {
        await TemplateService.deleteTemplate(templateToDelete.value._id)
        await getTemplates()
        showDeleteModal.value = false
        toast.success($t('msg.templateDeletedOk'))
      } catch (error) {
        console.error('Error deleting template:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorDeletingTemplate'))
      } finally {
        deletingTemplate.value = false
        templateToDelete.value = null
      }
    }
    
    const sortBy = (field) => {
      if (pagination.value.sortBy === field) {
        pagination.value.descending = !pagination.value.descending
      } else {
        pagination.value.sortBy = field
        pagination.value.descending = false
      }
      pagination.value.page = 1
    }
    
    // File handling methods
    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        handleFile(file)
      }
    }
    
    const handleFileDrop = (event) => {
      event.preventDefault()
      const file = event.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    }
    
    const handleDragOver = (event) => {
      event.preventDefault()
    }
    
    const handleDragEnter = (event) => {
      event.preventDefault()
    }
    
    const handleDragLeave = (event) => {
      event.preventDefault()
    }
    
    const handleFile = (file) => {
      // Validate file type
      const allowedTypes = ['.doc', '.docx', '.docm', '.ppt', '.pptx']
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error($t('msg.unsupportedFileType'))
        return
      }
      
      const fileReader = new FileReader()
      fileReader.onloadend = (e) => {
        currentTemplate.value.file = fileReader.result.split(',')[1]
        currentTemplate.value.ext = file.name.split('.').pop()
        selectedFileName.value = file.name
      }
      fileReader.readAsDataURL(file)
    }
    
    const removeFile = () => {
      currentTemplate.value.file = ''
      currentTemplate.value.ext = ''
      selectedFileName.value = ''
    }
    
    const cleanCurrentTemplate = () => {
      currentTemplate.value = {
        name: '',
        file: '',
        ext: ''
      }
      templateId.value = ''
      selectedFileName.value = ''
      cleanErrors()
    }
    
    const cleanErrors = () => {
      errors.value = {
        name: '',
        file: ''
      }
    }
    
    // Lifecycle
    onMounted(() => {
      getTemplates()
    })
    
    return {
      // Services
      UserService: { isAllowed },
      
      // Data
      templates,
      loading,
      creatingTemplate,
      updatingTemplate,
      deletingTemplate,
      
      // Modal state
      showCreateModal,
      showEditModal,
      showDeleteModal,
      
      // Search and pagination
      search,
      pagination,
      
      // Form data
      currentTemplate,
      templateToDelete,
      errors,
      selectedFileName,
      templateId,
      
      // Computed
      filteredTemplates,
      paginatedTemplates,
      totalPages,
      
      // Methods
      getTemplates,
      openCreateModal,
      createTemplate,
      editTemplate,
      updateTemplate,
      downloadTemplate,
      confirmDeleteTemplate,
      deleteTemplate,
      sortBy,
      handleFileSelect,
      handleFileDrop,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      handleFile,
      removeFile,
      cleanCurrentTemplate,
      cleanErrors
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>