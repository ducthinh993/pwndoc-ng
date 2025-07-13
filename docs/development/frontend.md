# Frontend Development Documentation

This document provides comprehensive guidance for developing and maintaining the pwndoc-ng frontend application. The frontend is built using Vue 3 with the Quasar framework, providing a modern, responsive user interface.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Development Setup](#development-setup)
5. [Component Architecture](#component-architecture)
6. [Services Layer](#services-layer)
7. [Routing System](#routing-system)
8. [State Management](#state-management)
9. [Real-time Communication](#real-time-communication)
10. [Internationalization](#internationalization)
11. [Styling & Theming](#styling--theming)
12. [Build Configuration](#build-configuration)
13. [Development Guidelines](#development-guidelines)
14. [Testing](#testing)
15. [Common Patterns](#common-patterns)
16. [Performance Optimization](#performance-optimization)

---

## Architecture Overview

The frontend follows a modern Vue 3 architecture with the following key principles:

### **Framework Architecture**
- **Vue 3** with Composition API support
- **Quasar Framework** for UI components and build tooling
- **Single Page Application (SPA)** with client-side routing
- **Component-based architecture** with reusable components
- **Service-oriented architecture** for API communication

### **Core Design Patterns**
- **Separation of Concerns**: UI components, business logic, and API communication are separated
- **Reactive Data Flow**: Vue's reactivity system manages state changes
- **Event-driven Architecture**: Socket.io for real-time updates
- **Modular Structure**: Features organized into logical modules

---

## Technology Stack

### **Core Technologies**
- **Vue 3** (^3.5.17) - Progressive JavaScript framework
- **Quasar Framework** (^2.18.1) - Vue.js based framework
- **Vue Router** (^4.5.1) - Official router for Vue.js
- **Axios** (^1.7.9) - HTTP client for API communication
- **Socket.io Client** (^4.8.1) - Real-time communication

### **Rich Text Editing**
- **TipTap** (^2.11.5) - Modern rich text editor
- **Collaboration Extensions** - Real-time collaborative editing
- **Highlight.js** (^11.11.1) - Code syntax highlighting
- **Lowlight** (^3.3.0) - Virtual syntax highlighting

### **Utilities & Tools**
- **Lodash** (^4.17.15) - Utility library
- **js-yaml** (^3.13.1) - YAML parser
- **jwt-decode** (^2.2.0) - JWT token decoding
- **vuedraggable** (^4.1.0) - Vue drag and drop
- **diff** (^4.0.2) - Text diffing utility

### **Development Tools**
- **Webpack** (via Quasar CLI) - Module bundler
- **Babel** - JavaScript transpilation
- **Stylus** - CSS preprocessor
- **PostCSS** - CSS processing
- **ESLint** (implied) - Code linting

---

## Project Structure

```
frontend/
├── src/
│   ├── App.vue                 # Root component
│   ├── index.template.html     # HTML template
│   ├── assets/                 # Static assets
│   ├── boot/                   # Boot files (plugins, configurations)
│   │   ├── auth.js            # Authentication setup
│   │   ├── axios.js           # HTTP client configuration
│   │   ├── darkmode.js        # Dark mode functionality
│   │   ├── i18n.js            # Internationalization setup
│   │   ├── socketio.js        # Socket.io client setup
│   │   └── settings.js        # Application settings
│   ├── components/            # Reusable components
│   │   ├── breadcrumb.vue     # Navigation breadcrumb
│   │   ├── editor.vue         # Rich text editor
│   │   ├── custom-fields.vue  # Dynamic custom fields
│   │   ├── cvsscalculator.vue # CVSS calculator
│   │   └── ...               # Other components
│   ├── css/                   # Global styles
│   │   ├── app.styl          # Main application styles
│   │   └── quasar.variables.styl # Quasar theme variables
│   ├── i18n/                  # Internationalization
│   │   ├── index.js          # Language exports
│   │   ├── en-US/            # English translations
│   │   ├── fr-FR/            # French translations
│   │   ├── de-DE/            # German translations
│   │   └── zh-CN/            # Chinese translations
│   ├── layouts/               # Layout components
│   │   └── home.vue          # Main application layout
│   ├── pages/                 # Page components
│   │   ├── audits/           # Audit management pages
│   │   ├── data/             # Data management pages
│   │   ├── vulnerabilities/  # Vulnerability management pages
│   │   ├── login.vue         # Login page
│   │   ├── profile/          # User profile pages
│   │   └── settings/         # Settings pages
│   ├── router/                # Routing configuration
│   │   ├── index.js          # Router instance
│   │   └── routes.js         # Route definitions
│   └── services/              # API service layer
│       ├── audit.js          # Audit API calls
│       ├── user.js           # User API calls
│       ├── vulnerability.js  # Vulnerability API calls
│       ├── utils.js          # Utility functions
│       └── ...              # Other services
├── public/                    # Public assets
│   ├── favicon.png           # Application icon
│   ├── logo.png              # Application logo
│   └── js/                   # External JavaScript files
├── ssl/                       # SSL certificates for development
├── babel.config.js           # Babel configuration
├── postcss.config.js         # PostCSS configuration
├── quasar.conf.js            # Quasar framework configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## Development Setup

### **Prerequisites**
- Node.js (>= 16.0.0)
- npm or yarn
- Git

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Development server
npm run dev
```

### **Development Scripts**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### **Environment Configuration**
The application uses different configurations for development and production:

```javascript
// quasar.conf.js
build: {
  env: ctx.dev
    ? { // Development environment
      API_PORT: 5252
    }
    : { // Production environment
      API_PORT: 8443,
    }
}
```

### **Development Server**
- **Port**: 8081
- **HTTPS**: Enabled with self-signed certificates
- **Proxy**: API requests proxied to backend at port 5252
- **Hot Reload**: Enabled for rapid development

---

## Component Architecture

### **Component Organization**

#### **1. Layout Components**
- **`layouts/home.vue`**: Main application layout with navigation
- Provides consistent header, navigation, and page structure
- Handles user authentication state and navigation

#### **2. Page Components**
- **`pages/`**: Top-level page components
- Each page represents a major application section
- Organized by feature (audits, vulnerabilities, data, etc.)

#### **3. Reusable Components**
- **`components/`**: Shared, reusable components
- Well-defined props and events
- Documentation and examples for each component

### **Key Components**

#### **Rich Text Editor (`components/editor.vue`)**
```vue
<template>
  <div class="editor-container">
    <editor-content :editor="editor" />
    <bubble-menu :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from '@tiptap/extension-collaboration';

export default {
  components: { EditorContent, BubbleMenu },
  props: {
    modelValue: String,
    editable: Boolean,
    collab: Boolean
  },
  // ... implementation
}
</script>
```

#### **Custom Fields (`components/custom-fields.vue`)**
- Dynamic form field generation
- Supports multiple field types (text, select, checkbox, etc.)
- Locale-aware field rendering
- Used throughout the application for extensible forms

#### **Breadcrumb Navigation (`components/breadcrumb.vue`)**
- Hierarchical navigation display
- Audit state integration
- Responsive button placement
- Consistent across all pages

### **Component Development Guidelines**

#### **1. Component Structure**
```vue
<template>
  <!-- Template with semantic HTML -->
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ComponentName',
  props: {
    // Well-defined props with types
  },
  emits: ['event-name'],
  components: {
    // Local component imports
  },
  setup(props, { emit }) {
    // Composition API setup
  }
});
</script>

<style lang="stylus" scoped>
// Component-specific styles
</style>
```

#### **2. Props and Events**
- **Props**: Use TypeScript-style prop definitions
- **Events**: Declare all emitted events
- **Validation**: Add prop validation where appropriate
- **Documentation**: Document complex props and events

#### **3. State Management**
- **Local State**: Use `ref()` and `reactive()` for component state
- **Computed Properties**: Use `computed()` for derived state
- **Watchers**: Use `watch()` for side effects
- **Lifecycle**: Use composition API lifecycle hooks

---

## Services Layer

### **Service Architecture**
The application uses a service-oriented architecture for API communication:

```javascript
// services/audit.js
import { api } from 'boot/axios'

export default {
  getAudits: (filters) => api.get(`audits${buildQueryString(filters)}`),
  getAudit: (auditId) => api.get(`audits/${auditId}`),
  createAudit: (audit) => api.post('audits', audit),
  updateAudit: (auditId, audit) => api.put(`audits/${auditId}`, audit),
  deleteAudit: (auditId) => api.delete(`audits/${auditId}`)
}
```

### **Available Services**

#### **1. User Service (`services/user.js`)**
- Authentication and token management
- User profile management
- TOTP (Two-Factor Authentication) setup
- Permission checking utilities

#### **2. Audit Service (`services/audit.js`)**
- Audit CRUD operations
- Finding management
- Section management
- Report generation
- Approval workflows

#### **3. Vulnerability Service (`services/vulnerability.js`)**
- Vulnerability CRUD operations
- Export/import functionality
- Vulnerability updates and merging

#### **4. Data Service (`services/data.js`)**
- Language management
- Audit types and categories
- Custom fields and sections
- Reference data management

#### **5. Utils Service (`services/utils.js`)**
- HTML encoding/decoding
- Image processing and compression
- Custom filtering utilities
- Common utility functions

### **Service Patterns**

#### **1. HTTP Client Configuration**
```javascript
// boot/axios.js
import axios from 'axios'
import User from '@/services/user'

const api = axios.create({
  baseURL: `${window.location.origin}/api`
})

// Request interceptor for authentication
api.interceptors.request.use(config => {
  // Add authentication headers
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      User.refreshToken()
    }
    return Promise.reject(error)
  }
)
```

#### **2. Service Method Patterns**
- **Consistent API**: All services follow similar patterns
- **Promise-based**: All methods return promises
- **Error Handling**: Centralized error handling in interceptors
- **Type Safety**: Use TypeScript interfaces where possible

#### **3. Authentication Flow**
```javascript
// services/user.js
export default {
  async getToken(username, password, totpToken) {
    const response = await api.post('users/token', {
      username, password, totpToken
    });
    const token = response.data.datas.token;
    this.user = jwtDecode(token);
    return response;
  },

  async refreshToken() {
    const response = await api.get('users/refreshtoken');
    const token = response.data.datas.token;
    this.user = jwtDecode(token);
    return response;
  }
}
```

---

## Routing System

### **Router Configuration**
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### **Route Structure**
```javascript
// router/routes.js
export default [
  {
    path: '/',
    component: () => import('layouts/home'),
    meta: { breadcrumb: 'Home' },
    children: [
      {
        path: 'audits',
        component: () => import('pages/audits'),
        meta: { breadcrumb: 'Audits' },
        children: [
          {
            path: ':auditId',
            component: () => import('pages/audits/edit'),
            children: [
              {
                path: 'general',
                name: 'general',
                component: () => import('pages/audits/edit/general')
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: () => import('pages/login')
  }
]
```

### **Route Features**
- **Nested Routes**: Hierarchical page structure
- **Dynamic Routes**: Parameter-based routing (`:auditId`)
- **Meta Fields**: Route metadata for breadcrumbs
- **Lazy Loading**: Code splitting with dynamic imports
- **Route Guards**: Authentication and authorization

### **Navigation Patterns**
```javascript
// Programmatic navigation
this.$router.push('/audits')
this.$router.push({ name: 'editFinding', params: { auditId: '123', findingId: '456' } })

// Route parameters
const auditId = this.$route.params.auditId
const query = this.$route.query.filter
```

---

## State Management

### **Reactive State**
The application uses Vue 3's reactivity system for state management:

#### **1. Component State**
```vue
<script setup>
import { ref, reactive, computed } from 'vue'

// Simple reactive state
const count = ref(0)
const loading = ref(false)

// Complex reactive state
const user = reactive({
  name: '',
  email: '',
  roles: []
})

// Computed state
const isAdmin = computed(() => user.roles.includes('admin'))
</script>
```

#### **2. Service State**
```javascript
// services/user.js
export default {
  user: reactive({
    username: "",
    role: "",
    firstname: "",
    lastname: "",
    totpEnabled: false
  }),

  isAuth() {
    return this.user && this.user.username
  },

  isAllowed(role) {
    return this.user.roles && this.user.roles.includes(role)
  }
}
```

#### **3. Global State Patterns**
- **Service Singletons**: Services maintain global state
- **Reactive Objects**: Use `reactive()` for complex state
- **Refs**: Use `ref()` for primitive values
- **Computed Properties**: Derive state from other state

### **State Persistence**
- **Local Storage**: Language preferences, theme settings
- **Session Storage**: Temporary state
- **Cookies**: Authentication tokens (HTTP-only)

---

## Real-time Communication

### **Socket.io Integration**
```javascript
// boot/socketio.js
import { io } from 'socket.io-client'

const socket = io(`${window.location.origin}`)

// Global socket instance
app.config.globalProperties.$socket = socket

// Connection handling
socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', () => {
  // Handle disconnection
})
```

### **Real-time Features**
- **Collaborative Editing**: Multiple users editing same document
- **Live Updates**: Real-time audit updates
- **User Presence**: Show connected users
- **Notifications**: Real-time notifications

### **Usage Patterns**
```javascript
// Join audit room
this.$socket.emit('join', {
  username: UserService.user.username,
  room: this.auditId
})

// Listen for updates
this.$socket.on('updateAudit', () => {
  this.refreshAuditData()
})

// Leave room on component unmount
this.$socket.emit('leave', {
  username: UserService.user.username,
  room: this.auditId
})
```

---

## Internationalization

### **i18n Configuration**
```javascript
// boot/i18n.js
import { createI18n } from 'vue-i18n'
import messages from '@/i18n'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('system_language') || 'en-US',
  fallbackLocale: 'en-US',
  messages,
  globalInjection: true
})
```

### **Supported Languages**
- **English (en-US)**: Default language
- **French (fr-FR)**: Complete translation
- **German (de-DE)**: Complete translation
- **Chinese (zh-CN)**: Complete translation

### **Translation Files**
```javascript
// i18n/en-US/index.js
export default {
  // Navigation
  nav: {
    audits: 'Audits',
    vulnerabilities: 'Vulnerabilities',
    data: 'Data'
  },
  
  // Common terms
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  
  // Messages
  msg: {
    saveSuccess: 'Saved successfully',
    deleteConfirm: 'Are you sure you want to delete this item?'
  }
}
```

### **Usage in Components**
```vue
<template>
  <div>
    <h1>{{ $t('nav.audits') }}</h1>
    <button @click="save">{{ $t('save') }}</button>
  </div>
</template>

<script>
import { $t } from '@/boot/i18n'

export default {
  methods: {
    showMessage() {
      this.$q.notify({
        message: $t('msg.saveSuccess'),
        type: 'positive'
      })
    }
  }
}
</script>
```

---

## Styling & Theming

### **Styling Architecture**
- **Stylus**: CSS preprocessor for enhanced syntax
- **Quasar Variables**: Centralized theme customization
- **Scoped Styles**: Component-specific styling
- **Global Styles**: Application-wide styles

### **Theme Configuration**
```stylus
// css/quasar.variables.styl
$primary   = #1976D2
$secondary = #26A69A
$accent    = #9C27B0
$positive  = #21BA45
$negative  = #C10015
$info      = #31CCEC
$warning   = #F2C037
```

### **Global Styles**
```stylus
// css/app.styl
@import 'src/css/quasar.variables.styl'

// Custom classes
.text-pre-wrap
  white-space: pre-wrap

.sticky-header-table
  max-height: calc(100vh - 82px)
  
  thead tr:first-child th
    position: sticky
    z-index: 1
    top: 0
```

### **Component Styling**
```vue
<style lang="stylus" scoped>
.component-container
  padding: 16px
  border-radius: 4px
  
  .header
    font-size: 1.2em
    font-weight: bold
    margin-bottom: 16px
    
  .content
    line-height: 1.6
</style>
```

### **Dark Mode Support**
```javascript
// boot/darkmode.js
import { Dark } from 'quasar'

export function updateDarkMode(isDark) {
  Dark.set(isDark)
  localStorage.setItem('darkMode', isDark)
}

// Usage in components
toggleDarkMode() {
  updateDarkMode(!this.$q.dark.isActive)
}
```

---

## Build Configuration

### **Quasar Configuration**
```javascript
// quasar.conf.js
module.exports = function (ctx) {
  return {
    // Boot files
    boot: [
      'axios', 'auth', 'i18n', 'darkmode',
      'socketio', 'settings'
    ],
    
    // CSS files
    css: ['app.styl'],
    
    // Quasar plugins
    framework: {
      plugins: [
        'Cookies', 'Dialog', 'Loading', 'Notify', 'Dark'
      ]
    },
    
    // Build configuration
    build: {
      vueRouterMode: 'history',
      showProgress: true,
      extendWebpack(cfg) {
        cfg.resolve.alias = {
          '@': path.resolve(__dirname, 'src')
        }
      }
    },
    
    // Development server
    devServer: {
      https: true,
      port: 8081,
      proxy: {
        '/api': {
          target: 'https://pwndoc-ng-backend:5252',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
}
```

### **Build Scripts**
```json
{
  "scripts": {
    "dev": "export NODE_OPTIONS=--openssl-legacy-provider && quasar dev",
    "build": "export NODE_OPTIONS=--openssl-legacy-provider && quasar build",
    "test": "quasar --version && npm --version"
  }
}
```

### **Environment Variables**
- **Development**: API_PORT=5252, HTTPS enabled
- **Production**: API_PORT=8443, Optimized build
- **Node Options**: Legacy OpenSSL provider for compatibility

---

## Development Guidelines

### **Code Style**
- **Vue 3 Composition API**: Preferred for new components
- **TypeScript**: Use where beneficial
- **ESLint**: Follow configured linting rules
- **Naming Conventions**: PascalCase for components, camelCase for variables

### **Component Guidelines**
```vue
<!-- Good component example -->
<template>
  <div class="user-profile">
    <h2>{{ user.fullName }}</h2>
    <q-btn @click="updateProfile" :loading="loading">
      Update Profile
    </q-btn>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import UserService from '@/services/user'

export default defineComponent({
  name: 'UserProfile',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  emits: ['profile-updated'],
  setup(props, { emit }) {
    const loading = ref(false)
    const user = ref({})
    
    const fullName = computed(() => 
      `${user.value.firstname} ${user.value.lastname}`
    )
    
    const updateProfile = async () => {
      loading.value = true
      try {
        await UserService.updateProfile(user.value)
        emit('profile-updated', user.value)
      } catch (error) {
        console.error('Failed to update profile:', error)
      } finally {
        loading.value = false
      }
    }
    
    return {
      loading,
      user,
      fullName,
      updateProfile
    }
  }
})
</script>
```

### **API Integration Guidelines**
```javascript
// Good service method
async getAuditFindings(auditId, filters = {}) {
  try {
    const queryString = new URLSearchParams(filters).toString()
    const response = await api.get(`audits/${auditId}/findings?${queryString}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch audit findings:', error)
    throw error
  }
}

// Usage in component
const { findings, loading, error } = await this.loadFindings(auditId)
```

### **Error Handling**
- **User-friendly Messages**: Show meaningful error messages
- **Logging**: Log errors for debugging
- **Graceful Degradation**: Handle API failures gracefully
- **Loading States**: Show loading indicators

### **Performance Guidelines**
- **Lazy Loading**: Use dynamic imports for routes
- **Component Caching**: Cache expensive computations
- **Virtual Scrolling**: For large data lists
- **Image Optimization**: Compress images before upload

---

## Testing

### **Testing Strategy**
- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: Service layer and API integration
- **E2E Tests**: User workflows and critical paths
- **Manual Testing**: UI/UX and accessibility

### **Testing Tools**
- **Jest**: JavaScript testing framework
- **Vue Test Utils**: Vue component testing
- **Cypress**: End-to-end testing
- **Testing Library**: User-centric testing utilities

### **Test Examples**
```javascript
// Unit test example
import { mount } from '@vue/test-utils'
import UserProfile from '@/components/UserProfile.vue'

describe('UserProfile.vue', () => {
  it('renders user information correctly', () => {
    const wrapper = mount(UserProfile, {
      props: {
        user: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com'
        }
      }
    })
    
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john@example.com')
  })
})
```

---

## Common Patterns

### **Form Handling**
```vue
<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="form.name"
      label="Name"
      :rules="[val => !!val || 'Name is required']"
    />
    <q-btn type="submit" color="primary" :loading="loading">
      Submit
    </q-btn>
  </q-form>
</template>

<script>
export default {
  setup() {
    const form = reactive({
      name: '',
      email: ''
    })
    
    const loading = ref(false)
    
    const onSubmit = async () => {
      loading.value = true
      try {
        await submitForm(form)
        // Handle success
      } catch (error) {
        // Handle error
      } finally {
        loading.value = false
      }
    }
    
    return { form, loading, onSubmit }
  }
}
</script>
```

### **Data Tables**
```vue
<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    @request="onRequest"
  />
</template>

<script>
export default {
  setup() {
    const rows = ref([])
    const loading = ref(false)
    const pagination = ref({
      page: 1,
      rowsPerPage: 25,
      sortBy: 'name'
    })
    
    const onRequest = async (props) => {
      loading.value = true
      try {
        const data = await fetchData(props)
        rows.value = data.rows
        pagination.value = data.pagination
      } finally {
        loading.value = false
      }
    }
    
    return { rows, loading, pagination, onRequest }
  }
}
</script>
```

### **Modal Dialogs**
```vue
<template>
  <q-dialog v-model="showDialog" @hide="onHide">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Confirm Action</div>
      </q-card-section>
      <q-card-section>
        Are you sure you want to delete this item?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="showDialog = false" />
        <q-btn flat label="Delete" color="negative" @click="confirmDelete" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
```

---

## Performance Optimization

### **Bundle Optimization**
- **Code Splitting**: Route-based code splitting
- **Tree Shaking**: Remove unused code
- **Lazy Loading**: Load components on demand
- **Webpack Analysis**: Analyze bundle size

### **Runtime Performance**
- **Virtual Scrolling**: For large lists
- **Memoization**: Cache computed values
- **Debouncing**: Limit API calls
- **Image Optimization**: Compress and resize images

### **Memory Management**
- **Event Cleanup**: Remove event listeners
- **Component Cleanup**: Clear timers and intervals
- **Socket Cleanup**: Disconnect sockets
- **Reactive Cleanup**: Unwatch reactive properties

### **Monitoring**
- **Performance Metrics**: Track page load times
- **Error Tracking**: Monitor client-side errors
- **User Experience**: Track user interactions
- **Bundle Analysis**: Regular bundle size monitoring

---

## Security Considerations

### **Authentication & Authorization**
- **JWT Tokens**: Secure token storage in HTTP-only cookies
- **Token Refresh**: Automatic token renewal
- **Permission Checking**: Client-side permission validation
- **Route Guards**: Protect authenticated routes

### **Input Validation**
- **Client-side Validation**: Immediate user feedback
- **Server-side Validation**: Never trust client input
- **XSS Prevention**: Sanitize user input
- **CSRF Protection**: Use CSRF tokens

### **Data Protection**
- **Sensitive Data**: Never log sensitive information
- **Local Storage**: Avoid storing sensitive data
- **Transmission**: Use HTTPS for all communications
- **Content Security Policy**: Implement CSP headers

---

## Deployment

### **Build Process**
```bash
# Production build
npm run build

# Generated files in dist/
dist/
├── css/
├── js/
├── fonts/
├── icons/
└── index.html
```

### **Environment Configuration**
- **API Endpoints**: Configure for production
- **SSL Certificates**: Use proper certificates
- **Build Optimization**: Enable minification and compression
- **Static Assets**: Serve from CDN if needed

### **Deployment Checklist**
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Build optimizations enabled
- [ ] Error monitoring configured
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place

---

## Troubleshooting

### **Common Issues**
1. **Build Failures**: Check Node.js version and dependencies
2. **API Connection**: Verify proxy configuration
3. **Authentication**: Check token expiration and renewal
4. **Performance**: Analyze bundle size and optimize

### **Debug Tools**
- **Vue DevTools**: Browser extension for Vue debugging
- **Network Tab**: Monitor API requests
- **Console Logs**: Check for JavaScript errors
- **Lighthouse**: Performance and accessibility audits

### **Support Resources**
- **Vue.js Documentation**: https://vuejs.org/
- **Quasar Documentation**: https://quasar.dev/
- **Component Library**: Internal component documentation
- **API Documentation**: Backend API reference

---

This documentation should be updated as the application evolves and new features are added. Regular reviews ensure it remains accurate and useful for the development team. 