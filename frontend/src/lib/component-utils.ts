import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with proper Tailwind CSS deduplication
 * @param inputs - Class names to combine
 * @returns Combined and deduplicated class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Component variant and size types
 */
export type ComponentSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl'
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'

/**
 * Base component classes for consistent styling
 */
export const componentBaseClasses = {
  // Button base classes
  button: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  
  // Input base classes
  input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  
  // Card base classes
  card: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  
  // Dialog base classes
  dialog: 'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
  
  // Table base classes
  table: 'w-full caption-bottom text-sm',
  
  // Badge base classes
  badge: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  
  // Label base classes
  label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  
  // Separator base classes
  separator: 'shrink-0 bg-border',
} as const

/**
 * Component size variants
 */
export const componentSizeVariants = {
  button: {
    xs: 'h-8 rounded-md px-2 text-xs',
    sm: 'h-9 rounded-md px-3',
    default: 'h-10 px-4 py-2',
    lg: 'h-11 rounded-md px-8',
    xl: 'h-12 rounded-md px-10',
    icon: 'h-10 w-10',
  },
  input: {
    xs: 'h-8 px-2 py-1 text-xs',
    sm: 'h-9 px-3 py-2',
    default: 'h-10 px-3 py-2',
    lg: 'h-11 px-4 py-3',
    xl: 'h-12 px-4 py-3 text-base',
  },
  badge: {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
    xl: 'px-4 py-1.5 text-sm',
  },
} as const

/**
 * Component color variants
 */
export const componentColorVariants = {
  button: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  badge: {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    primary: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
    ghost: 'border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
  },
} as const

/**
 * Interactive state classes
 */
export const interactiveStateClasses = {
  default: 'transition-colors duration-200 ease-in-out',
  hover: 'hover:bg-accent/80 hover:text-accent-foreground',
  focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  active: 'active:bg-accent active:text-accent-foreground',
  disabled: 'disabled:pointer-events-none disabled:opacity-50',
} as const

/**
 * Responsive design utilities
 */
export const responsiveContainerClasses = {
  default: 'px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto',
  tight: 'px-2 sm:px-4 lg:px-6 max-w-5xl mx-auto',
  wide: 'px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto',
  full: 'px-4 sm:px-6 lg:px-8 w-full',
} as const

export const responsiveGridClasses = {
  default: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  tight: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2',
  wide: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  auto: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
} as const

export const responsiveFlexClasses = {
  column: 'flex flex-col gap-4',
  row: 'flex flex-col sm:flex-row gap-4',
  wrap: 'flex flex-wrap gap-4',
  center: 'flex flex-col sm:flex-row items-center justify-center gap-4',
} as const

/**
 * Animation classes
 */
export const animationClasses = {
  'fade-in': 'animate-in fade-in-0 duration-200',
  'fade-out': 'animate-out fade-out-0 duration-200',
  'slide-in-from-top': 'animate-in slide-in-from-top-2 duration-300',
  'slide-in-from-bottom': 'animate-in slide-in-from-bottom-2 duration-300',
  'slide-in-from-left': 'animate-in slide-in-from-left-2 duration-300',
  'slide-in-from-right': 'animate-in slide-in-from-right-2 duration-300',
  'zoom-in': 'animate-in zoom-in-95 duration-200',
  'zoom-out': 'animate-out zoom-out-95 duration-200',
} as const

/**
 * Loading state classes
 */
export const loadingClasses = {
  skeleton: 'bg-muted animate-pulse rounded',
  spinner: 'animate-spin rounded-full border-2 border-muted border-t-primary',
  pulse: 'animate-pulse bg-muted/50',
} as const

/**
 * Utility functions for component styling
 */
export const componentUtils = {
  /**
   * Get component classes for a given component type
   */
  getComponentClasses: (
    component: keyof typeof componentBaseClasses,
    variant: ComponentVariant = 'default',
    size: ComponentSize = 'default',
    className?: string
  ) => {
    const baseClasses = componentBaseClasses[component]
    const sizeClasses = componentSizeVariants[component as keyof typeof componentSizeVariants]?.[size] || ''
    const variantClasses = componentColorVariants[component as keyof typeof componentColorVariants]?.[variant] || ''
    
    return cn(baseClasses, sizeClasses, variantClasses, className)
  },
  
  /**
   * Get interactive state classes
   */
  getInteractiveClasses: (disabled?: boolean) => {
    return cn(
      interactiveStateClasses.default,
      interactiveStateClasses.hover,
      interactiveStateClasses.focus,
      interactiveStateClasses.active,
      {
        [interactiveStateClasses.disabled]: disabled,
      }
    )
  },
  
  /**
   * Get responsive container classes
   */
  getContainerClasses: (variant: keyof typeof responsiveContainerClasses = 'default') => {
    return responsiveContainerClasses[variant]
  },
  
  /**
   * Get responsive grid classes
   */
  getGridClasses: (variant: keyof typeof responsiveGridClasses = 'default') => {
    return responsiveGridClasses[variant]
  },
  
  /**
   * Get animation classes
   */
  getAnimationClasses: (animation: keyof typeof animationClasses) => {
    return animationClasses[animation]
  },
  
  /**
   * Get loading state classes
   */
  getLoadingClasses: (variant: keyof typeof loadingClasses = 'skeleton') => {
    return loadingClasses[variant]
  },
} as const

/**
 * Style validation utilities
 */
export const styleValidators = {
  /**
   * Validate component size
   */
  isValidSize: (size: string): size is ComponentSize => {
    return ['xs', 'sm', 'default', 'lg', 'xl'].includes(size)
  },
  
  /**
   * Validate component variant
   */
  isValidVariant: (variant: string): variant is ComponentVariant => {
    return ['default', 'primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'].includes(variant)
  },
  
  /**
   * Validate class name string
   */
  isValidClassName: (className: any): className is string => {
    return typeof className === 'string' && className.trim().length > 0
  },
} as const

/**
 * Component prop defaults
 */
export const componentDefaults = {
  size: 'default' as ComponentSize,
  variant: 'default' as ComponentVariant,
  disabled: false,
  loading: false,
} as const

/**
 * Export all utilities as a single object for convenience
 */
export const componentKit = {
  cn,
  classes: componentBaseClasses,
  sizes: componentSizeVariants,
  colors: componentColorVariants,
  states: interactiveStateClasses,
  responsive: {
    containers: responsiveContainerClasses,
    grids: responsiveGridClasses,
    flex: responsiveFlexClasses,
  },
  animations: animationClasses,
  loading: loadingClasses,
  utils: componentUtils,
  validators: styleValidators,
  defaults: componentDefaults,
} as const

export default componentKit 