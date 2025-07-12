/**
 * Size variants for components - standardized across the entire application
 * These are the ONLY allowed size variants to ensure consistency
 */
export const sizeVariants = ['xs', 'sm', 'default', 'lg', 'xl'] as const

/**
 * Color variants for components - standardized across the entire application
 * These are the ONLY allowed color variants to ensure consistency
 */
export const colorVariants = ['default', 'primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const

/**
 * Interactive state variants for components
 * These define the standard interaction states across all components
 */
export const stateVariants = ['default', 'hover', 'focus', 'active', 'disabled'] as const

/**
 * Type definitions for variants - ensures TypeScript validation
 */
export type SizeVariant = typeof sizeVariants[number]
export type ColorVariant = typeof colorVariants[number]
export type StateVariant = typeof stateVariants[number]

/**
 * Validates if a size value is a valid size variant
 * @param size - The size value to validate
 * @returns True if valid, false otherwise
 */
export function validateSize(size: string): size is SizeVariant {
  return sizeVariants.includes(size as SizeVariant)
}

/**
 * Validates if a color value is a valid color variant
 * @param color - The color value to validate
 * @returns True if valid, false otherwise
 */
export function validateColor(color: string): color is ColorVariant {
  return colorVariants.includes(color as ColorVariant)
}

/**
 * Validates if a state value is a valid state variant
 * @param state - The state value to validate
 * @returns True if valid, false otherwise
 */
export function validateState(state: string): state is StateVariant {
  return stateVariants.includes(state as StateVariant)
}

/**
 * Gets all valid size variants
 * @returns Array of valid size variants
 */
export function getSizeVariants(): readonly SizeVariant[] {
  return sizeVariants
}

/**
 * Gets all valid color variants
 * @returns Array of valid color variants
 */
export function getColorVariants(): readonly ColorVariant[] {
  return colorVariants
}

/**
 * Gets all valid state variants
 * @returns Array of valid state variants
 */
export function getStateVariants(): readonly StateVariant[] {
  return stateVariants
} 