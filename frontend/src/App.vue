<template>
  <ThemeProvider>
    <div id="app" class="min-h-screen bg-background text-foreground">
      <router-view />
      <Loading />
      <Toast />
    </div>
  </ThemeProvider>
</template>

<script>
import { defineComponent } from 'vue';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Loading from '@/components/ui/loading.vue';
import Toast from '@/components/ui/toast.vue';

export default defineComponent({
  name: 'App',
  components: {
    ThemeProvider,
    Loading,
    Toast,
  },
});
</script>

<style>
@import '@/styles/globals.css';
</style>
