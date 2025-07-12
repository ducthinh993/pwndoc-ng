# PwnDoc-ng Style Guide

## Overview

This style guide ensures consistent styling across the PwnDoc-ng application using Vue Shadcn components and semantic design tokens. All components should follow these guidelines to maintain visual consistency and improve maintainability.

## Design Tokens

### Color System

Our color system uses semantic design tokens that automatically adapt to light and dark themes:

#### State Colors
```css
/* Success states */
--color-success-subtle: Light green background
--color-success-muted: Slightly stronger green
--color-success-emphasis: Medium green for borders
--color-success-solid: Strong green for buttons/badges
--color-success-strong: Dark green for text

/* Warning states */
--color-warning-subtle: Light amber background
--color-warning-muted: Slightly stronger amber
--color-warning-emphasis: Medium amber for borders
--color-warning-solid: Strong amber for buttons/badges
--color-warning-strong: Dark amber for text

/* Error states */
--color-error-subtle: Light red background
--color-error-muted: Slightly stronger red
--color-error-emphasis: Medium red for borders
--color-error-solid: Strong red for buttons/badges
--color-error-strong: Dark red for text

/* Info states */
--color-info-subtle: Light blue background
--color-info-muted: Slightly stronger blue
--color-info-emphasis: Medium blue for borders
--color-info-solid: Strong blue for buttons/badges
--color-info-strong: Dark blue for text
```

#### Diff/Change States
```css
/* For highlighting changes in forms or content */
--color-diff-added: Light green for additions
--color-diff-removed: Light red for deletions
--color-diff-changed: Light amber for modifications
```

#### Layout Colors
```css
/* Application layout colors */
--color-layout-background: Main page background
--color-layout-surface: Card/surface background
--color-layout-border: Border colors
```

### Usage in Components

#### ✅ Correct Usage
```vue
<template>
  <!-- Use semantic color classes -->
  <div class="bg-success-subtle text-success-strong border-success-emphasis">
    Success message
  </div>
  
  <!-- Use design tokens in custom CSS -->
  <div class="custom-alert">
    Alert content
  </div>
</template>

<style scoped>
.custom-alert {
  background-color: hsl(var(--color-warning-subtle));
  color: hsl(var(--color-warning-strong));
  border: 1px solid hsl(var(--color-warning-emphasis));
}
</style>
```

#### ❌ Incorrect Usage
```vue
<template>
  <!-- Don't use hardcoded colors -->
  <div class="bg-yellow-50 text-yellow-800 border-yellow-200">
    Warning message
  </div>
  
  <!-- Don't use hex colors -->
  <div class="custom-alert">
    Alert content
  </div>
</template>

<style scoped>
.custom-alert {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}
</style>
```

## Component Patterns

### State Indicators

#### Alert/Notification Components
```vue
<template>
  <div :class="cn('border rounded-lg p-4', variantClasses)">
    <slot />
  </div>
</template>

<script setup>
const variantClasses = computed(() => {
  const variants = {
    success: 'border-success-emphasis bg-success-subtle text-success-strong',
    warning: 'border-warning-emphasis bg-warning-subtle text-warning-strong',
    error: 'border-error-emphasis bg-error-subtle text-error-strong',
    info: 'border-info-emphasis bg-info-subtle text-info-strong',
  }
  return variants[props.variant] || variants.info
})
</script>
```

#### Badge Components
```vue
<template>
  <span :class="cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClasses)">
    <slot />
  </span>
</template>

<script setup>
const variantClasses = computed(() => {
  const variants = {
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    error: 'bg-destructive text-destructive-foreground',
    info: 'bg-info text-info-foreground',
  }
  return variants[props.variant] || variants.info
})
</script>
```

### Form Field States

#### Diff/Change Highlighting
```vue
<template>
  <Input
    :class="cn(
      'w-full',
      isChanged ? 'bg-diff-changed border-diff-changed' : 'bg-background border-input'
    )"
    v-model="value"
  />
</template>
```

#### Validation States
```vue
<template>
  <div class="space-y-2">
    <Input
      :class="cn(
        'w-full',
        {
          'border-error-emphasis bg-error-subtle': hasError,
          'border-success-emphasis bg-success-subtle': isValid,
        }
      )"
      v-model="value"
    />
    <p v-if="hasError" class="text-error-strong text-sm">
      {{ errorMessage }}
    </p>
  </div>
</template>
```

## Utility Classes

### Semantic Color Utilities

