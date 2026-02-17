import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isFinanceWorkspace = ref(false)

  const toggleFinanceWorkspace = () => {
    isFinanceWorkspace.value = !isFinanceWorkspace.value
    
    // Auto-trigger browser fullscreen if supported
    if (isFinanceWorkspace.value && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
            // Silently fail if blocked by browser policy
        })
    } else if (!isFinanceWorkspace.value && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
    }
  }

  const setFinanceWorkspace = (value: boolean) => {
    isFinanceWorkspace.value = value
    if (value && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {})
    } else if (!value && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
    }
  }

  return {
    isFinanceWorkspace,
    toggleFinanceWorkspace,
    setFinanceWorkspace
  }
})
