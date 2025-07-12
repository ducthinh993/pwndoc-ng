import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to replace Quasar Notify.create()
export function createNotify(options) {
  // This will be used with useToast() in components
  // For now, we'll use a simple console.log as a fallback
  console.log('Notify:', options.message)
  
  // In the actual implementation, components will use:
  // const { toast } = useToast()
  // toast({ title: options.message, variant: options.color === 'negative' ? 'destructive' : 'default' })
}

// Utility function to replace Quasar Dialog.create()
export function createDialog(options) {
  // This will be replaced with proper Vue Shadcn Dialog in components
  // For now, we'll use browser confirm as a fallback
  const result = confirm(`${options.title}\n${options.message}`)
  
  if (result && options.onOk) {
    options.onOk()
  }
  
  return {
    onOk: (callback) => {
      if (result) {
        callback()
      }
    }
  }
}

// Dark mode utilities to replace Quasar Dark
export const DarkMode = {
  set(darkMode) {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkmodeEnabled', 'y')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.removeItem('darkmodeEnabled')
    }
  },
  
  get isActive() {
    return document.documentElement.classList.contains('dark')
  },
  
  toggle() {
    this.set(!this.isActive)
  }
}

// Custom Loading utility to replace Quasar Loading
export const Loading = {
  _element: null,
  
  show(options = {}) {
    // Remove existing loading if present
    this.hide()
    
    // Create loading overlay
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center'
    overlay.style.backgroundColor = options.backgroundColor || 'rgba(0, 0, 0, 0.8)'
    
    // Create content container
    const content = document.createElement('div')
    content.className = 'text-center text-white p-6 rounded-lg max-w-sm mx-4'
    content.style.backgroundColor = options.backgroundColor || 'rgba(220, 38, 38, 0.9)' // red-600 with opacity
    
    if (options.html) {
      content.innerHTML = options.message || 'Loading...'
    } else {
      content.textContent = options.message || 'Loading...'
    }
    
    overlay.appendChild(content)
    document.body.appendChild(overlay)
    
    this._element = overlay
    
    // Auto-hide after delay if specified
    if (options.delay) {
      setTimeout(() => {
        this.hide()
      }, options.delay)
    }
  },
  
  hide() {
    if (this._element) {
      document.body.removeChild(this._element)
      this._element = null
    }
  }
} 