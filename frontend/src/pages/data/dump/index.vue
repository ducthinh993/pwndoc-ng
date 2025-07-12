<template>
  <div class="flex flex-col gap-6 p-6">
    <h1 class="text-2xl font-bold">
      {{ $t('dataImportExport') }}
    </h1>

    <Tabs v-model="selectedTab" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="vulnerabilities">
          {{ $t('nav.vulnerabilities') }}
        </TabsTrigger>
        <TabsTrigger value="companies">
          {{ $t('companies') }}
        </TabsTrigger>
        <TabsTrigger value="collaborators">
          {{ $t('collaborators') }}
        </TabsTrigger>
      </TabsList>

      <!-- Vulnerabilities Tab -->
      <TabsContent value="vulnerabilities">
        <Card>
          <CardHeader>
            <CardTitle>{{ $t('nav.vulnerabilities') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Import Vulnerabilities -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">
                  {{ $t('importVulnerabilities') }}
                </h3>
                <div class="text-sm text-muted-foreground" v-html="$t('importVulnerabilitiesInfo')" />
                <div>
                  <input
                    ref="importVulnerabilities"
                    type="file"
                    multiple
                    accept=".yml, .json"
                    class="hidden"
                    @change="importVulnerabilities($event.target.files)"
                  >
                  <Button
                    class="bg-secondary hover:bg-secondary/90"
                    @click="$refs.importVulnerabilities.click()"
                  >
                    <DocumentArrowUpIcon class="mr-2 size-4" />
                    {{ $t('import') }}
                  </Button>
                </div>
              </div>

              <!-- Export Vulnerabilities -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">
                  {{ $t('exportVulnerabilities') }}
                </h3>
                <div class="text-sm text-muted-foreground" v-html="$t('exportVulnerabilitiesInfo')" />
                <div>
                  <Button
                    class="bg-secondary hover:bg-secondary/90"
                    :disabled="exportingVulnerabilities"
                    @click="getVulnerabilities"
                  >
                    <LoadingSpinner v-if="exportingVulnerabilities" class="mr-2 size-4" />
                    <DocumentArrowDownIcon v-else class="mr-2 size-4" />
                    {{ $t('export') }}
                  </Button>
                </div>
              </div>
            </div>

            <Separator class="my-6" />

            <!-- Delete All Vulnerabilities -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-destructive">
                {{ $t('deleteAllVulnerabilities') }}
              </h3>
              <div class="text-sm text-muted-foreground" v-html="$t('deleteAllVulnerabilitiesInfo')" />
              <div>
                <Button
                  variant="destructive"
                  :disabled="deletingVulnerabilities"
                  @click="deleteAllVulnerabilities"
                >
                  <LoadingSpinner v-if="deletingVulnerabilities" class="mr-2 size-4" />
                  <TrashIcon v-else class="mr-2 size-4" />
                  {{ $t('btn.deleteAll') }}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Companies Tab -->
      <TabsContent value="companies">
        <div class="space-y-6">
          <!-- Companies -->
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('companies') }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <!-- Import Companies -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold">
                    {{ $t('importCompanies') }}
                  </h3>
                  <div class="text-sm text-muted-foreground" v-html="$t('importCompaniesInfo')" />
                  <div>
                    <input
                      ref="importCompanies"
                      type="file"
                      multiple
                      accept=".yml, .json"
                      class="hidden"
                      @change="importCompanies($event.target.files)"
                    >
                    <Button
                      class="bg-secondary hover:bg-secondary/90"
                      @click="$refs.importCompanies.click()"
                    >
                      <DocumentArrowUpIcon class="mr-2 size-4" />
                      {{ $t('import') }}
                    </Button>
                  </div>
                </div>

                <!-- Export Companies -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold">
                    {{ $t('exportCompanies') }}
                  </h3>
                  <div class="text-sm text-muted-foreground" v-html="$t('exportCompaniesInfo')" />
                  <div>
                    <Button
                      class="bg-secondary hover:bg-secondary/90"
                      :disabled="exportingCompanies"
                      @click="getCompanies"
                    >
                      <LoadingSpinner v-if="exportingCompanies" class="mr-2 size-4" />
                      <DocumentArrowDownIcon v-else class="mr-2 size-4" />
                      {{ $t('export') }}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator class="my-6" />

              <!-- Delete All Companies -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-destructive">
                  {{ $t('deleteAllCompanies') }}
                </h3>
                <div class="text-sm text-muted-foreground" v-html="$t('deleteAllCompaniesInfo')" />
                <div>
                  <Button
                    variant="destructive"
                    :disabled="deletingCompanies"
                    @click="deleteAllCompanies"
                  >
                    <LoadingSpinner v-if="deletingCompanies" class="mr-2 size-4" />
                    <TrashIcon v-else class="mr-2 size-4" />
                    {{ $t('btn.deleteAll') }}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Clients -->
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('clients') }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <!-- Import Clients -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold">
                    {{ $t('importClients') }}
                  </h3>
                  <div class="text-sm text-muted-foreground" v-html="$t('importClientsInfo')" />
                  <div>
                    <input
                      ref="importClients"
                      type="file"
                      multiple
                      accept=".yml, .json"
                      class="hidden"
                      @change="importClients($event.target.files)"
                    >
                    <Button
                      class="bg-secondary hover:bg-secondary/90"
                      @click="$refs.importClients.click()"
                    >
                      <DocumentArrowUpIcon class="mr-2 size-4" />
                      {{ $t('import') }}
                    </Button>
                  </div>
                </div>

                <!-- Export Clients -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold">
                    {{ $t('exportClients') }}
                  </h3>
                  <div class="text-sm text-muted-foreground" v-html="$t('exportClientsInfo')" />
                  <div>
                    <Button
                      class="bg-secondary hover:bg-secondary/90"
                      :disabled="exportingClients"
                      @click="getClients"
                    >
                      <LoadingSpinner v-if="exportingClients" class="mr-2 size-4" />
                      <DocumentArrowDownIcon v-else class="mr-2 size-4" />
                      {{ $t('export') }}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator class="my-6" />

              <!-- Delete All Clients -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-destructive">
                  {{ $t('deleteAllClients') }}
                </h3>
                <div class="text-sm text-muted-foreground" v-html="$t('deleteAllClientsInfo')" />
                <div>
                  <Button
                    variant="destructive"
                    :disabled="deletingClients"
                    @click="deleteAllClients"
                  >
                    <LoadingSpinner v-if="deletingClients" class="mr-2 size-4" />
                    <TrashIcon v-else class="mr-2 size-4" />
                    {{ $t('btn.deleteAll') }}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- Collaborators Tab -->
      <TabsContent value="collaborators">
        <Card>
          <CardHeader>
            <CardTitle>{{ $t('collaborators') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Import Collaborators -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">
                  {{ $t('importCollaborators') }}
                </h3>
                <div class="text-sm text-muted-foreground" v-html="$t('importCollaboratorsInfo')" />
                <div>
                  <input
                    ref="importCollaborators"
                    type="file"
                    multiple
                    accept=".yml, .json"
                    class="hidden"
                    @change="importCollaborators($event.target.files)"
                  >
                  <Button
                    class="bg-secondary hover:bg-secondary/90"
                    @click="$refs.importCollaborators.click()"
                  >
                    <DocumentArrowUpIcon class="mr-2 size-4" />
                    {{ $t('import') }}
                  </Button>
                </div>
              </div>

              <!-- Export Collaborators -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">
                  {{ $t('exportCollaborators') }}
                </h3>
                <div class="text-sm text-muted-foreground" v-html="$t('exportCollaboratorsInfo')" />
                <div>
                  <Button
                    class="bg-secondary hover:bg-secondary/90"
                    :disabled="exportingCollaborators"
                    @click="getCollaborators"
                  >
                    <LoadingSpinner v-if="exportingCollaborators" class="mr-2 size-4" />
                    <DocumentArrowDownIcon v-else class="mr-2 size-4" />
                    {{ $t('export') }}
                  </Button>
                </div>
              </div>
            </div>

            <Separator class="my-6" />

            <!-- Delete All Collaborators -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-destructive">
                {{ $t('deleteAllCollaborators') }}
              </h3>
              <div class="text-sm text-muted-foreground" v-html="$t('deleteAllCollaboratorsInfo')" />
              <div>
                <Button
                  variant="destructive"
                  :disabled="deletingCollaborators"
                  @click="deleteAllCollaborators"
                >
                  <LoadingSpinner v-if="deletingCollaborators" class="mr-2 size-4" />
                  <TrashIcon v-else class="mr-2 size-4" />
                  {{ $t('btn.deleteAll') }}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading'
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'

import VulnerabilityService from '@/services/vulnerability'
import CompanyService from '@/services/company'
import ClientService from '@/services/client'
import CollabService from '@/services/collaborator'
import YAML from 'js-yaml'

export default {
  name: 'DumpPage',
  components: {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Separator,
    LoadingSpinner,
    DocumentArrowUpIcon,
    DocumentArrowDownIcon,
    TrashIcon,
  },
  setup() {
    const toast = useToast()

    // Reactive data
    const selectedTab = ref('vulnerabilities')
    const vulnerabilities = ref([])

    // Loading states
    const exportingVulnerabilities = ref(false)
    const exportingCompanies = ref(false)
    const exportingClients = ref(false)
    const exportingCollaborators = ref(false)
    const deletingVulnerabilities = ref(false)
    const deletingCompanies = ref(false)
    const deletingClients = ref(false)
    const deletingCollaborators = ref(false)

    // Methods
    const getVulnerabilities = async () => {
      exportingVulnerabilities.value = true
      try {
        const response = await VulnerabilityService.exportVulnerabilities()
        vulnerabilities.value = response.data.datas
        downloadVulnerabilities()
        toast.success($t('msg.vulnerabilitiesExported'))
      } catch (error) {
        console.error('Error exporting vulnerabilities:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorExportingVulnerabilities'))
      } finally {
        exportingVulnerabilities.value = false
      }
    }

    const downloadVulnerabilities = () => {
      const yamlContent = YAML.dump(vulnerabilities.value)
      const blob = new Blob([yamlContent], { type: 'application/x-yaml' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'vulnerabilities.yml'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }

    const importVulnerabilities = async (files) => {
      if (!files || files.length === 0) return

      vulnerabilities.value = []
      let pending = 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileReader = new FileReader()

        fileReader.onloadend = async (e) => {
          try {
            let vulnFile
            const ext = file.name.split('.').pop()

            if (ext === 'yml' || ext === 'yaml') {
              vulnFile = YAML.load(fileReader.result)
            } else if (ext === 'json') {
              vulnFile = JSON.parse(fileReader.result)
            } else {
              throw new Error($t('err.unsupportedFileType'))
            }

            if (typeof vulnFile === 'object') {
              if (Array.isArray(vulnFile)) {
                // Handle special Serpico format
                if (vulnFile.length > 0 && vulnFile[0].id) {
                  vulnFile = parseSerpico(vulnFile)
                }

                // Handle references migration
                vulnFile.forEach(vuln => {
                  if (Array.isArray(vuln.references) && vuln.references.length > 0) {
                    vuln.details.forEach(d => {
                      if (!Array.isArray(d.references) || d.references.length === 0) {
                        d.references = vuln.references
                      }
                    })
                  }
                })

                vulnerabilities.value.push(...vulnFile)
              } else {
                vulnerabilities.value.push(vulnFile)
              }
            } else {
              throw new Error($t('err.invalidFileFormat'))
            }
          } catch (error) {
            console.error('Error parsing file:', error)
            let errorMessage = error.message

            if (error.mark) {
              errorMessage = $t('err.parsingError2', [error.mark.line, error.mark.column])
            } else if (error.message) {
              errorMessage = $t('err.parsingError1', [error.message])
            }

            toast.error(errorMessage)
            return
          }

          pending--
          if (pending === 0) {
            await createVulnerabilities()
          }
        }

        pending++
        fileReader.readAsText(file)
      }
    }

    const createVulnerabilities = async () => {
      try {
        const response = await VulnerabilityService.createVulnerabilities(vulnerabilities.value)
        const { created, duplicates } = response.data.datas

        let message = ''
        let type = 'success'

        if (duplicates === 0) {
          message = $t('importVulnerabilitiesOk', [created])
        } else if (created === 0 && duplicates > 0) {
          message = $t('importVulnerabilitiesAllExists', [duplicates.length])
          type = 'error'
        } else {
          message = $t('importVulnerabilitiesPartial', [created, duplicates.length])
          type = 'warning'
        }

        if (type === 'success') {
          toast.success(message)
        } else if (type === 'error') {
          toast.error(message)
        } else {
          toast.warning(message)
        }
      } catch (error) {
        console.error('Error creating vulnerabilities:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorImportingVulnerabilities'))
      }
    }

    const parseSerpico = (vulnerabilities) => {
      return vulnerabilities.map(vuln => {
        const details = {
          locale: formatSerpicoText(vuln.language) || 'en',
          title: formatSerpicoText(vuln.title),
          vulnType: formatSerpicoText(vuln.type),
          description: formatSerpicoText(vuln.overview),
          observation: formatSerpicoText(vuln.poc),
          remediation: formatSerpicoText(vuln.remediation),
          references: [],
        }

        if (vuln.references && vuln.references !== '') {
          const refs = vuln.references.replace(/<paragraph>/g, '')
          details.references = refs.split('</paragraph>').filter(Boolean)
        }

        return {
          cvssv3: vuln.c3_vs || null,
          priority: null,
          remediationComplexity: null,
          details: [details],
        }
      })
    }

    const formatSerpicoText = (str) => {
      if (!str) return null
      if (str === 'English') return 'en'
      if (str === 'French') return 'fr'
      return str
    }

    const getCompanies = async () => {
      exportingCompanies.value = true
      try {
        const response = await CompanyService.exportCompanies()
        const companies = response.data.datas
        const jsonContent = JSON.stringify(companies, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'companies.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        toast.success($t('msg.companiesExported'))
      } catch (error) {
        console.error('Error exporting companies:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorExportingCompanies'))
      } finally {
        exportingCompanies.value = false
      }
    }

    const importCompanies = async (files) => {
      if (!files || files.length === 0) return

      // Implementation similar to importVulnerabilities
      // This would need to be implemented based on the actual service
      toast.info($t('msg.importingCompanies'))
    }

    const getClients = async () => {
      exportingClients.value = true
      try {
        const response = await ClientService.exportClients()
        const clients = response.data.datas
        const jsonContent = JSON.stringify(clients, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'clients.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        toast.success($t('msg.clientsExported'))
      } catch (error) {
        console.error('Error exporting clients:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorExportingClients'))
      } finally {
        exportingClients.value = false
      }
    }

    const importClients = async (files) => {
      if (!files || files.length === 0) return
      toast.info($t('msg.importingClients'))
    }

    const getCollaborators = async () => {
      exportingCollaborators.value = true
      try {
        const response = await CollabService.exportCollaborators()
        const collaborators = response.data.datas
        const jsonContent = JSON.stringify(collaborators, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'collaborators.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        toast.success($t('msg.collaboratorsExported'))
      } catch (error) {
        console.error('Error exporting collaborators:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorExportingCollaborators'))
      } finally {
        exportingCollaborators.value = false
      }
    }

    const importCollaborators = async (files) => {
      if (!files || files.length === 0) return
      toast.info($t('msg.importingCollaborators'))
    }

    const deleteAllVulnerabilities = async () => {
      deletingVulnerabilities.value = true
      try {
        await VulnerabilityService.deleteAllVulnerabilities()
        toast.success($t('msg.allVulnerabilitiesDeleted'))
      } catch (error) {
        console.error('Error deleting vulnerabilities:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorDeletingVulnerabilities'))
      } finally {
        deletingVulnerabilities.value = false
      }
    }

    const deleteAllCompanies = async () => {
      deletingCompanies.value = true
      try {
        await CompanyService.deleteAllCompanies()
        toast.success($t('msg.allCompaniesDeleted'))
      } catch (error) {
        console.error('Error deleting companies:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorDeletingCompanies'))
      } finally {
        deletingCompanies.value = false
      }
    }

    const deleteAllClients = async () => {
      deletingClients.value = true
      try {
        await ClientService.deleteAllClients()
        toast.success($t('msg.allClientsDeleted'))
      } catch (error) {
        console.error('Error deleting clients:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorDeletingClients'))
      } finally {
        deletingClients.value = false
      }
    }

    const deleteAllCollaborators = async () => {
      deletingCollaborators.value = true
      try {
        await CollabService.deleteAllCollaborators()
        toast.success($t('msg.allCollaboratorsDeleted'))
      } catch (error) {
        console.error('Error deleting collaborators:', error)
        toast.error(error.response?.data?.datas || $t('msg.errorDeletingCollaborators'))
      } finally {
        deletingCollaborators.value = false
      }
    }

    return {
      // Data
      selectedTab,
      vulnerabilities,

      // Loading states
      exportingVulnerabilities,
      exportingCompanies,
      exportingClients,
      exportingCollaborators,
      deletingVulnerabilities,
      deletingCompanies,
      deletingClients,
      deletingCollaborators,

      // Methods
      getVulnerabilities,
      importVulnerabilities,
      getCompanies,
      importCompanies,
      getClients,
      importClients,
      getCollaborators,
      importCollaborators,
      deleteAllVulnerabilities,
      deleteAllCompanies,
      deleteAllClients,
      deleteAllCollaborators,
    }
  },
}
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
