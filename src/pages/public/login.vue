<template>
  <div class="container flex h-[calc(100vh-160px)] items-center justify-center">
    <div v-if="authStore.loading" class="flex flex-col items-center gap-4">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p class="text-sm text-muted-foreground animate-pulse">{{ $t('login.verifying') }}</p>
    </div>
    
    <ClientOnly v-else>
      <Card v-if="!authStore.isAuthenticated" class="w-full max-w-[400px]">
        <CardHeader class="space-y-1 text-center">
          <CardTitle class="text-2xl font-semibold">{{ $t('login.title') }}</CardTitle>
          <CardDescription>
            {{ $t('login.description') }}
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="grid gap-2">
              <Label for="email">{{ $t('login.email') }}</Label>
              <Input
                id="email"
                v-model="email"
                placeholder="name@example.com"
                type="email"
                auto-capitalize="none"
                autocomplete="email"
                auto-correct="off"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="password">{{ $t('login.password') }}</Label>
              <Input
                id="password"
                v-model="password"
                placeholder="••••••••"
                type="password"
                autocomplete="current-password"
                required
              />
            </div>
            <Button class="w-full" :disabled="loading">
              <span v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
              {{ $t('login.button') }}
            </Button>
          </form>
          
          <div v-if="error" class="text-sm text-destructive text-center">
            {{ error }}
          </div>
        </CardContent>
      </Card>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/admin')
  } catch (err: any) {
    error.value = t('login.error_failed')
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
