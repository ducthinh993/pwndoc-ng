<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb
      :title="$t('auditCharts')"
      :state="parentState"
      :approvals="parentApprovals"
      buttons
    >
      <template #buttons>
        <div class="flex items-center gap-2">
          <ToggleGroup
            :value="selectedView"
            class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            @update:value="changeView"
          >
            <button
              :class="[
                'px-4 py-2 text-sm font-medium transition-colors',
                selectedView === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              ]"
              @click="changeView('all')"
            >
              {{ $t('allCharts') }}
            </button>
            <button
              :class="[
                'border-l border-gray-200 px-4 py-2 text-sm font-medium transition-colors dark:border-gray-700',
                selectedView === 'severity'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              ]"
              @click="changeView('severity')"
            >
              {{ $t('severityCharts') }}
            </button>
            <button
              :class="[
                'border-l border-gray-200 px-4 py-2 text-sm font-medium transition-colors dark:border-gray-700',
                selectedView === 'category'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              ]"
              @click="changeView('category')"
            >
              {{ $t('categoryCharts') }}
            </button>
          </ToggleGroup>

          <Tooltip>
            <template #trigger>
              <button
                :class="[
                  'rounded-full p-2 transition-colors',
                  'border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
                  'hover:bg-gray-50 dark:hover:bg-gray-700',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  { 'cursor-not-allowed opacity-50': isLoading }
                ]"
                :disabled="isLoading"
                @click="refreshAllCharts"
              >
                <svg
                  :class="['size-5 text-gray-600 dark:text-gray-400', { 'animate-spin': isLoading }]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </template>
            <template #content>
              {{ $t('refreshAllCharts') }}
            </template>
          </Tooltip>
        </div>
      </template>
    </Breadcrumb>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-6">
      <div class="mx-auto max-w-5xl">
        <!-- All Charts View -->
        <div v-if="showAllCharts" class="space-y-8">
          <!-- CVSS Severity Charts Section -->
          <Card class="overflow-hidden">
            <template #header>
              <div class="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                <svg
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                {{ $t('vulnerabilitySeverityDistribution') }}
              </div>
            </template>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <!-- Pie Chart -->
              <Card variant="outline" class="bg-white dark:bg-gray-800">
                <template #header>
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
                        {{ $t('severityDistributionPie') }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ $t('pentestFindings') }}
                      </p>
                    </div>
                    <div class="flex gap-1">
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.severity"
                            @click="exportChart('severity-pie')"
                          >
                            <svg
                              class="size-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('exportChart') }}
                        </template>
                      </Tooltip>
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.severity"
                            @click="refreshChart('severity')"
                          >
                            <svg
                              :class="['size-4 text-gray-500', { 'animate-spin': loading.severity }]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('refresh') }}
                        </template>
                      </Tooltip>
                    </div>
                  </div>
                </template>

                <!-- Loading State -->
                <div v-if="loading.severity" class="flex flex-col items-center justify-center py-16">
                  <Loading size="lg" />
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('loadingChart') }}
                  </p>
                </div>

                <!-- Error State -->
                <div v-else-if="errors.severity" class="flex flex-col items-center justify-center py-16">
                  <Alert variant="destructive" class="w-full max-w-md">
                    <template #icon>
                      <svg
                        class="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </template>
                    <template #title>
                      {{ $t('chartLoadError') }}
                    </template>
                    <template #description>
                      <button
                        class="mt-2 rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/90"
                        @click="loadSeverityData"
                      >
                        {{ $t('retry') }}
                      </button>
                    </template>
                  </Alert>
                </div>

                <!-- Chart Content -->
                <div v-else class="h-96">
                  <PieChart
                    :chart-data="severityPieData"
                    :chart-options="getPieChartOptions()"
                    chart-id="severity-pie-chart"
                  />
                </div>
              </Card>

              <!-- Bar Chart -->
              <Card variant="outline" class="bg-white dark:bg-gray-800">
                <template #header>
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
                        {{ $t('severityDistributionBar') }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ $t('pentestFindings') }}
                      </p>
                    </div>
                    <div class="flex gap-1">
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.severity"
                            @click="exportChart('severity-bar')"
                          >
                            <svg
                              class="size-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('exportChart') }}
                        </template>
                      </Tooltip>
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.severity"
                            @click="refreshChart('severity')"
                          >
                            <svg
                              :class="['size-4 text-gray-500', { 'animate-spin': loading.severity }]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('refresh') }}
                        </template>
                      </Tooltip>
                    </div>
                  </div>
                </template>

                <!-- Loading State -->
                <div v-if="loading.severity" class="flex flex-col items-center justify-center py-16">
                  <Loading size="lg" />
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('loadingChart') }}
                  </p>
                </div>

                <!-- Error State -->
                <div v-else-if="errors.severity" class="flex flex-col items-center justify-center py-16">
                  <Alert variant="destructive" class="w-full max-w-md">
                    <template #icon>
                      <svg
                        class="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </template>
                    <template #title>
                      {{ $t('chartLoadError') }}
                    </template>
                    <template #description>
                      <button
                        class="mt-2 rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/90"
                        @click="loadSeverityData"
                      >
                        {{ $t('retry') }}
                      </button>
                    </template>
                  </Alert>
                </div>

                <!-- Chart Content -->
                <div v-else class="h-96">
                  <BarChart
                    :chart-data="severityBarData"
                    :chart-options="getBarChartOptions()"
                    chart-id="severity-bar-chart"
                  />
                </div>
              </Card>
            </div>
          </Card>

          <!-- Category Distribution Section -->
          <Card class="overflow-hidden">
            <template #header>
              <div class="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                <svg
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {{ $t('categoryDistribution') }}
              </div>
            </template>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <!-- Category Pie Chart -->
              <Card variant="outline" class="bg-white dark:bg-gray-800">
                <template #header>
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
                        {{ $t('vulnerabilityCategories') }}
                      </h3>
                    </div>
                    <div class="flex gap-1">
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.category"
                            @click="exportChart('category')"
                          >
                            <svg
                              class="size-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('exportChart') }}
                        </template>
                      </Tooltip>
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.category"
                            @click="refreshChart('category')"
                          >
                            <svg
                              :class="['size-4 text-gray-500', { 'animate-spin': loading.category }]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('refresh') }}
                        </template>
                      </Tooltip>
                    </div>
                  </div>
                </template>

                <!-- Loading State -->
                <div v-if="loading.category" class="flex flex-col items-center justify-center py-16">
                  <Loading size="lg" />
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('loadingChart') }}
                  </p>
                </div>

                <!-- Error State -->
                <div v-else-if="errors.category" class="flex flex-col items-center justify-center py-16">
                  <Alert variant="destructive" class="w-full max-w-md">
                    <template #icon>
                      <svg
                        class="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </template>
                    <template #title>
                      {{ $t('chartLoadError') }}
                    </template>
                    <template #description>
                      <button
                        class="mt-2 rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/90"
                        @click="loadCategoryData"
                      >
                        {{ $t('retry') }}
                      </button>
                    </template>
                  </Alert>
                </div>

                <!-- Chart Content -->
                <div v-else class="h-80">
                  <PieChart
                    :chart-data="categoryChartData"
                    :chart-options="getPieChartOptions()"
                    chart-id="category-pie-chart"
                  />
                </div>
              </Card>

              <!-- Type Bar Chart -->
              <Card variant="outline" class="bg-white dark:bg-gray-800">
                <template #header>
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
                        {{ $t('vulnerabilityTypes') }}
                      </h3>
                    </div>
                    <div class="flex gap-1">
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.type"
                            @click="exportChart('type')"
                          >
                            <svg
                              class="size-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('exportChart') }}
                        </template>
                      </Tooltip>
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.type"
                            @click="refreshChart('type')"
                          >
                            <svg
                              :class="['size-4 text-gray-500', { 'animate-spin': loading.type }]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('refresh') }}
                        </template>
                      </Tooltip>
                    </div>
                  </div>
                </template>

                <!-- Loading State -->
                <div v-if="loading.type" class="flex flex-col items-center justify-center py-16">
                  <Loading size="lg" />
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('loadingChart') }}
                  </p>
                </div>

                <!-- Error State -->
                <div v-else-if="errors.type" class="flex flex-col items-center justify-center py-16">
                  <Alert variant="destructive" class="w-full max-w-md">
                    <template #icon>
                      <svg
                        class="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </template>
                    <template #title>
                      {{ $t('chartLoadError') }}
                    </template>
                    <template #description>
                      <button
                        class="mt-2 rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/90"
                        @click="loadTypeData"
                      >
                        {{ $t('retry') }}
                      </button>
                    </template>
                  </Alert>
                </div>

                <!-- Chart Content -->
                <div v-else class="h-80">
                  <BarChart
                    :chart-data="typeChartData"
                    :chart-options="getBarChartOptions()"
                    chart-id="type-bar-chart"
                  />
                </div>
              </Card>
            </div>
          </Card>
        </div>

        <!-- Severity Only View -->
        <div v-else-if="showSeverityOnly">
          <Card class="overflow-hidden">
            <template #header>
              <div class="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                <svg
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                {{ $t('vulnerabilitySeverityDistribution') }} - {{ $t('detailedView') }}
              </div>
            </template>

            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <!-- Detailed Pie Chart -->
              <Card variant="outline" class="bg-white dark:bg-gray-800">
                <template #header>
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
                        {{ $t('severityDistributionPie') }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ $t('pentestFindings') }} - {{ $t('detailedView') }}
                      </p>
                    </div>
                    <div class="flex gap-1">
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.severity"
                            @click="exportChart('severity-pie')"
                          >
                            <svg
                              class="size-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('exportChart') }}
                        </template>
                      </Tooltip>
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.severity"
                            @click="refreshChart('severity')"
                          >
                            <svg
                              :class="['size-4 text-gray-500', { 'animate-spin': loading.severity }]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('refresh') }}
                        </template>
                      </Tooltip>
                    </div>
                  </div>
                </template>

                <!-- Loading/Error/Chart Content -->
                <div v-if="loading.severity" class="flex flex-col items-center justify-center py-20">
                  <Loading size="lg" />
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('loadingChart') }}
                  </p>
                </div>
                <div v-else-if="errors.severity" class="flex flex-col items-center justify-center py-20">
                  <Alert variant="destructive" class="w-full max-w-md">
                    <template #icon>
                      <svg
                        class="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </template>
                    <template #title>
                      {{ $t('chartLoadError') }}
                    </template>
                    <template #description>
                      <button
                        class="mt-2 rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/90"
                        @click="loadSeverityData"
                      >
                        {{ $t('retry') }}
                      </button>
                    </template>
                  </Alert>
                </div>
                <div v-else class="h-[450px]">
                  <PieChart
                    :chart-data="severityPieData"
                    :chart-options="getPieChartOptions()"
                    chart-id="severity-pie-detailed"
                  />
                </div>
              </Card>

              <!-- Detailed Bar Chart -->
              <Card variant="outline" class="bg-white dark:bg-gray-800">
                <template #header>
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
                        {{ $t('severityDistributionBar') }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ $t('pentestFindings') }} - {{ $t('detailedView') }}
                      </p>
                    </div>
                    <div class="flex gap-1">
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.severity"
                            @click="exportChart('severity-bar')"
                          >
                            <svg
                              class="size-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('exportChart') }}
                        </template>
                      </Tooltip>
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.severity"
                            @click="refreshChart('severity')"
                          >
                            <svg
                              :class="['size-4 text-gray-500', { 'animate-spin': loading.severity }]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('refresh') }}
                        </template>
                      </Tooltip>
                    </div>
                  </div>
                </template>

                <!-- Loading/Error/Chart Content -->
                <div v-if="loading.severity" class="flex flex-col items-center justify-center py-20">
                  <Loading size="lg" />
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('loadingChart') }}
                  </p>
                </div>
                <div v-else-if="errors.severity" class="flex flex-col items-center justify-center py-20">
                  <Alert variant="destructive" class="w-full max-w-md">
                    <template #icon>
                      <svg
                        class="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </template>
                    <template #title>
                      {{ $t('chartLoadError') }}
                    </template>
                    <template #description>
                      <button
                        class="mt-2 rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/90"
                        @click="loadSeverityData"
                      >
                        {{ $t('retry') }}
                      </button>
                    </template>
                  </Alert>
                </div>
                <div v-else class="h-[450px]">
                  <BarChart
                    :chart-data="severityBarData"
                    :chart-options="getBarChartOptions()"
                    chart-id="severity-bar-detailed"
                  />
                </div>
              </Card>
            </div>
          </Card>
        </div>

        <!-- Category Only View -->
        <div v-else-if="showCategoryOnly">
          <Card class="overflow-hidden">
            <template #header>
              <div class="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                <svg
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {{ $t('categoryDistribution') }} - {{ $t('detailedView') }}
              </div>
            </template>

            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <!-- Detailed Category Chart -->
              <Card variant="outline" class="bg-white dark:bg-gray-800">
                <template #header>
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
                        {{ $t('vulnerabilityCategories') }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ $t('detailedView') }}
                      </p>
                    </div>
                    <div class="flex gap-1">
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.category"
                            @click="exportChart('category')"
                          >
                            <svg
                              class="size-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('exportChart') }}
                        </template>
                      </Tooltip>
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.category"
                            @click="refreshChart('category')"
                          >
                            <svg
                              :class="['size-4 text-gray-500', { 'animate-spin': loading.category }]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('refresh') }}
                        </template>
                      </Tooltip>
                    </div>
                  </div>
                </template>

                <!-- Loading/Error/Chart Content -->
                <div v-if="loading.category" class="flex flex-col items-center justify-center py-20">
                  <Loading size="lg" />
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('loadingChart') }}
                  </p>
                </div>
                <div v-else-if="errors.category" class="flex flex-col items-center justify-center py-20">
                  <Alert variant="destructive" class="w-full max-w-md">
                    <template #icon>
                      <svg
                        class="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </template>
                    <template #title>
                      {{ $t('chartLoadError') }}
                    </template>
                    <template #description>
                      <button
                        class="mt-2 rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/90"
                        @click="loadCategoryData"
                      >
                        {{ $t('retry') }}
                      </button>
                    </template>
                  </Alert>
                </div>
                <div v-else class="h-[450px]">
                  <PieChart
                    :chart-data="categoryChartData"
                    :chart-options="getPieChartOptions()"
                    chart-id="category-pie-detailed"
                  />
                </div>
              </Card>

              <!-- Detailed Type Chart -->
              <Card variant="outline" class="bg-white dark:bg-gray-800">
                <template #header>
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
                        {{ $t('vulnerabilityTypes') }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ $t('detailedView') }}
                      </p>
                    </div>
                    <div class="flex gap-1">
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.type"
                            @click="exportChart('type')"
                          >
                            <svg
                              class="size-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('exportChart') }}
                        </template>
                      </Tooltip>
                      <Tooltip>
                        <template #trigger>
                          <button
                            class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            :disabled="loading.type"
                            @click="refreshChart('type')"
                          >
                            <svg
                              :class="['size-4 text-gray-500', { 'animate-spin': loading.type }]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        </template>
                        <template #content>
                          {{ $t('refresh') }}
                        </template>
                      </Tooltip>
                    </div>
                  </div>
                </template>

                <!-- Loading/Error/Chart Content -->
                <div v-if="loading.type" class="flex flex-col items-center justify-center py-20">
                  <Loading size="lg" />
                  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('loadingChart') }}
                  </p>
                </div>
                <div v-else-if="errors.type" class="flex flex-col items-center justify-center py-20">
                  <Alert variant="destructive" class="w-full max-w-md">
                    <template #icon>
                      <svg
                        class="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </template>
                    <template #title>
                      {{ $t('chartLoadError') }}
                    </template>
                    <template #description>
                      <button
                        class="mt-2 rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground transition-colors hover:bg-destructive/90"
                        @click="loadTypeData"
                      >
                        {{ $t('retry') }}
                      </button>
                    </template>
                  </Alert>
                </div>
                <div v-else class="h-[450px]">
                  <BarChart
                    :chart-data="typeChartData"
                    :chart-options="getBarChartOptions()"
                    chart-id="type-bar-detailed"
                  />
                </div>
              </Card>
            </div>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && !hasErrors && !chartData.severity && !chartData.category" class="flex justify-center">
          <Card class="w-full max-w-md">
            <div class="flex flex-col items-center justify-center py-12 text-center">
              <svg
                class="mb-4 size-20 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ $t('noChartData') }}
              </h3>
              <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
                {{ $t('noChartDataMessage') }}
              </p>
              <button
                class="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                @click="refreshAllCharts"
              >
                {{ $t('refreshData') }}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useToast } from '@/composables/useToast'

