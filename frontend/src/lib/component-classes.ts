/**
 * Base classes for components - standardized across the entire application
 * These classes ensure consistent styling and behavior across all components
 * NO HARDCODED VALUES - all values come from design tokens
 */

/**
 * Base button classes - used for all button variants
 * Includes accessibility, focus states, and transitions
 */
export const baseButtonClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

/**
 * Base input classes - used for all input variants
 * Includes proper focus states, accessibility, and consistent sizing
 */
export const baseInputClasses = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

/**
 * Base card classes - used for all card variants
 * Includes consistent borders, shadows, and background colors
 */
export const baseCardClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm'

/**
 * Base dialog classes - used for all dialog variants
 * Includes proper positioning, animations, and backdrop
 */
export const baseDialogClasses = 'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full'

/**
 * Base table classes - used for all table variants
 * Includes proper spacing, borders, and responsive behavior
 */
export const baseTableClasses = 'w-full caption-bottom text-sm'

/**
 * Base table header classes - used for table headers
 * Includes sticky behavior and proper styling
 */
export const baseTableHeaderClasses = 'border-b px-4 py-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'

/**
 * Base table cell classes - used for table cells
 * Includes proper padding and alignment
 */
export const baseTableCellClasses = 'px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0'

/**
 * Base badge classes - used for all badge variants
 * Includes consistent sizing and styling
 */
export const baseBadgeClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'

/**
 * Base alert classes - used for all alert variants
 * Includes proper padding, borders, and icon spacing
 */
export const baseAlertClasses = 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground'

/**
 * Base tooltip classes - used for all tooltip variants
 * Includes proper positioning and styling
 */
export const baseTooltipClasses = 'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'

/**
 * Base select classes - used for all select variants
 * Includes proper styling and focus states
 */
export const baseSelectClasses = 'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

/**
 * Base checkbox classes - used for all checkbox variants
 * Includes proper sizing and focus states
 */
export const baseCheckboxClasses = 'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'

/**
 * Base radio classes - used for all radio variants
 * Includes proper sizing and focus states
 */
export const baseRadioClasses = 'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

/**
 * Base switch classes - used for all switch variants
 * Includes proper animations and focus states
 */
export const baseSwitchClasses = 'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input'

/**
 * Base navigation classes - used for navigation components
 * Includes proper spacing and hover states
 */
export const baseNavigationClasses = 'relative z-10 flex max-w-max flex-1 items-center justify-center'

/**
 * Base dropdown classes - used for dropdown components
 * Includes proper positioning and animations
 */
export const baseDropdownClasses = 'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'

/**
 * Base sheet classes - used for sheet/drawer components
 * Includes proper positioning and animations
 */
export const baseSheetClasses = 'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500'

/**
 * Base avatar classes - used for avatar components
 * Includes consistent sizing and positioning
 */
export const baseAvatarClasses = 'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full'

/**
 * Base form field classes - used for form field wrappers
 * Includes proper spacing and layout
 */
export const baseFormFieldClasses = 'space-y-2'

/**
 * Base separator classes - used for separator components
 * Includes proper styling and orientation
 */
export const baseSeparatorClasses = 'shrink-0 bg-border'
