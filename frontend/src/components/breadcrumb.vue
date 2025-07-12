<template>
  <div class="bg-card border-b border-border">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between min-h-[38px]">
        <!-- Left side: Home button + Title/Breadcrumb -->
        <div class="flex items-center space-x-4">
          <!-- Home button (when in buttons mode) -->
          <Button
            v-if="typeof buttons !== 'undefined'"
            variant="ghost"
            size="sm"
            @click="$router.push('/audits')"
            class="text-secondary hover:text-secondary hover:bg-secondary/10"
          >
            <Home class="h-4 w-4" />
          </Button>

          <!-- Title with audit state (when title is provided) -->
          <div v-if="typeof title !== 'undefined'" class="flex items-center space-x-2">
            <h1 class="text-xl font-bold text-foreground">{{ title }}</h1>
            <AuditStateIcon
              v-if="$settings.reviews.enabled && state !== 'EDIT'"
              :approvals="approvals"
              :state="state"
              class="ml-2"
            />
          </div>

          <!-- Dynamic title from breadcrumb (when no title is provided) -->
          <h1 v-else-if="bread.length > 0" class="text-xl font-bold text-foreground">
            {{ bread[last].name }}
          </h1>

          <!-- Breadcrumb navigation (when not in buttons mode) -->
          <nav v-if="typeof buttons === 'undefined'" class="flex items-center space-x-2 text-sm text-muted-foreground">
            <template v-for="(breadcrumb, index) in bread" :key="breadcrumb.path">
              <Button
                v-if="index < bread.length - 1"
                variant="ghost"
                size="sm"
                @click="$router.push(breadcrumb.path)"
                class="h-auto p-0 font-normal text-muted-foreground hover:text-foreground"
              >
                {{ breadcrumb.name }}
              </Button>
              <span v-else class="font-medium text-foreground">{{ breadcrumb.name }}</span>
              <ChevronRight
                v-if="index < bread.length - 1"
                class="h-4 w-4 text-muted-foreground"
              />
            </template>
          </nav>
        </div>

        <!-- Right side: Custom buttons slot -->
        <div v-if="typeof buttons !== 'undefined'" class="flex items-center space-x-2">
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Components
import { Button } from '@/components/ui/button'
import AuditStateIcon from '@/components/audit-state-icon.vue'

// Icons
import { Home, ChevronRight } from 'lucide-vue-next'

// Props
const props = defineProps({
  buttons: {
    type: [Boolean, String],
    default: undefined
  },
  title: {
    type: String,
    default: undefined
  },
  approvals: {
    type: Array,
    default: () => []
  },
  state: {
    type: String,
    default: 'EDIT'
  }
})

const route = useRoute()
const router = useRouter()

// Reactive data
const bread = ref([])
const last = ref(0)

// Methods
const initBreadcrumb = () => {
  bread.value = []
  const breadArray = route.matched
  
  breadArray.forEach((element) => {
    if (element.meta?.breadcrumb) {
      const entry = {
        name: element.meta.breadcrumb,
        path: element.path === "" ? "/" : element.path
      }
      bread.value.push(entry)
    }
  })
  
  last.value = bread.value.length - 1
}

// Initialize breadcrumb on component mount
onMounted(() => {
  initBreadcrumb()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .justify-between {
    width: 100%;
    justify-content: flex-start;
  }
  
  .space-x-4 > * + * {
    margin-left: 0;
  }
  
  .space-x-2 > * + * {
    margin-left: 0.5rem;
  }
}
</style>