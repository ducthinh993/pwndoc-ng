/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design token mapping for colors
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
        accent: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(var(--color-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--color-popover))",
          foreground: "hsl(var(--color-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--color-card))",
          foreground: "hsl(var(--color-card-foreground))",
        },
        // Legacy Quasar color mappings for backwards compatibility
        success: "hsl(var(--color-success))",
        info: "hsl(var(--color-info))",
        warning: "hsl(var(--color-warning))",
        // Additional color mappings for existing styles
        'blue-grey': {
          50: '#eceff1',
          100: '#cfd8dc',
          200: '#b0bec5',
          300: '#90a4ae',
          400: '#78909c',
          500: '#607d8b',
          600: '#546e7a',
          700: '#455a64',
          800: '#37474f',
          900: '#263238',
        },
        'light-blue': {
          50: '#e1f5fe',
          100: '#b3e5fc',
          200: '#81d4fa',
          300: '#4fc3f7',
          400: '#29b6f6',
          500: '#03a9f4',
          600: '#039be5',
          700: '#0288d1',
          800: '#0277bd',
          900: '#01579b',
        },
        'orange': {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800',
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        },
      },
      borderRadius: {
        // Design token mapping for border radius
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        full: "var(--radius-full)",
      },
      fontFamily: {
        // Design token mapping for typography
        sans: ["var(--font-family-sans)", ...fontFamily.sans],
      },
      fontSize: {
        // Design token mapping for font sizes
        xs: ["var(--font-size-xs)", { lineHeight: "1.5" }],
        sm: ["var(--font-size-sm)", { lineHeight: "1.5" }],
        base: ["var(--font-size-base)", { lineHeight: "1.5" }],
        lg: ["var(--font-size-lg)", { lineHeight: "1.5" }],
        xl: ["var(--font-size-xl)", { lineHeight: "1.5" }],
        "2xl": ["var(--font-size-2xl)", { lineHeight: "1.4" }],
        "3xl": ["var(--font-size-3xl)", { lineHeight: "1.3" }],
        "4xl": ["var(--font-size-4xl)", { lineHeight: "1.2" }],
      },
      spacing: {
        // Design token mapping for spacing
        0: "var(--spacing-0)",
        "0.5": "var(--spacing-0-5)",
        1: "var(--spacing-1)",
        2: "var(--spacing-2)",
        3: "var(--spacing-3)",
        4: "var(--spacing-4)",
        5: "var(--spacing-5)",
        6: "var(--spacing-6)",
        7: "var(--spacing-7)",
        8: "var(--spacing-8)",
        9: "var(--spacing-9)",
        10: "var(--spacing-10)",
        11: "var(--spacing-11)",
        12: "var(--spacing-12)",
        14: "var(--spacing-14)",
        16: "var(--spacing-16)",
        20: "var(--spacing-20)",
        24: "var(--spacing-24)",
        28: "var(--spacing-28)",
        32: "var(--spacing-32)",
      },
      boxShadow: {
        // Design token mapping for shadows
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        inner: "var(--shadow-inner)",
      },
      transitionDuration: {
        // Design token mapping for transitions
        75: "var(--transition-duration-75)",
        100: "var(--transition-duration-100)",
        150: "var(--transition-duration-150)",
        200: "var(--transition-duration-200)",
        300: "var(--transition-duration-300)",
        500: "var(--transition-duration-500)",
        700: "var(--transition-duration-700)",
        1000: "var(--transition-duration-1000)",
      },
      zIndex: {
        // Design token mapping for z-index
        dropdown: "var(--z-index-dropdown)",
        sticky: "var(--z-index-sticky)",
        fixed: "var(--z-index-fixed)",
        "modal-backdrop": "var(--z-index-modal-backdrop)",
        modal: "var(--z-index-modal)",
        popover: "var(--z-index-popover)",
        tooltip: "var(--z-index-tooltip)",
      },
      keyframes: {
        // Custom animations for Shadcn components
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "slide-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "zoom-in": {
          from: { transform: "scale(0.95)" },
          to: { transform: "scale(1)" },
        },
        "zoom-out": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(0.95)" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-top": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" },
        },
        "slide-out-to-bottom": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "slide-out-to-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "slide-out-to-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        // Custom animations for Shadcn components
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-down": "slide-down 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "zoom-in": "zoom-in 0.2s ease-out",
        "zoom-out": "zoom-out 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.2s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.2s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.2s ease-out",
        "slide-out-to-top": "slide-out-to-top 0.2s ease-out",
        "slide-out-to-bottom": "slide-out-to-bottom 0.2s ease-out",
        "slide-out-to-left": "slide-out-to-left 0.2s ease-out",
        "slide-out-to-right": "slide-out-to-right 0.2s ease-out",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Custom plugin for component variants
    function({ addUtilities }) {
      const newUtilities = {
        // Custom utility classes for component variants
        '.animate-in': {
          'animation-name': 'fade-in, zoom-in',
          'animation-duration': '0.2s',
          'animation-fill-mode': 'both',
        },
        '.animate-out': {
          'animation-name': 'fade-out, zoom-out',
          'animation-duration': '0.2s',
          'animation-fill-mode': 'both',
        },
        '.fade-in-0': {
          'animation-name': 'fade-in',
        },
        '.fade-out-0': {
          'animation-name': 'fade-out',
        },
        '.zoom-in-95': {
          'animation-name': 'zoom-in',
        },
        '.zoom-out-95': {
          'animation-name': 'zoom-out',
        },
        '.slide-in-from-top-2': {
          'animation-name': 'slide-in-from-top',
        },
        '.slide-in-from-bottom-2': {
          'animation-name': 'slide-in-from-bottom',
        },
        '.slide-in-from-left-2': {
          'animation-name': 'slide-in-from-left',
        },
        '.slide-in-from-right-2': {
          'animation-name': 'slide-in-from-right',
        },
        '.slide-out-to-top-2': {
          'animation-name': 'slide-out-to-top',
        },
        '.slide-out-to-bottom-2': {
          'animation-name': 'slide-out-to-bottom',
        },
        '.slide-out-to-left-1\\/2': {
          'animation-name': 'slide-out-to-left',
        },
        '.slide-out-to-right-1\\/2': {
          'animation-name': 'slide-out-to-right',
        },
        '.slide-in-from-left-1\\/2': {
          'animation-name': 'slide-in-from-left',
        },
        '.slide-in-from-right-1\\/2': {
          'animation-name': 'slide-in-from-right',
        },
        '.slide-out-to-top-\\[48\\%\\]': {
          'animation-name': 'slide-out-to-top',
        },
        '.slide-in-from-top-\\[48\\%\\]': {
          'animation-name': 'slide-in-from-top',
        },
      }
      addUtilities(newUtilities)
    },
  ],
} 