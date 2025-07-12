# Quasar to Vue Shadcn Migration Analysis Report

## Executive Summary

This document provides a comprehensive analysis of the current Quasar-based frontend application and outlines a detailed migration plan to Vue Shadcn while maintaining existing UX, styles, and behaviors.

## Current System Analysis

### 1. Quasar Framework Setup

**Current Version:** Quasar 2.17.7 with Vue 3.5.13

**Build System:**
- Quasar CLI with webpack
- Babel transpilation with @quasar/babel-preset-app
- Stylus for CSS preprocessing
- Development server with HTTPS support
- Production build with legacy provider support

**Architecture:**
- Single Page Application (SPA)
- Vue 3 Composition API
- Component-based architecture
- Internationalization support (i18n)
- Dark mode support
- Responsive design

### 2. Quasar Components Inventory

**Core Layout Components:**
- `q-layout` - Main application layout
- `q-header` - Top navigation header
- `q-toolbar` - Toolbar container
- `q-drawer` - Side navigation drawer
- `q-page-container` - Main content area
- `q-page` - Individual page wrapper

**Navigation Components:**
- `q-item` - Navigation menu items
- `q-item-section` - Item content sections
- `q-breadcrumbs` - Breadcrumb navigation
- `q-breadcrumbs-el` - Breadcrumb elements
- `q-tabs` - Tab navigation
- `q-tab` - Individual tab
- `q-tab-panels` - Tab content panels
- `q-tab-panel` - Individual tab panel

**Form Components:**
- `q-input` - Text input fields
- `q-select` - Dropdown select
- `q-checkbox` - Checkbox input
- `q-radio` - Radio button
- `q-option-group` - Radio/checkbox groups
- `q-toggle` - Toggle switch
- `q-date` - Date picker
- `q-btn` - Button component
- `q-btn-dropdown` - Dropdown button
- `q-btn-group` - Button groups
- `q-btn-toggle` - Toggle buttons

**Data Display Components:**
- `q-table` - Data table
- `q-card` - Card container
- `q-card-section` - Card content sections
- `q-card-actions` - Card action area
- `q-list` - List container
- `q-chip` - Chip/tag component
- `q-badge` - Badge component
- `q-avatar` - Avatar component

**Feedback Components:**
- `q-dialog` - Modal dialogs
- `q-banner` - Banner notifications
- `q-tooltip` - Tooltips
- `q-popup-edit` - Inline editing popup
- `q-popup-proxy` - General purpose popup
- `q-inner-loading` - Loading indicators
- `q-spinner-gears` - Loading spinner

**Layout & Utility Components:**
- `q-space` - Flexible spacer
- `q-separator` - Visual separators
- `q-icon` - Icon component
- `q-img` - Image component
- `q-scroll-area` - Scrollable area
- `q-splitter` - Resizable splitter
- `q-expansion-item` - Collapsible content
- `q-field` - Form field wrapper

### 3. Styling System Analysis

**Current Approach:**
- Stylus preprocessor for CSS
- Quasar's built-in CSS variables system
- Material Design color palette
- Custom color schemes for light/dark modes
- Responsive design with Quasar's breakpoint system

**Theme Configuration:**
```stylus
$primary   = #3c4759
$secondary = #26A69A
$positive  = #21BA45
$negative  = #DB2828
$info      = #31CCEC
$warning   = #F2C037
```

**Dark Mode Implementation:**
- Quasar Dark plugin for theme switching
- Custom CSS variables for theme-specific colors
- LocalStorage persistence for theme preference
- Body class-based theme switching

### 4. Third-Party Integrations

**Key Dependencies:**
- TipTap editor for rich text editing
- Chart.js for data visualization
- Socket.io for real-time communication
- Axios for HTTP requests
- Vue i18n for internationalization
- JWT for authentication

### 5. Build System & Tooling

**Current Configuration:**
- Quasar CLI with webpack bundling
- Babel for JavaScript transpilation
- Stylus loader for CSS processing
- Development server with hot reload
- Production build with code splitting

## Migration Strategy

### Phase 1: Foundation Setup (2-3 weeks)

**1.1 New Build System Setup**
- Replace Quasar CLI with Vite
- Configure Tailwind CSS
- Set up Vue Shadcn/ui
- Configure TypeScript support
- Set up ESLint and Prettier

**1.2 Dependencies Migration**
- Update to latest Vue 3 version
- Replace Quasar plugins with Vue 3 equivalents
- Update build dependencies
- Configure path aliases