import Breadcrumb from '@/components/breadcrumb.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import Card from '@/components/ui/card.vue'
import ToggleGroup from '@/components/ui/toggle-group.vue'
import Tooltip from '@/components/ui/tooltip.vue'
import Loading from '@/components/ui/loading.vue'
import Alert from '@/components/ui/alert.vue'

import ChartService from '@/services/chart'
import UserService from '@/services/user'

export default defineComponent({
  name: 'ChartsPage',

  components: {
    Breadcrumb,
    PieChart,
    BarChart,
    Card,
    ToggleGroup,
    Tooltip,
    Loading,
    Alert,
  },

  data() {
    return {
      UserService,
      auditId: null,

      // Loading states
      loading: {
        severity: false,
        category: false,
        type: false,
        status: false,
      },

      // Error states
      errors: {
        severity: null,
        category: null,
        type: null,
        status: null,
      },

      // Chart data
      chartData: {
        severity: null,
        category: null,
        type: null,
        status: null,
      },

      // Chart display options
      chartOptions: {
        pie: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label(context) {
                  const dataset = context.dataset
                  const total = dataset.data.reduce((sum, value) => sum + value, 0)
                  const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0
                  return `${context.label}: ${context.raw} (${percentage}%)`
                },
              },
            },
          },
        },
        bar: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      },

      // UI state
      selectedView: 'all', // 'all', 'severity', 'category'

      // Breadcrumb props
      parentState: null,
      parentApprovals: null,

      // Processed chart data to avoid circular references
      processedChartData: {
        severityPie: { labels: [], datasets: [] },
        severityBar: { labels: [], datasets: [] },
        category: { labels: [], datasets: [] },
        type: { labels: [], datasets: [] },
      },
    }
  },

  computed: {
    // Loading states
    isLoading() {
      return Object.values(this.loading).some(state => state)
    },

    hasErrors() {
      return Object.values(this.errors).some(error => error !== null)
    },

    // Chart visibility
    showAllCharts() {
      return this.selectedView === 'all'
    },

    showSeverityOnly() {
      return this.selectedView === 'severity'
    },

    showCategoryOnly() {
      return this.selectedView === 'category'
    },

    // Safe chart data getters
    severityPieData() {
      return this.processedChartData.severityPie
    },

    severityBarData() {
      return this.processedChartData.severityBar
    },

    categoryChartData() {
      return this.processedChartData.category
    },

    typeChartData() {
      return this.processedChartData.type
    },
  },

  watch: {
    '$route.params.auditId': {
      handler(newAuditId) {
        if (newAuditId && newAuditId !== this.auditId) {
          this.auditId = newAuditId
          this.loadAllChartData()
        }
      },
      immediate: true,
    },
  },

  async mounted() {
    this.auditId = this.$route.params.auditId
    if (this.auditId) {
      await this.loadAllChartData()
    } else {
      this.showError('No audit ID provided')
    }
  },

  methods: {
    // Data transformation methods
    transformChartData() {
      try {
        // Create a new object to avoid reactivity issues
        const newProcessedData = {
          severityPie: { labels: [], datasets: [] },
          severityBar: { labels: [], datasets: [] },
          category: { labels: [], datasets: [] },
          type: { labels: [], datasets: [] },
        }

        // Transform severity data
        if (this.chartData.severity) {
          newProcessedData.severityPie = ChartService.transformSeverityToPieChart(this.chartData.severity)
          newProcessedData.severityBar = ChartService.transformSeverityToBarChart(this.chartData.severity)
        }

        // Transform category data
        if (this.chartData.category) {
          newProcessedData.category = ChartService.transformCategoryToChart(this.chartData.category)
        }

        // Transform type data
        if (this.chartData.type) {
          newProcessedData.type = ChartService.transformTypeToChart(this.chartData.type)
        }

        // Replace the entire object to avoid reactivity issues
        this.processedChartData = newProcessedData
      } catch (error) {
        console.error('Error transforming chart data:', error)
        this.showError(`Failed to transform chart data: ${error.message}`)
      }
    },

    // Data loading methods
    async loadAllChartData() {
      const promises = [
        this.loadSeverityData(),
        this.loadCategoryData(),
        this.loadTypeData(),
      ]

      await Promise.allSettled(promises)
      this.transformChartData()
    },

    async loadSeverityData() {
      if (!this.auditId) return

      this.loading.severity = true
      this.errors.severity = null

      try {
        const data = await ChartService.getAuditSeverityData(this.auditId)
        this.chartData.severity = data
      } catch (error) {
        console.error('Error loading severity data:', error)
        this.errors.severity = error.message
        this.showError(`Failed to load severity data: ${error.message}`)
      } finally {
        this.loading.severity = false
      }
    },

    async loadCategoryData() {
      if (!this.auditId) return

      this.loading.category = true
      this.errors.category = null

      try {
        const data = await ChartService.getAuditCategoryData(this.auditId)
        this.chartData.category = data
      } catch (error) {
        console.error('Error loading category data:', error)
        this.errors.category = error.message
        this.showError(`Failed to load category data: ${error.message}`)
      } finally {
        this.loading.category = false
      }
    },

    async loadTypeData() {
      if (!this.auditId) return

      this.loading.type = true
      this.errors.type = null

      try {
        const data = await ChartService.getAuditTypeData(this.auditId)
        this.chartData.type = data
      } catch (error) {
        console.error('Error loading type data:', error)
        this.errors.type = error.message
        this.showError(`Failed to load type data: ${error.message}`)
      } finally {
        this.loading.type = false
      }
    },

    // Chart control methods
    async refreshChart(chartType) {
      switch (chartType) {
      case 'severity':
        await this.loadSeverityData()
        break
      case 'category':
        await this.loadCategoryData()
        break
      case 'type':
        await this.loadTypeData()
        break
      default:
        await this.loadAllChartData()
      }
      this.transformChartData()
    },

    async refreshAllCharts() {
      await this.loadAllChartData()
      this.showSuccess('Charts refreshed successfully')
    },

    exportChart(chartType) {
      // Chart export functionality can be implemented here
      console.log(`Exporting ${chartType} chart`)
      this.showSuccess(`${chartType} chart export started`)
    },

    changeView(view) {
      this.selectedView = view
    },

    showError(message) {
      const { showToast } = useToast()
      showToast({
        type: 'error',
        message,
        duration: 5000,
      })
    },

    showSuccess(message) {
      const { showToast } = useToast()
      showToast({
        type: 'success',
        message,
        duration: 3000,
      })
    },

    getPieChartOptions() {
      return this.chartOptions.pie
    },

    getBarChartOptions() {
      return this.chartOptions.bar
    },
  },
})
</script>
