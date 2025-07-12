import { ref, reactive } from 'vue'

export interface LoadingState {
  isLoading: boolean
  message?: string
  customClass?: string
  backgroundColor?: string
  html?: boolean
}

const state = reactive<LoadingState>({
  isLoading: false,
  message: undefined,
  customClass: undefined,
  backgroundColor: undefined,
  html: false,
})

export const useLoading = () => {
  const show = (options?: {
    message?: string
    customClass?: string
    backgroundColor?: string
    html?: boolean
  }) => {
    state.isLoading = true
    state.message = options?.message
    state.customClass = options?.customClass
    state.backgroundColor = options?.backgroundColor
    state.html = options?.html || false
  }

  const hide = () => {
    state.isLoading = false
    state.message = undefined
    state.customClass = undefined
    state.backgroundColor = undefined
    state.html = false
  }

  const isLoading = () => state.isLoading

  return {
    show,
    hide,
    isLoading,
    state,
  }
}

// Global loading state for use across components
export const globalLoading = useLoading()
