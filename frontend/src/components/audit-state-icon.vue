<template>
  <Badge
    v-if="state === 'APPROVED'"
    variant="secondary"
    class="bg-success-subtle text-success-strong hover:bg-success-muted gap-2 px-2 py-1 font-bold"
    :class="sizeClass"
  >
    <div
      class="cursor-help"
      :title="tooltipContent"
    >
      <Avatar
        :size="size"
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
    class="bg-warning-subtle text-warning-strong hover:bg-warning-muted gap-2 px-2 py-1 font-bold"
    :class="sizeClass"
  >
    <div
      class="cursor-help"
      :title="tooltipContent"
    >
      <Avatar
        :size="size"
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

<script setup lang="ts">
import { computed } from 'vue'
import Badge from '@/components/ui/badge.vue'
import Avatar from '@/components/ui/avatar.vue'
import { useSettings } from '@/composables/useSettings'

interface Props {
  approvals?: Array<{
    firstname: string
    lastname: string
  }>
  state: string
  size?: 'sm' | 'default' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  approvals: () => [],
  size: 'default',
})

const settings = useSettings()

const sizeClass = computed(() => {
  // Convert size to Tailwind classes
  const sizeMap: Record<string, string> = {
    'sm': 'text-xs px-1.5 py-0.5',
    'default': 'text-sm px-2 py-1',
    'lg': 'text-base px-3 py-1.5',
    'xl': 'text-lg px-4 py-2',
  }
  return sizeMap[props.size] || 'text-sm px-2 py-1'
})

const tooltipContent = computed(() => {
  let content = ''
  if (props.state === 'APPROVED') {
    content = `Audit is approved (${getApprovalCount()}/${getMinReviewers()})`
  } else if (props.state === 'REVIEW') {
    content = `Audit is being reviewed (${getApprovalCount()}/${getMinReviewers()})`
  }

  if (props.approvals && props.approvals.length > 0) {
    const reviewerNames = props.approvals.map((reviewer) =>
      `${reviewer.firstname} ${reviewer.lastname}`,
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
  return settings.value?.reviews?.public?.minReviewers || 1
}
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
