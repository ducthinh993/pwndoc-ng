<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import Breadcrumb from '@/components/breadcrumb.vue'

export default defineComponent({
  components: {
    Breadcrumb,
  },
})
</script>

