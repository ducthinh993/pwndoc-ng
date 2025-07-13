# Design System Documentation

This document outlines the comprehensive design system for pwndoc-ng, including color schemes, typography, spacing, components, and visual guidelines.

## Table of Contents

1. [Overview](#overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Design Tokens](#component-design-tokens)
6. [Theming System](#theming-system)
7. [Visual States](#visual-states)
8. [Iconography](#iconography)
9. [Usage Guidelines](#usage-guidelines)

---

## Overview

The pwndoc-ng design system is built on top of the Quasar Framework, providing a cohesive visual language that supports both light and dark themes. The system emphasizes:

- **Consistency**: Unified visual elements across the application
- **Accessibility**: WCAG-compliant color contrasts and interactive elements
- **Flexibility**: Support for theming and customization
- **Professional Appearance**: Clean, modern interface suitable for cybersecurity professionals

---

## Color Palette

### Primary Color Scheme

```stylus
// Core brand colors
$primary   = #3c4759    // Dark blue-grey (main brand color)
$secondary = #26A69A    // Teal (accent color)
$tertiary  = #555       // Dark grey

// Neutral colors
$neutral   = #E0E1E2    // Light grey for backgrounds
```

### Semantic Colors

```stylus
// Status and feedback colors
$positive  = #21BA45    // Green for success states
$negative  = #DB2828    // Red for error states  
$info      = #31CCEC    // Cyan for informational messages
$warning   = #F2C037    // Amber for warning states
```

### Diff and Comparison Colors

```stylus
// Document comparison and change tracking
$diffBackground = #ffebee           // Light red for diff highlighting
$diffBackgroundDark = #f4433626     // Dark mode diff highlighting
$diffTextNegative = #fdb8c0         // Text color for negative diffs
```

### Dark Theme Colors

```stylus
// Dark mode specific colors
$cDark = #1d1d1d           // Dark background
$darkPrimary = #9fa8da     // Indigo for dark mode primary
$darkGrey = #424242        // Dark mode grey elements
```

### Color Usage Guidelines

#### Primary Color Usage
- **Headers and navigation**: Main brand color for top-level elements
- **Primary actions**: Call-to-action buttons and important interactive elements
- **Brand elements**: Logos, key visual identifiers

#### Secondary Color Usage
- **Accent elements**: Highlights, active states, secondary actions
- **Links**: Text links and navigation elements
- **Progress indicators**: Loading states and progress bars

#### Semantic Color Usage
- **Positive (Green)**: Success messages, completed states, approvals
- **Negative (Red)**: Error messages, destructive actions, failed states
- **Info (Cyan)**: Informational messages, tips, neutral notifications
- **Warning (Amber)**: Caution messages, pending states, review indicators

---

## Typography

### Font Stack

```stylus
$typography-font-family = Helvetica, Arial, sans-serif
```

### Font Sizes

```stylus
// Base font sizes
$item-font-size = 14px      // Standard item text
$input-font-size = 14px     // Form input text
```

### Typography Hierarchy

#### Heading Levels
- **H1**: Page titles and main headings (used sparingly)
- **H2**: Section headers within pages
- **H3**: Subsection headers
- **H4-H6**: Content organization within sections

#### Body Text
- **Base size**: 14px for optimal readability
- **Line height**: 1.6 for comfortable reading
- **Text styles**: Regular, bold, italic, underline, strikethrough

#### Specialized Text
- **Code text**: Monospace font for code blocks and inline code
- **Captions**: Italic text for image captions and supplementary content
- **Labels**: Bold text for form labels and important identifiers

---

## Spacing & Layout

### Spacing Scale

The application uses a consistent spacing scale based on Quasar's spacing utilities:

- **xs**: 4px - Tight spacing for closely related elements
- **sm**: 8px - Small gaps between related items
- **md**: 16px - Standard spacing for most elements
- **lg**: 24px - Larger gaps for section separation
- **xl**: 32px - Major section separation

### Layout Patterns

#### Grid System
- **Responsive grid**: 12-column grid system using Quasar's flex utilities
- **Breakpoints**: Standard Quasar breakpoints (xs, sm, md, lg, xl)
- **Gutters**: Consistent spacing between grid columns

#### Container Types
- **Full width**: Content spanning entire viewport width
- **Constrained**: Content with maximum width and centered alignment
- **Cards**: Elevated containers with padding and borders

---

## Component Design Tokens

### Card Design
```stylus
// Card styling
.q-card
  background: #fafafa    // Light grey background (light mode)
  border-radius: 4px     // Subtle rounded corners
  box-shadow: elevation  // Quasar elevation system
```

### Button Design
```stylus
// Button styling variations
.q-btn
  border-radius: 4px           // Consistent corner radius
  font-weight: 500            // Medium font weight
  text-transform: none        // Preserve natural text casing
```

### Form Elements
```stylus
// Input field styling
.q-field__control
  background: white           // Clean white background
  border: 1px solid #e0e0e0  // Subtle border
  border-radius: 4px         // Consistent corners
```

### Table Design
```stylus
// Data table styling
.q-table__container
  background: #fafafa        // Light background
  border-radius: 4px         // Rounded corners
  
.sticky-header-table
  max-height: calc(100vh - 82px)  // Dynamic height calculation
```

---

## Theming System

### Light Mode Configuration

```stylus
light-mode-colors()
  // Clean, bright appearance
  .q-field__control, .editor
    background: white
    
  .q-card, .q-table__container
    background: #fafafa    // Light grey background
    
  .bg-diffbackground
    background: $diffBackground  // Light red for diff highlighting
```

### Dark Mode Configuration

```stylus
dark-mode-colors()
  // Dark, easy-on-the-eyes appearance
  .bg-white
    background: $cDark     // Override white backgrounds
    
  .q-field__control, .editor
    background: #333333    // Dark input backgrounds
    
  .bg-diffbackground
    background: $diffBackgroundDark  // Dark mode diff highlighting
```

### Theme Switching
- **Automatic detection**: Respects system preference
- **Manual toggle**: User can override system setting
- **Persistence**: Theme choice saved in localStorage
- **Smooth transitions**: No jarring theme switches

---

## Visual States

### Interactive States

#### Button States
- **Default**: Standard appearance with subtle elevation
- **Hover**: Slightly elevated with color shift
- **Active**: Pressed appearance with color darkening
- **Disabled**: Reduced opacity and no interactions
- **Loading**: Spinner indication during processing

#### Form States
- **Default**: Clean, neutral appearance
- **Focus**: Border highlight and subtle glow
- **Error**: Red border and error message
- **Disabled**: Greyed out with no interaction
- **Filled**: Visual indication of completed fields

### Content States

#### Loading States
```stylus
.loading-error
  .material-icons
    font-size: 100px     // Large icon for visibility
  p
    font-size: 20px      // Readable error text
```

#### Empty States
- **No data**: Friendly message with guidance
- **Search results**: Clear indication of no matches
- **Error states**: Helpful error messages with recovery options

---

## Iconography

### Icon Libraries
- **FontAwesome 5**: Primary icon library for UI elements
- **Material Icons**: Secondary library for specific use cases
- **MDI (Material Design Icons)**: Specialized icons for unique functions

### Icon Usage Guidelines

#### Navigation Icons
- **Home**: `fa fa-home` - Navigation back to main page
- **Menu**: `fa fa-bars` - Mobile navigation toggle
- **Back**: `fa fa-arrow-left` - Return to previous view

#### Functional Icons
- **Edit**: `fa fa-edit` - Edit actions
- **Delete**: `fa fa-trash` - Destructive actions
- **Save**: `fa fa-save` - Save operations
- **Download**: `fa fa-download` - Export functions

#### Status Icons
- **Success**: `fa fa-check` - Completion indicators
- **Error**: `fa fa-exclamation-triangle` - Error states
- **Warning**: `fa fa-exclamation-circle` - Warning states
- **Info**: `fa fa-info-circle` - Information displays

---

## Usage Guidelines

### Do's and Don'ts

#### Color Usage
✅ **Do:**
- Use primary color for main navigation and key actions
- Maintain consistent color meanings across the application
- Ensure sufficient contrast for accessibility
- Test colors in both light and dark modes

❌ **Don't:**
- Use red for non-error states
- Mix different semantic meanings for the same color
- Use low-contrast color combinations
- Override semantic colors without purpose

#### Typography
✅ **Do:**
- Maintain consistent font sizes across similar elements
- Use appropriate heading hierarchy
- Ensure readable line heights and spacing
- Use bold text sparingly for emphasis

❌ **Don't:**
- Use too many different font sizes
- Skip heading levels in hierarchy
- Use insufficient contrast for text
- Overuse decorative text styles

#### Layout
✅ **Do:**
- Use consistent spacing throughout the application
- Align elements on a grid system
- Group related elements together
- Provide adequate white space

❌ **Don't:**
- Use inconsistent spacing between similar elements
- Cram too much content into small spaces
- Break alignment without purpose
- Create visual clutter with poor spacing

### Accessibility Considerations

#### Color Accessibility
- **Contrast ratios**: All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- **Color blind support**: Information not conveyed by color alone
- **Dark mode support**: Full feature parity with light mode

#### Interactive Accessibility
- **Focus indicators**: Clear visual focus states for keyboard navigation
- **Touch targets**: Minimum 44px tap targets for mobile devices
- **Screen reader support**: Proper ARIA labels and semantic markup

### Responsive Design Considerations

#### Mobile Adaptations
- **Touch-friendly**: Larger tap targets and spacing on mobile
- **Readable text**: Maintain legible font sizes across all screen sizes
- **Simplified layouts**: Streamlined interfaces for smaller screens

#### Desktop Optimizations
- **Efficient layouts**: Make use of available screen real estate
- **Hover states**: Rich hover interactions for mouse users
- **Keyboard navigation**: Full keyboard accessibility

---

## Implementation Notes

### CSS Custom Properties
The design system could benefit from CSS custom properties for better maintainability:

```css
:root {
  --color-primary: #3c4759;
  --color-secondary: #26A69A;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --border-radius: 4px;
}
```

### Component Library Integration
- **Quasar components**: Leverage Quasar's built-in theming system
- **Custom components**: Ensure they follow the same design principles
- **Consistent props**: Use similar prop patterns across custom components

### Future Enhancements
- **Design tokens**: Implement a formal design token system
- **Component variants**: Create standardized component variations
- **Animation system**: Consistent motion design across the application
- **Brand customization**: Allow for white-label customization

This design system serves as the foundation for creating a cohesive, professional, and accessible user interface for pwndoc-ng. 