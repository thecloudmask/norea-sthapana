import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"
import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const authHint = useCookie('auth_hint').value === 'true'
  
  const isAuthPage = to.path === '/login'
  const isAdminPage = to.path.startsWith('/admin')
  const isAdminOnlyPage = to.path.startsWith('/admin/settings') || to.path.startsWith('/admin/users')

  // Server-side: Use the cookie hint to perform an immediate redirect.
  // This avoids the 'flash' of the wrong page before the client can initialize Firebase.
  if (import.meta.server) {
    if (authHint && isAuthPage) {
      return navigateTo('/admin')
    }
    if (!authHint && isAdminPage) {
      return navigateTo('/login')
    }
    return
  }
  
  // Client-side: Wait for the formal Firebase auth check to complete.
  if (authStore.loading) {
    await authStore.initPromise
  }
  
  // Final verification for authenticated users trying to visit login
  if (authStore.isAuthenticated && isAuthPage) {
    return navigateTo('/admin')
  }

  // Final verification for guests trying to visit admin
  if (!authStore.isAuthenticated && isAdminPage) {
    return navigateTo('/login')
  }

  // RBAC: Redirect non-admins away from admin-only pages
  // Only run this on the client because the server doesn't have the user profile
  if (import.meta.client && isAdminOnlyPage && !authStore.isAdmin) {
    console.warn('Access denied: Admin only')
    return navigateTo('/admin')
  }
})
