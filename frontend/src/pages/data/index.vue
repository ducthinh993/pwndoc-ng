<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar Navigation -->
    <div class="w-64 shrink-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div class="p-6">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ $t('handleCustomData') }}
        </h2>

        <Separator class="mb-6" />

        <nav class="space-y-2">
          <!-- Main Data Management -->
          <NavItem
            to="/data/collaborators"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            active-class="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <svg
              class="size-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="font-medium">{{ $t('collaborators') }}</span>
          </NavItem>

          <NavItem
            to="/data/companies"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            active-class="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <svg
              class="size-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span class="font-medium">{{ $t('companies') }}</span>
          </NavItem>

          <NavItem
            to="/data/clients"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            active-class="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <svg
              class="size-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="font-medium">{{ $t('clients') }}</span>
          </NavItem>

          <NavItem
            to="/data/templates"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            active-class="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <svg
              class="size-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span class="font-medium">{{ $t('templates') }}</span>
          </NavItem>

          <Separator class="my-4" />

          <!-- Advanced Data Management -->
          <NavItem
            to="/data/custom"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            active-class="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <svg
              class="size-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span class="font-medium">{{ $t('customData') }}</span>
          </NavItem>

          <NavItem
            to="/data/dump"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            active-class="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <svg
              class="size-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M8 6l4-4 4 4M8 6v4m8-4v4"
              />
            </svg>
            <span class="font-medium">{{ $t('import') }} / {{ $t('export') }}</span>
          </NavItem>
        </nav>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <router-view />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import Separator from '@/components/ui/separator.vue'
import NavItem from '@/components/ui/nav-item.vue'
import UserService from '@/services/user'

export default defineComponent({
  name: 'DataLayout',

  components: {
    Separator,
    NavItem,
  },

  data() {
    return {
      UserService,
    }
  },
})
</script>