#### Backgrounds
- `bg-success-subtle` - Light success background
- `bg-warning-subtle` - Light warning background
- `bg-error-subtle` - Light error background
- `bg-info-subtle` - Light info background

#### Text Colors
- `text-success-strong` - Strong success text
- `text-warning-strong` - Strong warning text
- `text-error-strong` - Strong error text
- `text-info-strong` - Strong info text

#### Borders
- `border-success-emphasis` - Success border
- `border-warning-emphasis` - Warning border
- `border-error-emphasis` - Error border
- `border-info-emphasis` - Info border

#### Diff States
- `bg-diff-added` - Added content background
- `bg-diff-removed` - Removed content background
- `bg-diff-changed` - Changed content background

## Layout Guidelines

### Container Patterns
```vue
<template>
  <!-- Use semantic layout classes -->
  <div class="bg-layout min-h-screen">
    <div class="bg-surface border-layout border rounded-lg p-6">
      <slot />
    </div>
  </div>
</template>
```

### Card Components
```vue
<template>
  <Card class="bg-card border-border">
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
  </Card>
</template>
```

## Dark Mode Support

All design tokens automatically adapt to dark mode. Components using semantic tokens will automatically switch themes without additional code.

### Theme-Aware Components
```vue
<template>
  <div class="bg-background text-foreground">
    <!-- Content automatically adapts to light/dark theme -->
    <Alert variant="success">
      This alert automatically adapts to the current theme
    </Alert>
  </div>
</template>
```

## ESLint Configuration

Our ESLint configuration enforces these style guidelines:

### Rules
- `tailwindcss/classnames-order` - Ensures consistent class ordering
- `tailwindcss/no-custom-classname` - Prevents undefined classes
- `tailwindcss/no-contradicting-classname` - Prevents conflicting classes

### Whitelisted Classes
The following classes are whitelisted for specific use cases:
- Design token classes (e.g., `bg-success-subtle`)
- Dynamic grid classes (e.g., `col-span-1` to `col-span-12`)
- Editor-specific classes (e.g., `ProseMirror`, `tiptap`)

## Migration from Hardcoded Colors

### Common Replacements
```diff
- bg-yellow-50 border-yellow-200
+ bg-diff-changed border-diff-changed

- bg-green-100 text-green-800
+ bg-success-subtle text-success-strong

- bg-red-100 text-red-800
+ bg-error-subtle text-error-strong

- bg-blue-100 text-blue-800
+ bg-info-subtle text-info-strong

- bg-orange-100 text-orange-800
+ bg-warning-subtle text-warning-strong
```

### CSS Custom Properties
```diff
- background-color: #fef3c7;
+ background-color: hsl(var(--color-warning-subtle));

- color: #92400e;
+ color: hsl(var(--color-warning-strong));

- border-color: #fcd34d;
+ border-color: hsl(var(--color-warning-emphasis));
```

## Best Practices

### 1. Use Semantic Classes
Always use semantic color classes that describe intent rather than appearance:
```vue
<!-- Good -->
<Badge variant="success">Approved</Badge>

<!-- Bad -->
<Badge class="bg-green-100 text-green-800">Approved</Badge>
```

### 2. Consistent Component Variants
All components should support standard variants:
```typescript
type ComponentVariant = 'default' | 'success' | 'warning' | 'error' | 'info'
```

### 3. Use Design Tokens in Custom CSS
When writing custom CSS, always use design tokens:
```css
.custom-component {
  background-color: hsl(var(--color-success-subtle));
  color: hsl(var(--color-success-strong));
}
```

### 4. Maintain Accessibility
Ensure sufficient color contrast by using the appropriate token combinations:
- `*-subtle` backgrounds with `*-strong` text
- `*-muted` backgrounds with `*-strong` text
- `*-emphasis` borders with subtle backgrounds

### 5. Document Component Variants
Always document available variants in component props:
```typescript
interface Props {
  variant?: 'success' | 'warning' | 'error' | 'info'
}
```

## Testing Style Consistency

### Manual Testing
1. Test components in both light and dark modes
2. Verify color contrast meets accessibility standards
3. Ensure consistent spacing and typography
4. Check responsive behavior across screen sizes

### Automated Testing
- ESLint rules enforce style consistency
- Tailwind CSS purging removes unused classes
- TypeScript ensures proper prop types

## Conclusion

Following these guidelines ensures:
- ✅ Consistent visual design across the application
- ✅ Automatic dark mode support
- ✅ Maintainable and scalable styling
- ✅ Accessibility compliance
- ✅ Developer experience improvements

For questions or suggestions, please refer to the component documentation or create an issue in the project repository. 