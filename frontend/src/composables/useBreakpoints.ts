import { ref, computed, onMounted, onUnmounted } from 'vue'

// Quasar breakpoints (matching exactly)
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const

export type BreakpointName = keyof typeof breakpoints

export interface BreakpointQueries {
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  smAndUp: boolean
  mdAndUp: boolean
  lgAndUp: boolean
  xlAndUp: boolean
  smAndDown: boolean
  mdAndDown: boolean
  lgAndDown: boolean
  xlAndDown: boolean
}

export function useBreakpoints() {
  const windowWidth = ref(0)

  // Current breakpoint
  const currentBreakpoint = computed<BreakpointName>(() => {
    const width = windowWidth.value
    if (width >= breakpoints.xl) return 'xl'
    if (width >= breakpoints.lg) return 'lg'
    if (width >= breakpoints.md) return 'md'
    if (width >= breakpoints.sm) return 'sm'
    return 'xs'
  })

  // Breakpoint queries
  const queries = computed<BreakpointQueries>(() => {
    const width = windowWidth.value

    return {
      xs: width < breakpoints.sm,
      sm: width >= breakpoints.sm && width < breakpoints.md,
      md: width >= breakpoints.md && width < breakpoints.lg,
      lg: width >= breakpoints.lg && width < breakpoints.xl,
      xl: width >= breakpoints.xl,
      smAndUp: width >= breakpoints.sm,
      mdAndUp: width >= breakpoints.md,
      lgAndUp: width >= breakpoints.lg,
      xlAndUp: width >= breakpoints.xl,
      smAndDown: width < breakpoints.md,
      mdAndDown: width < breakpoints.lg,
      lgAndDown: width < breakpoints.xl,
      xlAndDown: width < Infinity,
    }
  })

  // Individual breakpoint checks
  const xs = computed(() => queries.value.xs)
  const sm = computed(() => queries.value.sm)
  const md = computed(() => queries.value.md)
  const lg = computed(() => queries.value.lg)
  const xl = computed(() => queries.value.xl)

  // Range checks
  const smAndUp = computed(() => queries.value.smAndUp)
  const mdAndUp = computed(() => queries.value.mdAndUp)
  const lgAndUp = computed(() => queries.value.lgAndUp)
  const xlAndUp = computed(() => queries.value.xlAndUp)

  const smAndDown = computed(() => queries.value.smAndDown)
  const mdAndDown = computed(() => queries.value.mdAndDown)
  const lgAndDown = computed(() => queries.value.lgAndDown)
  const xlAndDown = computed(() => queries.value.xlAndDown)

  // Mobile/tablet/desktop helpers
  const isMobile = computed(() => xs.value)
  const isTablet = computed(() => sm.value || md.value)
  const isDesktop = computed(() => lg.value || xl.value)

  // Update window width
  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }

  // Initialize
  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  return {
    // Current state
    windowWidth: computed(() => windowWidth.value),
    currentBreakpoint,

    // Individual breakpoints
    xs,
    sm,
    md,
    lg,
    xl,

    // Range queries
    smAndUp,
    mdAndUp,
    lgAndUp,
    xlAndUp,
    smAndDown,
    mdAndDown,
    lgAndDown,
    xlAndDown,

    // Device helpers
    isMobile,
    isTablet,
    isDesktop,

    // All queries object
    queries,

    // Utilities
    breakpoints,
    isBreakpoint: (name: BreakpointName) => currentBreakpoint.value === name,
    isGreaterThan: (name: BreakpointName) => windowWidth.value > breakpoints[name],
    isLessThan: (name: BreakpointName) => windowWidth.value < breakpoints[name],
  }
}

// Utility function to get responsive classes
export function getResponsiveClasses(
  baseClass: string,
  breakpointClasses: Partial<Record<BreakpointName, string>>,
): string {
  const classes = [baseClass]

  Object.entries(breakpointClasses).forEach(([breakpoint, className]) => {
    if (className) {
      const bp = breakpoint as BreakpointName
      classes.push(`${bp}:${className}`)
    }
  })

  return classes.join(' ')
}

// Utility function to get responsive values
export function getResponsiveValue<T>(
  values: Partial<Record<BreakpointName, T>>,
  currentBreakpoint: BreakpointName,
  defaultValue: T,
): T {
  // Check current breakpoint first
  if (values[currentBreakpoint]) {
    return values[currentBreakpoint]!
  }

  // Fall back to smaller breakpoints
  const breakpointOrder: BreakpointName[] = ['xl', 'lg', 'md', 'sm', 'xs']
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)

  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i]
    if (values[bp]) {
      return values[bp]!
    }
  }

  return defaultValue
}

// Types are already exported above
