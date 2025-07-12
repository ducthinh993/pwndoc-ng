import { ref, reactive } from 'vue'

export interface ToastItem {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastState {
  items: ToastItem[]
}

const state = reactive<ToastState>({
  items: [],
})

let toastId = 0

const generateId = () => `toast-${++toastId}`

const removeToast = (id: string) => {
  const index = state.items.findIndex(item => item.id === id)
  if (index > -1) {
    state.items.splice(index, 1)
  }
}

const addToast = (toast: Omit<ToastItem, 'id'>) => {
  const id = generateId()
  const item: ToastItem = {
    id,
    duration: 5000,
    ...toast,
  }

  state.items.push(item)

  // Auto remove after duration
  if (item.duration && item.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, item.duration)
  }

  return id
}

export const useToast = () => {
  const toast = (options: Omit<ToastItem, 'id'> | string) => {
    const toastOptions = typeof options === 'string'
      ? { message: options, type: 'info' as const }
      : options

    return addToast(toastOptions)
  }

  const success = (message: string, title?: string) => {
    return addToast({ message, title, type: 'success' })
  }

  const error = (message: string, title?: string) => {
    return addToast({ message, title, type: 'error' })
  }

  const warning = (message: string, title?: string) => {
    return addToast({ message, title, type: 'warning' })
  }

  const info = (message: string, title?: string) => {
    return addToast({ message, title, type: 'info' })
  }

  const dismiss = (id: string) => {
    removeToast(id)
  }

  const clear = () => {
    state.items.splice(0, state.items.length)
  }

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
    clear,
    items: state.items,
  }
}
