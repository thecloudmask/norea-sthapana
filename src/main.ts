import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import App from './App.vue'
import './assets/css/main.css'

import en from './locales/en.json'
import km from './locales/km.json'
import { createHead } from '@unhead/vue'

const head = createHead()

import { useAuthStore } from './stores/auth'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80, // Offset for sticky header
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.loading) {
    await authStore.initPromise
  }

  const isAuthPage = to.path === '/login'
  const isAdminPage = to.path.startsWith('/admin')
  
  if (!isAdminPage && !isAuthPage) {
     return next()
  }

  if (authStore.isAuthenticated && isAuthPage) {
    return next('/admin')
  }

  if (!authStore.isAuthenticated && isAdminPage) {
    return next('/login')
  }
  
  if (isAdminPage && to.path !== '/admin' && !authStore.isAdmin) {
     const isAdminOnly = to.path.startsWith('/admin/settings') || to.path.startsWith('/admin/users')
     if (isAdminOnly && !authStore.isAdmin) {
        return next('/admin')
     }
  }

  next()
})

const i18n = createI18n({
  legacy: false,
  locale: 'km',
  fallbackLocale: 'en',
  messages: {
    en,
    km
  }
})

import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.use(head)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.component('apexchart', VueApexCharts)


app.mount('#app')