### Phase 2: Core Component Migration (4-6 weeks)

**2.1 Layout Components**
```
q-layout → Custom layout with Shadcn components
q-header → Custom header with Shadcn navigation
q-drawer → Shadcn Sheet component
q-toolbar → Custom toolbar with Shadcn components
```

**2.2 Form Components**
```
q-input → Shadcn Input component
q-select → Shadcn Select component
q-checkbox → Shadcn Checkbox component
q-radio → Shadcn RadioGroup component
q-toggle → Shadcn Switch component
q-btn → Shadcn Button component
q-date → Shadcn Calendar component
```

**2.3 Data Display Components**
```
q-table → Shadcn Table component
q-card → Shadcn Card component
q-list → Custom list with Shadcn components
q-chip → Shadcn Badge component
q-dialog → Shadcn Dialog component
```

### Phase 3: Styling System Migration (2-3 weeks)

**3.1 Design System Foundation**
- Establish design tokens and CSS custom properties
- Create comprehensive color system mapping
- Define typography scale and font weights
- Set up spacing scale and component sizing
- Configure border radius and shadow systems

**3.2 Component Styling Standards**
- Create styled component variants for consistency
- Define component size variants (sm, md, lg, xl)
- Establish state styling patterns (hover, focus, active, disabled)
- Create responsive styling guidelines
- Set up animation and transition standards

### Phase 4: Advanced Features (3-4 weeks)

**4.1 Theme System**
- Implement dark mode toggle
- Create theme provider
- Set up localStorage persistence
- Configure theme switching animations

**4.2 Responsive Design**
- Implement responsive layouts
- Create mobile-first components
- Set up breakpoint system
- Optimize for touch devices

### Phase 5: Testing & Optimization (2-3 weeks)

**5.1 Component Testing**
- Unit tests for all components
- Integration tests for complex flows
- Visual regression testing
- Accessibility testing

**5.2 Performance Optimization**
- Bundle size optimization
- Code splitting configuration
- Lazy loading implementation
- Performance monitoring

## Component Mapping Guide

### Layout Components

| Quasar Component | Vue Shadcn Equivalent | Migration Notes |
|------------------|----------------------|-----------------|
| `q-layout` | Custom layout wrapper | Use CSS Grid/Flexbox |
| `q-header` | Custom header component | Combine with Shadcn Navigation |
| `q-drawer` | `Sheet` component | Use Sheet for mobile, sidebar for desktop |
| `q-page-container` | `main` element | Simple HTML semantic element |
| `q-toolbar` | Custom toolbar | Combine Button and Separator |

### Form Components

| Quasar Component | Vue Shadcn Equivalent | Migration Notes |
|------------------|----------------------|-----------------|
| `q-input` | `Input` | Direct replacement |
| `q-select` | `Select` | Use SelectContent, SelectItem |
| `q-checkbox` | `Checkbox` | Direct replacement |
| `q-radio` | `RadioGroup` | Use RadioGroupItem |
| `q-toggle` | `Switch` | Direct replacement |
| `q-btn` | `Button` | Direct replacement with variants |
| `q-date` | `Calendar` | Use with Popover for date picker |

### Data Display Components

| Quasar Component | Vue Shadcn Equivalent | Migration Notes |
|------------------|----------------------|-----------------|
| `q-table` | `Table` | Use TableHeader, TableBody, TableRow |
| `q-card` | `Card` | Use CardHeader, CardContent, CardFooter |
| `q-list` | Custom list | Create with div and proper semantics |
| `q-chip` | `Badge` | Use Badge with variants |
| `q-dialog` | `Dialog` | Use DialogContent, DialogHeader |

### Feedback Components

| Quasar Component | Vue Shadcn Equivalent | Migration Notes |
|------------------|----------------------|-----------------|
| `q-banner` | `Alert` | Use AlertDescription |
| `q-tooltip` | `Tooltip` | Use TooltipContent, TooltipTrigger |
| `q-popup-edit` | `Popover` | Combine with form components |
| `q-inner-loading` | Custom loading | Create with Spinner component |

## Comprehensive Styling Guidelines

### 1. Design System Foundation

