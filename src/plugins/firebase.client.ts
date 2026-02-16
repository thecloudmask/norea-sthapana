import { onAuthStateChanged } from 'firebase/auth'
import { defineNuxtPlugin } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { initFirebase } from '~/utils/firebase'

export default defineNuxtPlugin((nuxtApp) => {
  const { app, db, auth, storage } = initFirebase()

  // Sync auth state with the store
  const authStore = useAuthStore()
  
  // Guard for server-side initialization if it ever hits this (though it's .client.ts)
  if (import.meta.client) {
    onAuthStateChanged(auth, (user) => {
      authStore.setUser(user)
    })
  }

  return {
    provide: {
      firebaseApp: app,
      db,
      auth,
      storage
    }
  }
})
