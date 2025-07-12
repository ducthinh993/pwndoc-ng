<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="border-b bg-card">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-foreground">{{ $t('vulnerabilities') }}</h1>
            <p class="text-muted-foreground mt-2">{{ $t('manageVulnerabilities') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- No Languages Message -->
      <div v-if="languages.length === 0" class="text-center py-12">
        <Card class="max-w-md mx-auto">
          <CardContent class="pt-6">
            <Alert>
              <AlertCircle class="h-4 w-4" />
              <AlertTitle>{{ $t('noLanguage') }}</AlertTitle>
              <AlertDescription>
                {{ $t('pleaseCreateLanguage') }}
                <router-link to="/data/custom" class="text-primary underline">
                  {{ $t('nav.data') }} -> {{ $t('customData') }} -> {{ $t('languages') }}
                </router-link>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <!-- Vulnerabilities Table -->
      <div v-else>
        <Card>
          <CardHeader>
            <div class="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div class="flex items-center space-x-4">
                <div class="w-48">
                  <Label for="language-select">{{ $t('language') }}</Label>
                  <Select v-model="dtLanguage">
                    <SelectTrigger id="language-select">
                      <SelectValue :placeholder="$t('selectLanguage')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="language in languages"
                        :key="language.locale"
                        :value="language.locale"
                      >
                        {{ language.language }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <!-- Status Toggles -->
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <Switch
                      id="filter-valid"
                      :checked="search.valid === 0"
                      @update:checked="search.valid = $event ? 0 : -1"
                    />
                    <Label for="filter-valid">{{ $t('btn.valid') }}</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Switch
                      id="filter-new"
                      :checked="search.new === 1"
                      @update:checked="search.new = $event ? 1 : -1"
                    />
                    <Label for="filter-new">{{ $t('btn.new') }}</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Switch
                      id="filter-updates"
                      :checked="search.updates === 2"
                      @update:checked="search.updates = $event ? 2 : -1"
                    />
                    <Label for="filter-updates">{{ $t('btn.updates') }}</Label>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <Button
                  v-if="UserService.isAllowed('vulnerabilities:update')"
                  variant="outline"
                  @click="openMergeModal"
                >
                  <Merge class="w-4 h-4 mr-2" />
                  {{ $t('mergeVulnerabilities') }}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button v-if="UserService.isAllowed('vulnerabilities:create')">
                      <Plus class="w-4 h-4 mr-2" />
                      {{ $t('btn.create') }}
                      <ChevronDown class="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem @click="openCreateModal()">
                      {{ $t('addVulnerability') }}
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="openCreateModal(null)">
                      {{ $t('addVulnerabilityNoCategory') }}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      v-for="category in vulnCategories"
                      :key="category.name"
                      @click="openCreateModal(category)"
                    >
                      {{ $t('addVulnerability') }} ({{ category.name }})
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <!-- Search Filters -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <Input
                  v-model="search.title"
                  :placeholder="$t('searchTitle')"
                  class="w-full"
                />
              </div>
              <div>
                <Select v-model="search.category">
                  <SelectTrigger>
                    <SelectValue :placeholder="$t('searchCategory')" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{{ $t('allCategories') }}</SelectItem>
                    <SelectItem
                      v-for="category in vulnCategoriesOptions"
                      :key="category"
                      :value="category"
                    >
                      {{ category }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select v-model="search.type">
                  <SelectTrigger>
                    <SelectValue :placeholder="$t('searchType')" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{{ $t('allTypes') }}</SelectItem>
                    <SelectItem
                      v-for="type in vulnTypeOptions"
                      :key="type"
                      :value="type"
                    >
                      {{ type }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  v-model="search.updatedAt"
                  :placeholder="$t('searchDate')"
                  class="w-full"
                />
              </div>
            </div>

            <!-- Data Table -->
            <div class="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-[45%]">
                      <Button
                        variant="ghost"
                        @click="updateSort('title')"
                        class="h-auto p-0 font-semibold text-left justify-start"
                      >
                        {{ $t('title') }}
                        <ArrowUpDown class="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead class="w-[15%]">
                      <Button
                        variant="ghost"
                        @click="updateSort('category')"
                        class="h-auto p-0 font-semibold text-left justify-start"
                      >
                        {{ $t('category') }}
                        <ArrowUpDown class="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead class="w-[15%]">
                      <Button
                        variant="ghost"
                        @click="updateSort('type')"
                        class="h-auto p-0 font-semibold text-left justify-start"
                      >
                        {{ $t('type') }}
                        <ArrowUpDown class="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead class="w-[15%]">
                      <Button
                        variant="ghost"
                        @click="updateSort('updatedAt')"
                        class="h-auto p-0 font-semibold text-left justify-start"
                      >
                        {{ $t('lastUpdated') }}
                        <ArrowUpDown class="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead class="w-[10%]">{{ $t('actions') }}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-if="loading">
                    <TableCell :colspan="5" class="text-center py-12">
                      <div class="flex items-center justify-center">
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                        {{ $t('loading') }}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    v-else-if="paginatedVulnerabilities.length === 0"
                  >
                    <TableCell :colspan="5" class="text-center py-12">
                      {{ $t('noVulnerabilitiesFound') }}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    v-else
                    v-for="vulnerability in paginatedVulnerabilities"
                    :key="vulnerability._id"
                    class="cursor-pointer hover:bg-muted/50"
                    @dblclick="dblClick(vulnerability)"
                  >
                    <TableCell>
                      <div class="flex items-center space-x-2">
                        <Badge
                          :variant="getStatusVariant(vulnerability.status)"
                          class="text-xs"
                        >
                          {{ getStatusLabel(vulnerability.status) }}
                        </Badge>
                        <span class="font-medium">{{ getDtTitle(vulnerability) }}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {{ vulnerability.category || $t('noCategory') }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {{ getDtType(vulnerability) }}
                    </TableCell>
                    <TableCell>
                      {{ getDtUpdatedAt(vulnerability) }}
                    </TableCell>
                    <TableCell>
                      <div class="flex items-center space-x-1">
                        <Button
                          v-if="UserService.isAllowed('vulnerabilities:update')"
                          variant="ghost"
                          size="sm"
                          @click.stop="editVulnerability(vulnerability)"
                        >
                          <Edit class="h-4 w-4" />
                        </Button>
                        <Button
                          v-else
                          variant="ghost"
                          size="sm"
                          @click.stop="viewVulnerability(vulnerability)"
                        >
                          <Eye class="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          @click.stop="goToAudits(vulnerability)"
                        >
                          <Search class="h-4 w-4" />
                        </Button>
                        <Button
                          v-if="UserService.isAllowed('vulnerabilities:delete')"
                          variant="ghost"
                          size="sm"
                          @click.stop="confirmDeleteVulnerability(vulnerability)"
                        >
                          <Trash2 class="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-4">
              <div class="text-sm text-muted-foreground">
                {{ $t('showingResults', { 
                  start: ((currentPage - 1) * pageSize) + 1,
                  end: Math.min(currentPage * pageSize, filteredVulnerabilities.length),
                  total: filteredVulnerabilities.length
                }) }}
              </div>
              <div class="flex items-center space-x-2">
                <Label for="page-size">{{ $t('resultsPerPage') }}</Label>
                <Select v-model="pageSize">
                  <SelectTrigger id="page-size" class="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="0">{{ $t('all') }}</SelectItem>
                  </SelectContent>
                </Select>
                <div class="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="currentPage = 1"
                    :disabled="currentPage === 1"
                  >
                    <ChevronsLeft class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                  >
                    <ChevronLeft class="h-4 w-4" />
                  </Button>
                  <span class="text-sm px-2">
                    {{ $t('pageOfPages', { current: currentPage, total: totalPages }) }}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                  >
                    <ChevronRight class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    @click="currentPage = totalPages"
                    :disabled="currentPage === totalPages"
                  >
                    <ChevronsRight class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Create Vulnerability Modal -->
    <Dialog :open="showCreateModal" @update:open="showCreateModal = $event">
      <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <span v-if="currentCategory">{{ $t('addVulnerability') }} ({{ currentCategory.name }})</span>
            <span v-else>{{ $t('addVulnerability') }} ({{ $t('noCategory') }})</span>
          </DialogTitle>
        </DialogHeader>

        <div class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="md:col-span-8">
              <Label for="create-title">{{ $t('title') }} *</Label>
              <Input
                id="create-title"
                v-model="currentVulnerability.details[currentDetailsIndex].title"
                :placeholder="$t('title')"
                :class="{ 'border-destructive': errors.title }"
                @keyup.enter="createVulnerability"
              />
              <p v-if="errors.title" class="text-sm text-destructive mt-1">{{ errors.title }}</p>
            </div>
            <div class="md:col-span-2">
              <Label for="create-type">{{ $t('type') }}</Label>
              <Select v-model="currentVulnerability.details[currentDetailsIndex].vulnType">
                <SelectTrigger id="create-type">
                  <SelectValue :placeholder="$t('selectType')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="type in vulnTypesLang"
                    :key="type.name"
                    :value="type.name"
                  >
                    {{ type.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="md:col-span-2">
              <Label for="create-language">{{ $t('language') }}</Label>
              <Select v-model="currentLanguage">
                <SelectTrigger id="create-language">
                  <SelectValue :placeholder="$t('selectLanguage')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="language in languages"
                    :key="language.locale"
                    :value="language.locale"
                  >
                    {{ language.language }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Description -->
          <div>
            <Label>{{ $t('description') }}</Label>
            <div class="border rounded-md p-4 min-h-[200px] bg-background">
              <BasicEditor
                :collab="false"
                :id-unique="currentVulnerability._id + '-description'"
                v-model="currentVulnerability.details[currentDetailsIndex].description"
                :key="currentDetailsIndex"
                :disabled="lenCurrentTitle === 0"
                :editable="lenCurrentTitle > 0"
              />
            </div>
          </div>

          <!-- Observation -->
          <div>
            <Label>{{ $t('observation') }}</Label>
            <div class="border rounded-md p-4 min-h-[200px] bg-background">
              <BasicEditor
                :collab="false"
                :id-unique="currentVulnerability._id + '-observation'"
                v-model="currentVulnerability.details[currentDetailsIndex].observation"
                :key="currentDetailsIndex"
                :disabled="lenCurrentTitle === 0"
                :editable="lenCurrentTitle > 0"
              />
            </div>
          </div>

          <!-- CVSS Calculator -->
          <div>
            <Label>{{ $t('cvssScore') }}</Label>
            <div class="border rounded-md p-4">
              <CvssCalculator
                v-model="currentVulnerability.cvssv3"
                @cvss-score-change="currentVulnerability.cvssScore = $event"
              />
            </div>
          </div>

          <!-- Remediation -->
          <div>
            <Label>{{ $t('remediation') }}</Label>
            <div class="border rounded-md p-4 min-h-[200px] bg-background">
              <BasicEditor
                :collab="false"
                :id-unique="currentVulnerability._id + '-remediation'"
                v-model="currentVulnerability.details[currentDetailsIndex].remediation"
                :key="currentDetailsIndex"
                :disabled="lenCurrentTitle === 0"
                :editable="lenCurrentTitle > 0"
              />
            </div>
          </div>

          <!-- Priority and Complexity -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="create-priority">{{ $t('remediationPriority') }}</Label>
              <Select v-model="currentVulnerability.priority">
                <SelectTrigger id="create-priority">
                  <SelectValue :placeholder="$t('selectPriority')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{{ $t('low') }}</SelectItem>
                  <SelectItem value="2">{{ $t('medium') }}</SelectItem>
                  <SelectItem value="3">{{ $t('high') }}</SelectItem>
                  <SelectItem value="4">{{ $t('urgent') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="create-complexity">{{ $t('remediationComplexity') }}</Label>
              <Select v-model="currentVulnerability.remediationComplexity">
                <SelectTrigger id="create-complexity">
                  <SelectValue :placeholder="$t('selectComplexity')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{{ $t('easy') }}</SelectItem>
                  <SelectItem value="2">{{ $t('medium') }}</SelectItem>
                  <SelectItem value="3">{{ $t('complex') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- References -->
          <div>
            <Label>{{ $t('references') }}</Label>
            <TextareaArray 
              v-model="currentVulnerability.details[currentDetailsIndex].references"
              :key="currentDetailsIndex"
              :disabled="lenCurrentTitle === 0"
              :readonly="lenCurrentTitle === 0"
            />
          </div>

          <!-- Custom Fields -->
          <Collapsible class="space-y-2">
            <CollapsibleTrigger as-child>
              <Button variant="outline" class="w-full justify-between">
                {{ $t('customFields') }}
                <ChevronDown class="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent class="space-y-4">
              <CustomFields
                ref="customfields"
                :collab="false"
                v-model="currentVulnerability.details[currentDetailsIndex].customFields"
                :key="currentDetailsIndex"
                :disabled="lenCurrentTitle === 0"
                :readonly="lenCurrentTitle === 0"
                :category="currentVulnerability.category"
                :id-unique="currentDetailsIndex + currentVulnerability._id"
                display="vuln"
                :locale="currentLanguage"
              />
            </CollapsibleContent>
          </Collapsible>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showCreateModal = false">
            {{ $t('btn.cancel') }}
          </Button>
          <Button @click="createVulnerability">
            {{ $t('btn.create') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Vulnerability Modal -->
    <Dialog :open="showEditModal" @update:open="showEditModal = $event">
      <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div class="flex items-center justify-between">
            <DialogTitle>
              <span v-if="currentVulnerability.category">{{ $t('editVulnerability') }} ({{ currentVulnerability.category }})</span>
              <span v-else>{{ $t('editVulnerability') }} ({{ $t('noCategory') }})</span>
            </DialogTitle>
            <div class="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="outline" size="sm">
                    {{ $t('changeCategory') }}
                    <ChevronDown class="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem @click="editChangeCategory()">
                    {{ $t('noCategory') }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    v-for="category in vulnCategories"
                    :key="category.name"
                    @click="editChangeCategory(category)"
                  >
                    {{ category.name }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Badge v-if="currentVulnerability.creator" variant="secondary">
                {{ $t('creator') }}: {{ currentVulnerability.creator.username }}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="md:col-span-8">
              <Label for="edit-title">{{ $t('title') }} *</Label>
              <Input
                id="edit-title"
                v-model="currentVulnerability.details[currentDetailsIndex].title"
                :placeholder="$t('title')"
                :class="{ 'border-destructive': errors.title }"
                @keyup.enter="updateVulnerability"
              />
              <p v-if="errors.title" class="text-sm text-destructive mt-1">{{ errors.title }}</p>
            </div>
            <div class="md:col-span-2">
              <Label for="edit-type">{{ $t('type') }}</Label>
              <Select 
                v-model="currentVulnerability.details[currentDetailsIndex].vulnType"
                :disabled="lenCurrentTitle === 0"
              >
                <SelectTrigger id="edit-type">
                  <SelectValue :placeholder="$t('selectType')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="type in vulnTypesLang"
                    :key="type.name"
                    :value="type.name"
                  >
                    {{ type.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="md:col-span-2">
              <Label for="edit-language">{{ $t('language') }}</Label>
              <Select v-model="currentLanguage">
                <SelectTrigger id="edit-language">
                  <SelectValue :placeholder="$t('selectLanguage')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="language in languages"
                    :key="language.locale"
                    :value="language.locale"
                  >
                    {{ language.language }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Description -->
          <div>
            <Label>{{ $t('description') }}</Label>
            <div class="border rounded-md p-4 min-h-[200px] bg-background">
              <BasicEditor
                :id-unique="currentVulnerability._id + '-description'"
                v-model="currentVulnerability.details[currentDetailsIndex].description"
                :key="currentDetailsIndex"
                :disabled="lenCurrentTitle === 0"
                :editable="lenCurrentTitle > 0"
              />
            </div>
          </div>

          <!-- Observation -->
          <div>
            <Label>{{ $t('observation') }}</Label>
            <div class="border rounded-md p-4 min-h-[200px] bg-background">
              <BasicEditor
                :id-unique="currentVulnerability._id + '-observation'"
                v-model="currentVulnerability.details[currentDetailsIndex].observation"
                :key="currentDetailsIndex"
                :disabled="lenCurrentTitle === 0"
                :editable="lenCurrentTitle > 0"
              />
            </div>
          </div>

          <!-- CVSS Calculator -->
          <div>
            <Label>{{ $t('cvssScore') }}</Label>
            <div class="border rounded-md p-4">
              <CvssCalculator
                v-model="currentVulnerability.cvssv3"
                @cvss-score-change="currentVulnerability.cvssScore = $event"
              />
            </div>
          </div>

          <!-- Remediation -->
          <div>
            <Label>{{ $t('remediation') }}</Label>
            <div class="border rounded-md p-4 min-h-[200px] bg-background">
              <BasicEditor
                :id-unique="currentVulnerability._id + '-remediation'"
                v-model="currentVulnerability.details[currentDetailsIndex].remediation"
                :key="currentDetailsIndex"
                :disabled="lenCurrentTitle === 0"
                :editable="lenCurrentTitle > 0"
              />
            </div>
          </div>

          <!-- Priority and Complexity -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="edit-priority">{{ $t('remediationPriority') }}</Label>
              <Select v-model="currentVulnerability.priority">
                <SelectTrigger id="edit-priority">
                  <SelectValue :placeholder="$t('selectPriority')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{{ $t('low') }}</SelectItem>
                  <SelectItem value="2">{{ $t('medium') }}</SelectItem>
                  <SelectItem value="3">{{ $t('high') }}</SelectItem>
                  <SelectItem value="4">{{ $t('urgent') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="edit-complexity">{{ $t('remediationComplexity') }}</Label>
              <Select v-model="currentVulnerability.remediationComplexity">
                <SelectTrigger id="edit-complexity">
                  <SelectValue :placeholder="$t('selectComplexity')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{{ $t('easy') }}</SelectItem>
                  <SelectItem value="2">{{ $t('medium') }}</SelectItem>
                  <SelectItem value="3">{{ $t('complex') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- References -->
          <div>
            <Label>{{ $t('references') }}</Label>
            <TextareaArray 
              v-model="currentVulnerability.details[currentDetailsIndex].references"
              :key="currentDetailsIndex"
              :disabled="lenCurrentTitle === 0"
              :readonly="lenCurrentTitle === 0"
            />
          </div>

          <!-- Custom Fields -->
          <Collapsible class="space-y-2">
            <CollapsibleTrigger as-child>
              <Button variant="outline" class="w-full justify-between">
                {{ $t('customFields') }}
                <ChevronDown class="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent class="space-y-4">
              <CustomFields
                ref="customfields"
                v-model="currentVulnerability.details[currentDetailsIndex].customFields"
                :key="currentDetailsIndex"
                :id-unique="currentDetailsIndex + currentVulnerability._id"
                :disabled="lenCurrentTitle === 0"
                :readonly="lenCurrentTitle === 0"
                :locale="currentLanguage"
              />
            </CollapsibleContent>
          </Collapsible>
        </div>

        <DialogFooter v-if="UserService.isAllowed('vulnerabilities:update')">
          <Button variant="outline" @click="showEditModal = false">
            {{ $t('btn.cancel') }}
          </Button>
          <Button 
            v-if="currentVulnerability.status === 1"
            @click="updateVulnerability"
            class="bg-blue-600 hover:bg-blue-700"
          >
            {{ $t('approve') }}
          </Button>
          <Button v-else @click="updateVulnerability">
            {{ $t('btn.update') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Updates Comparison Modal -->
    <Dialog :open="showUpdatesModal" @update:open="showUpdatesModal = $event">
      <DialogContent class="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{{ $t('updateVulnerability') }}</DialogTitle>
        </DialogHeader>

        <div class="flex h-[80vh] space-x-4">
          <!-- Current Version -->
          <div class="flex-1 border rounded-lg overflow-hidden">
            <div class="bg-muted px-4 py-2 border-b">
              <h3 class="font-semibold">{{ $t('current') }}</h3>
            </div>
            <div class="p-4 overflow-y-auto h-full space-y-4">
              <!-- Current vulnerability content... Similar structure to edit modal -->
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div class="md:col-span-8">
                    <Label>{{ $t('title') }} *</Label>
                    <Input
                      v-model="currentVulnerability.details[currentDetailsIndex].title"
                      :class="{ 'border-destructive': errors.title }"
                    />
                  </div>
                  <!-- Add other fields as needed -->
                </div>
              </div>
            </div>
          </div>

          <!-- Updates Version -->
          <div class="flex-1 border rounded-lg overflow-hidden">
            <div class="bg-muted px-4 py-2 border-b">
              <h3 class="font-semibold">{{ $t('updates') }}</h3>
            </div>
            <div class="p-4 overflow-y-auto h-full">
              <Tabs v-model="currentUpdate" class="w-full">
                <TabsList class="grid w-full grid-cols-1" style="grid-template-columns: repeat(auto-fit, minmax(100px, 1fr))">
                  <TabsTrigger 
                    v-for="update in vulnUpdates"
                    :key="update._id"
                    :value="update._id"
                  >
                    {{ getLanguageByLocale(update.locale) }}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent
                  v-for="update in vulnUpdates"
                  :key="update._id"
                  :value="update._id"
                  class="space-y-4"
                >
                  <!-- Update content with diff highlighting -->
                  <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div class="md:col-span-8">
                        <Label>{{ $t('title') }}</Label>
                        <Input
                          :value="update.title"
                          readonly
                          class="bg-muted"
                        />
                      </div>
                      <!-- Add other fields as needed with diff highlighting -->
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showUpdatesModal = false">
            {{ $t('btn.cancel') }}
          </Button>
          <Button @click="updateVulnerability" class="bg-orange-600 hover:bg-orange-700">
            {{ $t('btn.update') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Merge Vulnerabilities Modal -->
    <Dialog :open="showMergeModal" @update:open="showMergeModal = $event">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{{ $t('mergeVulnerabilities') }}</DialogTitle>
        </DialogHeader>

        <div v-if="languages.length < 2" class="py-8">
          <Alert>
            <AlertCircle class="h-4 w-4" />
            <AlertDescription v-html="$t('mergeVulnerabilitiesInfo')"></AlertDescription>
          </Alert>
        </div>

        <div v-else class="grid grid-cols-2 gap-6">
          <!-- Left Side -->
          <div class="space-y-4">
            <div>
              <Label for="merge-lang-left">{{ $t('languageAddFromRight') }}</Label>
              <Select v-model="mergeLanguageLeft" @update:model-value="mergeVulnLeft = ''">
                <SelectTrigger id="merge-lang-left">
                  <SelectValue :placeholder="$t('selectLanguage')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="language in languages"
                    :key="language.locale"
                    :value="language.locale"
                  >
                    {{ language.language }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div class="border rounded-lg h-64 overflow-y-auto">
              <RadioGroup v-model="mergeVulnLeft" class="p-4">
                <div
                  v-for="vuln in filteredVulnerabilitiesLeft"
                  :key="vuln._id"
                  class="flex items-center space-x-2"
                >
                  <RadioGroupItem :value="vuln._id" />
                  <Label class="flex-1 cursor-pointer">
                    {{ getVulnTitleLocale(vuln, mergeLanguageLeft) }}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <!-- Right Side -->
          <div class="space-y-4">
            <div>
              <Label for="merge-lang-right">{{ $t('languageMoveToLeft') }}</Label>
              <Select v-model="mergeLanguageRight" @update:model-value="mergeVulnRight = ''">
                <SelectTrigger id="merge-lang-right">
                  <SelectValue :placeholder="$t('selectLanguage')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="language in languages"
                    :key="language.locale"
                    :value="language.locale"
                  >
                    {{ language.language }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div class="border rounded-lg h-64 overflow-y-auto">
              <RadioGroup v-model="mergeVulnRight" class="p-4">
                <div
                  v-for="vuln in filteredVulnerabilitiesRight"
                  :key="vuln._id"
                  class="flex items-center space-x-2"
                >
                  <RadioGroupItem :value="vuln._id" />
                  <Label class="flex-1 cursor-pointer">
                    {{ getVulnTitleLocale(vuln, mergeLanguageRight) }}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            @click="mergeVulnerabilities"
            :disabled="!mergeVulnLeft || !mergeVulnRight"
          >
            {{ $t('merge') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { _ } from 'lodash'
import {
  Plus, Edit, Eye, Search, Trash2, ChevronDown, ArrowUpDown,
  Loader2, AlertCircle, Merge, ChevronsLeft, ChevronLeft,
  ChevronRight, ChevronsRight
} from 'lucide-vue-next'

// Shadcn Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

// Custom Components
import BasicEditor from '@/components/editor'
import CvssCalculator from '@/components/cvsscalculator'
import TextareaArray from '@/components/textarea-array'
import CustomFields from '@/components/custom-fields'

// Services
import VulnerabilityService from '@/services/vulnerability'
import DataService from '@/services/data'
import UserService from '@/services/user'
import Utils from '@/services/utils'

// Toast composable
import { useToast } from '@/composables/useToast'

const { t: $t } = useI18n()
const router = useRouter()
const { toast } = useToast()

// Data
const vulnerabilities = ref([])
const loading = ref(true)
const languages = ref([])
const vulnTypes = ref([])
const vulnCategories = ref([])
const customFields = ref([])

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showUpdatesModal = ref(false)
const showMergeModal = ref(false)

// Current data
const currentVulnerability = reactive({
  cvssv3: '',
  priority: '',
  remediationComplexity: '',
  details: []
})
const currentDetailsIndex = ref(0)
const currentLanguage = ref('')
const dtLanguage = ref('')
const vulnerabilityId = ref('')
const currentCategory = ref(null)

// Updates data
const vulnUpdates = ref([])
const currentUpdate = ref('')

// Merge data
const mergeLanguageLeft = ref('')
const mergeLanguageRight = ref('')
const mergeVulnLeft = ref('')
const mergeVulnRight = ref('')

// Search and filtering
const search = reactive({
  title: '',
  type: '',
  category: '',
  updatedAt: '',
  valid: 0,
  new: 1,
  updates: 2
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(25)

// Sorting
const sortBy = ref('title')
const sortDescending = ref(false)

// Errors
const errors = reactive({
  title: ''
})

// Computed Properties
const lenCurrentTitle = computed(() => {
  if (currentVulnerability.details[currentDetailsIndex.value]) {
    return currentVulnerability.details[currentDetailsIndex.value].title.length
  }
  return 0
})

const vulnTypesLang = computed(() => {
  return vulnTypes.value.filter(type => type.locale === currentLanguage.value)
})

const computedVulnerabilities = computed(() => {
  if (!dtLanguage.value) return []
  return vulnerabilities.value.filter(vuln =>
    vuln.details.some(detail => detail.locale === dtLanguage.value && detail.title)
  )
})

const filteredVulnerabilities = computed(() => {
  return computedVulnerabilities.value.filter(vuln => {
    const title = getDtTitle(vuln).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const category = (vuln.category || $t('noCategory')).toLowerCase()
    const type = getDtType(vuln).toLowerCase()
    const updatedAt = getDtUpdatedAt(vuln)
    
    const termTitle = (search.title || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const termCategory = (search.category || "").toLowerCase()
    const termVulnType = (search.type || "").toLowerCase()
    const termUpdatedAt = (search.updatedAt || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    return title.indexOf(termTitle) > -1 && 
      type.indexOf(termVulnType || "") > -1 &&
      category.indexOf(termCategory || "") > -1 &&
      updatedAt.indexOf(termUpdatedAt) > -1 &&
      (vuln.status === search.valid || vuln.status === search.new || vuln.status === search.updates)
  })
})

const sortedVulnerabilities = computed(() => {
  const data = [...filteredVulnerabilities.value]
  
  data.sort((a, b) => {
    let aVal, bVal
    
    switch (sortBy.value) {
      case 'title':
        aVal = getDtTitle(a) || ''
        bVal = getDtTitle(b) || ''
        break
      case 'category':
        aVal = a.category || $t('noCategory')
        bVal = b.category || $t('noCategory')
        break
      case 'type':
        aVal = getDtType(a) || ''
        bVal = getDtType(b) || ''
        break
      case 'updatedAt':
        aVal = getDtUpdatedAt(a) || ''
        bVal = getDtUpdatedAt(b) || ''
        break
      default:
        return 0
    }
    
    const comparison = aVal.localeCompare(bVal)
    return sortDescending.value ? -comparison : comparison
  })
  
  return data
})

const paginatedVulnerabilities = computed(() => {
  if (pageSize.value === 0) return sortedVulnerabilities.value
  
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedVulnerabilities.value.slice(start, end)
})

const totalPages = computed(() => {
  if (pageSize.value === 0) return 1
  return Math.ceil(filteredVulnerabilities.value.length / pageSize.value)
})

const vulnCategoriesOptions = computed(() => {
  const result = vulnCategories.value.map(cat => cat.name)
  result.unshift('No Category')
  return result
})

const vulnTypeOptions = computed(() => {
  const result = vulnTypes.value.filter(type => type.locale === dtLanguage.value).map(type => type.name)
  result.unshift('Undefined')
  return result
})

const filteredVulnerabilitiesLeft = computed(() => {
  if (!mergeLanguageLeft.value) return []
  return vulnerabilities.value.filter(
    vuln => vuln && vuln.details && getVulnTitleLocale(vuln, mergeLanguageLeft.value) !== 'undefined'
  )
})

const filteredVulnerabilitiesRight = computed(() => {
  if (!mergeLanguageRight.value) return []
  return vulnerabilities.value.filter(
    vuln => vuln && vuln.details && getVulnTitleLocale(vuln, mergeLanguageRight.value) !== 'undefined'
  )
})

// Watch for language changes
watch(currentLanguage, () => {
  setCurrentDetails()
})

// Methods
const getLanguages = async () => {
  try {
    const data = await DataService.getLanguages()
    languages.value = data.data.datas
    if (languages.value.length > 0) {
      dtLanguage.value = languages.value[0].locale
      cleanCurrentVulnerability()
    }
  } catch (err) {
    console.error(err)
  }
}

const getCustomFields = async () => {
  try {
    const data = await DataService.getCustomFields()
    customFields.value = _.cloneDeep(data.data.datas)
  } catch (err) {
    console.error(err)
  }
}

const getVulnTypes = async () => {
  try {
    const data = await DataService.getVulnerabilityTypes()
    vulnTypes.value = data.data.datas
  } catch (err) {
    console.error(err)
  }
}

const getVulnerabilityCategories = async () => {
  try {
    const data = await DataService.getVulnerabilityCategories()
    vulnCategories.value = data.data.datas
  } catch (err) {
    console.error(err)
  }
}

const getVulnerabilities = async () => {
  loading.value = true
  try {
    const data = await VulnerabilityService.getVulnerabilities()
    vulnerabilities.value = data.data.datas
  } catch (err) {
    console.error(err)
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  } finally {
    loading.value = false
  }
}

const createVulnerability = async () => {
  cleanErrors()
  const index = currentVulnerability.details.findIndex(obj => obj.title !== '')
  if (index < 0) {
    errors.title = $t('err.titleRequired')
    return
  }

  try {
    await VulnerabilityService.createVulnerabilities([currentVulnerability])
    await getVulnerabilities()
    showCreateModal.value = false
    toast({
      title: $t('success'),
      description: $t('msg.vulnerabilityCreatedOk')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const updateVulnerability = async () => {
  cleanErrors()
  const index = currentVulnerability.details.findIndex(obj => obj.title !== '')
  if (index < 0) {
    errors.title = $t('err.titleRequired')
    return
  }

  try {
    await VulnerabilityService.updateVulnerability(vulnerabilityId.value, currentVulnerability)
    await getVulnerabilities()
    showEditModal.value = false
    showUpdatesModal.value = false
    toast({
      title: $t('success'),
      description: $t('msg.vulnerabilityUpdatedOk')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const deleteVulnerability = async (vulnerabilityId) => {
  try {
    await VulnerabilityService.deleteVulnerability(vulnerabilityId)
    await getVulnerabilities()
    toast({
      title: $t('success'),
      description: $t('msg.vulnerabilityDeletedOk')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const confirmDeleteVulnerability = (row) => {
  if (confirm($t('msg.vulnerabilityWillBeDeleted'))) {
    deleteVulnerability(row._id)
  }
}

const getVulnUpdates = async (vulnId) => {
  try {
    const data = await VulnerabilityService.getVulnUpdates(vulnId)
    vulnUpdates.value = data.data.datas
    vulnUpdates.value.forEach(vuln => {
      vuln.customFields = Utils.filterCustomFields('vulnerability', currentVulnerability.category, customFields.value, vuln.customFields, vuln.locale)
    })
    if (vulnUpdates.value.length > 0) {
      currentUpdate.value = vulnUpdates.value[0]._id || null
      currentLanguage.value = vulnUpdates.value[0].locale || null
    }
  } catch (err) {
    console.error(err)
  }
}

const clone = (row) => {
  cleanCurrentVulnerability()
  Object.assign(currentVulnerability, _.cloneDeep(row))
  setCurrentDetails()
  vulnerabilityId.value = row._id
  if (UserService.isAllowed('vulnerabilities:update')) {
    getVulnUpdates(vulnerabilityId.value)
  }
}

const editChangeCategory = (category) => {
  if (confirm($t('msg.categoryChangingNotice'))) {
    if (category) {
      currentVulnerability.category = category.name
    } else {
      currentVulnerability.category = null
    }
    setCurrentDetails()
  }
}

const cleanErrors = () => {
  errors.title = ''
}

const cleanCurrentVulnerability = () => {
  cleanErrors()
  currentVulnerability.cvssv3 = ''
  currentVulnerability.priority = ''
  currentVulnerability.remediationComplexity = ''
  currentVulnerability.details = []
  currentLanguage.value = dtLanguage.value
  
  if (currentCategory.value && currentCategory.value.name) {
    currentVulnerability.category = currentCategory.value.name
  } else {
    currentVulnerability.category = null
  }
  
  setCurrentDetails()
}

const setCurrentDetails = () => {
  let index = currentVulnerability.details.findIndex(obj => obj.locale === currentLanguage.value)
  
  if (index < 0) {
    const details = {
      locale: currentLanguage.value,
      title: '',
      vulnType: '',
      updatedAt: '',
      description: '',
      observation: '',
      remediation: '',
      references: [],
      customFields: []
    }
    
    details.customFields = _.cloneDeep(Utils.filterCustomFields('vulnerability', currentVulnerability.category, customFields.value, [], currentLanguage.value))
    currentVulnerability.details.push(details)
    index = currentVulnerability.details.length - 1
  } else {
    currentVulnerability.details[index].customFields = _.cloneDeep(Utils.filterCustomFields('vulnerability', currentVulnerability.category, customFields.value, currentVulnerability.details[index].customFields, currentLanguage.value))
  }
  
  currentDetailsIndex.value = index
}

const getDtTitle = (row) => {
  const index = row.details.findIndex(obj => obj.locale === dtLanguage.value)
  if (index < 0 || !row.details[index].title) {
    return $t('err.notDefinedLanguage')
  }
  return row.details[index].title
}

const getDtType = (row) => {
  const index = row.details.findIndex(obj => obj.locale === dtLanguage.value)
  if (index < 0 || !row.details[index].vulnType) {
    return "Undefined"
  }
  return row.details[index].vulnType
}

const getDtUpdatedAt = (row) => {
  if (!row.updatedAt) {
    return "Undefined"
  }
  return new Date(row.updatedAt).toLocaleDateString('es-CL')
}

const getStatusVariant = (status) => {
  switch (status) {
    case 0: return 'default'
    case 1: return 'secondary'
    case 2: return 'destructive'
    default: return 'outline'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 0: return $t('valid')
    case 1: return $t('new')
    case 2: return $t('updates')
    default: return $t('unknown')
  }
}

const updateSort = (column) => {
  if (sortBy.value === column) {
    sortDescending.value = !sortDescending.value
  } else {
    sortBy.value = column
    sortDescending.value = false
  }
}

const goToAudits = (row) => {
  const title = getDtTitle(row)
  router.push({ name: 'audits_by_find', params: { finding: title } })
}

const getVulnTitleLocale = (vuln, locale) => {
  if (!vuln || !Array.isArray(vuln.details)) {
    return "undefined"
  }
  
  for (let i = 0; i < vuln.details.length; i++) {
    if (vuln.details[i].locale === locale && vuln.details[i].title) {
      return vuln.details[i].title
    }
  }
  
  return "undefined"
}

const getLanguageByLocale = (locale) => {
  const language = languages.value.find(lang => lang.locale === locale)
  return language ? language.language : locale
}

const mergeVulnerabilities = async () => {
  try {
    await VulnerabilityService.mergeVulnerability(mergeVulnLeft.value, mergeVulnRight.value, mergeLanguageRight.value)
    await getVulnerabilities()
    showMergeModal.value = false
    toast({
      title: $t('success'),
      description: $t('msg.vulnerabilityMergeOk')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const dblClick = (row) => {
  clone(row)
  if (UserService.isAllowed('vulnerabilities:update') && row.status === 2) {
    showUpdatesModal.value = true
  } else {
    showEditModal.value = true
  }
}

const openCreateModal = (category = null) => {
  currentCategory.value = category
  cleanCurrentVulnerability()
  showCreateModal.value = true
}

const openMergeModal = () => {
  mergeLanguageLeft.value = ''
  mergeLanguageRight.value = ''
  mergeVulnLeft.value = ''
  mergeVulnRight.value = ''
  showMergeModal.value = true
}

const editVulnerability = (vulnerability) => {
  clone(vulnerability)
  if (vulnerability.status === 2) {
    showUpdatesModal.value = true
  } else {
    showEditModal.value = true
  }
}

const viewVulnerability = (vulnerability) => {
  clone(vulnerability)
  showEditModal.value = true
}

// Lifecycle
onMounted(() => {
  getLanguages()
  getVulnTypes()
  getVulnerabilities()
  getVulnerabilityCategories()
  getCustomFields()
})
</script>

<style scoped>
.basic-editor {
  min-height: 150px;
}
</style>