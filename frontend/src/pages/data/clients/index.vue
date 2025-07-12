<template>
  <div class="flex flex-col gap-6 p-6">
    <!-- Header with Add Button -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        {{ $t('clients') }}
      </h1>
      <Button
        class="bg-secondary hover:bg-secondary/90"
        @click="openCreateModal"
      >
        {{ $t('addClient') }}
      </Button>
    </div>

    <!-- Search Filters -->
    <Card>
      <CardHeader>
        <CardTitle>{{ $t('search') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div class="space-y-2">
            <Label for="search-firstname">{{ $t('firstname') }}</Label>
            <Input
              id="search-firstname"
              v-model="search.firstname"
              :placeholder="$t('search')"
              clearable
            />
          </div>
          <div class="space-y-2">
            <Label for="search-lastname">{{ $t('lastname') }}</Label>
            <Input
              id="search-lastname"
              v-model="search.lastname"
              :placeholder="$t('search')"
              clearable
            />
          </div>
          <div class="space-y-2">
            <Label for="search-email">{{ $t('email') }}</Label>
            <Input
              id="search-email"
              v-model="search.email"
              :placeholder="$t('search')"
              clearable
            />
          </div>
          <div class="space-y-2">
            <Label for="search-company">{{ $t('company') }}</Label>
            <Select
              v-model="search['company.name']"
              :placeholder="$t('search')"
            >
              <SelectTrigger id="search-company">
                <SelectValue :placeholder="$t('search')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {{ $t('all') }}
                </SelectItem>
                <SelectItem
                  v-for="company in companies"
                  :key="company.name"
                  :value="company.name"
                >
                  {{ company.name }}
                </SelectItem>
              </SelectContent>
            </Select>
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
                <th class="cursor-pointer p-4 text-left font-medium hover:bg-muted/50" @click="sortBy('firstname')">
                  {{ $t('firstname') }}
                  <ChevronUpIcon v-if="pagination.sortBy === 'firstname' && !pagination.descending" class="ml-1 inline size-4" />
                  <ChevronDownIcon v-if="pagination.sortBy === 'firstname' && pagination.descending" class="ml-1 inline size-4" />
                </th>
                <th class="cursor-pointer p-4 text-left font-medium hover:bg-muted/50" @click="sortBy('lastname')">
                  {{ $t('lastname') }}
                  <ChevronUpIcon v-if="pagination.sortBy === 'lastname' && !pagination.descending" class="ml-1 inline size-4" />
                  <ChevronDownIcon v-if="pagination.sortBy === 'lastname' && pagination.descending" class="ml-1 inline size-4" />
                </th>
                <th class="cursor-pointer p-4 text-left font-medium hover:bg-muted/50" @click="sortBy('email')">
                  {{ $t('email') }}
                  <ChevronUpIcon v-if="pagination.sortBy === 'email' && !pagination.descending" class="ml-1 inline size-4" />
                  <ChevronDownIcon v-if="pagination.sortBy === 'email' && pagination.descending" class="ml-1 inline size-4" />
                </th>
                <th class="cursor-pointer p-4 text-left font-medium hover:bg-muted/50" @click="sortBy('company')">
                  {{ $t('company') }}
                  <ChevronUpIcon v-if="pagination.sortBy === 'company' && !pagination.descending" class="ml-1 inline size-4" />
                  <ChevronDownIcon v-if="pagination.sortBy === 'company' && pagination.descending" class="ml-1 inline size-4" />
                </th>
                <th class="w-24 p-4 text-left font-medium">
                  {{ $t('actions') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="text-center">
                <td colspan="5" class="p-8">
                  <div class="flex items-center justify-center">
                    <LoadingSpinner class="mr-2 size-6" />
                    {{ $t('loading') }}
                  </div>
                </td>
              </tr>
              <tr v-else-if="paginatedClients.length === 0" class="text-center">
                <td colspan="5" class="p-8 text-muted-foreground">
                  {{ $t('noDataAvailable') }}
                </td>
              </tr>
              <tr
                v-for="client in paginatedClients"
                v-else
                :key="client._id"
                class="cursor-pointer border-b hover:bg-muted/50"
                @dblclick="editClient(client)"
              >
                <td class="p-4">
                  {{ client.firstname }}
                </td>
                <td class="p-4">
                  {{ client.lastname }}
                </td>
                <td class="p-4">
                  {{ client.email }}
                </td>
                <td class="p-4">
                  {{ client.company?.name || '-' }}
                </td>
                <td class="p-4">
                  <div class="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      @click="editClient(client)"
                    >
                      <PencilIcon class="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      @click="confirmDeleteClient(client)"
                    >
                      <TrashIcon class="size-4 text-destructive" />
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
            <span v-if="filteredClients.length === 1">
              1 {{ $t('quantifier') }}{{ $t('client') }}
            </span>
            <span v-else>
              {{ filteredClients.length }} {{ $t('quantifier') }}{{ $t('clients') }}
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
                  <SelectItem value="25">
                    25
                  </SelectItem>
                  <SelectItem value="50">
                    50
                  </SelectItem>
                  <SelectItem value="100">
                    100
                  </SelectItem>
                  <SelectItem value="0">
                    {{ $t('all') }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                :disabled="pagination.page === 1"
                @click="pagination.page = Math.max(1, pagination.page - 1)"
              >
                <ChevronLeftIcon class="size-4" />
              </Button>

              <span class="text-sm">
                {{ pagination.page }} / {{ totalPages }}
              </span>

              <Button
                variant="outline"
                size="sm"
                :disabled="pagination.page === totalPages"
                @click="pagination.page = Math.min(totalPages, pagination.page + 1)"
              >
                <ChevronRightIcon class="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Create Client Modal -->
    <Dialog :open="showCreateModal" @update:open="showCreateModal = $event">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ $t('addClient') }}</DialogTitle>
        </DialogHeader>

        <form class="space-y-4" @submit.prevent="createClient">
          <div class="space-y-2">
            <Label for="create-company">{{ $t('company') }}</Label>
            <Select v-model="currentClient.company">
              <SelectTrigger id="create-company">
                <SelectValue :placeholder="$t('selectCompany')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {{ $t('noCompany') }}
                </SelectItem>
                <SelectItem
                  v-for="company in companies"
                  :key="company.name"
                  :value="company"
                >
                  {{ company.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="create-firstname">{{ $t('firstname') }} *</Label>
            <Input
              id="create-firstname"
              v-model="currentClient.firstname"
              :error="!!errors.firstname"
              required
              autofocus
              @keyup.enter="createClient"
            />
            <p v-if="errors.firstname" class="text-sm text-destructive">
              {{ errors.firstname }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="create-lastname">{{ $t('lastname') }} *</Label>
            <Input
              id="create-lastname"
              v-model="currentClient.lastname"
              :error="!!errors.lastname"
              required
              @keyup.enter="createClient"
            />
            <p v-if="errors.lastname" class="text-sm text-destructive">
              {{ errors.lastname }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="create-email">{{ $t('email') }} *</Label>
            <Input
              id="create-email"
              v-model="currentClient.email"
              :error="!!errors.email"
              type="email"
              required
              @keyup.enter="createClient"
            />
            <p v-if="errors.email" class="text-sm text-destructive">
              {{ errors.email }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="create-title">{{ $t('function') }}</Label>
            <Input
              id="create-title"
              v-model="currentClient.title"
              @keyup.enter="createClient"
            />
          </div>

          <div class="space-y-2">
            <Label for="create-phone">{{ $t('phone') }}</Label>
            <Input
              id="create-phone"
              v-model="currentClient.phone"
              @keyup.enter="createClient"
            />
          </div>

          <div class="space-y-2">
            <Label for="create-cell">{{ $t('cell') }}</Label>
            <Input
              id="create-cell"
              v-model="currentClient.cell"
              @keyup.enter="createClient"
            />
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
            :disabled="creatingClient"
            class="bg-secondary hover:bg-secondary/90"
            @click="createClient"
          >
            <LoadingSpinner v-if="creatingClient" class="mr-2 size-4" />
            {{ $t('btn.create') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Client Modal -->
    <Dialog :open="showEditModal" @update:open="showEditModal = $event">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ $t('editClient') }}</DialogTitle>
        </DialogHeader>

        <form class="space-y-4" @submit.prevent="updateClient">
          <div class="space-y-2">
            <Label for="edit-company">{{ $t('company') }}</Label>
            <Select v-model="currentClient.company">
              <SelectTrigger id="edit-company">
                <SelectValue :placeholder="$t('selectCompany')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {{ $t('noCompany') }}
                </SelectItem>
                <SelectItem
                  v-for="company in companies"
                  :key="company.name"
                  :value="company"
                >
                  {{ company.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="edit-firstname">{{ $t('firstname') }} *</Label>
            <Input
              id="edit-firstname"
              v-model="currentClient.firstname"
              :error="!!errors.firstname"
              required
              @keyup.enter="updateClient"
            />
            <p v-if="errors.firstname" class="text-sm text-destructive">
              {{ errors.firstname }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="edit-lastname">{{ $t('lastname') }} *</Label>
            <Input
              id="edit-lastname"
              v-model="currentClient.lastname"
              :error="!!errors.lastname"
              required
              @keyup.enter="updateClient"
            />
            <p v-if="errors.lastname" class="text-sm text-destructive">
              {{ errors.lastname }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="edit-email">{{ $t('email') }} *</Label>
            <Input
              id="edit-email"
              v-model="currentClient.email"
              :error="!!errors.email"
              type="email"
              required
              @keyup.enter="updateClient"
            />
            <p v-if="errors.email" class="text-sm text-destructive">
              {{ errors.email }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="edit-title">{{ $t('function') }}</Label>
            <Input
              id="edit-title"
              v-model="currentClient.title"
              @keyup.enter="updateClient"
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-phone">{{ $t('phone') }}</Label>
            <Input
              id="edit-phone"
              v-model="currentClient.phone"
              @keyup.enter="updateClient"
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-cell">{{ $t('cell') }}</Label>
            <Input
              id="edit-cell"
              v-model="currentClient.cell"
              @keyup.enter="updateClient"
            />
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
            :disabled="updatingClient"
            class="bg-secondary hover:bg-secondary/90"
            @click="updateClient"
          >
            <LoadingSpinner v-if="updatingClient" class="mr-2 size-4" />
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
            {{ $t('client') }} «{{ clientToDelete?.firstname }} {{ clientToDelete?.lastname }}» {{ $t('msg.deleteNotice') }}
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
            :disabled="deletingClient"
            @click="deleteClient"
          >
            <LoadingSpinner v-if="deletingClient" class="mr-2 size-4" />
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
import { LoadingSpinner } from '@/components/ui/loading'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'

import ClientService from '@/services/client'
import CompanyService from '@/services/company'
import Utils from '@/services/utils'

export default {
  name: 'ClientsPage',
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
    LoadingSpinner,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    PencilIcon,
    TrashIcon,
  },
  setup() {
    const toast = useToast()

    // Reactive data
    const clients = ref([])
    const companies = ref([])
    const loading = ref(true)
    const creatingClient = ref(false)
    const updatingClient = ref(false)
    const deletingClient = ref(false)

    // Modal state
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const showDeleteModal = ref(false)

    // Search filters
    const search = ref({
      firstname: '',
      lastname: '',
      email: '',
      'company.name': '',
    })

    // Pagination
    const pagination = ref({
      page: 1,
      rowsPerPage: 25,
      sortBy: 'firstname',
      descending: false,
    })

    // Current client for forms
    const currentClient = ref({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      cell: '',
      title: '',
      company: null,
    })

    // Client to delete
    const clientToDelete = ref(null)

    // Form errors
    const errors = ref({
      firstname: '',
      lastname: '',
      email: '',
    })

    // ID for updating
    const idUpdate = ref('')

    // Computed properties
    const filteredClients = computed(() => {
      return Utils.customFilter(clients.value, search.value)
    })

    const sortedClients = computed(() => {
      const sorted = [...filteredClients.value].sort((a, b) => {
        let aVal, bVal

        switch (pagination.value.sortBy) {
        case 'firstname':
          aVal = a.firstname || ''
          bVal = b.firstname || ''
          break
        case 'lastname':
          aVal = a.lastname || ''
          bVal = b.lastname || ''
          break
        case 'email':
          aVal = a.email || ''
          bVal = b.email || ''
          break
        case 'company':
          aVal = a.company?.name || ''
          bVal = b.company?.name || ''
          break
        default:
          aVal = a.firstname || ''
          bVal = b.firstname || ''
        }

        const result = aVal.localeCompare(bVal)
        return pagination.value.descending ? -result : result
      })

      return sorted
    })

    const paginatedClients = computed(() => {
      const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
      const end = pagination.value.rowsPerPage === 0 ?
        sortedClients.value.length :
        start + pagination.value.rowsPerPage

      return sortedClients.value.slice(start, end)
    })

    const totalPages = computed(() => {
      if (pagination.value.rowsPerPage === 0) return 1
      return Math.ceil(filteredClients.value.length / pagination.value.rowsPerPage)
    })

    // Methods
    const getClients = async () => {
      loading.value = true
      try {
        const response = await ClientService.getClients()
        clients.value = response.data.datas
      } catch (error) {
        console.error('Error fetching clients:', error)
        toast.error($t('msg.errorFetchingClients'))
      } finally {
        loading.value = false
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

    const openCreateModal = () => {
      cleanCurrentClient()
      cleanErrors()
      showCreateModal.value = true
    }

    const createClient = async () => {
      cleanErrors()

      if (!currentClient.value.firstname) {
        errors.value.firstname = $t('msg.firstnameRequired')
      }
      if (!currentClient.value.lastname) {
        errors.value.lastname = $t('msg.lastnameRequired')
      }
      if (!currentClient.value.email) {
        errors.value.email = $t('msg.emailRequired')
      }

      if (errors.value.firstname || errors.value.lastname || errors.value.email) {
        return
      }

      creatingClient.value = true
      try {
        await ClientService.createClients([currentClient.value])
        await getClients()
        showCreateModal.value = false
        toast.success($t('msg.clientCreatedOk'))
      } catch (error) {
        console.error('Error creating client:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorCreatingClient'))
      } finally {
        creatingClient.value = false
      }
    }

    const editClient = (client) => {
      currentClient.value = { ...client }
      idUpdate.value = client._id
      cleanErrors()
      showEditModal.value = true
    }

    const updateClient = async () => {
      cleanErrors()

      if (!currentClient.value.firstname) {
        errors.value.firstname = $t('msg.firstnameRequired')
      }
      if (!currentClient.value.lastname) {
        errors.value.lastname = $t('msg.lastnameRequired')
      }
      if (!currentClient.value.email) {
        errors.value.email = $t('msg.emailRequired')
      }

      if (errors.value.firstname || errors.value.lastname || errors.value.email) {
        return
      }

      updatingClient.value = true
      try {
        await ClientService.updateClient(idUpdate.value, currentClient.value)
        await getClients()
        showEditModal.value = false
        toast.success($t('msg.clientUpdatedOk'))
      } catch (error) {
        console.error('Error updating client:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorUpdatingClient'))
      } finally {
        updatingClient.value = false
      }
    }

    const confirmDeleteClient = (client) => {
      clientToDelete.value = client
      showDeleteModal.value = true
    }

    const deleteClient = async () => {
      if (!clientToDelete.value) return

      deletingClient.value = true
      try {
        await ClientService.deleteClient(clientToDelete.value._id)
        await getClients()
        showDeleteModal.value = false
        toast.success($t('msg.clientDeletedOk'))
      } catch (error) {
        console.error('Error deleting client:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorDeletingClient'))
      } finally {
        deletingClient.value = false
        clientToDelete.value = null
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

    const cleanCurrentClient = () => {
      currentClient.value = {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        cell: '',
        title: '',
        company: null,
      }
    }

    const cleanErrors = () => {
      errors.value = {
        firstname: '',
        lastname: '',
        email: '',
      }
    }

    // Lifecycle
    onMounted(() => {
      getClients()
      getCompanies()
    })

    return {
      // Data
      clients,
      companies,
      loading,
      creatingClient,
      updatingClient,
      deletingClient,

      // Modal state
      showCreateModal,
      showEditModal,
      showDeleteModal,

      // Search and pagination
      search,
      pagination,

      // Form data
      currentClient,
      clientToDelete,
      errors,
      idUpdate,

      // Computed
      filteredClients,
      paginatedClients,
      totalPages,

      // Methods
      getClients,
      getCompanies,
      openCreateModal,
      createClient,
      editClient,
      updateClient,
      confirmDeleteClient,
      deleteClient,
      sortBy,
      cleanCurrentClient,
      cleanErrors,
    }
  },
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