**CSS Custom Properties (Design Tokens)**
```css
:root {
  /* Color System */
  --color-primary: 60 71 89;           /* #3c4759 */
  --color-secondary: 38 166 154;       /* #26A69A */
  --color-success: 33 186 69;          /* #21BA45 */
  --color-destructive: 219 40 40;      /* #DB2828 */
  --color-info: 49 204 236;            /* #31CCEC */
  --color-warning: 242 192 55;         /* #F2C037 */
  
  /* Neutral Colors */
  --color-background: 0 0 100%;        /* #ffffff */
  --color-foreground: 13 13 13;        /* #0d0d0d */
  --color-card: 0 0 100%;              /* #ffffff */
  --color-popover: 0 0 100%;           /* #ffffff */
  --color-muted: 245 245 245;          /* #f5f5f5 */
  --color-muted-foreground: 115 115 115; /* #737373 */
  --color-border: 229 229 229;         /* #e5e5e5 */
  --color-input: 229 229 229;          /* #e5e5e5 */
  --color-ring: 142 142 142;           /* #8e8e8e */
  
  /* Typography */
  --font-family-sans: 'Helvetica', 'Arial', sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  /* Spacing Scale */
  --spacing-0: 0;
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  
  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* Dark Mode */
.dark {
  --color-background: 13 13 13;        /* #0d0d0d */
  --color-foreground: 250 250 250;     /* #fafafa */
  --color-card: 29 29 29;              /* #1d1d1d */
  --color-popover: 29 29 29;           /* #1d1d1d */
  --color-muted: 38 38 38;             /* #262626 */
  --color-muted-foreground: 163 163 163; /* #a3a3a3 */
  --color-border: 38 38 38;            /* #262626 */
  --color-input: 38 38 38;             /* #262626 */
  --color-ring: 142 142 142;           /* #8e8e8e */
}
```

**Tailwind Configuration**
```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,vue}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          foreground: "hsl(var(--color-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--color-secondary))",
          foreground: "hsl(var(--color-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--color-destructive))",
          foreground: "hsl(var(--color-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--color-muted))",
          foreground: "hsl(var(--color-muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--color-card))",
          foreground: "hsl(var(--color-card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--color-popover))",
          foreground: "hsl(var(--color-popover-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-family-sans)", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        "3xl": "var(--font-size-3xl)",
        "4xl": "var(--font-size-4xl)",
      },
      spacing: {
        0: "var(--spacing-0)",
        1: "var(--spacing-1)",
        2: "var(--spacing-2)",
        3: "var(--spacing-3)",
        4: "var(--spacing-4)",
        5: "var(--spacing-5)",
        6: "var(--spacing-6)",
        8: "var(--spacing-8)",
        10: "var(--spacing-10)",
        12: "var(--spacing-12)",
        16: "var(--spacing-16)",
      },
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
    },
  },
  plugins: [],
}
```

### 2. Component Styling Standards

**Button Components**
```vue
<!-- Button variants following Shadcn patterns -->
<template>
  <button
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      {
        // Size variants
        'h-10 px-4 py-2': size === 'default',
        'h-9 rounded-md px-3': size === 'sm',
        'h-11 rounded-md px-8': size === 'lg',
        'h-10 w-10': size === 'icon',
        
        // Color variants
        'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
        'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
        'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
        'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
        'text-primary underline-offset-4 hover:underline': variant === 'link',
      }
    )"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
```

**Input Components**
```vue
<!-- Input with consistent styling -->
<template>
  <input
    :class="cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      {
        'border-destructive focus-visible:ring-destructive': error,
        'h-8 px-2 py-1 text-xs': size === 'sm',
        'h-12 px-4 py-3 text-base': size === 'lg',
      },
      className
    )"
    :disabled="disabled"
    v-bind="$attrs"
  />
</template>
```

**Card Components**
```vue
<!-- Card with consistent styling -->
<template>
  <div :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)">
    <div v-if="$slots.header" class="flex flex-col space-y-1.5 p-6">
      <slot name="header" />
    </div>
    <div class="p-6 pt-0">
      <slot />
    </div>
    <div v-if="$slots.footer" class="flex items-center p-6 pt-0">
      <slot name="footer" />
    </div>
  </div>
</template>
```

### 3. Quasar to Shadcn Styling Migration Map

**Color System Mapping**
```css
/* Quasar → Shadcn Color Mapping */
.q-primary     → .bg-primary .text-primary-foreground
.q-secondary   → .bg-secondary .text-secondary-foreground
.q-positive    → .bg-green-600 .text-white
.q-negative    → .bg-destructive .text-destructive-foreground
.q-info        → .bg-blue-600 .text-white
.q-warning     → .bg-yellow-600 .text-white

/* Background Colors */
.bg-grey-1     → .bg-gray-50
.bg-grey-2     → .bg-gray-100
.bg-grey-3     → .bg-gray-200
.bg-grey-4     → .bg-gray-300
.bg-blue-grey-5 → .bg-slate-500

/* Text Colors */
.text-grey-8   → .text-gray-800
.text-white    → .text-white
.text-black    → .text-black
```

