import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const showToast = ({ type = 'info', message, duration = 3000 }) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      type,
      message,
      duration
    }
    
    toasts.value.push(toast)
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  return {
    toasts,
    showToast,
    removeToast
  }
} 