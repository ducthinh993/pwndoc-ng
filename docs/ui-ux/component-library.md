# Component Library Documentation

This document provides a comprehensive catalog of all UI components used in pwndoc-ng, including their props, usage examples, and design specifications.

## Table of Contents

1. [Overview](#overview)
2. [Core Components](#core-components)
3. [Form Components](#form-components)
4. [Layout Components](#layout-components)
5. [Navigation Components](#navigation-components)
6. [Data Display Components](#data-display-components)
7. [Specialized Components](#specialized-components)
8. [Component Usage Guidelines](#component-usage-guidelines)

---

## Overview

The pwndoc-ng component library is built on the Quasar Framework, combining Quasar's built-in components with custom components designed specifically for cybersecurity audit workflows. All components follow the established design system and support both light and dark themes.

### Component Categories
- **Core Components**: Basic UI elements (buttons, inputs, cards)
- **Form Components**: Form-specific elements and validation
- **Layout Components**: Page structure and organization
- **Navigation Components**: Routing and wayfinding
- **Data Display Components**: Tables, lists, and data visualization
- **Specialized Components**: Domain-specific functionality

---

## Core Components

### Rich Text Editor (`components/editor.vue`)

**Purpose**: Advanced rich text editing with collaborative features and syntax highlighting.

**Key Features**:
- Real-time collaborative editing using Y.js and Hocuspocus
- Syntax highlighting for code blocks
- Image embedding and caption management
- Table creation and editing
- Link management and internal linking
- Grammar checking with LanguageTool integration
- Diff visualization for document comparison
- Customizable toolbar options

**Props**:
```javascript
{
  modelValue: String,        // Editor content (HTML)
  editable: Boolean,         // Enable/disable editing
  collab: Boolean,          // Enable collaborative features
  idUnique: String,         // Unique identifier for collaboration
  toolbar: Array,           // Toolbar sections to display
  noAffix: Boolean,         // Disable sticky toolbar
  diff: String,             // Comparison content for diff view
  disableDrop: Boolean,     // Disable drag & drop
  noSync: Boolean           // Disable automatic syncing
}
```

**Usage Example**:
```vue
<basic-editor 
  v-model="content"
  :editable="!readonly"
  :collab="true"
  :toolbar="['format', 'marks', 'list', 'table', 'image']"
  @editorchange="handleContentChange"
/>
```

**Design Notes**:
- Sticky toolbar with customizable sections
- Bubble menu for quick formatting
- Clean, minimalist interface
- Full-width layout with card container

---

### CVSS Calculator (`components/cvsscalculator.vue`)

**Purpose**: Interactive CVSS v3 vulnerability scoring calculator.

**Key Features**:
- Complete CVSS v3.1 implementation
- Real-time score calculation
- Visual severity indicators
- Metric tooltips and explanations
- Base, Temporal, and Environmental metrics
- Read-only mode for display

**Props**:
```javascript
{
  modelValue: String,       // CVSS vector string
  readonly: Boolean         // Disable user interaction
}
```

**Usage Example**:
```vue
<cvss-calculator 
  v-model="vulnerability.cvssv3"
  :readonly="!canEdit"
/>
```

**Design Notes**:
- Color-coded severity ratings
- Grouped metric sections
- Toggle button interface
- Prominent score display
- Comprehensive tooltips

---

### Custom Fields (`components/custom-fields.vue`)

**Purpose**: Dynamic form field generation based on configuration.

**Key Features**:
- Multiple field types (text, input, select, checkbox, radio, date)
- Responsive grid layout
- Validation support
- Diff highlighting for changes
- Rich text editor integration
- Multi-language support

**Props**:
```javascript
{
  modelValue: Array,        // Field definitions and values
  customElement: String,    // Container element type
  noSyncEditor: Boolean,    // Disable editor syncing
  diff: Array,             // Comparison data
  readonly: Boolean,        // Read-only mode
  locale: String,          // Language locale
  collab: Boolean,         // Collaboration features
  idUnique: String         // Unique identifier
}
```

**Supported Field Types**:
- **text**: Rich text editor
- **input**: Single-line text input
- **select**: Dropdown selection
- **select-multiple**: Multi-select dropdown
- **checkbox**: Multiple choice checkboxes
- **radio**: Single choice radio buttons
- **date**: Date picker
- **space**: Layout spacer

**Usage Example**:
```vue
<custom-fields 
  v-model="audit.customFields"
  :readonly="!canEdit"
  :locale="currentLocale"
  @editorchange="handleFieldChange"
/>
```

---

## Form Components

### Textarea Array (`components/textarea-array.vue`)

**Purpose**: Convert between array data and multi-line text input.

**Props**:
```javascript
{
  label: String,           // Field label
  modelValue: Array,       // Array of strings
  noEmptyLine: Boolean,    // Filter empty lines
  readonly: Boolean        // Read-only mode
}
```

**Usage Example**:
```vue
<textarea-array 
  label="References"
  v-model="vulnerability.references"
  :readonly="!canEdit"
/>
```

### Language Selector (`components/language-selector.vue`)

**Purpose**: Application language switching.

**Features**:
- Supported languages: English, French, German, Chinese
- Persistent selection in localStorage
- Immediate language switching

**Usage Example**:
```vue
<language-selector />
```

---

## Layout Components

### Breadcrumb Navigation (`components/breadcrumb.vue`)

**Purpose**: Hierarchical navigation display with audit state indicators.

**Props**:
```javascript
{
  buttons: Boolean,        // Show action buttons instead of breadcrumbs
  title: String,          // Custom title override
  approvals: Array,       // Audit approval data
  state: String           // Audit state (EDIT, REVIEW, APPROVED)
}
```

**Features**:
- Automatic breadcrumb generation from router
- Audit state visualization
- Action button slot
- Responsive layout

**Usage Example**:
```vue
<breadcrumb :title="audit.name" :state="audit.state" :approvals="audit.approvals">
  <template v-slot:buttons>
    <q-btn @click="saveAudit">Save</q-btn>
  </template>
</breadcrumb>
```

### Audit State Icon (`components/audit-state-icon.vue`)

**Purpose**: Visual indicator for audit review states.

**Props**:
```javascript
{
  approvals: Array,        // Current approvals
  state: String,          // Audit state
  size: String            // Icon size (default: "11px")
}
```

**States**:
- **APPROVED**: Green chip with approval count
- **REVIEW**: Orange chip with review progress
- **EDIT**: No visual indicator

**Usage Example**:
```vue
<audit-state-icon 
  :approvals="audit.approvals"
  :state="audit.state"
  size="14px"
/>
```

---

## Navigation Components

### Main Layout (`layouts/home.vue`)

**Purpose**: Primary application layout with navigation and user controls.

**Features**:
- Top navigation bar with logo
- Main navigation links (Audits, Vulnerabilities, Data)
- User menu with profile and settings
- Dark mode toggle
- Logout functionality
- Responsive drawer for mobile

**Navigation Structure**:
```javascript
// Main navigation items
[
  { path: '/audits', icon: 'fa fa-fingerprint', label: 'Audits' },
  { path: '/vulnerabilities', icon: 'fa fa-shield-alt', label: 'Vulnerabilities' },
  { path: '/data/collaborators', icon: 'fa fa-database', label: 'Data' },
  { path: '/settings', icon: 'fa fa-cog', label: 'Settings' }
]
```

---

## Data Display Components

### Data Tables

**Standard Table Features**:
- Sticky headers with dynamic height calculation
- Sorting and pagination
- Responsive design
- Loading states
- Empty states
- Row selection
- Custom cell rendering

**Table Variants**:
```stylus
// Standard data table
.sticky-header-table
  max-height: calc(100vh - 82px)

// Table with additional controls
.sticky-header-table-addfinding  
  max-height: calc(100vh - 132px)
```

### Cards and Containers

**Card Design Pattern**:
- Light grey background (`#fafafa`)
- Subtle border radius (4px)
- Consistent padding and spacing
- Elevation for visual hierarchy

---

## Specialized Components

### Upload Image (`components/uploadImage.vue`)

**Purpose**: Image handling within rich text editor.

**Features**:
- Drag & drop image upload
- Base64 encoding support
- Caption editing with popup
- Responsive image display
- API integration for image storage

**Usage Context**: 
- Integrated within TipTap editor
- Node view component for image nodes
- Supports both local and server-stored images

### Code Block (`components/CodeBlockComponent.vue`)

**Purpose**: Syntax-highlighted code blocks within editor.

**Features**:
- Language selection dropdown
- Syntax highlighting with highlight.js
- Support for multiple programming languages
- Auto-detection option

**Supported Languages**:
- JavaScript, TypeScript, HTML, CSS
- Python, Java, C++, PHP
- Bash, SQL, JSON, YAML
- And many more via highlight.js

### Internal Link Extension (`components/internal-link.js`)

**Purpose**: Cross-reference linking within audit documents.

**Features**:
- Trigger-based menu (`@` character)
- Dynamic content suggestions
- Audit finding references
- Loading and error states
- Keyboard navigation

---

## Component Usage Guidelines

### Design Consistency

#### Component Styling
```vue
<!-- Consistent card layout -->
<q-card flat bordered class="q-pa-md">
  <q-card-section>
    <!-- Content -->
  </q-card-section>
</q-card>

<!-- Standard form layout -->
<q-form @submit="onSubmit" class="q-gutter-md">
  <q-input v-model="field" outlined />
  <q-btn type="submit" color="primary">Submit</q-btn>
</q-form>
```

#### Spacing and Layout
- Use Quasar's spacing classes (`q-pa-*`, `q-ma-*`, `q-gutter-*`)
- Maintain consistent grid layouts with `row` and `col-*`
- Apply responsive breakpoints consistently

### Accessibility Standards

#### Form Components
- Always provide labels for form inputs
- Use appropriate ARIA attributes
- Implement proper error messaging
- Ensure keyboard navigation support

#### Interactive Components
- Minimum 44px touch targets for mobile
- Clear focus indicators
- Descriptive button text and icons
- Proper color contrast ratios

### Performance Considerations

#### Large Data Sets
- Implement virtual scrolling for large lists
- Use pagination for data tables
- Lazy load components when appropriate
- Optimize image loading and sizing

#### Real-time Features
- Debounce user input for API calls
- Use efficient diff algorithms
- Minimize unnecessary re-renders
- Clean up event listeners and subscriptions

### Error Handling

#### Component Error States
```vue
<template>
  <div>
    <q-spinner v-if="loading" />
    <div v-else-if="error" class="error-state">
      <q-icon name="error" />
      <p>{{ error.message }}</p>
      <q-btn @click="retry">Retry</q-btn>
    </div>
    <div v-else>
      <!-- Component content -->
    </div>
  </div>
</template>
```

#### User Feedback
- Provide clear error messages
- Show loading states during operations
- Confirm destructive actions
- Display success feedback

### Future Component Development

#### Component Creation Checklist
- [ ] Follow design system guidelines
- [ ] Implement proper prop validation
- [ ] Add accessibility features
- [ ] Support both themes (light/dark)
- [ ] Include error handling
- [ ] Write comprehensive documentation
- [ ] Test across different screen sizes
- [ ] Validate with real user data

#### Best Practices
- Use Vue 3 Composition API for new components
- Implement proper TypeScript support
- Follow naming conventions
- Provide comprehensive prop documentation
- Include usage examples
- Test edge cases and error conditions

This component library serves as both documentation and a guide for maintaining consistency across the pwndoc-ng application. Regular updates ensure it remains current with the evolving codebase. 