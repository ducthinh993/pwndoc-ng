<template>
  <div class="flex flex-col gap-6 p-6">
    <!-- Header with Toggle and Add Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold">
          {{ $t('collaborators') }}
        </h1>
        <div class="flex items-center gap-2">
          <Switch
            id="enabled-toggle"
            v-model="search.enabled"
          />
          <Label for="enabled-toggle">
            {{ search.enabled ? $t('btn.accountsEnabled') : $t('btn.accountsDisabled') }}
          </Label>
        </div>
      </div>
      <Button
        v-if="UserService.isAllowed('users:create')"
        class="bg-secondary hover:bg-secondary/90"
        @click="openCreateModal"
      >
        {{ $t('addCollaborator') }}
      </Button>
    </div>

    <!-- Search Filters -->
    <Card>
      <CardHeader>
        <CardTitle>{{ $t('search') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div class="space-y-2">
            <Label for="search-username">{{ $t('username') }}</Label>
            <Input
              id="search-username"
              v-model="search.username"
              :placeholder="$t('search')"
              clearable
            />
          </div>
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
            <Label for="search-role">{{ $t('role') }}</Label>
            <Select
              v-model="search.role"
              :placeholder="$t('search')"
            >
              <SelectTrigger id="search-role">
                <SelectValue :placeholder="$t('search')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {{ $t('all') }}
                </SelectItem>
                <SelectItem
                  v-for="role in roles"
                  :key="role"
                  :value="role"
                >
                  {{ role }}
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
                <th class="cursor-pointer p-4 text-left font-medium hover:bg-muted/50" @click="sortBy('username')">
                  {{ $t('username') }}
                  <ChevronUpIcon v-if="pagination.sortBy === 'username' && !pagination.descending" class="ml-1 inline size-4" />
                  <ChevronDownIcon v-if="pagination.sortBy === 'username' && pagination.descending" class="ml-1 inline size-4" />
                </th>
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
                <th class="cursor-pointer p-4 text-left font-medium hover:bg-muted/50" @click="sortBy('role')">
                  {{ $t('role') }}
                  <ChevronUpIcon v-if="pagination.sortBy === 'role' && !pagination.descending" class="ml-1 inline size-4" />
                  <ChevronDownIcon v-if="pagination.sortBy === 'role' && pagination.descending" class="ml-1 inline size-4" />
                </th>
                <th class="w-24 p-4 text-left font-medium">
                  {{ $t('actions') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="text-center">
                <td colspan="6" class="p-8">
                  <div class="flex items-center justify-center">
                    <LoadingSpinner class="mr-2 size-6" />
                    {{ $t('loading') }}
                  </div>
                </td>
              </tr>
              <tr v-else-if="paginatedCollaborators.length === 0" class="text-center">
                <td colspan="6" class="p-8 text-muted-foreground">
                  {{ $t('noDataAvailable') }}
                </td>
              </tr>
              <tr
                v-for="collab in paginatedCollaborators"
                v-else
                :key="collab._id"
                class="cursor-pointer border-b hover:bg-muted/50"
                @dblclick="editCollaborator(collab)"
              >
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    {{ collab.username }}
                    <Badge v-if="!collab.enabled" variant="secondary" class="text-xs">
                      {{ $t('disabled') }}
                    </Badge>
                  </div>
                </td>
                <td class="p-4">
                  {{ collab.firstname }}
                </td>
                <td class="p-4">
                  {{ collab.lastname }}
                </td>
                <td class="p-4">
                  {{ collab.email || '-' }}
                </td>
                <td class="p-4">
                  <Badge variant="outline">
                    {{ collab.role }}
                  </Badge>
                </td>
                <td class="p-4">
                  <div class="flex gap-2">
                    <Button
                      v-if="UserService.isAllowed('users:update')"
                      size="sm"
                      variant="ghost"
                      @click="editCollaborator(collab)"
                    >
                      <PencilIcon class="size-4" />
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
            <span v-if="filteredCollaborators.length === 1">
              1 {{ $t('quantifier') }}{{ $t('collaborator') }}
            </span>
            <span v-else>
              {{ filteredCollaborators.length }} {{ $t('quantifier') }}{{ $t('collaborators') }}
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

    <!-- Create Collaborator Modal -->
    <Dialog :open="showCreateModal" @update:open="showCreateModal = $event">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ $t('addCollaborator') }}</DialogTitle>
        </DialogHeader>

        <form class="space-y-4" @submit.prevent="createCollaborator">
          <div class="space-y-2">
            <Label for="create-username">{{ $t('username') }} *</Label>
            <Input
              id="create-username"
              v-model="currentCollab.username"
              :error="!!errors.username"
              required
              autofocus
              @keyup.enter="createCollaborator"
            />
            <p v-if="errors.username" class="text-sm text-destructive">
              {{ errors.username }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="create-firstname">{{ $t('firstname') }} *</Label>
            <Input
              id="create-firstname"
              v-model="currentCollab.firstname"
              :error="!!errors.firstname"
              required
              @keyup.enter="createCollaborator"
            />
            <p v-if="errors.firstname" class="text-sm text-destructive">
              {{ errors.firstname }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="create-lastname">{{ $t('lastname') }} *</Label>
            <Input
              id="create-lastname"
              v-model="currentCollab.lastname"
              :error="!!errors.lastname"
              required
              @keyup.enter="createCollaborator"
            />
            <p v-if="errors.lastname" class="text-sm text-destructive">
              {{ errors.lastname }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="create-email">{{ $t('email') }}</Label>
            <Input
              id="create-email"
              v-model="currentCollab.email"
              type="email"
              @keyup.enter="createCollaborator"
            />
          </div>

          <div class="space-y-2">
            <Label for="create-phone">{{ $t('phone') }}</Label>
            <Input
              id="create-phone"
              v-model="currentCollab.phone"
              @keyup.enter="createCollaborator"
            />
          </div>

          <div class="space-y-2">
            <Label for="create-role">{{ $t('role') }} *</Label>
            <Select v-model="currentCollab.role" required>
              <SelectTrigger id="create-role">
                <SelectValue :placeholder="$t('selectRole')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="role in roles"
                  :key="role"
                  :value="role"
                >
                  {{ role }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="create-password">{{ $t('password') }} *</Label>
            <Input
              id="create-password"
              v-model="currentCollab.password"
              :error="!!errors.password"
              type="password"
              required
              @keyup.enter="createCollaborator"
            />
            <p v-if="errors.password" class="text-sm text-destructive">
              {{ errors.password }}
            </p>
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
            :disabled="creatingCollaborator"
            class="bg-secondary hover:bg-secondary/90"
            @click="createCollaborator"
          >
            <LoadingSpinner v-if="creatingCollaborator" class="mr-2 size-4" />
            {{ $t('btn.create') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Collaborator Modal -->
    <Dialog :open="showEditModal" @update:open="showEditModal = $event">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ $t('editCollaborator') }}</DialogTitle>
        </DialogHeader>

        <form class="space-y-4" @submit.prevent="updateCollaborator">
          <div class="space-y-2">
            <Label for="edit-username">{{ $t('username') }} *</Label>
            <Input
              id="edit-username"
              v-model="currentCollab.username"
              :error="!!errors.username"
              required
              @keyup.enter="updateCollaborator"
            />
            <p v-if="errors.username" class="text-sm text-destructive">
              {{ errors.username }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="edit-firstname">{{ $t('firstname') }} *</Label>
            <Input
              id="edit-firstname"
              v-model="currentCollab.firstname"
              :error="!!errors.firstname"
              required
              @keyup.enter="updateCollaborator"
            />
            <p v-if="errors.firstname" class="text-sm text-destructive">
              {{ errors.firstname }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="edit-lastname">{{ $t('lastname') }} *</Label>
            <Input
              id="edit-lastname"
              v-model="currentCollab.lastname"
              :error="!!errors.lastname"
              required
              @keyup.enter="updateCollaborator"
            />
            <p v-if="errors.lastname" class="text-sm text-destructive">
              {{ errors.lastname }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="edit-email">{{ $t('email') }}</Label>
            <Input
              id="edit-email"
              v-model="currentCollab.email"
              type="email"
              @keyup.enter="updateCollaborator"
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-phone">{{ $t('phone') }}</Label>
            <Input
              id="edit-phone"
              v-model="currentCollab.phone"
              @keyup.enter="updateCollaborator"
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-role">{{ $t('role') }} *</Label>
            <Select v-model="currentCollab.role" required>
              <SelectTrigger id="edit-role">
                <SelectValue :placeholder="$t('selectRole')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="role in roles"
                  :key="role"
                  :value="role"
                >
                  {{ role }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="edit-password">{{ $t('password') }}</Label>
            <Input
              id="edit-password"
              v-model="currentCollab.password"
              :error="!!errors.password"
              type="password"
              @keyup.enter="updateCollaborator"
            />
            <p v-if="errors.password" class="text-sm text-destructive">
              {{ errors.password }}
            </p>
          </div>

          <div class="space-y-4">
            <div class="rounded-lg bg-muted p-4">
              <p class="text-sm">
                <strong>2FA Status:</strong>
                <span v-if="currentCollab.totpEnabled" class="text-green-600">{{ $t('enabled') }}</span>
                <span v-else class="text-muted-foreground">{{ $t('disabled') }}</span>
              </p>
            </div>

            <div class="flex items-center gap-2">
              <Switch
                id="edit-enabled"
                v-model="currentCollab.enabled"
              />
              <Label for="edit-enabled">
                {{ currentCollab.enabled ? $t('btn.accountEnabled') : $t('btn.accountDisabled') }}
              </Label>
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
            :disabled="updatingCollaborator"
            class="bg-secondary hover:bg-secondary/90"
            @click="updateCollaborator"
          >
            <LoadingSpinner v-if="updatingCollaborator" class="mr-2 size-4" />
            {{ $t('btn.update') }}
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
} from '@heroicons/vue/24/outline'

import CollabService from '@/services/collaborator'
import UserService from '@/services/user'
import DataService from '@/services/data'
import Utils from '@/services/utils'

export default {
  name: 'CollaboratorsPage',
  components: {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
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
    Switch,
    Badge,
    LoadingSpinner,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    PencilIcon,
  },
  setup() {
    const toast = useToast()

    // Service
    const { isAllowed } = UserService

    // Reactive data
    const collaborators = ref([])
    const roles = ref([])
    const loading = ref(true)
    const creatingCollaborator = ref(false)
    const updatingCollaborator = ref(false)

    // Modal state
    const showCreateModal = ref(false)
    const showEditModal = ref(false)

    // Search filters
    const search = ref({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      role: '',
      enabled: true,
    })

    // Pagination
    const pagination = ref({
      page: 1,
      rowsPerPage: 25,
      sortBy: 'username',
      descending: false,
    })

    // Current collaborator for forms
    const currentCollab = ref({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      enabled: true,
      totpEnabled: false,
    })

    // Form errors
    const errors = ref({
      username: '',
      firstname: '',
      lastname: '',
      password: '',
    })

    // ID for updating
    const idUpdate = ref('')

    // Computed properties
    const filteredCollaborators = computed(() => {
      return Utils.customFilter(collaborators.value, search.value)
    })

    const sortedCollaborators = computed(() => {
      const sorted = [...filteredCollaborators.value].sort((a, b) => {
        let aVal, bVal

        switch (pagination.value.sortBy) {
        case 'username':
          aVal = a.username || ''
          bVal = b.username || ''
          break
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
        case 'role':
          aVal = a.role || ''
          bVal = b.role || ''
          break
        default:
          aVal = a.username || ''
          bVal = b.username || ''
        }

        const result = aVal.localeCompare(bVal)
        return pagination.value.descending ? -result : result
      })

      return sorted
    })

    const paginatedCollaborators = computed(() => {
      const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
      const end = pagination.value.rowsPerPage === 0 ?
        sortedCollaborators.value.length :
        start + pagination.value.rowsPerPage

      return sortedCollaborators.value.slice(start, end)
    })

    const totalPages = computed(() => {
      if (pagination.value.rowsPerPage === 0) return 1
      return Math.ceil(filteredCollaborators.value.length / pagination.value.rowsPerPage)
    })

    // Methods
    const getCollaborators = async () => {
      loading.value = true
      try {
        const response = await CollabService.getCollabs()
        collaborators.value = response.data.datas
      } catch (error) {
        console.error('Error fetching collaborators:', error)
        toast.error($t('msg.errorFetchingCollaborators'))
      } finally {
        loading.value = false
      }
    }

    const getRoles = async () => {
      try {
        const response = await DataService.getRoles()
        roles.value = response.data.datas
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    const openCreateModal = () => {
      cleanCurrentCollab()
      cleanErrors()
      showCreateModal.value = true
    }

    const createCollaborator = async () => {
      cleanErrors()

      if (!currentCollab.value.username) {
        errors.value.username = $t('msg.usernameRequired')
      }
      if (!currentCollab.value.firstname) {
        errors.value.firstname = $t('msg.firstnameRequired')
      }
      if (!currentCollab.value.lastname) {
        errors.value.lastname = $t('msg.lastnameRequired')
      }
      if (!Utils.strongPassword(currentCollab.value.password)) {
        errors.value.password = $t('msg.passwordComplexity')
      }

      if (errors.value.username || errors.value.firstname || errors.value.lastname || errors.value.password) {
        return
      }

      creatingCollaborator.value = true
      try {
        await CollabService.createCollab([currentCollab.value])
        await getCollaborators()
        showCreateModal.value = false
        toast.success($t('msg.collaboratorCreatedOk'))
      } catch (error) {
        console.error('Error creating collaborator:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorCreatingCollaborator'))
      } finally {
        creatingCollaborator.value = false
      }
    }

    const editCollaborator = (collab) => {
      if (!UserService.isAllowed('users:update')) return

      currentCollab.value = { ...collab }
      idUpdate.value = collab._id
      cleanErrors()
      showEditModal.value = true
    }

    const updateCollaborator = async () => {
      cleanErrors()

      if (!currentCollab.value.username) {
        errors.value.username = $t('msg.usernameRequired')
      }
      if (!currentCollab.value.firstname) {
        errors.value.firstname = $t('msg.firstnameRequired')
      }
      if (!currentCollab.value.lastname) {
        errors.value.lastname = $t('msg.lastnameRequired')
      }
      if (currentCollab.value.password && !Utils.strongPassword(currentCollab.value.password)) {
        errors.value.password = $t('msg.passwordComplexity')
      }

      if (errors.value.username || errors.value.firstname || errors.value.lastname || errors.value.password) {
        return
      }

      updatingCollaborator.value = true
      try {
        await CollabService.updateCollab(idUpdate.value, currentCollab.value)
        await getCollaborators()
        showEditModal.value = false
        toast.success($t('msg.collaboratorUpdatedOk'))
      } catch (error) {
        console.error('Error updating collaborator:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorUpdatingCollaborator'))
      } finally {
        updatingCollaborator.value = false
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

    const cleanCurrentCollab = () => {
      currentCollab.value = {
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        role: 'user',
        password: '',
        enabled: true,
        totpEnabled: false,
      }
    }

    const cleanErrors = () => {
      errors.value = {
        username: '',
        firstname: '',
        lastname: '',
        password: '',
      }
    }

    // Lifecycle
    onMounted(() => {
      getCollaborators()
      getRoles()
    })

    return {
      // Services
      UserService: { isAllowed },

      // Data
      collaborators,
      roles,
      loading,
      creatingCollaborator,
      updatingCollaborator,

      // Modal state
      showCreateModal,
      showEditModal,

      // Search and pagination
      search,
      pagination,

      // Form data
      currentCollab,
      errors,
      idUpdate,

      // Computed
      filteredCollaborators,
      paginatedCollaborators,
      totalPages,

      // Methods
      getCollaborators,
      getRoles,
      openCreateModal,
      createCollaborator,
      editCollaborator,
      updateCollaborator,
      sortBy,
      cleanCurrentCollab,
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
