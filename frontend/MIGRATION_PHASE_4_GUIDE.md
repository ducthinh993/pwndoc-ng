# Phase 4 Migration Guide - Page-by-Page Conversion

## Overview
This guide provides systematic steps for migrating all pages from Quasar components to Vue Shadcn components that have been built in Phases 1-3.

## Migration Strategy

### 1. Component Mapping Reference
```
Quasar Component          → Vue Shadcn Component
================          =================
q-btn                    → Button
q-input                  → Input
q-select                 → Select
q-card                   → Card
q-dialog                 → Dialog
q-table                  → Table
q-checkbox               → Checkbox
q-radio                  → Radio
q-chip                   → Badge
q-banner                 → Alert (to be created)
q-tooltip                → Tooltip
q-tabs                   → Tabs (to be created)
q-tab-panel              → TabsContent (to be created)
q-drawer                 → Sheet
q-layout                 → Layout
q-header                 → Header
q-toolbar                → Toolbar
q-breadcrumbs            → Breadcrumb
q-space                  → <div class="flex-1" />
q-separator              → <hr class="border-border" />
q-icon                   → lucide-vue-next icons
q-img                    → <img> with styling
q-uploader               → Custom file input
q-toggle                 → Switch (to be created)
q-expansion-item         → Collapsible (to be created)
q-splitter               → Resizable (to be created)
```

### 2. Import Updates
```typescript
// Before (Quasar)
import { Dialog, Notify } from 'quasar'

// After (Vue Shadcn)
import { Dialog } from '@/components/ui/dialog'
import { useToast } from '@/composables/useToast' // to be created
```

### 3. Class Migration Pattern
```vue
<!-- Before (Quasar) -->
<q-btn color="primary" class="q-ma-md" @click="handleClick">
  Button Text
</q-btn>

<!-- After (Vue Shadcn) -->
<Button variant="default" class="m-4" @click="handleClick">
  Button Text
</Button>
```

### 4. Layout Updates
```vue
<!-- Before (Quasar) -->
<q-layout view="lHh Lpr lFf">
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
      <q-toolbar-title>Title</q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-drawer v-model="drawer" show-if-above bordered>
    <!-- content -->
  </q-drawer>
  <q-page-container>
    <!-- content -->
  </q-page-container>
</q-layout>

<!-- After (Vue Shadcn) -->
<Layout>
  <Header class="bg-primary text-primary-foreground">
    <Toolbar>
      <Button variant="ghost" size="icon" @click="drawer = !drawer">
        <Menu class="h-4 w-4" />
      </Button>
      <div class="font-semibold">Title</div>
    </Toolbar>
  </Header>
  <Sheet v-model:open="drawer" side="left">
    <!-- content -->
  </Sheet>
  <main class="flex-1">
    <!-- content -->
  </main>
</Layout>
```

## Migration Priority Order

### High Priority (Simple Pages)
1. **Login Page** - Simple form with basic components
2. **Settings Page** - Basic form inputs and toggles
3. **Profile Page** - User form with validation

### Medium Priority (Data Management)
4. **Companies Page** - Table with CRUD operations
5. **Clients Page** - Table with CRUD operations
6. **Collaborators Page** - Table with CRUD operations
7. **Templates Page** - File upload and table
8. **Custom Data Page** - Complex forms with tabs
9. **Dump Page** - Import/export functionality

### High Priority (Complex Pages)
10. **Charts Page** - Data visualization
11. **Vulnerabilities Page** - Complex table with modals
12. **Audits List Page** - Complex table with state management
13. **Audit Edit Pages** - Most complex with real-time collaboration

### Core Components (Foundational)
14. **Main Layout** - Navigation and structure
15. **Breadcrumb Component** - Navigation trail
16. **Language Selector** - Dropdown component
17. **Custom Fields** - Dynamic form generation
18. **TipTap Editor** - Rich text editor toolbar

## Step-by-Step Migration Process

### For Each Page:

1. **Analyze Current Components**
   - List all q-* components used
   - Identify required Vue Shadcn replacements
   - Note any missing components that need to be created

2. **Create Missing Components**
   - Build any Vue Shadcn components not yet available
   - Follow established patterns and design tokens

3. **Update Imports**
   - Replace Quasar imports with Vue Shadcn imports
   - Update component references in script section

4. **Convert Template**
   - Replace Quasar components with Vue Shadcn equivalents
   - Update classes using Tailwind utilities
   - Maintain exact visual appearance

5. **Update Script Logic**
   - Replace Quasar methods (Dialog, Notify) with Vue Shadcn equivalents
   - Update event handlers if needed
   - Maintain all functionality

6. **Test Thoroughly**
   - Verify visual appearance matches exactly
   - Test all interactive functionality
   - Check responsive behavior
   - Validate dark mode support

### Component Creation Pattern

When creating new components:

```vue
<template>
  <div :class="cn(baseClasses, variantClasses, sizeClasses, className)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant, type ColorVariant } from '@/lib/style-validators'

interface Props {
  variant?: ColorVariant
  size?: SizeVariant
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
})

const baseClasses = 'component-base-classes'
const variantClasses = computed(() => {
  // variant logic
})
const sizeClasses = computed(() => {
  // size logic
})
</script>
```

## Testing Checklist

For each migrated page:

- [ ] Visual appearance matches exactly
- [ ] All interactive elements work correctly
- [ ] Form validation functions properly
- [ ] Responsive design maintained
- [ ] Dark mode support works
- [ ] Accessibility features preserved
- [ ] Performance not degraded
- [ ] No console errors or warnings

## Common Pitfalls to Avoid

1. **Breaking Visual Consistency**
   - Always use design tokens
   - Maintain exact spacing and colors
   - Preserve responsive behavior

2. **Losing Functionality**
   - Test all interactive elements
   - Verify form submissions
   - Check modal behaviors

3. **Performance Issues**
   - Avoid importing entire libraries
   - Use tree-shaking friendly imports
   - Optimize component rendering

4. **Accessibility Regression**
   - Maintain ARIA attributes
   - Preserve keyboard navigation
   - Keep screen reader support

## Next Steps

1. Start with Login Page migration (simplest)
2. Establish migration pattern
3. Create any missing components as needed
4. Progress through pages in priority order
5. Test thoroughly at each step
6. Remove Quasar dependencies when complete

## Success Criteria

- All pages render correctly with Vue Shadcn components
- Zero visual regression from original Quasar implementation
- All functionality preserved
- Performance maintained or improved
- Bundle size reduced
- No remaining Quasar dependencies 