**Typography Mapping**
```css
/* Quasar → Shadcn Typography */
.text-h1       → .text-4xl .font-bold
.text-h2       → .text-3xl .font-bold
.text-h3       → .text-2xl .font-bold
.text-h4       → .text-xl .font-bold
.text-h5       → .text-lg .font-bold
.text-h6       → .text-base .font-bold
.text-subtitle1 → .text-lg .font-medium
.text-subtitle2 → .text-base .font-medium
.text-body1    → .text-base
.text-body2    → .text-sm
.text-caption  → .text-xs
.text-overline → .text-xs .uppercase .tracking-wider
```

**Spacing Mapping**
```css
/* Quasar → Shadcn Spacing */
.q-pa-xs       → .p-1
.q-pa-sm       → .p-2
.q-pa-md       → .p-4
.q-pa-lg       → .p-6
.q-pa-xl       → .p-8

.q-ma-xs       → .m-1
.q-ma-sm       → .m-2
.q-ma-md       → .m-4
.q-ma-lg       → .m-6
.q-ma-xl       → .m-8

.q-gutter-xs   → .gap-1
.q-gutter-sm   → .gap-2
.q-gutter-md   → .gap-4
.q-gutter-lg   → .gap-6
.q-gutter-xl   → .gap-8
```

### 4. Component State Styling Standards

**Interactive States**
```css
/* Consistent hover, focus, active states */
.interactive-element {
  @apply transition-colors duration-200 ease-in-out;
  
  &:hover {
    @apply bg-accent/80 text-accent-foreground;
  }
  
  &:focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2;
  }
  
  &:active {
    @apply bg-accent text-accent-foreground;
  }
  
  &:disabled {
    @apply pointer-events-none opacity-50;
  }
}
```

**Loading States**
```css
/* Loading state patterns */
.loading-skeleton {
  @apply bg-muted animate-pulse rounded;
}

.loading-spinner {
  @apply animate-spin rounded-full border-2 border-muted border-t-primary;
}
```

### 5. Responsive Design Patterns

**Breakpoint System**
```css
/* Consistent responsive patterns */
.responsive-container {
  @apply px-4 sm:px-6 lg:px-8;
  @apply max-w-7xl mx-auto;
}

.responsive-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.responsive-flex {
  @apply flex flex-col sm:flex-row gap-4;
}
```

### 6. Animation Standards

**Consistent Animations**
```css
/* Standard transitions */
.transition-default {
  @apply transition-all duration-200 ease-in-out;
}

.transition-fast {
  @apply transition-all duration-150 ease-in-out;
}

.transition-slow {
  @apply transition-all duration-300 ease-in-out;
}

/* Modal/Dialog animations */
.modal-enter {
  @apply transition-opacity duration-200;
}

.modal-enter-from {
  @apply opacity-0;
}

.modal-enter-to {
  @apply opacity-100;
}
```

### 7. Component Composition Patterns

**Consistent Component Structure**
```vue
<!-- Standard component template -->
<template>
  <div :class="cn(baseClasses, variantClasses, sizeClasses, stateClasses, className)">
    <slot />
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'sm', 'lg', 'icon'].includes(value)
  },
  disabled: Boolean,
  className: String,
})

const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variantClasses = computed(() => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  }
  return sizes[props.size]
})

const stateClasses = computed(() => {
  return {
    'opacity-50 cursor-not-allowed': props.disabled,
  }
})
</script>
```

### 8. Style Enforcement Guidelines

**CSS Class Naming Conventions**
- Use Tailwind utility classes for consistent spacing, colors, and sizing
- Create component-specific classes only when necessary
- Use `cn()` utility for conditional class application
- Follow BEM methodology for custom CSS classes

**Component Variant System**
- Always provide size variants: `sm`, `default`, `lg`
- Always provide color variants: `default`, `secondary`, `destructive`, `outline`, `ghost`
- Use TypeScript for prop validation
- Document all variants in component props

