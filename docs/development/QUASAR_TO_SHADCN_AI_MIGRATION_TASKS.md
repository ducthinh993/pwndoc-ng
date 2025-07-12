# Quasar to Vue Shadcn Migration - AI Task List

## ⚠️ CRITICAL REQUIREMENTS
- **ZERO DEVIATION** from styling guidelines
- **EXACT UI/UX REPLICATION** - no visual changes
- **MANDATORY STYLE CONSISTENCY** - use design tokens only
- **COMPONENT VARIANT SYSTEM** - all components must have size/color variants
- **TYPESCRIPT VALIDATION** - all props must be type-safe
- **ACCESSIBILITY COMPLIANCE** - maintain all ARIA attributes
- **RESPONSIVE DESIGN** - preserve mobile/desktop layouts

## Phase 1: Foundation Setup (Week 1-2)

### Task 1.1: Project Structure Setup
- [ ] Create new Vite project structure
- [ ] Install required dependencies:
  ```bash
  npm install vue@latest vue-router@latest
  npm install @tailwindcss/forms @tailwindcss/typography
  npm install clsx tailwind-merge class-variance-authority
  npm install @vueuse/core @vueuse/components
  npm install lucide-vue-next
  npm install -D vite @vitejs/plugin-vue
  npm install -D tailwindcss postcss autoprefixer
  npm install -D typescript @vue/tsconfig
  npm install -D eslint-plugin-tailwindcss
  ```
- [ ] Configure `vite.config.ts`:
  ```typescript
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
  })
  ```

