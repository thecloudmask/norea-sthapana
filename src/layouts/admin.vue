<template>
  <SidebarProvider v-if="!uiStore.isFinanceWorkspace">
    <Sidebar collapsible="icon" variant="inset">
      <!-- Sidebar Header / Logo -->
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" as-child>
              <RouterLink to="/admin">
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboardIcon class="size-4" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-bold">{{ $t('app.name') }} Admin</span>
                  <span class="truncate text-xs font-medium opacity-70">{{ $t('app.subtitle') }}</span>
                </div>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <!-- Sidebar Content -->
      <SidebarContent>
        <!-- Dynamic Navigation Groups -->
        <SidebarGroup v-for="group in navigation" :key="group.title">
          <SidebarGroupLabel>{{ $t(group.title) }}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in group.items" :key="item.url">
                <SidebarMenuButton as-child :isActive="isActive(item.url)">
                  <RouterLink :to="item.url">
                    <component :is="item.icon" />
                    <span>{{ $t(item.titleKey) }}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <!-- Sidebar Footer / User -->
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage :src="profile?.photoURL || ''" :alt="profile?.displayName || 'Admin'" />
                      <AvatarFallback class="rounded-lg">{{ initials }}</AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{ profile?.displayName || user?.displayName || 'User' }}</span>
                      <span class="truncate text-xs">{{ user?.email }}</span>
                      <span class="text-[9px] uppercase font-bold text-primary">{{ userRole }}</span>
                    </div>
                    <ChevronsUpDownIcon class="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom" align="end" :side-offset="4">
                  <DropdownMenuLabel class="p-0 font-normal">
                    <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar class="h-8 w-8 rounded-lg">
                        <AvatarImage :src="profile?.photoURL || ''" :alt="profile?.displayName || 'Admin'" />
                        <AvatarFallback class="rounded-lg">{{ initials }}</AvatarFallback>
                      </Avatar>
                      <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-semibold">{{ profile?.displayName || user?.displayName || 'User' }}</span>
                        <span class="truncate text-xs">{{ user?.email }}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SparklesIcon class="mr-2 h-4 w-4" />
                    {{ $t('admin.sidebar.upgrade') }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <BadgeCheckIcon class="mr-2 h-4 w-4" />
                    {{ $t('admin.sidebar.account') }}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon class="mr-2 h-4 w-4" />
                    {{ $t('admin.sidebar.billing') }}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BellIcon class="mr-2 h-4 w-4" />
                    {{ $t('admin.sidebar.notifications') }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleLogout" class="text-red-600 focus:bg-red-50 focus:text-red-600">
                    <LogOutIcon class="mr-2 h-4 w-4" />
                    {{ $t('admin.sidebar.logout') }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
         </SidebarMenu>

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

    <!-- Main Content Inset -->
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4 hidden sm:block" />
          <Breadcrumb class="hidden sm:block">
             <BreadcrumbList>
                <BreadcrumbItem>
                   <BreadcrumbLink to="/admin">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                   <BreadcrumbPage>{{ currentPage }}</BreadcrumbPage>
                </BreadcrumbItem>
             </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="ml-auto flex items-center gap-2 md:gap-4">
             <!-- Language Switcher -->
             <LanguageSwitcher />
             <ThemeSwitcher />
             
             <div class="hidden lg:flex items-center text-sm font-medium text-muted-foreground bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
                  <ClockIcon class="mr-2 h-4 w-4" />
                  <span class="tabular-nums">{{ currentTime }}</span>
              </div>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-6 p-2 md:p-2 lg:p-2 overflow-y-auto">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>

  <!-- Finance Workspace Layout (Truly Full Screen) -->
  <div v-else class="fixed inset-0 w-full h-full bg-background flex flex-col z-[100] overflow-hidden">
     <div class="flex-1 overflow-y-auto">
        <RouterView />
     </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { 
    LayoutDashboardIcon, FolderKanbanIcon, FileTextIcon, SettingsIcon, LogOutIcon, 
    ChevronsUpDownIcon, SparklesIcon, BadgeCheckIcon, CreditCardIcon, BellIcon, ClockIcon, Users as UsersIcon, CalendarIcon, FileBarChartIcon, NewspaperIcon
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useUIStore } from '~/stores/ui'
import { 
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, 
    SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, 
    SidebarRail, SidebarTrigger 
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const { profile, user, userRole } = storeToRefs(authStore)

const initials = computed(() => {
  const name = profile.value?.displayName || user.value?.displayName || 'User'
  return name.substring(0, 2).toUpperCase()
})

const navigation = computed(() => {
  const groups = [
    {
      title: "admin.sidebar.overview",
      items: [
        { titleKey: "admin.sidebar.dashboard", url: "/admin", icon: LayoutDashboardIcon },
      ]
    },
    {
      title: "admin.sidebar.operations",
      items: [
        { titleKey: "admin.sidebar.ceremonies", url: "/admin/ceremonies", icon: CalendarIcon },
        { titleKey: "admin.sidebar.projects", url: "/admin/projects", icon: FolderKanbanIcon },
      ]
    },
    {
      title: "admin.sidebar.content",
      items: [
        { titleKey: "admin.sidebar.articles", url: "/admin/articles", icon: FileTextIcon },
        { titleKey: "admin.sidebar.news", url: "/admin/news", icon: NewspaperIcon },
      ]
    },
    {
      title: "admin.sidebar.analytics",
      items: [
        { titleKey: "admin.sidebar.reports", url: "/admin/reports", icon: FileBarChartIcon },
      ]
    }
  ]
  
  if (authStore.isAdmin) {
    groups.push({
      title: "admin.sidebar.system",
      items: [
        { titleKey: "admin.sidebar.users", url: "/admin/users", icon: UsersIcon },
        { titleKey: "admin.sidebar.settings", url: "/admin/settings", icon: SettingsIcon },
      ]
    })
  }

  return groups
})

const isActive = (url: string) => {
    if (url === '/admin' && route.path === '/admin') return true
    if (url !== '/admin' && route.path.startsWith(url)) return true
    return false
}

const currentPage = computed(() => {
    return route.name?.toString().replace('admin-', '').replace('index', 'Dashboard').toUpperCase() || 'Dashboard'
})


const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Clock logic
const currentTime = ref('')
let timer: any
onMounted(() => {
    const updateTime = () => {
        currentTime.value = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    updateTime()
    timer = setInterval(updateTime, 60000)
})
onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>