**Style Consistency Rules**
1. **No inline styles** - Use Tailwind classes or CSS custom properties
2. **Consistent spacing** - Use spacing scale (1, 2, 3, 4, 6, 8, 12, 16)
3. **Consistent colors** - Use design tokens, no hardcoded colors
4. **Consistent typography** - Use font scale and weight system
5. **Consistent interactions** - Use standard transition and animation patterns

### 9. Utility Functions and Helpers

**Class Name Utility (`cn` function)**
```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Style Validation Helpers**
```typescript
// lib/style-validators.ts
export const sizeVariants = ['xs', 'sm', 'default', 'lg', 'xl'] as const
export const colorVariants = ['default', 'primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const

export type SizeVariant = typeof sizeVariants[number]
export type ColorVariant = typeof colorVariants[number]

export function validateSize(size: string): size is SizeVariant {
  return sizeVariants.includes(size as SizeVariant)
}

export function validateColor(color: string): color is ColorVariant {
  return colorVariants.includes(color as ColorVariant)
}
```

**Component Base Classes**
```typescript
// lib/component-classes.ts
export const baseButtonClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

export const baseInputClasses = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export const baseCardClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm'

export const baseDialogClasses = 'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full'
```

### 10. Development Guidelines and Code Review Checklist

**Pre-Development Setup**
```bash
# Install required dependencies
npm install clsx tailwind-merge class-variance-authority
npm install -D @tailwindcss/typography
npm install -D eslint-plugin-tailwindcss

# ESLint configuration for Tailwind
# .eslintrc.js
module.exports = {
  extends: ['plugin:tailwindcss/recommended'],
  rules: {
    'tailwindcss/classnames-order': 'error',
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'error',
    'tailwindcss/migration-from-tailwind-2': 'error',
    'tailwindcss/no-arbitrary-value': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/no-contradicting-classname': 'error'
  }
}
```

**Code Review Checklist**
- [ ] **Design Tokens Used**: No hardcoded colors, spacing, or typography
- [ ] **Consistent Variants**: All components have proper size/color variants
- [ ] **Accessibility**: Proper ARIA attributes and keyboard navigation
- [ ] **Responsive Design**: Mobile-first approach with proper breakpoints
- [ ] **State Management**: Consistent hover, focus, active, disabled states
- [ ] **Class Organization**: Uses `cn()` utility for conditional classes
- [ ] **TypeScript Props**: Proper type validation for variants
- [ ] **Documentation**: Component variants and usage documented
- [ ] **Performance**: No unnecessary re-renders or style calculations
- [ ] **Testing**: Component behavior tested across all variants

**Component Development Template**
```vue
<template>
  <component
    :is="as"
    :class="cn(baseClasses, variantClasses, sizeClasses, stateClasses, className)"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { type SizeVariant, type ColorVariant } from '@/lib/style-validators'

interface Props {
  as?: string
  variant?: ColorVariant
  size?: SizeVariant
  disabled?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  variant: 'default',
  size: 'default',
  disabled: false,
})

// Base classes - shared across all variants
const baseClasses = 'component-base-classes'

// Variant-specific classes
const variantClasses = computed(() => {
  const variants = {
    default: 'variant-default-classes',
    primary: 'variant-primary-classes',
    // ... other variants
  }
  return variants[props.variant]
})

// Size-specific classes
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'size-sm-classes',
    default: 'size-default-classes',
    lg: 'size-lg-classes',
  }
  return sizes[props.size]
})

// State-specific classes
const stateClasses = computed(() => ({
  'opacity-50 cursor-not-allowed': props.disabled,
}))
</script>
```

### 11. Style Migration Automation Tools

**Automated Class Replacement Script**
```javascript
// scripts/migrate-styles.js
const fs = require('fs')
const path = require('path')

const replacements = {
  // Quasar to Tailwind mappings
  'q-pa-xs': 'p-1',
  'q-pa-sm': 'p-2',
  'q-pa-md': 'p-4',
  'q-pa-lg': 'p-6',
  'q-pa-xl': 'p-8',
  'text-h1': 'text-4xl font-bold',
  'text-h2': 'text-3xl font-bold',
  'text-h3': 'text-2xl font-bold',
  'text-h4': 'text-xl font-bold',
  'text-h5': 'text-lg font-bold',
  'text-h6': 'text-base font-bold',
  'bg-primary': 'bg-primary',
  'bg-secondary': 'bg-secondary',
  'bg-positive': 'bg-green-600',
  'bg-negative': 'bg-destructive',
  'bg-info': 'bg-blue-600',
  'bg-warning': 'bg-yellow-600',
}

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  Object.entries(replacements).forEach(([quasarClass, tailwindClass]) => {
    const regex = new RegExp(`\\b${quasarClass}\\b`, 'g')
    content = content.replace(regex, tailwindClass)
  })
  
  fs.writeFileSync(filePath, content)
}

