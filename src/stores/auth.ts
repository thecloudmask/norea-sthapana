import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'

export interface LaravelUser {
  id: string
  uid: string
  name: string
  displayName?: string
  email: string
  role: 'super_admin' | 'admin' | 'staff' | 'user'
  status: 'active' | 'inactive' | 'disabled'
  position?: string
  phone?: string
  phoneNumber?: string
  address?: string
  profile_picture?: string
  photoURL?: string
  last_login_at?: string
  lastLoginAt?: any
  created_at?: string
  telegramHandle?: string
  note?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<LaravelUser | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(true) // Start with loading true until first auth check

  // Try to restore user from localStorage immediately
  try {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  } catch (e) {
    console.error('Failed to parse saved user:', e)
  }

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'super_admin')
  const isSuperAdmin = computed(() => user.value?.role === 'super_admin')
  const userRole = computed(() => user.value?.role || 'guest')

  // Actions
  async function login(credentials: { email: string; password: string }) {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      
      // Update State
      user.value = response.data as any
      token.value = response.token
      
      // Persist Session
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.data))
      
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await authService.logout()
      }
    } finally {
      // Clear State
      user.value = null
      token.value = null
      
      // Clear Persistence
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  // Initialize from Firebase listener
  function initAuth() {
    authService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser as LaravelUser
        token.value = 'firebase-session' // Placeholder to maintain isAuthenticated logic
        localStorage.setItem('user', JSON.stringify(firebaseUser))
        localStorage.setItem('token', 'firebase-session')
      } else {
        user.value = null
        token.value = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
      loading.value = false // Done with initial check
    })
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    userRole,
    login,
    logout,
    initAuth
  }
})
