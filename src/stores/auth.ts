import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type User, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { auth, db } from '~/utils/firebase'

export interface UserProfile {
  // 1. Identity
  uid: string
  email: string | null
  displayName: string | null
  photoURL?: string | null
  phoneNumber?: string | null

  // 2. Access Control
  role: 'super_admin' | 'admin' | 'staff'
  status: 'active' | 'disabled' | 'pending'
  
  // 3. Metadata
  telegramHandle?: string | null
  note?: string | null
  
  // 4. Audit Timestamps
  createdAt: Timestamp | any
  updatedAt: Timestamp | any
  lastLoginAt: Timestamp | any
  createdBy?: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)
  const loading = ref(true)

  let _resolveInit: (value: unknown) => void
  const initPromise = new Promise((resolve) => {
    _resolveInit = resolve
  })

  // Set initial state
  const setUser = async (newUser: User | null) => {
    user.value = newUser
    
    try {
      if (newUser) {
        // Fetch user profile from Firestore
        const userRef = doc(db, 'users', newUser.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile
          profile.value = data
          // Update last login & ensure createdAt exists
          const updates: any = {
            lastLoginAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }
          if (!data.createdAt) {
            updates.createdAt = serverTimestamp()
          }
          await updateDoc(userRef, updates)
        } else {
          // Create initial profile if it doesn't exist (first login)
          const newProfile: UserProfile = {
            uid: newUser.uid,
            email: newUser.email,
            displayName: newUser.displayName || newUser.email?.split('@')[0] || 'User',
            photoURL: newUser.photoURL,
            phoneNumber: newUser.phoneNumber,
            role: 'staff', // Default to staff for safety
            status: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          }
          await setDoc(userRef, newProfile)
          profile.value = newProfile
        }
      } else {
        profile.value = null
      }
    } catch (error) {
      console.error('❌ [AuthStore] Error in setUser:', error)
    } finally {
      loading.value = false
      if (_resolveInit) _resolveInit(true)
    }
  }

  // Initialize auth listener
  onAuthStateChanged(auth, async (newUser) => {
    await setUser(newUser)
  })

  // Restore initAuth for compatibility and early initialization (empty now as onAuthStateChanged is global)
  const initAuth = (firebaseAuth?: any) => {
     // No-op, managed globally
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
    profile.value = null
  }

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin' || profile.value?.role === 'super_admin')
  const isSuperAdmin = computed(() => profile.value?.role === 'super_admin')
  const userRole = computed(() => profile.value?.role || 'guest')

  return {
    user,
    profile,
    loading,
    setUser,
    initAuth,
    logout,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    userRole,
    initPromise
  }
})