// Usage: node scripts/migrate-styles.js
```

## Implementation Timeline

### Week 1-2: Project Setup
- [ ] Set up new Vite project
- [ ] Configure Tailwind CSS
- [ ] Install Vue Shadcn/ui
- [ ] Set up TypeScript
- [ ] Configure development environment

### Week 3-4: Core Layout Migration
- [ ] Migrate main layout structure
- [ ] Implement navigation components
- [ ] Set up routing system
- [ ] Create breadcrumb component

### Week 5-8: Component Migration
- [ ] Migrate form components
- [ ] Migrate data display components
- [ ] Migrate feedback components
- [ ] Create custom components where needed

### Week 9-10: Styling System
- [ ] Implement design tokens and CSS custom properties
- [ ] Convert color system mapping
- [ ] Set up Tailwind configuration with design tokens
- [ ] Create component styling standards
- [ ] Implement dark mode system
- [ ] Set up responsive design patterns
- [ ] Create utility classes and helper functions
- [ ] Implement style validation and linting
- [ ] Create component development templates

### Week 11-13: Advanced Features
- [ ] Implement theme switching
- [ ] Add animations and transitions
- [ ] Optimize for performance
- [ ] Add accessibility features

### Week 14-15: Testing & Polish
- [ ] Comprehensive testing
- [ ] Style consistency audit
- [ ] Code review checklist implementation
- [ ] Bug fixes and optimizations
- [ ] Documentation updates
- [ ] Performance audits
- [ ] Final style guide validation

## Risk Assessment

### High Risk Items
1. **Complex Table Components** - Quasar's QTable has advanced features that may require custom implementation
2. **Rich Text Editor Integration** - TipTap integration may need adjustments
3. **Custom Field Components** - Complex custom field system needs careful migration
4. **Real-time Features** - Socket.io integration must be preserved

### Medium Risk Items
1. **Theme System** - Dark mode implementation complexity
2. **Responsive Design** - Ensuring mobile compatibility
3. **Performance** - Bundle size and runtime performance
4. **Accessibility** - Maintaining ARIA compliance
5. **Style Consistency** - Ensuring developers follow design system guidelines
6. **Component Variants** - Implementing all necessary size/color variants

### Low Risk Items
1. **Basic Form Components** - Direct replacements available
2. **Layout Structure** - Straightforward migration
3. **Color System** - Well-defined mapping
4. **Build System** - Modern tooling upgrade

## Migration Checklist

### Pre-Migration
- [ ] Create backup of current codebase
- [ ] Document current functionality
- [ ] Set up testing environment
- [ ] Establish rollback plan

### During Migration
- [ ] Migrate components incrementally
- [ ] Test each component thoroughly
- [ ] Maintain git history
- [ ] Document changes and decisions

### Post-Migration
- [ ] Performance comparison
- [ ] Accessibility audit
- [ ] User acceptance testing
- [ ] Documentation update

## Success Metrics

### Functional Requirements
- [ ] All existing features work correctly
- [ ] No regression in user experience
- [ ] Performance metrics maintained or improved
- [ ] Accessibility compliance maintained

### Technical Requirements
- [ ] Bundle size reduced by 20%
- [ ] Build time improved by 30%
- [ ] Development experience enhanced
- [ ] Type safety improved with TypeScript
- [ ] Style consistency maintained across all components
- [ ] Zero hardcoded colors or spacing values
- [ ] All components follow variant system
- [ ] Design tokens used consistently

## Conclusion

The migration from Quasar to Vue Shadcn is feasible and will result in a more modern, maintainable, and performant application. The key to success is:

1. **Incremental Migration** - Migrate components gradually to minimize risk
2. **Thorough Testing** - Ensure no functionality is lost during migration
3. **Performance Monitoring** - Track metrics throughout the process
4. **Team Training** - Ensure team is familiar with new tools and patterns

**Estimated Timeline:** 12-15 weeks
**Team Size:** 2-3 developers
**Risk Level:** Medium
**Expected Benefits:** Better performance, improved DX, modern tooling, smaller bundle size

This migration will modernize the application while preserving all existing functionality and user experience. 