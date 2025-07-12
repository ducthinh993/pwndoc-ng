import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    https: {
      key: path.resolve(__dirname, 'ssl/server.key'),
      cert: path.resolve(__dirname, 'ssl/server.cert')
    },
    host: "0.0.0.0",
    port: 8081,
    proxy: {
      '/api': {
        target: 'https://pwndoc-ng-backend:5252',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['@tiptap/core', '@tiptap/vue-3'],
        },
      },
    },
  },
  define: {
    // Preserve environment variables from Quasar config
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/globals.css";`
      }
    }
  }
}) 