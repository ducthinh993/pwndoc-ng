<template>
  <div class="fixed inset-0 flex items-center justify-center text-center">
    <div class="space-y-4">
      <p>
        <img
          src="~assets/sad.svg"
          class="w-[30vw] max-w-[150px] mx-auto"
        >
      </p>
      <p class="text-muted-foreground">{{ message }} <strong>(404)</strong></p>
      <Button
        variant="secondary"
        class="w-[200px]"
        @click="$router.push('/')"
      >
        {{ $t('goBack') }}
      </Button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Button } from '@/components/ui/button'

export default defineComponent({
  name: 'Error404',
  components: {
    Button
  },
  data() {
    return {
      message: ''
    }
  },
  created() {
    this.message = this.$route.params.error
  }
})
</script>