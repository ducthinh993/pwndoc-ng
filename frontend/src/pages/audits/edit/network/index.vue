<template>
  <div>
    <Breadcrumb
      buttons
      :title="audit?.name ? `${audit.name} (${audit.auditType || $t('msg.auditTypeNotSet')})` : 'Loading...'"
      :state="parentState"
      :approvals="parentApprovals"
    >
      <template #buttons>
        <div class="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" class="mr-2">
                {{ $t('import') }}
                <ChevronDownIcon class="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem @click="$refs.nmapFile.click()">
                Nmap
                <input
                  ref="nmapFile"
                  type="file"
                  accept=".xml"
                  class="hidden"
                  @change="importNetworkScan($event.target.files, 'nmap')"
                >
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="$refs.nessusFile.click()">
                Nessus
                <input
                  ref="nessusFile"
                  type="file"
                  accept=".nessus"
                  class="hidden"
                  @change="importNetworkScan($event.target.files, 'nessus')"
                >
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="default"
            @click="updateAuditNetwork"
          >
            {{ $t('btn.save') + ' (ctrl+s)' }}
          </Button>
        </div>
      </template>
    </Breadcrumb>

    <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{{ $t('hostsAssociateScopes') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-for="scope of audit.scope" :key="scope.name" class="mb-6">
              <h3 class="mb-3 text-lg font-semibold">
                {{ scope.name }}
              </h3>
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <Select
                    v-model="selectedTargets[scope.name]"
                    multiple
                    class="flex-1"
                  >
                    <SelectTrigger>
                      <SelectValue :placeholder="selectHostsLabel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="option in targetsOptions"
                        :key="option.value"
                        :value="option"
                      >
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    @click="updateScopeHosts(scope)"
                  >
                    <PlusIcon class="size-4" />
                  </Button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <Badge
                    v-for="(host, index) in scope.hosts"
                    :key="host.ip"
                    variant="secondary"
                    class="cursor-pointer"
                    @click="currentHost = $_.cloneDeep(host)"
                  >
                    {{ host.ip }}
                    <Button
                      variant="ghost"
                      size="icon"
                      class="ml-2 size-4 p-0"
                      @click.stop="scope.hosts.splice(index, 1)"
                    >
                      <XIcon class="size-3" />
                    </Button>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div v-if="currentHost !== null">
        <Card>
          <CardHeader>
            <CardTitle>{{ `${currentHost.ip} (${currentHost.hostname})` }}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Port</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="service in currentHost.services"
                  :key="service.port"
                >
                  <TableCell>{{ service.port }}</TableCell>
                  <TableCell>{{ service.protocol }}</TableCell>
                  <TableCell>{{ service.name }}</TableCell>
                  <TableCell>{{ service.version }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import { useToast } from '@/components/ui/toast'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronDownIcon, PlusIcon, XIcon } from 'lucide-vue-next'

import Breadcrumb from '@/components/breadcrumb.vue'
import AuditService from '@/services/audit'
import Utils from '@/services/utils'
import DataService from '@/services/data'
import { $t } from '@/boot/i18n'

export default {
  name: 'AuditNetworkEdit',
  components: {
    Breadcrumb,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Badge,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    ChevronDownIcon,
    PlusIcon,
    XIcon,
  },
  beforeRouteLeave(to, from, next) {
    if (this.$_.isEqual(this.audit, this.auditOrig)) {
      next()
    } else {
      // TODO: Replace with Vue Shadcn Dialog
      if (confirm(`${this.$t('msg.thereAreUnsavedChanges')  }\n${  this.$t('msg.doYouWantToLeave')}`)) {
        next()
      }
    }
  },
  props: {
    frontEndAuditState: {
      type: Number,
      required: true,
    },
    parentState: {
      type: String,
      required: true,
    },
    parentApprovals: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      auditId: null,
      audit: {
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
        approvals: [],
      },
      auditOrig: {},
      targetsOptions: [],
      selectedTargets: [],
      currentHost: null,
      AUDIT_VIEW_STATE: Utils.AUDIT_VIEW_STATE,
    }
  },
  computed: {
    selectHostsLabel() {
      if (this.targetsOptions && this.targetsOptions.length > 0) {
        return this.$t('msg.selectHost')
      } else {
        return this.$t('msg.importHostsFirst')
      }
    },
  },
  mounted() {
    this.auditId = this.$route.params.auditId
    this.getAuditNetwork()
    this.getAuditGeneral()
    this.$socket.emit('menu', { menu: 'network', room: this.auditId })

    document.addEventListener('keydown', this._listener, false)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this._listener, false)
  },
  methods: {
    _listener(e) {
      if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
        e.preventDefault()
        if (this.frontEndAuditState === this.AUDIT_VIEW_STATE.EDIT) {
          this.updateAuditNetwork()
        }
      }
    },

    getAuditNetwork() {
      AuditService.getAuditNetwork(this.auditId)
        .then((data) => {
          this.audit = data.data.datas
          this.auditOrig = this.$_.cloneDeep(this.audit)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getAuditGeneral() {
      DataService.getCustomFields()
        .then((data) => {
          this.audit = data.data.datas
        })
        .catch((err) => {
          console.log(err.response)
        })
    },

    updateAuditNetwork() {
      const { toast } = useToast()

      AuditService.updateAuditNetwork(this.auditId, this.audit)
        .then(() => {
          this.auditOrig = this.$_.cloneDeep(this.audit)
          toast({
            title: this.$t('msg.auditUpdateOk'),
            variant: 'default',
          })
        })
        .catch((err) => {
          toast({
            title: err.response.data.datas,
            variant: 'destructive',
          })
        })
    },

    importNetworkScan(files, type) {
      const file = files[0]
      const fileReader = new FileReader()

      fileReader.onloadend = () => {
        if (type === 'nmap') {
          this.parseXmlNmap(fileReader.result)
        } else if (type === 'nessus') {
          this.parseXmlNessus(fileReader.result)
        }
      }

      fileReader.readAsText(file)
    },

    updateScopeHosts(scope) {
      if (!this.selectedTargets[scope.name]) {
        console.error(`Scope "${scope.name}" not found in selectedTargets.`)
        return
      }
      for (let i = 0; i < this.selectedTargets[scope.name].length; i++) {
        scope.hosts.push(this.selectedTargets[scope.name][i].host)
      }
    },

    getXmlElementByAttribute(elmts, attr, val) {
      for (let i = 0; i < elmts.length; i++) {
        if (elmts[i].getAttribute(attr) === val) {
          return elmts[i]
        }
      }
      return null
    },

    parseXmlNmap(data) {
      const { toast } = useToast()
      console.log('Starting Nmap parser')

      const parser = new DOMParser()
      const xmlData = parser.parseFromString(data, 'application/xml')

      try {
        const hosts = xmlData.getElementsByTagName('host')
        if (hosts.length === 0) throw new Error('Parsing Error: No host element')

        const hostsRes = []
        for (let i = 0; i < hosts.length; i++) {
          if (hosts[i].getElementsByTagName('status')[0].getAttribute('state') === 'up') {
            const host = {}
            const addrElmt = hosts[i].getElementsByTagName('address')[0]
            if (typeof addrElmt === 'undefined') {
              throw new Error(`Parsing Error: No address element in host number ${  i}`)
            }
            host.ip = addrElmt.getAttribute('addr')

            const osElmt = hosts[i].getElementsByTagName('os')[0]
            if (typeof osElmt !== 'undefined') {
              const osClassElmt = osElmt.getElementsByTagName('osclass')[0]
              if (typeof osClassElmt === 'undefined') {
                host.os = ''
              } else {
                host.os = osClassElmt.getAttribute('osfamily')
              }
            }

            const hostnamesElmt = hosts[i].getElementsByTagName('hostnames')[0]
            if (typeof hostnamesElmt === 'undefined') {
              host.hostname = 'Unknown'
            } else {
              const dnElmt = this.getXmlElementByAttribute(hostnamesElmt.getElementsByTagName('hostname'), 'type', 'PTR')
              host.hostname = dnElmt ? dnElmt.getAttribute('name') : 'Unknown'
            }

            const portsElmt = hosts[i].getElementsByTagName('ports')[0]
            if (typeof portsElmt === 'undefined') {
              throw new Error(`Parsing Error: No ports element in host number ${  i}`)
            }

            const ports = portsElmt.getElementsByTagName('port')
            host.services = []
            for (let j = 0; j < ports.length; j++) {
              const service = {}
              service.protocol = ports[j].getAttribute('protocol')
              service.port = ports[j].getAttribute('portid')
              service.state = ports[j].getElementsByTagName('state')[0].getAttribute('state')

              const serviceDetails = ports[j].getElementsByTagName('service')[0]
              if (typeof serviceDetails === 'undefined') {
                service.product = 'Unknown'
                service.name = 'Unknown'
                service.version = 'Unknown'
              } else {
                service.product = serviceDetails.getAttribute('product') || 'Unknown'
                service.name = serviceDetails.getAttribute('name') || 'Unknown'
                service.version = serviceDetails.getAttribute('version') || 'Unknown'
              }

              if (service.state === 'open') {
                host.services.push(service)
              }
            }

            hostsRes.push({ label: host.ip, value: host.ip, host })
          }
        }

        this.targetsOptions = hostsRes
        toast({
          title: `Successfully imported ${hostsRes.length} hosts`,
          variant: 'default',
        })
      } catch (err) {
        console.log(err)
        toast({
          title: 'Error parsing Nmap',
          variant: 'destructive',
        })
      }
    },

    parseXmlNessus(data) {
      const { toast } = useToast()
      console.log('Starting Nessus parser')

      const parser = new DOMParser()
      const hostsRes = []
      const xmlData = parser.parseFromString(data, 'application/xml')

      try {
        const hosts = xmlData.getElementsByTagName('ReportHost')
        if (hosts.length === 0) throw new Error('Parsing Error: No ReportHost element')

        for (let i = 0; i < hosts.length; i++) {
          const host = {}
          const properties = hosts[i].getElementsByTagName('HostProperties')[0]
          const tags = properties.getElementsByTagName('tag')

          for (let j = 0; j < tags.length; j++) {
            const tag = tags[j]
            const tagName = tag.getAttribute('name')
            const tagContent = tag.innerHTML

            if (tagName === 'host-ip') {
              host.ip = tagContent
            }
            if (tagName === 'operating-system') {
              host.os = tagContent
            }
            if (tagName === 'host-fqdn') {
              host.hostname = tagContent
            }
            if (tagName === 'netbios-name' && !host.hostname) {
              host.hostname = tagContent
            }
          }

          if (!host.ip) {
            host.ip = hosts[i].getAttribute('name') || 'n/a'
          }

          const reports = hosts[i].getElementsByTagName('ReportItem')
          host.services = []

          for (let j = 0; j < reports.length; j++) {
            const port = reports[j].getAttribute('port')
            const protocol = reports[j].getAttribute('protocol')
            const svcName = reports[j].getAttribute('svc_name')
            const product = reports[j].getAttribute('svc_product')
            const version = reports[j].getAttribute('svc_version')

            if (port !== '0') {
              const prev = host.services.filter((service) => {
                return service.port === port
              })

              const service = prev.length === 0 ? {} : prev[0]

              service.protocol = protocol
              service.port = port
              service.name = svcName || 'n/a'
              service.product = product || 'n/a'
              service.version = version || 'n/a'

              if (prev.length === 0) {
                host.services.push(service)
              }
            }
          }

          hostsRes.push({ label: host.ip, value: host.ip, host })
        }

        this.targetsOptions = hostsRes
        toast({
          title: `Successfully imported ${hostsRes.length} hosts`,
          variant: 'default',
        })
      } catch (err) {
        console.log(err)
        toast({
          title: 'Error parsing Nessus',
          variant: 'destructive',
        })
      }
    },
  },
}
</script>
