<template>
  <Badge 
    v-if="state === 'APPROVED'" 
    variant="secondary" 
    class="font-bold bg-success-subtle text-success-strong hover:bg-success-muted px-2 py-1 gap-2"
    :class="sizeClass"
  >
    <div 
      class="cursor-help" 
      :title="tooltipContent"
    >
      <Avatar 
        :size="avatarSize" 
        color="success" 
        text-color="white" 
        class="bg-success text-white"
      >
        {{ getApprovalCount() }}/{{ getMinReviewers() }}
      </Avatar>
      <span class="ml-2">Approved</span>
    </div>
  </Badge>

  <Badge 
    v-else-if="state === 'REVIEW'" 
    variant="secondary" 
    class="font-bold bg-warning-subtle text-warning-strong hover:bg-warning-muted px-2 py-1 gap-2"
    :class="sizeClass"
  >
    <div 
      class="cursor-help" 
      :title="tooltipContent"
    >
      <Avatar 
        :size="avatarSize" 
        color="warning" 
        text-color="white" 
        class="bg-warning text-white"
      >
        {{ getApprovalCount() }}/{{ getMinReviewers() }}
      </Avatar>
      <span class="ml-2">Reviewing</span>
    </div>
  </Badge>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Badge from '@/components/ui/badge.vue'
import Avatar from '@/components/ui/avatar.vue'

export default defineComponent({
  name: 'AuditStateIconShadcn',
  components: {
    Badge,
    Avatar,
  },
  props: {
    approvals: {
      type: Array,
      default: () => []
    },
    state: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: "11px"
    }
  },
  setup(props) {
    const sizeClass = computed(() => {
      // Convert Quasar size to Tailwind classes
      const sizeMap: Record<string, string> = {
        '10px': 'text-xs px-1 py-0.5',
        '11px': 'text-xs px-1.5 py-0.5',
        '12px': 'text-sm px-2 py-1',
        '14px': 'text-sm px-2 py-1',
        '16px': 'text-base px-3 py-1.5',
      }
      return sizeMap[props.size] || 'text-xs px-1.5 py-0.5'
    })

    const avatarSize = computed(() => {
      // Map text size to avatar size
      const avatarSizeMap: Record<string, string> = {
        '10px': 'sm',
        '11px': 'sm', 
        '12px': 'default',
        '14px': 'default',
        '16px': 'lg',
      }
      return avatarSizeMap[props.size] || 'sm'
    })

    const tooltipContent = computed(() => {
      let content = ''
      if (props.state === 'APPROVED') {
        content = `Audit is approved (${getApprovalCount()}/${getMinReviewers()})`
      } else if (props.state === 'REVIEW') {
        content = `Audit is being reviewed (${getApprovalCount()}/${getMinReviewers()})`
      }
      
      if (props.approvals && props.approvals.length > 0) {
        const reviewerNames = props.approvals.map((reviewer: any) => 
          `${reviewer.firstname} ${reviewer.lastname}`
        ).join(', ')
        content += `\nReviewers: ${reviewerNames}`
      }
      
      return content
    })

    const getApprovalCount = () => {
      if (props.approvals) return props.approvals.length
      else return -1
    }

    const getMinReviewers = () => {
      // @ts-ignore - $settings is injected globally
      return window.$settings?.reviews?.public?.minReviewers || 1
    }

    return {
      sizeClass,
      avatarSize,
      tooltipContent,
      getApprovalCount,
      getMinReviewers,
    }
  }
})
</script>

<style scoped>
/* Custom styling to match the original design */
.badge-approved {
  background-color: #f0f9ff;
  color: #065f46;
  border: 1px solid #10b981;
}

.badge-review {
  background-color: #fffbeb;
  color: #92400e;
  border: 1px solid #f59e0b;
}
</style> 