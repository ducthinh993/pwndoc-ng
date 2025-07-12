<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ $t('companies') }}</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ $t('manageCompanies') }}</p>
        </div>
        <button 
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          @click="cleanCurrentCompany(); showCreateModal = true"
        >
          {{ $t('addCompany') }}
        </button>
      </div>

      <!-- Search Filter -->
      <div class="mb-6">
        <input 
          v-model="search.name"
          :placeholder="$t('search')"
          class="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <!-- Companies Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table v-if="!loading" class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sort('name')">
                <div class="flex items-center gap-2">
                  {{ $t('name') }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sort('shortName')">
                <div class="flex items-center gap-2">
                  {{ $t('shortName') }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ $t('logo') }}</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="company in filteredCompanies" 
              :key="company.name" 
              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              @dblclick="dblClick(company)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ company.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ company.shortName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  v-if="company.logo && isBase64Image(company.logo)"
                  :src="getImageSrc(company.logo)"
                  class="h-10 w-10 object-contain"
                  alt="Company logo"
                />
                <span v-else class="text-sm text-gray-500 dark:text-gray-400">{{ company.logo }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <tooltip>
                    <template #trigger>
                      <button 
                        class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        @click="clone(company); showEditModal = true"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </template>
                    <template #content>{{ $t('tooltip.edit') }}</template>
                  </tooltip>
                  
                  <tooltip>
                    <template #trigger>
                      <button 
                        class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        @click="confirmDeleteCompany(company)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </template>
                    <template #content>{{ $t('tooltip.delete') }}</template>
                  </tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <loading size="lg" />
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">{{ $t('loading') }}</p>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredCompanies.length === 0" class="p-12 text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{{ $t('noCompanies') }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('noCompaniesMessage') }}</p>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && filteredCompanies.length > 0" class="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            <span v-if="filteredCompanies.length === 1">1 {{ $t('quantifier') }}{{ $t('company') }}</span>                
            <span v-else>{{ filteredCompanies.length }} {{ $t('quantifier') }}{{ $t('companies') }}</span>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('resultsPerPage') }}</span>
              <select 
                v-model="pagination.rowsPerPage"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option v-for="option in rowsPerPageOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            
            <div class="flex items-center gap-2">
              <button 
                :disabled="pagination.page <= 1"
                :class="[
                  'px-3 py-1 text-sm rounded border transition-colors',
                  pagination.page <= 1 
                    ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                ]"
                @click="pagination.page--"
              >
                {{ $t('previous') }}
              </button>
              
              <span class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                {{ pagination.page }} / {{ totalPages }}
              </span>
              
              <button 
                :disabled="pagination.page >= totalPages"
                :class="[
                  'px-3 py-1 text-sm rounded border transition-colors',
                  pagination.page >= totalPages 
                    ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                ]"
                @click="pagination.page++"
              >
                {{ $t('next') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Company Modal -->
    <dialog v-model:open="showCreateModal">
      <template #content>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('addCompany') }}</h2>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <input 
                v-model="currentCompany.name"
                :placeholder="$t('name') + ' *'"
                :class="[
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                ]"
                @keyup.enter="createCompany()"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.name }}</p>
            </div>

            <div>
              <input 
                v-model="currentCompany.shortName"
                :placeholder="$t('shortName')"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                @keyup.enter="createCompany()"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('logo') }}</label>
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  ref="fileInput"
                  type="file"
                  accept=".gif,.jpg,.jpeg,.png"
                  @change="handleImage"
                  class="hidden"
                />
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <button 
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="text-primary hover:text-primary/80 font-medium"
                >
                  {{ $t('chooseFile') }}
                </button>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button 
              @click="showCreateModal = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {{ $t('btn.cancel') }}
            </button>
            <button 
              @click="createCompany()"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {{ $t('btn.create') }}
            </button>
          </div>
        </div>
      </template>
    </dialog>

    <!-- Edit Company Modal -->
    <dialog v-model:open="showEditModal">
      <template #content>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('editCompany') }}</h2>
            <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <input 
                v-model="currentCompany.name"
                :placeholder="$t('name') + ' *'"
                :class="[
                  'w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                ]"
                @keyup.enter="updateCompany()"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.name }}</p>
            </div>

            <div>
              <input 
                v-model="currentCompany.shortName"
                :placeholder="$t('shortName')"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                @keyup.enter="updateCompany()"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('logo') }}</label>
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  ref="editFileInput"
                  type="file"
                  accept=".gif,.jpg,.jpeg,.png"
                  @change="handleImage"
                  class="hidden"
                />
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <button 
                  type="button"
                  @click="$refs.editFileInput.click()"
                  class="text-primary hover:text-primary/80 font-medium"
                >
                  {{ $t('chooseFile') }}
                </button>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button 
              @click="showEditModal = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {{ $t('btn.cancel') }}
            </button>
            <button 
              @click="updateCompany()"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {{ $t('btn.update') }}
            </button>
          </div>
        </div>
      </template>
    </dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useToast } from '@/composables/useToast'

import Dialog from '@/components/ui/dialog.vue'
import Tooltip from '@/components/ui/tooltip.vue'
import Loading from '@/components/ui/loading.vue'

