<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="border-b bg-card">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-foreground">{{ $t('customData') }}</h1>
            <p class="text-muted-foreground mt-2">{{ $t('manageCustomSettings') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Tabs -->
      <Tabs :value="selectedTab" @update:value="selectedTab = $event" class="w-full">
        <TabsList class="grid w-full grid-cols-6">
          <TabsTrigger value="languages">{{ $t('languages') }}</TabsTrigger>
          <TabsTrigger value="audit-types">{{ $t('auditTypes') }}</TabsTrigger>
          <TabsTrigger value="vulnerability-types">{{ $t('vulnerabilityTypes') }}</TabsTrigger>
          <TabsTrigger value="vulnerability-categories">{{ $t('vulnerabilityCategories') }}</TabsTrigger>
          <TabsTrigger value="custom-fields">{{ $t('customFields') }}</TabsTrigger>
          <TabsTrigger value="custom-sections">{{ $t('customSections') }}</TabsTrigger>
        </TabsList>

        <!-- Languages Tab -->
        <TabsContent value="languages" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('languages') }}</CardTitle>
              <CardDescription>{{ $t('languageUsedInAuditsAndVuls') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Create Language Section -->
                <div v-if="UserService.isAllowed('languages:create')">
                  <div class="space-y-4">
                    <h3 class="text-lg font-semibold">{{ $t('addLanguage') }}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label for="language-input">{{ $t('language') }}</Label>
                        <Input
                          id="language-input"
                          v-model="newLanguage.language"
                          :placeholder="$t('language')"
                          @keyup.enter="createLanguage"
                        />
                      </div>
                      <div>
                        <Label for="locale-input">{{ $t('locale') }}</Label>
                        <Input
                          id="locale-input"
                          v-model="newLanguage.locale"
                          :placeholder="$t('locale')"
                          @keyup.enter="createLanguage"
                        />
                      </div>
                    </div>
                    <Button @click="createLanguage" class="w-full md:w-auto">
                      <Plus class="w-4 h-4 mr-2" />
                      {{ $t('btn.add') }}
                    </Button>
                  </div>
                </div>

                <!-- Language List Section -->
                <div v-if="!editLanguage && languages.length > 0">
                  <Card>
                    <CardHeader class="flex flex-row items-center justify-between">
                      <CardTitle>{{ $t('listOfLanguages') }}</CardTitle>
                      <Button
                        v-if="UserService.isAllowed('languages:update')"
                        variant="outline"
                        size="sm"
                        @click="editLanguage = true; editLanguages = $_.cloneDeep(languages)"
                      >
                        <Edit class="w-4 h-4 mr-2" />
                        {{ $t('btn.edit') }}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div class="space-y-4">
                        <div v-for="language in languages" :key="language.locale" class="grid grid-cols-2 gap-4">
                          <div>
                            <Label>{{ $t('language') }}</Label>
                            <Input :value="language.language" readonly class="bg-muted" />
                          </div>
                          <div>
                            <Label>{{ $t('locale') }}</Label>
                            <Input :value="language.locale" readonly class="bg-muted" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <!-- Edit Languages Section -->
                <div v-else-if="editLanguage">
                  <Card>
                    <CardHeader>
                      <CardTitle>{{ $t('editLanguages') }}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <draggable
                        v-model="editLanguages"
                        handle=".handle"
                        :ghost-class="'opacity-50'"
                        item-key="locale"
                      >
                        <template #item="{ element, index }">
                          <div class="flex items-center gap-4 p-4 border rounded-lg mb-4">
                            <GripVertical class="w-5 h-5 text-muted-foreground cursor-move handle" />
                            <div class="grid grid-cols-2 gap-4 flex-1">
                              <div>
                                <Label>{{ $t('language') }}</Label>
                                <Input v-model="element.language" />
                              </div>
                              <div>
                                <Label>{{ $t('locale') }}</Label>
                                <Input v-model="element.locale" />
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              @click="removeLanguage(element.locale)"
                            >
                              <X class="w-4 h-4" />
                            </Button>
                          </div>
                        </template>
                      </draggable>
                    </CardContent>
                    <CardFooter class="flex justify-end gap-2">
                      <Button variant="outline" @click="editLanguage = false">
                        {{ $t('btn.cancel') }}
                      </Button>
                      <Button @click="updateLanguages">
                        {{ $t('btn.save') }}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Audit Types Tab -->
        <TabsContent value="audit-types" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('auditTypes') }}</CardTitle>
              <CardDescription>{{ $t('createAuditTypes') }}</CardDescription>
            </CardHeader>
            <CardContent v-if="languages.length > 0">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Create Audit Type Section -->
                <div v-if="UserService.isAllowed('audit-types:create')">
                  <div class="space-y-4">
                    <h3 class="text-lg font-semibold">{{ $t('addAuditType') }}</h3>
                    <div>
                      <Label for="audit-type-name">{{ $t('name') }}</Label>
                      <Input
                        id="audit-type-name"
                        v-model="newAuditType.name"
                        :placeholder="$t('name')"
                        @keyup.enter="createAuditType"
                      />
                    </div>
                    
                    <!-- Templates for each language -->
                    <div v-for="(language, idx) in languages" :key="idx" class="space-y-2">
                      <Label>{{ language.language }} {{ $t('template') }} <span class="text-destructive">*</span></Label>
                      <Select
                        :value="newAuditType.templates[idx]?.template"
                        @update:value="setAuditTypeTemplate(idx, $event)"
                      >
                        <SelectTrigger>
                          <SelectValue :placeholder="$t('selectTemplate')" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="template in getTemplateOptionsLanguage(language.locale)"
                            :key="template.template"
                            :value="template.template"
                          >
                            {{ template.name }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button @click="createAuditType" class="w-full md:w-auto">
                      <Plus class="w-4 h-4 mr-2" />
                      {{ $t('btn.add') }}
                    </Button>
                  </div>
                </div>

                <!-- Audit Types List / Edit -->
                <div v-if="!editAuditType && auditTypes.length > 0">
                  <Card>
                    <CardHeader class="flex flex-row items-center justify-between">
                      <CardTitle>{{ $t('listOfAuditTypes') }}</CardTitle>
                      <Button
                        v-if="UserService.isAllowed('audit-types:update')"
                        variant="outline"
                        size="sm"
                        @click="editAuditType = true; editAuditTypes = $_.cloneDeep(auditTypes)"
                      >
                        <Edit class="w-4 h-4 mr-2" />
                        {{ $t('btn.edit') }}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div class="space-y-4">
                        <div v-for="auditType in auditTypes" :key="auditType.name" class="border rounded-lg p-4">
                          <h4 class="font-semibold mb-2">{{ auditType.name }}</h4>
                          <div class="space-y-2">
                            <div v-for="(template, idx) in auditType.templates" :key="idx" class="text-sm">
                              <Badge variant="outline">{{ languages[idx]?.language }}: {{ template?.name }}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <!-- Edit Audit Types -->
                <div v-else-if="editAuditType">
                  <Card>
                    <CardHeader>
                      <CardTitle>{{ $t('editAuditTypes') }}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <draggable
                        v-model="editAuditTypes"
                        handle=".handle"
                        :ghost-class="'opacity-50'"
                        item-key="name"
                      >
                        <template #item="{ element: auditType, index }">
                          <div class="border rounded-lg p-4 mb-4">
                            <div class="flex items-center gap-4 mb-4">
                              <GripVertical class="w-5 h-5 text-muted-foreground cursor-move handle" />
                              <div class="flex-1">
                                <Label>{{ $t('name') }}</Label>
                                <Input v-model="auditType.name" />
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                @click="removeAuditType(auditType.name)"
                              >
                                <X class="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <!-- Templates for each language -->
                            <div class="space-y-4">
                              <div v-for="(language, idx) in languages" :key="idx">
                                <Label>{{ language.language }} {{ $t('template') }} <span class="text-destructive">*</span></Label>
                                <Select
                                  :value="auditType.templates[idx]?.template"
                                  @update:value="setEditAuditTypeTemplate(index, idx, $event)"
                                >
                                  <SelectTrigger>
                                    <SelectValue :placeholder="$t('selectTemplate')" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      v-for="template in getTemplateOptionsLanguage(language.locale)"
                                      :key="template.template"
                                      :value="template.template"
                                    >
                                      {{ template.name }}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </template>
                      </draggable>
                    </CardContent>
                    <CardFooter class="flex justify-end gap-2">
                      <Button variant="outline" @click="editAuditType = false">
                        {{ $t('btn.cancel') }}
                      </Button>
                      <Button @click="updateAuditTypes">
                        {{ $t('btn.save') }}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardContent v-else>
              <Alert>
                <AlertCircle class="h-4 w-4" />
                <AlertTitle>{{ $t('noLanguagesAvailable') }}</AlertTitle>
                <AlertDescription>{{ $t('createAtLeastOneLanguage') }}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Vulnerability Types Tab -->
        <TabsContent value="vulnerability-types" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('vulnerabilityTypes') }}</CardTitle>
              <CardDescription>{{ $t('createVulnerabilityTypes') }}</CardDescription>
            </CardHeader>
            <CardContent v-if="languages.length > 0">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Create Vulnerability Type Section -->
                <div v-if="UserService.isAllowed('vulnerability-types:create')">
                  <div class="space-y-4">
                    <h3 class="text-lg font-semibold">{{ $t('addVulnerabilityType') }}</h3>
                    <div>
                      <Label for="vuln-type-language">{{ $t('language') }}</Label>
                      <Select v-model="newVulnType.locale">
                        <SelectTrigger id="vuln-type-language">
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
                    <div>
                      <Label for="vuln-type-name">{{ $t('name') }}</Label>
                      <Input
                        id="vuln-type-name"
                        v-model="newVulnType.name"
                        :placeholder="$t('name')"
                        @keyup.enter="createVulnType"
                      />
                    </div>
                    <Button @click="createVulnType" class="w-full md:w-auto">
                      <Plus class="w-4 h-4 mr-2" />
                      {{ $t('btn.add') }}
                    </Button>
                  </div>
                </div>

                <!-- Vulnerability Types List / Edit -->
                <div v-if="!editVulnType && vulnTypes.length > 0">
                  <Card>
                    <CardHeader class="flex flex-row items-center justify-between">
                      <CardTitle>{{ $t('listOfVulnerabilityTypes') }}</CardTitle>
                      <Button
                        v-if="UserService.isAllowed('vulnerability-types:update')"
                        variant="outline"
                        size="sm"
                        @click="editVulnType = true; editVulnTypes = $_.cloneDeep(vulnTypes)"
                      >
                        <Edit class="w-4 h-4 mr-2" />
                        {{ $t('btn.edit') }}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div class="space-y-2">
                        <div v-for="vulnType in vulnTypes" :key="vulnType._id" class="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span class="font-medium">{{ vulnType.name }}</span>
                            <Badge variant="outline" class="ml-2">{{ getLanguageByLocale(vulnType.locale) }}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <!-- Edit Vulnerability Types -->
                <div v-else-if="editVulnType">
                  <Card>
                    <CardHeader>
                      <CardTitle>{{ $t('editVulnerabilityTypes') }}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <draggable
                        v-model="editVulnTypes"
                        handle=".handle"
                        :ghost-class="'opacity-50'"
                        item-key="_id"
                      >
                        <template #item="{ element: vulnType }">
                          <div class="flex items-center gap-4 p-4 border rounded-lg mb-4">
                            <GripVertical class="w-5 h-5 text-muted-foreground cursor-move handle" />
                            <div class="flex-1">
                              <Label>{{ $t('name') }}</Label>
                              <Input v-model="vulnType.name" />
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              @click="removeVulnType(vulnType)"
                            >
                              <X class="w-4 h-4" />
                            </Button>
                          </div>
                        </template>
                      </draggable>
                    </CardContent>
                    <CardFooter class="flex justify-end gap-2">
                      <Button variant="outline" @click="editVulnType = false">
                        {{ $t('btn.cancel') }}
                      </Button>
                      <Button @click="updateVulnTypes">
                        {{ $t('btn.save') }}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardContent v-else>
              <Alert>
                <AlertCircle class="h-4 w-4" />
                <AlertTitle>{{ $t('noLanguagesAvailable') }}</AlertTitle>
                <AlertDescription>{{ $t('createAtLeastOneLanguage') }}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Vulnerability Categories Tab -->
        <TabsContent value="vulnerability-categories" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('vulnerabilityCategories') }}</CardTitle>
              <CardDescription>{{ $t('createVulnerabilityCategories') }}</CardDescription>
            </CardHeader>
            <CardContent v-if="languages.length > 0">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Create Vulnerability Category Section -->
                <div v-if="UserService.isAllowed('vulnerability-categories:create')">
                  <div class="space-y-4">
                    <h3 class="text-lg font-semibold">{{ $t('addVulnerabilityCategory') }}</h3>
                    <div>
                      <Label for="vuln-cat-name">{{ $t('name') }}</Label>
                      <Input
                        id="vuln-cat-name"
                        v-model="newVulnCat.name"
                        :placeholder="$t('name')"
                        @keyup.enter="createVulnCat"
                      />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label for="sort-value">{{ $t('sortValue') }}</Label>
                        <Select v-model="newVulnCat.sortValue">
                          <SelectTrigger id="sort-value">
                            <SelectValue :placeholder="$t('selectSortValue')" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              v-for="option in sortValueOptions"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label for="sort-order">{{ $t('sortOrder') }}</Label>
                        <Select v-model="newVulnCat.sortOrder">
                          <SelectTrigger id="sort-order">
                            <SelectValue :placeholder="$t('selectSortOrder')" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              v-for="option in sortOrderOptions"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Checkbox
                        id="sort-auto"
                        v-model:checked="newVulnCat.sortAuto"
                      />
                      <Label for="sort-auto">{{ $t('sortAuto') }}</Label>
                    </div>
                    <Button @click="createVulnCat" class="w-full md:w-auto">
                      <Plus class="w-4 h-4 mr-2" />
                      {{ $t('btn.add') }}
                    </Button>
                  </div>
                </div>

                <!-- Vulnerability Categories List / Edit -->
                <div v-if="!editCategory && vulnCategories.length > 0">
                  <Card>
                    <CardHeader class="flex flex-row items-center justify-between">
                      <CardTitle>{{ $t('listOfVulnerabilityCategories') }}</CardTitle>
                      <Button
                        v-if="UserService.isAllowed('vulnerability-categories:update')"
                        variant="outline"
                        size="sm"
                        @click="editCategory = true; editCategories = $_.cloneDeep(vulnCategories)"
                      >
                        <Edit class="w-4 h-4 mr-2" />
                        {{ $t('btn.edit') }}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div class="space-y-2">
                        <div v-for="category in vulnCategories" :key="category.name" class="p-3 border rounded-lg">
                          <div class="flex items-center justify-between">
                            <span class="font-medium">{{ category.name }}</span>
                            <div class="flex items-center gap-2">
                              <Badge variant="outline">{{ getSortValueLabel(category.sortValue) }}</Badge>
                              <Badge variant="outline">{{ getSortOrderLabel(category.sortOrder) }}</Badge>
                              <Badge v-if="category.sortAuto" variant="secondary">{{ $t('auto') }}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <!-- Edit Vulnerability Categories -->
                <div v-else-if="editCategory">
                  <Card>
                    <CardHeader>
                      <CardTitle>{{ $t('editVulnerabilityCategories') }}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <draggable
                        v-model="editCategories"
                        handle=".handle"
                        :ghost-class="'opacity-50'"
                        item-key="name"
                      >
                        <template #item="{ element: category }">
                          <div class="border rounded-lg p-4 mb-4">
                            <div class="flex items-center gap-4 mb-4">
                              <GripVertical class="w-5 h-5 text-muted-foreground cursor-move handle" />
                              <div class="flex-1">
                                <Label>{{ $t('name') }}</Label>
                                <Input v-model="category.name" />
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                @click="removeCategory(category.name)"
                              >
                                <X class="w-4 h-4" />
                              </Button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>{{ $t('sortValue') }}</Label>
                                <Select v-model="category.sortValue">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      v-for="option in sortValueOptions"
                                      :key="option.value"
                                      :value="option.value"
                                    >
                                      {{ option.label }}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>{{ $t('sortOrder') }}</Label>
                                <Select v-model="category.sortOrder">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      v-for="option in sortOrderOptions"
                                      :key="option.value"
                                      :value="option.value"
                                    >
                                      {{ option.label }}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div class="flex items-center space-x-2 mt-4">
                              <Checkbox
                                :id="`sort-auto-${category.name}`"
                                v-model:checked="category.sortAuto"
                              />
                              <Label :for="`sort-auto-${category.name}`">{{ $t('sortAuto') }}</Label>
                            </div>
                          </div>
                        </template>
                      </draggable>
                    </CardContent>
                    <CardFooter class="flex justify-end gap-2">
                      <Button variant="outline" @click="editCategory = false">
                        {{ $t('btn.cancel') }}
                      </Button>
                      <Button @click="updateCategories">
                        {{ $t('btn.save') }}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardContent v-else>
              <Alert>
                <AlertCircle class="h-4 w-4" />
                <AlertTitle>{{ $t('noLanguagesAvailable') }}</AlertTitle>
                <AlertDescription>{{ $t('createAtLeastOneLanguage') }}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Custom Fields Tab -->
        <TabsContent value="custom-fields" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('customFields') }}</CardTitle>
              <CardDescription>{{ $t('createAndManageCustomFields') }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-6">
                <!-- Create Custom Field Form -->
                <div class="border rounded-lg p-6">
                  <h3 class="text-lg font-semibold mb-4">{{ $t('createCustomField') }}</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label for="cf-display">{{ $t('selectView') }}</Label>
                      <Select v-model="newCustomField.display">
                        <SelectTrigger id="cf-display">
                          <SelectValue :placeholder="$t('selectView')" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="option in cfDisplayOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label for="cf-component">{{ $t('selectComponent') }}</Label>
                      <Select v-model="newCustomField.fieldType">
                        <SelectTrigger id="cf-component">
                          <SelectValue :placeholder="$t('selectComponent')" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="option in cfComponentOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label for="cf-label">{{ $t('label') }}</Label>
                      <Input
                        id="cf-label"
                        v-model="newCustomField.label"
                        :placeholder="$t('label')"
                      />
                    </div>
                    <div>
                      <Label for="cf-size">{{ $t('size') }}</Label>
                      <Select v-model="newCustomField.size">
                        <SelectTrigger id="cf-size">
                          <SelectValue :placeholder="$t('selectSize')" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">{{ $t('halfWidth') }}</SelectItem>
                          <SelectItem value="12">{{ $t('fullWidth') }}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Checkbox
                        id="cf-required"
                        v-model:checked="newCustomField.required"
                      />
                      <Label for="cf-required">{{ $t('required') }}</Label>
                    </div>
                  </div>
                  
                  <!-- Options for select/radio/checkbox fields -->
                  <div v-if="['select', 'select-multiple', 'checkbox', 'radio'].includes(newCustomField.fieldType)" class="mt-4">
                    <h4 class="font-medium mb-2">{{ $t('fieldOptions') }}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label for="cf-locale">{{ $t('optionsLanguage') }}</Label>
                        <Select v-model="cfLocale">
                          <SelectTrigger id="cf-locale">
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
                      <div>
                        <Label for="cf-option">{{ $t('addOption') }}</Label>
                        <div class="flex gap-2">
                          <Input
                            id="cf-option"
                            v-model="newCustomOption"
                            :placeholder="$t('optionValue')"
                            @keyup.enter="addCustomFieldOption(newCustomField.options)"
                          />
                          <Button
                            size="sm"
                            @click="addCustomFieldOption(newCustomField.options)"
                            :disabled="!newCustomOption"
                          >
                            <Plus class="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Options List -->
                    <div v-if="newCustomFieldLangOptions.length > 0" class="mt-4">
                      <div class="space-y-2">
                        <div
                          v-for="(option, idx) in newCustomFieldLangOptions"
                          :key="idx"
                          class="flex items-center justify-between p-2 border rounded"
                        >
                          <span>{{ option.value }}</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            @click="removeCustomFieldOption(newCustomField.options, option)"
                          >
                            <X class="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <Button @click="createCustomField" class="w-full md:w-auto">
                      <Plus class="w-4 h-4 mr-2" />
                      {{ $t('btn.add') }}
                    </Button>
                  </div>
                </div>

                <!-- Custom Fields Preview/Edit -->
                <div v-if="canDisplayCustomFields()">
                  <Card>
                    <CardHeader>
                      <CardTitle>{{ $t('customFieldsPreview') }}</CardTitle>
                      <div class="flex items-center gap-4">
                        <div>
                          <Label for="preview-locale">{{ $t('languageForDefaultText') }}</Label>
                          <Select v-model="cfLocale">
                            <SelectTrigger id="preview-locale" class="w-48">
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
                    </CardHeader>
                    <CardContent>
                      <draggable
                        v-model="customFields"
                        item-key="_id"
                        handle=".drag-handle"
                        :ghost-class="'opacity-50'"
                        class="space-y-4"
                      >
                        <template #item="{ element: field }">
                          <div class="border rounded-lg p-4 bg-muted/50">
                            <div class="flex items-center justify-between mb-4">
                              <div class="flex items-center gap-2">
                                <GripVertical class="w-5 h-5 text-muted-foreground cursor-move drag-handle" />
                                <span class="font-medium">{{ field.label }}</span>
                                <Badge variant="outline">{{ field.fieldType }}</Badge>
                                <Badge v-if="field.required" variant="destructive">{{ $t('required') }}</Badge>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                @click="deleteCustomField(field)"
                              >
                                <Trash2 class="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <!-- Field Preview -->
                            <div class="space-y-2">
                              <!-- Text/Rich Editor Field -->
                              <div v-if="field.fieldType === 'text'">
                                <Label>{{ field.label }} <span v-if="field.required" class="text-destructive">*</span></Label>
                                <div class="border rounded-md p-2 min-h-[100px] bg-background">
                                  <BasicEditor
                                    :key="field._id + '-' + cfLocale"
                                    :model-value="getFieldValue(field)"
                                    @update:model-value="setFieldValue(field, $event)"
                                  />
                                </div>
                              </div>
                              
                              <!-- Input Field -->
                              <div v-else-if="field.fieldType === 'input'">
                                <Label>{{ field.label }} <span v-if="field.required" class="text-destructive">*</span></Label>
                                <Input
                                  :value="getFieldValue(field)"
                                  @input="setFieldValue(field, $event.target.value)"
                                />
                              </div>
                              
                              <!-- Date Field -->
                              <div v-else-if="field.fieldType === 'date'">
                                <Label>{{ field.label }} <span v-if="field.required" class="text-destructive">*</span></Label>
                                <Input
                                  type="date"
                                  :value="getFieldValue(field)"
                                  @input="setFieldValue(field, $event.target.value)"
                                />
                              </div>
                              
                              <!-- Select Field -->
                              <div v-else-if="field.fieldType === 'select'">
                                <Label>{{ field.label }} <span v-if="field.required" class="text-destructive">*</span></Label>
                                <Select
                                  :value="getFieldValue(field)"
                                  @update:value="setFieldValue(field, $event)"
                                >
                                  <SelectTrigger>
                                    <SelectValue :placeholder="$t('selectOption')" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      v-for="option in field.options.filter(e => e.locale === cfLocale)"
                                      :key="option.value"
                                      :value="option.value"
                                    >
                                      {{ option.value }}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <!-- Multi Select Field -->
                              <div v-else-if="field.fieldType === 'select-multiple'">
                                <Label>{{ field.label }} <span v-if="field.required" class="text-destructive">*</span></Label>
                                <div class="space-y-2">
                                  <div
                                    v-for="option in field.options.filter(e => e.locale === cfLocale)"
                                    :key="option.value"
                                    class="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      :checked="(getFieldValue(field) || []).includes(option.value)"
                                      @update:checked="toggleMultiSelectOption(field, option.value)"
                                    />
                                    <Label>{{ option.value }}</Label>
                                  </div>
                                </div>
                              </div>
                              
                              <!-- Checkbox Group -->
                              <div v-else-if="field.fieldType === 'checkbox'">
                                <Label>{{ field.label }} <span v-if="field.required" class="text-destructive">*</span></Label>
                                <div class="space-y-2">
                                  <div
                                    v-for="option in field.options.filter(e => e.locale === cfLocale)"
                                    :key="option.value"
                                    class="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      :checked="(getFieldValue(field) || []).includes(option.value)"
                                      @update:checked="toggleMultiSelectOption(field, option.value)"
                                    />
                                    <Label>{{ option.value }}</Label>
                                  </div>
                                </div>
                              </div>
                              
                              <!-- Radio Group -->
                              <div v-else-if="field.fieldType === 'radio'">
                                <Label>{{ field.label }} <span v-if="field.required" class="text-destructive">*</span></Label>
                                <RadioGroup
                                  :value="getFieldValue(field)"
                                  @update:value="setFieldValue(field, $event)"
                                >
                                  <div
                                    v-for="option in field.options.filter(e => e.locale === cfLocale)"
                                    :key="option.value"
                                    class="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem :value="option.value" />
                                    <Label>{{ option.value }}</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                              
                              <!-- Space Field -->
                              <div v-else-if="field.fieldType === 'space'" class="py-4">
                                <div class="text-center text-muted-foreground">{{ $t('spacer') }}</div>
                              </div>
                            </div>
                            
                            <!-- Field Description -->
                            <div v-if="field.description" class="mt-2 text-sm text-muted-foreground">
                              {{ field.description }}
                            </div>
                          </div>
                        </template>
                      </draggable>
                    </CardContent>
                    <CardFooter>
                      <Button
                        @click="updateCustomFields"
                        v-if="UserService.isAllowed('custom-fields:update')"
                      >
                        {{ $t('btn.save') }}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Custom Sections Tab -->
        <TabsContent value="custom-sections" class="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{{ $t('customSections') }}</CardTitle>
              <CardDescription>{{ $t('createAndManageSections') }}</CardDescription>
            </CardHeader>
            <CardContent v-if="languages.length > 0">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Create Section -->
                <div v-if="UserService.isAllowed('custom-sections:create')">
                  <div class="space-y-4">
                    <h3 class="text-lg font-semibold">{{ $t('addSection') }}</h3>
                    <div>
                      <Label for="section-field">{{ $t('field') }}</Label>
                      <Input
                        id="section-field"
                        v-model="newSection.field"
                        :placeholder="$t('field')"
                        @keyup.enter="createSection"
                      />
                    </div>
                    <div>
                      <Label for="section-name">{{ $t('name') }}</Label>
                      <Input
                        id="section-name"
                        v-model="newSection.name"
                        :placeholder="$t('name')"
                        @keyup.enter="createSection"
                      />
                    </div>
                    <div>
                      <Label for="section-icon">{{ $t('customIcon') }}</Label>
                      <div class="flex items-center gap-2">
                        <Input
                          id="section-icon"
                          v-model="newSection.icon"
                          :placeholder="$t('customIcon')"
                          @keyup.enter="createSection"
                        />
                        <div class="w-8 h-8 border rounded flex items-center justify-center">
                          <i :class="newSection.icon" class="text-sm"></i>
                        </div>
                      </div>
                    </div>
                    <Button @click="createSection" class="w-full md:w-auto">
                      <Plus class="w-4 h-4 mr-2" />
                      {{ $t('btn.add') }}
                    </Button>
                  </div>
                </div>

                <!-- Sections List / Edit -->
                <div v-if="!editSection && sections.length > 0">
                  <Card>
                    <CardHeader class="flex flex-row items-center justify-between">
                      <CardTitle>{{ $t('listOfSections') }}</CardTitle>
                      <Button
                        v-if="UserService.isAllowed('custom-sections:update')"
                        variant="outline"
                        size="sm"
                        @click="editSection = true; editSections = $_.cloneDeep(sections)"
                      >
                        <Edit class="w-4 h-4 mr-2" />
                        {{ $t('btn.edit') }}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div class="space-y-2">
                        <div v-for="section in sections" :key="section.field" class="flex items-center justify-between p-3 border rounded-lg">
                          <div class="flex items-center gap-3">
                            <div class="w-8 h-8 border rounded flex items-center justify-center">
                              <i :class="section.icon" class="text-sm"></i>
                            </div>
                            <div>
                              <div class="font-medium">{{ section.name }}</div>
                              <div class="text-sm text-muted-foreground">{{ section.field }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <!-- Edit Sections -->
                <div v-else-if="editSection">
                  <Card>
                    <CardHeader>
                      <CardTitle>{{ $t('editSections') }}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <draggable
                        v-model="editSections"
                        handle=".handle"
                        :ghost-class="'opacity-50'"
                        item-key="field"
                      >
                        <template #item="{ element: section, index }">
                          <div class="flex items-center gap-4 p-4 border rounded-lg mb-4">
                            <GripVertical class="w-5 h-5 text-muted-foreground cursor-move handle" />
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                              <div>
                                <Label>{{ $t('name') }}</Label>
                                <Input v-model="section.name" />
                              </div>
                              <div>
                                <Label>{{ $t('field') }}</Label>
                                <Input v-model="section.field" />
                              </div>
                            </div>
                            <div class="flex items-center gap-2">
                              <div>
                                <Label>{{ $t('customIcon') }}</Label>
                                <div class="flex items-center gap-2">
                                  <Input
                                    v-model="section.icon"
                                    :placeholder="$t('customIcon')"
                                    class="w-32"
                                  />
                                  <div class="w-8 h-8 border rounded flex items-center justify-center">
                                    <i :class="section.icon" class="text-sm"></i>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                @click="removeSection(index)"
                              >
                                <X class="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </template>
                      </draggable>
                    </CardContent>
                    <CardFooter class="flex justify-end gap-2">
                      <Button variant="outline" @click="editSection = false">
                        {{ $t('btn.cancel') }}
                      </Button>
                      <Button @click="updateSections">
                        {{ $t('btn.save') }}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardContent v-else>
              <Alert>
                <AlertCircle class="h-4 w-4" />
                <AlertTitle>{{ $t('noLanguagesAvailable') }}</AlertTitle>
                <AlertDescription>{{ $t('createAtLeastOneLanguage') }}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import { _ } from 'lodash'
import { 
  Plus, Edit, X, GripVertical, AlertCircle, Trash2
} from 'lucide-vue-next'

// Shadcn Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Custom Components
import BasicEditor from '@/components/editor'

// Services
import DataService from '@/services/data'
import Utils from '@/services/utils'
import UserService from '@/services/user'
import TemplateService from '@/services/template'

// Toast composable
import { useToast } from '@/composables/useToast'

const { t: $t } = useI18n()
const { toast } = useToast()

// Data
const selectedTab = ref('languages')

// Languages
const languages = ref([])
const newLanguage = reactive({ locale: '', language: '' })
const editLanguages = ref([])
const editLanguage = ref(false)

// Audit Types
const auditTypes = ref([])
const newAuditType = reactive({ name: '', templates: [], sections: [], hidden: [] })
const editAuditTypes = ref([])
const editAuditType = ref(false)
const templates = ref([])

// Vulnerability Types
const vulnTypes = ref([])
const newVulnType = reactive({ name: '', locale: '' })
const editVulnTypes = ref([])
const editVulnType = ref(false)

// Vulnerability Categories
const vulnCategories = ref([])
const newVulnCat = reactive({ name: '', sortValue: 'cvssScore', sortOrder: 'desc', sortAuto: true })
const editCategories = ref([])
const editCategory = ref(false)

const sortValueOptions = [
  { label: $t('cvssScore'), value: 'cvssScore' },
  { label: $t('cvssTemporalScore'), value: 'cvssTemporalScore' },
  { label: $t('cvssEnvironmentalScore'), value: 'cvssEnvironmentalScore' },
  { label: $t('priority'), value: 'priority' },
  { label: $t('remediationDifficulty'), value: 'remediationComplexity' }
]

const sortOrderOptions = [
  { label: $t('ascending'), value: 'asc' },
  { label: $t('descending'), value: 'desc' }
]

// Custom Fields
const customFields = ref([])
const newCustomField = reactive({
  label: '',
  fieldType: '',
  display: 'general',
  displaySub: '',
  size: 12,
  offset: 0,
  required: false,
  description: '',
  text: [],
  options: []
})

const cfLocale = ref('')
const newCustomOption = ref('')

const cfDisplayOptions = [
  { label: $t('auditGeneral'), value: 'general' },
  { label: $t('auditFinding'), value: 'finding' },
  { label: $t('auditSection'), value: 'section' },
  { label: $t('vulnerability'), value: 'vulnerability' }
]

const cfComponentOptions = [
  { label: $t('checkbox'), value: 'checkbox', icon: 'check_box' },
  { label: $t('date'), value: 'date', icon: 'event' },
  { label: $t('editor'), value: 'text', icon: 'mdi-format-pilcrow' },
  { label: $t('input'), value: 'input', icon: 'title' },
  { label: $t('radio'), value: 'radio', icon: 'radio_button_checked' },
  { label: $t('select'), value: 'select', icon: 'far fa-caret-square-down' },
  { label: $t('selectMultiple'), value: 'select-multiple', icon: 'filter_none' },
  { label: $t('space'), value: 'space', icon: 'space_bar' }
]

// Sections
const sections = ref([])
const newSection = reactive({ field: '', name: '', icon: '' })
const editSections = ref([])
const editSection = ref(false)

// Computed Properties
const newCustomFieldLangOptions = computed(() => {
  return newCustomField.options.filter(e => e.locale === cfLocale.value)
})

const vulnTypesFiltered = computed(() => {
  return vulnTypes.value.filter(vuln => vuln.locale === newVulnType.locale)
})

// Methods
const getTemplates = async () => {
  try {
    const data = await TemplateService.getTemplates()
    templates.value = data.data.datas
  } catch (err) {
    console.error(err)
  }
}

const getLanguages = async () => {
  try {
    const data = await DataService.getLanguages()
    languages.value = data.data.datas
    if (languages.value.length > 0) {
      newVulnType.locale = languages.value[0].locale
      cfLocale.value = languages.value[0].locale
    }
  } catch (err) {
    console.error(err)
  }
}

const getAuditTypes = async () => {
  try {
    const data = await DataService.getAuditTypes()
    auditTypes.value = data.data.datas
  } catch (err) {
    console.error(err)
  }
}

const getVulnerabilityTypes = async () => {
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

const getSections = async () => {
  try {
    const data = await DataService.getSections()
    sections.value = data.data.datas
  } catch (err) {
    console.error(err)
  }
}

const getCustomFields = async () => {
  try {
    const data = await DataService.getCustomFields()
    customFields.value = data.data.datas
  } catch (err) {
    console.error(err)
  }
}

// Language Methods
const createLanguage = async () => {
  if (!newLanguage.language || !newLanguage.locale) {
    toast({
      title: $t('error'),
      description: $t('fillAllFields'),
      variant: 'destructive'
    })
    return
  }

  try {
    await DataService.createLanguage(newLanguage)
    newLanguage.locale = ''
    newLanguage.language = ''
    await getLanguages()
    toast({
      title: $t('success'),
      description: $t('languageCreatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const updateLanguages = async () => {
  try {
    await DataService.updateLanguages(editLanguages.value)
    await getLanguages()
    editLanguage.value = false
    toast({
      title: $t('success'),
      description: $t('languagesUpdatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const removeLanguage = (locale) => {
  const index = editLanguages.value.findIndex(lang => lang.locale === locale)
  if (index !== -1) {
    editLanguages.value.splice(index, 1)
  }
}

// Audit Type Methods
const getTemplateOptionsLanguage = (locale) => {
  return templates.value.filter(template => template.locale === locale)
}

const setAuditTypeTemplate = (index, template) => {
  if (!newAuditType.templates[index]) {
    newAuditType.templates[index] = {}
  }
  newAuditType.templates[index].template = template
  const templateObj = templates.value.find(t => t.template === template)
  if (templateObj) {
    newAuditType.templates[index].name = templateObj.name
  }
}

const setEditAuditTypeTemplate = (auditTypeIndex, templateIndex, template) => {
  if (!editAuditTypes.value[auditTypeIndex].templates[templateIndex]) {
    editAuditTypes.value[auditTypeIndex].templates[templateIndex] = {}
  }
  editAuditTypes.value[auditTypeIndex].templates[templateIndex].template = template
  const templateObj = templates.value.find(t => t.template === template)
  if (templateObj) {
    editAuditTypes.value[auditTypeIndex].templates[templateIndex].name = templateObj.name
  }
}

const createAuditType = async () => {
  if (!newAuditType.name || newAuditType.templates.length !== languages.value.length) {
    toast({
      title: $t('error'),
      description: $t('fillAllFields'),
      variant: 'destructive'
    })
    return
  }

  try {
    await DataService.createAuditType(newAuditType)
    newAuditType.name = ''
    newAuditType.templates = []
    await getAuditTypes()
    toast({
      title: $t('success'),
      description: $t('auditTypeCreatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const updateAuditTypes = async () => {
  try {
    await DataService.updateAuditTypes(editAuditTypes.value)
    await getAuditTypes()
    editAuditType.value = false
    toast({
      title: $t('success'),
      description: $t('auditTypesUpdatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const removeAuditType = (name) => {
  const index = editAuditTypes.value.findIndex(type => type.name === name)
  if (index !== -1) {
    editAuditTypes.value.splice(index, 1)
  }
}

// Vulnerability Type Methods
const createVulnType = async () => {
  if (!newVulnType.name || !newVulnType.locale) {
    toast({
      title: $t('error'),
      description: $t('fillAllFields'),
      variant: 'destructive'
    })
    return
  }

  try {
    await DataService.createVulnType(newVulnType)
    newVulnType.name = ''
    await getVulnerabilityTypes()
    toast({
      title: $t('success'),
      description: $t('vulnerabilityTypeCreatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const updateVulnTypes = async () => {
  try {
    await DataService.updateVulnerabilityTypes(editVulnTypes.value)
    await getVulnerabilityTypes()
    editVulnType.value = false
    toast({
      title: $t('success'),
      description: $t('vulnerabilityTypesUpdatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const removeVulnType = (vulnType) => {
  const index = editVulnTypes.value.findIndex(type => type._id === vulnType._id)
  if (index !== -1) {
    editVulnTypes.value.splice(index, 1)
  }
}

const getLanguageByLocale = (locale) => {
  const language = languages.value.find(lang => lang.locale === locale)
  return language ? language.language : locale
}

// Vulnerability Category Methods
const createVulnCat = async () => {
  if (!newVulnCat.name) {
    toast({
      title: $t('error'),
      description: $t('fillAllFields'),
      variant: 'destructive'
    })
    return
  }

  try {
    await DataService.createVulnCategory(newVulnCat)
    newVulnCat.name = ''
    await getVulnerabilityCategories()
    toast({
      title: $t('success'),
      description: $t('vulnerabilityCategoryCreatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const updateCategories = async () => {
  try {
    await DataService.updateVulnerabilityCategories(editCategories.value)
    await getVulnerabilityCategories()
    editCategory.value = false
    toast({
      title: $t('success'),
      description: $t('vulnerabilityCategoriesUpdatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const removeCategory = (name) => {
  const index = editCategories.value.findIndex(category => category.name === name)
  if (index !== -1) {
    editCategories.value.splice(index, 1)
  }
}

const getSortValueLabel = (value) => {
  const option = sortValueOptions.find(opt => opt.value === value)
  return option ? option.label : value
}

const getSortOrderLabel = (value) => {
  const option = sortOrderOptions.find(opt => opt.value === value)
  return option ? option.label : value
}

// Custom Field Methods
const createCustomField = async () => {
  if (newCustomField.fieldType !== 'space' && (!newCustomField.label || !newCustomField.fieldType)) {
    toast({
      title: $t('error'),
      description: $t('fillAllFields'),
      variant: 'destructive'
    })
    return
  }

  try {
    newCustomField.position = customFields.value.length
    await DataService.createCustomField(newCustomField)
    
    // Reset form
    newCustomField.label = ''
    newCustomField.fieldType = ''
    newCustomField.options = []
    
    await getCustomFields()
    toast({
      title: $t('success'),
      description: $t('customFieldCreatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const updateCustomFields = async () => {
  try {
    let position = 0
    customFields.value.forEach(field => {
      field.position = position++
    })
    
    await DataService.updateCustomFields(customFields.value)
    await getCustomFields()
    toast({
      title: $t('success'),
      description: $t('customFieldsUpdatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const deleteCustomField = async (customField) => {
  if (!confirm($t('confirmDeleteCustomField'))) {
    return
  }

  try {
    const data = await DataService.deleteCustomField(customField._id)
    await getCustomFields()
    toast({
      title: $t('success'),
      description: $t('customFieldDeletedSuccessfully', { 
        name: customField.label, 
        count: data.data.datas.vulnCount 
      })
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas?.msg || err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const canDisplayCustomField = (field) => {
  return (
    (newCustomField.display === field.display || 
     (newCustomField.display === 'finding' && field.display === 'vulnerability')) &&
    (newCustomField.displaySub === field.displaySub || field.displaySub === '')
  )
}

const canDisplayCustomFields = () => {
  return customFields.value.some(field => canDisplayCustomField(field))
}

const getFieldValue = (field) => {
  const localeEntry = field.text.find(e => e.locale === cfLocale.value)
  if (!localeEntry) {
    const newEntry = { 
      locale: cfLocale.value, 
      value: field.fieldType === 'checkbox' || field.fieldType === 'select-multiple' ? [] : '' 
    }
    field.text.push(newEntry)
    return newEntry.value
  }
  return localeEntry.value
}

const setFieldValue = (field, newValue) => {
  const localeEntry = field.text.find(e => e.locale === cfLocale.value)
  if (localeEntry) {
    localeEntry.value = newValue
  } else {
    field.text.push({ locale: cfLocale.value, value: newValue })
  }
}

const toggleMultiSelectOption = (field, optionValue) => {
  const currentValue = getFieldValue(field) || []
  const index = currentValue.indexOf(optionValue)
  
  if (index === -1) {
    currentValue.push(optionValue)
  } else {
    currentValue.splice(index, 1)
  }
  
  setFieldValue(field, currentValue)
}

const addCustomFieldOption = (options) => {
  if (!newCustomOption.value) return
  
  options.push({ locale: cfLocale.value, value: newCustomOption.value })
  newCustomOption.value = ''
}

const removeCustomFieldOption = (options, option) => {
  const index = options.findIndex(e => e.locale === option.locale && e.value === option.value)
  if (index !== -1) {
    options.splice(index, 1)
  }
}

// Section Methods
const createSection = async () => {
  if (!newSection.field || !newSection.name) {
    toast({
      title: $t('error'),
      description: $t('fillAllFields'),
      variant: 'destructive'
    })
    return
  }

  try {
    await DataService.createSection(newSection)
    newSection.field = ''
    newSection.name = ''
    newSection.icon = ''
    await getSections()
    toast({
      title: $t('success'),
      description: $t('sectionCreatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const updateSections = async () => {
  try {
    await DataService.updateSections(editSections.value)
    sections.value = editSections.value
    editSection.value = false
    toast({
      title: $t('success'),
      description: $t('sectionsUpdatedSuccessfully')
    })
  } catch (err) {
    toast({
      title: $t('error'),
      description: err.response?.data?.datas || $t('errorOccurred'),
      variant: 'destructive'
    })
  }
}

const removeSection = (index) => {
  editSections.value.splice(index, 1)
}

// Lifecycle
onMounted(() => {
  getTemplates()
  getLanguages()
  getAuditTypes()
  getVulnerabilityTypes()
  getVulnerabilityCategories()
  getSections()
  getCustomFields()
})
</script>

<style scoped>
.drag-ghost {
  opacity: 0.5;
}
</style>