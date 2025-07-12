<template>
  <div>
    <breadcrumb
      buttons
      :title="audit ? `${audit.name} (${audit.auditType || 'Audit Type not set'})` : 'Loading...'"
      :state="parentState"
      :approvals="parentApprovals"
    >
      <template #buttons>
        <Button
          v-if="frontEndAuditState === AUDIT_VIEW_STATE.EDIT"
          variant="default"
          @click="updateSection"
        >
          {{ $t('btn.save') + ' (ctrl+s)' }}
        </Button>
      </template>
    </breadcrumb>
    
    <div class="grid grid-cols-1 gap-4 p-4">
      <div class="col-span-1 md:col-start-2 md:col-span-8 lg:col-start-3 lg:col-span-6">
        <Card>
          <CardContent class="p-6">
            <!-- For retrocompatibility, test if section.text exists -->
            <basic-editor 
              v-if="section.text"
              ref="basiceditor_section" 
              v-model="section.text" 
              no-sync 
              :editable="frontEndAuditState === AUDIT_VIEW_STATE.EDIT" 
            />
            <custom-fields 
              v-else
              ref="customfields" 
              v-model="section.customFields" 
              custom-element="div"
              no-sync-editor
              :readonly="frontEndAuditState !== AUDIT_VIEW_STATE.EDIT"
              :locale="audit.language"
            />
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
import { Card, CardContent } from '@/components/ui/card'

import BasicEditor from '@/components/editor.vue'
import Breadcrumb from '@/components/breadcrumb.vue'
import CustomFields from '@/components/custom-fields.vue'

import AuditService from '@/services/audit'
import DataService from '@/services/data'
import Utils from '@/services/utils'
import { $t } from '@/boot/i18n'

export default {
  name: 'AuditSectionEdit',
  components: {
    BasicEditor,
    Breadcrumb,
    CustomFields,
    Button,
    Card,
    CardContent
  },
  props: {
    frontEndAuditState: {
      type: Number,
      required: true
    },
    parentState: {
      type: String,
      required: true
    },
    parentApprovals: {
      type: Array,
      required: true
    },
    audit: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data() {
    return {
      auditId: null,
      sectionId: null,
      section: {
        field: '',
        name: '',
        customFields: []
      },
      sectionOrig: {},
      customFields: [],
      AUDIT_VIEW_STATE: Utils.AUDIT_VIEW_STATE
    }
  },
  mounted() {
    this.auditId = this.$route.params.auditId
    this.sectionId = this.$route.params.sectionId
    this.getSection()
    
    this.$socket.emit('menu', { 
      menu: 'editSection', 
      section: this.sectionId, 
      room: this.auditId 
    })
    
    document.addEventListener('keydown', this._listener, false)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this._listener, false)
  },
  beforeRouteLeave(to, from, next) {
    Utils.syncEditors(this.$refs)
    if (this.unsavedChanges()) {
      // TODO: Replace with Vue Shadcn Dialog
      if (confirm(this.$t('msg.thereAreUnsavedChanges') + '\n' + this.$t('msg.doYouWantToLeave'))) {
        next()
      }
    } else {
      next()
    }
  },
  beforeRouteUpdate(to, from, next) {
    Utils.syncEditors(this.$refs)
    if (this.unsavedChanges()) {
      // TODO: Replace with Vue Shadcn Dialog
      if (confirm(this.$t('msg.thereAreUnsavedChanges') + '\n' + this.$t('msg.doYouWantToLeave'))) {
        next()
      }
    } else {
      next()
    }
  },
  methods: {
    _listener(e) {
      if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
        e.preventDefault()
        if (this.frontEndAuditState === this.AUDIT_VIEW_STATE.EDIT) {
          this.updateSection()
        }
      }
    },
    
    getSection() {
      DataService.getCustomFields()
        .then((data) => {
          this.customFields = data.data.datas
          return AuditService.getSection(this.auditId, this.sectionId)
        })
        .then((data) => {
          this.section = data.data.datas
          this.sectionOrig = this.$_.cloneDeep(this.section)
          nextTick(() => {
            Utils.syncEditors(this.$refs)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    
    updateSection() {
      const { toast } = useToast()
      
      Utils.syncEditors(this.$refs)
      nextTick(() => {
        if (this.$refs.customfields && this.$refs.customfields.requiredFieldsEmpty()) {
          toast({
            title: this.$t('msg.fieldRequired'),
            variant: 'destructive'
          })
          return
        }
        
        AuditService.updateSection(this.auditId, this.sectionId, this.section)
          .then(() => {
            this.sectionOrig = this.$_.cloneDeep(this.section)
            toast({
              title: this.$t('msg.sectionUpdateOk'),
              variant: 'default'
            })
          })
          .catch((err) => {
            toast({
              title: err.response.data.datas,
              variant: 'destructive'
            })
          })
      })
    },
    
    unsavedChanges() {
      if (!this.$_.isEqual(this.section.customFields, this.sectionOrig.customFields)) {
        return true
      }
      return false
    }
  }
}
</script>