import CompanyService from '@/services/company'
import Utils from '@/services/utils'
import { $t } from '@/boot/i18n'

export default defineComponent({
  name: 'CompaniesPage',
  
  components: {
    Dialog,
    Tooltip,
    Loading
  },

  data() {
    return {
      // UI state
      showCreateModal: false,
      showEditModal: false,
      
      // Companies list
      companies: [],
      loading: false,
      
      // Datatable headers
      dtHeaders: [
        {name: 'name', label: $t('name'), field: 'name', align: 'left', sortable: true},
        {name: 'shortName', label: $t('shortName'), field: 'shortName', align: 'left', sortable: true},
        {name: 'logo', label: $t('logo'), field: 'logo', align: 'left', sortable: true},
        {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
      ],
      
      // Datatable pagination
      pagination: {
        page: 1,
        rowsPerPage: 25,
        sortBy: 'name',
        descending: false
      },
      rowsPerPageOptions: [
        {label:'25', value:25},
        {label:'50', value:50},
        {label:'100', value:100},
        {label:'All', value:0}
      ],
      
      // Search filter
      search: {name: ''},
      customFilter: Utils.customFilter,
      
      // Errors messages
      errors: {name: ''},
      
      // Company to create or update
      currentCompany: {
        name: '', 
        shortName: '',
        logo: ''
      },
      
      // Name for update
      idUpdate: ''
    }
  },

  computed: {
    filteredCompanies() {
      let filtered = this.companies.filter(company => {
        return !this.search.name || company.name.toLowerCase().includes(this.search.name.toLowerCase())
      })

      // Sort
      if (this.pagination.sortBy) {
        filtered.sort((a, b) => {
          const aVal = a[this.pagination.sortBy]
          const bVal = b[this.pagination.sortBy]
          
          if (aVal < bVal) return this.pagination.descending ? 1 : -1
          if (aVal > bVal) return this.pagination.descending ? -1 : 1
          return 0
        })
      }

      // Paginate
      if (this.pagination.rowsPerPage === 0) return filtered
      
      const start = (this.pagination.page - 1) * this.pagination.rowsPerPage
      const end = start + this.pagination.rowsPerPage
      return filtered.slice(start, end)
    },

    totalPages() {
      if (this.pagination.rowsPerPage === 0) return 1
      return Math.ceil(this.companies.length / this.pagination.rowsPerPage)
    }
  },

  mounted() {
    this.getCompanies()
  },

  methods: {
    getCompanies() {
      this.loading = true
      CompanyService.getCompanies()
      .then((data) => {
        this.companies = data.data.datas
        this.loading = false
      })
      .catch((err) => {
        console.log(err)
        this.loading = false
      })
    },

    createCompany() {
      this.cleanErrors()
      if (!this.currentCompany.name) {
        this.errors.name = $t('msg.companyRequired')
        return
      }

      CompanyService.createCompanies([this.currentCompany])
      .then(() => {
        this.getCompanies()
        this.showCreateModal = false
        const { showToast } = useToast()
        showToast({
          type: 'success',
          message: $t('msg.companyCreatedOk'),
          duration: 3000
        })
      })
      .catch((err) => {
        const { showToast } = useToast()
        showToast({
          type: 'error',
          message: err.response.data.datas,
          duration: 5000
        })
      })
    },

    updateCompany() {
      this.cleanErrors()
      if (!this.currentCompany.name) {
        this.errors.name = $t('msg.companyRequired')
        return
      }

      CompanyService.updateCompany(this.idUpdate, this.currentCompany)
      .then(() => {
        this.getCompanies()
        this.showEditModal = false
        const { showToast } = useToast()
        showToast({
          type: 'success',
          message: $t('msg.companyUpdatedOk'),
          duration: 3000
        })
      })
      .catch((err) => {
        const { showToast } = useToast()
        showToast({
          type: 'error',
          message: err.response.data.datas,
          duration: 5000
        })
      })
    },

    deleteCompany(company) {
      CompanyService.deleteCompany(company.name)
      .then(() => {
        this.getCompanies()
        const { showToast } = useToast()
        showToast({
          type: 'success',
          message: $t('msg.companyDeletedOk'),
          duration: 3000
        })
      })
      .catch((err) => {
        const { showToast } = useToast()
        showToast({
          type: 'error',
          message: err.response.data.datas,
          duration: 5000
        })
      })
    },

    confirmDeleteCompany(company) {
      if (confirm($t('msg.confirmSuppression'))) {
        this.deleteCompany(company)
      }
    },

    cleanCurrentCompany() {
      this.currentCompany = {name: '', shortName: '', logo: ''}
      this.idUpdate = ''
    },

    cleanErrors() {
      this.errors = {name: ''}
    },

    clone(row) {
      this.cleanErrors()
      this.currentCompany = {...row}
      this.idUpdate = row.name
    },

    dblClick(row) {
      this.clone(row)
      this.showEditModal = true
    },

    sort(field) {
      if (this.pagination.sortBy === field) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = field
        this.pagination.descending = false
      }
    },

    handleImage(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.currentCompany.logo = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    isBase64Image(str) {
      return str && str.startsWith('data:image')
    },

    getImageSrc(base64) {
      return base64
    }
  }
})
</script>