### Task 1.2: Design System Foundation
- [ ] Create `src/lib/utils.ts`:
  ```typescript
  import { type ClassValue, clsx } from 'clsx'
  import { twMerge } from 'tailwind-merge'
  
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```
- [ ] Create `src/lib/style-validators.ts`:
  ```typescript
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
- [ ] Create `src/lib/component-classes.ts` with all base classes from the plan

### Task 1.3: CSS Custom Properties Setup
- [ ] Create `src/styles/globals.css` with EXACT design tokens:
  ```css
  :root {
    /* EXACT color mapping from Quasar theme */
    --color-primary: 60 71 89;           /* #3c4759 */
    --color-secondary: 38 166 154;       /* #26A69A */
    --color-success: 33 186 69;          /* #21BA45 */
    --color-destructive: 219 40 40;      /* #DB2828 */
    --color-info: 49 204 236;            /* #31CCEC */
    --color-warning: 242 192 55;         /* #F2C037 */
    
    /* Complete design token system from the plan */
    /* ... ALL tokens from the analysis must be included */
  }
  ```
- [ ] Create `src/styles/components.css` for component-specific styles

### Task 1.4: Tailwind Configuration
- [ ] Create `tailwind.config.js` with EXACT configuration from the plan
- [ ] Verify all design tokens are properly mapped
- [ ] Test color system matches Quasar exactly

## Phase 2: Core Component Migration (Week 3-8)

### Task 2.1: Layout Components Migration

#### Task 2.1.1: Layout Component (`q-layout` → Custom Layout)
- [ ] Create `src/components/ui/layout.vue`:
  ```vue
  <template>
    <div :class="cn('min-h-screen bg-background font-sans antialiased', className)">
      <slot />
    </div>
  </template>
  
  <script setup lang="ts">
  import { cn } from '@/lib/utils'
  
  interface Props {
    className?: string
  }
  
  defineProps<Props>()
  </script>
  ```
- [ ] **VALIDATION**: Must match q-layout visual appearance exactly
- [ ] **ACCESSIBILITY**: Maintain semantic HTML structure

#### Task 2.1.2: Header Component (`q-header` → Custom Header)
- [ ] Create `src/components/ui/header.vue`:
  ```vue
  <template>
    <header :class="cn('sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)">
      <div class="container flex h-14 items-center">
        <slot />
      </div>
    </header>
  </template>
  ```
- [ ] **VALIDATION**: Must match q-header height and styling exactly
- [ ] **RESPONSIVE**: Maintain mobile behavior

#### Task 2.1.3: Navigation Drawer (`q-drawer` → Sheet Component)
- [ ] Create `src/components/ui/sheet.vue` with Shadcn Sheet implementation
- [ ] **CRITICAL**: Must match q-drawer slide animation exactly
- [ ] **MOBILE**: Implement overlay behavior identical to Quasar
- [ ] **DESKTOP**: Maintain sidebar behavior

#### Task 2.1.4: Toolbar Component (`q-toolbar` → Custom Toolbar)
- [ ] Create `src/components/ui/toolbar.vue`:
  ```vue
  <template>
    <div :class="cn('flex items-center justify-between p-4', className)">
      <slot />
    </div>
  </template>
  ```
- [ ] **VALIDATION**: Must match q-toolbar spacing and alignment

### Task 2.2: Form Components Migration

#### Task 2.2.1: Button Component (`q-btn` → Shadcn Button)
- [ ] Create `src/components/ui/button.vue`:
  ```vue
  <template>
    <button
      :class="cn(baseButtonClasses, variantClasses, sizeClasses, stateClasses, className)"
      :disabled="disabled"
      v-bind="$attrs"
    >
      <slot />
    </button>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '@/lib/utils'
  import { baseButtonClasses } from '@/lib/component-classes'
  import { type SizeVariant, type ColorVariant } from '@/lib/style-validators'
  
  interface Props {
    variant?: ColorVariant
    size?: SizeVariant
    disabled?: boolean
    className?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'default',
    disabled: false,
  })
  
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
      xs: 'h-8 px-2 text-xs',
      sm: 'h-9 px-3 text-sm',
      default: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg',
      xl: 'h-12 px-10 text-xl',
    }
    return sizes[props.size]
  })
  
  const stateClasses = computed(() => ({
    'opacity-50 cursor-not-allowed': props.disabled,
  }))
  </script>
  ```
- [ ] **VALIDATION**: Must match ALL q-btn variants exactly
- [ ] **REQUIRED VARIANTS**: default, primary, secondary, outline, ghost, link
- [ ] **REQUIRED SIZES**: xs, sm, default, lg, xl
- [ ] **STATES**: hover, focus, active, disabled must match Quasar exactly

#### Task 2.2.2: Input Component (`q-input` → Shadcn Input)
- [ ] Create `src/components/ui/input.vue`:
  ```vue
  <template>
    <input
      :class="cn(baseInputClasses, sizeClasses, errorClasses, className)"
      :disabled="disabled"
      v-bind="$attrs"
    />
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '@/lib/utils'
  import { baseInputClasses } from '@/lib/component-classes'
  import { type SizeVariant } from '@/lib/style-validators'
  
  interface Props {
    size?: SizeVariant
    error?: boolean
    disabled?: boolean
    className?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    size: 'default',
    error: false,
    disabled: false,
  })
  
  const sizeClasses = computed(() => {
    const sizes = {
      xs: 'h-8 px-2 py-1 text-xs',
      sm: 'h-9 px-3 py-2 text-sm',
      default: 'h-10 px-3 py-2 text-sm',
      lg: 'h-11 px-4 py-3 text-base',
      xl: 'h-12 px-4 py-3 text-lg',
    }
    return sizes[props.size]
  })
  
  const errorClasses = computed(() => ({
    'border-destructive focus-visible:ring-destructive': props.error,
  }))
  </script>
  ```
- [ ] **VALIDATION**: Must match q-input sizing and behavior exactly
- [ ] **ERROR STATES**: Must match q-input error styling
- [ ] **FOCUS STATES**: Must match q-input focus ring behavior

#### Task 2.2.3: Select Component (`q-select` → Shadcn Select)
- [ ] Create `src/components/ui/select.vue` with full Shadcn Select implementation
- [ ] **DROPDOWN BEHAVIOR**: Must match q-select dropdown exactly
- [ ] **OPTION STYLING**: Must match q-select option appearance
- [ ] **SEARCH FUNCTIONALITY**: Maintain if exists in current implementation

#### Task 2.2.4: Checkbox Component (`q-checkbox` → Shadcn Checkbox)
- [ ] Create `src/components/ui/checkbox.vue`
- [ ] **VALIDATION**: Must match q-checkbox styling exactly
- [ ] **STATES**: unchecked, checked, indeterminate, disabled

#### Task 2.2.5: Radio Component (`q-radio` → Shadcn RadioGroup)
- [ ] Create `src/components/ui/radio-group.vue`
- [ ] **VALIDATION**: Must match q-radio styling exactly
- [ ] **GROUP BEHAVIOR**: Maintain radio group functionality

#### Task 2.2.6: Toggle Component (`q-toggle` → Shadcn Switch)
- [ ] Create `src/components/ui/switch.vue`
- [ ] **ANIMATION**: Must match q-toggle animation exactly
- [ ] **STATES**: on, off, disabled

### Task 2.3: Data Display Components Migration

#### Task 2.3.1: Card Component (`q-card` → Shadcn Card)
- [ ] Create `src/components/ui/card.vue`:
  ```vue
  <template>
    <div :class="cn(baseCardClasses, variantClasses, className)">
      <div v-if="$slots.header" :class="cn('flex flex-col space-y-1.5 p-6', headerClasses)">
        <slot name="header" />
      </div>
      <div :class="cn('p-6', { 'pt-0': $slots.header }, contentClasses)">
        <slot />
      </div>
      <div v-if="$slots.footer" :class="cn('flex items-center p-6 pt-0', footerClasses)">
        <slot name="footer" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { cn } from '@/lib/utils'
  import { baseCardClasses } from '@/lib/component-classes'
  
  interface Props {
    variant?: 'default' | 'outlined' | 'elevated'
    className?: string
    headerClasses?: string
    contentClasses?: string
    footerClasses?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
  })
  
  const variantClasses = computed(() => {
    const variants = {
      default: 'border shadow-sm',
      outlined: 'border-2',
      elevated: 'shadow-lg',
    }
    return variants[props.variant]
  })
  </script>
  ```
- [ ] **VALIDATION**: Must match q-card sections exactly
- [ ] **SPACING**: Must match q-card-section padding exactly

#### Task 2.3.2: Table Component (`q-table` → Shadcn Table)
- [ ] Create `src/components/ui/table.vue` with full table implementation
- [ ] **CRITICAL**: Must support sticky headers exactly like current implementation
- [ ] **PAGINATION**: Must match q-table pagination behavior
- [ ] **SORTING**: Must match q-table sorting behavior
- [ ] **FILTERING**: Must match q-table filtering behavior
- [ ] **SELECTION**: Must match q-table row selection behavior

#### Task 2.3.3: Badge Component (`q-chip` → Shadcn Badge)
- [ ] Create `src/components/ui/badge.vue`
- [ ] **VARIANTS**: Must match all q-chip color variants
- [ ] **REMOVABLE**: Must support removable chips if used

#### Task 2.3.4: Avatar Component (`q-avatar` → Custom Avatar)
- [ ] Create `src/components/ui/avatar.vue`
- [ ] **SIZING**: Must match q-avatar sizing exactly
- [ ] **FALLBACK**: Must handle fallback text/icons properly

### Task 2.4: Feedback Components Migration

#### Task 2.4.1: Dialog Component (`q-dialog` → Shadcn Dialog)
- [ ] Create `src/components/ui/dialog.vue`
- [ ] **ANIMATION**: Must match q-dialog enter/exit animations exactly
- [ ] **OVERLAY**: Must match q-dialog overlay behavior
- [ ] **POSITIONING**: Must match q-dialog positioning

#### Task 2.4.2: Toast/Notification Component (`q-banner` → Shadcn Alert)
- [ ] Create `src/components/ui/alert.vue`
- [ ] **VARIANTS**: success, error, warning, info must match exactly
- [ ] **POSITIONING**: Must match banner positioning

#### Task 2.4.3: Tooltip Component (`q-tooltip` → Shadcn Tooltip)
- [ ] Create `src/components/ui/tooltip.vue`
- [ ] **POSITIONING**: Must match q-tooltip positioning exactly
- [ ] **ANIMATION**: Must match q-tooltip show/hide animation

## Phase 3: Styling System Implementation (Week 9-10)

### Task 3.1: Component Variant System Validation
- [ ] **AUDIT ALL COMPONENTS**: Every component must have consistent variant system
- [ ] **SIZE VARIANTS**: xs, sm, default, lg, xl for all applicable components
- [ ] **COLOR VARIANTS**: default, primary, secondary, destructive, outline, ghost, link
- [ ] **STATE VARIANTS**: hover, focus, active, disabled for all interactive components

### Task 3.2: Style Consistency Enforcement
- [ ] Create ESLint configuration for Tailwind:
  ```javascript
  module.exports = {
    extends: ['plugin:tailwindcss/recommended'],
    rules: {
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/no-contradicting-classname': 'error'
    }
  }
  ```
- [ ] **VALIDATION**: Run ESLint on all components to ensure compliance

### Task 3.3: Dark Mode Implementation
- [ ] Create `src/composables/useDarkMode.ts`:
  ```typescript
  import { ref, watch } from 'vue'
  
  const isDark = ref(false)
  
  export function useDarkMode() {
    const toggle = () => {
      isDark.value = !isDark.value
      updateDOM()
    }
    
    const updateDOM = () => {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
    
    // Initialize from localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      isDark.value = true
      updateDOM()
    }
    
    return { isDark, toggle }
  }
  ```
- [ ] **VALIDATION**: Must match current dark mode behavior exactly

### Task 3.4: Responsive Design Implementation
- [ ] **BREAKPOINT VALIDATION**: All components must work at all breakpoints
- [ ] **MOBILE FIRST**: All components must be mobile-first
- [ ] **GRID SYSTEM**: Must match current responsive grid behavior

## Phase 4: Page Migration (Week 11-12)

### Task 4.1: Layout Migration (`src/layouts/home.vue`)
- [ ] Migrate to new layout system
- [ ] **NAVIGATION**: Must match current navigation exactly
- [ ] **RESPONSIVE**: Must match current responsive behavior
- [ ] **DARK MODE**: Must integrate with new dark mode system

### Task 4.2: Page Component Migration
- [ ] Migrate `src/pages/audits/list/index.vue`
- [ ] Migrate `src/pages/vulnerabilities/index.vue`
- [ ] Migrate `src/pages/data/index.vue`
- [ ] Migrate `src/pages/settings/index.vue`
- [ ] Migrate `src/pages/profile/index.vue`
- [ ] **VALIDATION**: Each page must match current functionality exactly

### Task 4.3: Complex Component Migration
- [ ] Migrate `src/components/editor.vue` (TipTap integration)
- [ ] Migrate `src/components/charts/` (Chart.js integration)
- [ ] Migrate `src/components/custom-fields.vue`
- [ ] **CRITICAL**: All complex components must maintain exact functionality

## Phase 5: Integration & Testing (Week 13-14)

### Task 5.1: Service Integration
- [ ] Ensure all services work with new components
- [ ] **API INTEGRATION**: All API calls must work unchanged
- [ ] **SOCKET.IO**: Real-time features must work unchanged
- [ ] **AUTHENTICATION**: JWT authentication must work unchanged

### Task 5.2: Internationalization
- [ ] Integrate Vue i18n with new components
- [ ] **VALIDATION**: All translations must work unchanged
- [ ] **LANGUAGE SWITCHING**: Must work exactly as before

### Task 5.3: Component Testing
- [ ] Create unit tests for each component
- [ ] **VARIANT TESTING**: Test all size/color variants
- [ ] **ACCESSIBILITY TESTING**: Test all ARIA attributes
- [ ] **RESPONSIVE TESTING**: Test all breakpoints

### Task 5.4: Visual Regression Testing
- [ ] **SCREENSHOT COMPARISON**: Compare before/after screenshots
- [ ] **PIXEL PERFECT**: UI must be pixel-perfect match
- [ ] **INTERACTION TESTING**: All interactions must work identically

## Phase 6: Performance & Optimization (Week 15)

### Task 6.1: Bundle Analysis
- [ ] Analyze bundle size vs current Quasar build
- [ ] **TARGET**: 20% bundle size reduction
- [ ] **LAZY LOADING**: Implement code splitting where beneficial

### Task 6.2: Performance Optimization
- [ ] **TREE SHAKING**: Ensure unused code is removed
- [ ] **CSS OPTIMIZATION**: Ensure CSS is optimized
- [ ] **LOADING PERFORMANCE**: Must match or exceed current performance

### Task 6.3: Final Validation
- [ ] **STYLE AUDIT**: Run comprehensive style consistency audit
- [ ] **FUNCTIONALITY AUDIT**: Ensure all features work exactly as before
- [ ] **PERFORMANCE AUDIT**: Ensure performance targets are met
- [ ] **ACCESSIBILITY AUDIT**: Ensure accessibility compliance

## ⚠️ FAILURE CONDITIONS (IMMEDIATE TERMINATION)
1. **Visual Differences**: Any visual difference from current UI
2. **Missing Functionality**: Any feature that doesn't work as before
3. **Style Inconsistency**: Any hardcoded colors/spacing or missing variants
4. **Performance Regression**: Any performance degradation
5. **Accessibility Regression**: Any accessibility issues introduced
6. **Responsive Breakage**: Any responsive behavior differences
7. **Component Variants Missing**: Any component without proper variant system
8. **TypeScript Issues**: Any TypeScript errors or missing type safety

## 📋 VALIDATION CHECKLIST FOR EACH COMPONENT
- [ ] Matches visual appearance exactly
- [ ] Has all required variants (size, color, state)
- [ ] Uses design tokens only (no hardcoded values)
- [ ] Follows TypeScript interface properly
- [ ] Includes accessibility attributes
- [ ] Works on all breakpoints
- [ ] Has proper hover/focus/active states
- [ ] Maintains semantic HTML
- [ ] Follows component template pattern
- [ ] Passes ESLint validation

## 🎯 SUCCESS CRITERIA
- ✅ Zero visual differences from current UI
- ✅ All functionality preserved exactly
- ✅ All components have consistent variant system
- ✅ All styling uses design tokens
- ✅ Performance improved by 20%+
- ✅ TypeScript coverage 100%
- ✅ Accessibility compliance maintained
- ✅ Mobile responsiveness preserved
- ✅ Dark mode functionality identical
- ✅ All integrations working unchanged

**REMEMBER: This is a pixel-perfect migration. Any deviation from current UI/UX or missing functionality is grounds for immediate failure.** 