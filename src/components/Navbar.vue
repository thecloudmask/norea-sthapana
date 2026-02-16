<template>
  <header class="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-2xl transition-all duration-300 supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
      <!-- Logo Area -->
      <RouterLink to="/" class="flex items-center gap-3 transition-transform hover:scale-[1.02]">
        <div class="size-10 md:size-11 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <span class="text-white font-black text-xl">{{ $t('app.name_highlight')[0] }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-lg md:text-xl font-bold text-foreground leading-none">
            <span class="text-primary">{{ $t('app.name_highlight') }}</span>{{ $t('app.name_rest') }}
          </span>
          <span class="text-[9px] font-medium text-muted-foreground/60 mt-0.5">{{ $t('app.subtitle') }}</span>
        </div>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-10">
        <RouterLink 
          v-for="link in navLinks" 
          :key="link.href" 
          :to="getLinkPath(link.href)" 
          class="text-sm font-medium font-khmer text-muted-foreground transition-colors relative py-2 px-1 hover:text-foreground"
          :class="{ 'text-foreground font-semibold': isActive(link.href) }"
        >
          {{ $t(link.titleKey) }}
          <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-300 ease-out origin-left" :class="{ 'scale-x-100': isActive(link.href) }"></span>
        </RouterLink>
      </nav>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3 md:gap-5">
        <!-- Theme Switcher (Desktop) -->
        <ThemeSwitcher class="hidden md:flex" size="sm" />
        
        <!-- Language Switcher -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="sm" class="hidden md:flex gap-2 px-3 rounded-full hover:bg-muted font-khmer transition-all h-9">
              <GlobeIcon class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm font-medium text-foreground">{{ locale === 'km' ? 'ខ្មែរ' : 'EN' }}</span>
              <ChevronDownIcon class="h-3 w-3 text-muted-foreground/60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="rounded-xl p-1 border-border/50 bg-card/95 backdrop-blur-sm shadow-xl">
            <DropdownMenuItem @click="setLocale('km')" class="font-khmer font-medium cursor-pointer rounded-lg h-9 px-3 focus:bg-primary/10 focus:text-primary transition-colors">
              ខ្មែរ (Khmer)
            </DropdownMenuItem>
            <DropdownMenuItem @click="setLocale('en')" class="font-medium cursor-pointer rounded-lg h-9 px-3 focus:bg-primary/10 focus:text-primary transition-colors">
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Donate Button (Desktop) -->
        <Button class="hidden md:flex bg-primary hover:bg-orange-600 text-white font-medium font-khmer h-10 px-6 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 text-xs">
          {{ $t('nav.donate') }}
        </Button>

        <!-- Mobile Action Group -->
        <div class="flex items-center gap-2 md:hidden">
            <ThemeSwitcher />
            <Sheet v-model:open="isOpen">
              <SheetTrigger as-child>
                <Button variant="ghost" size="icon" class="hover:bg-muted rounded-xl transition-all">
                  <MenuIcon class="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" class="p-0 w-[300px] border-border bg-card">
                <div class="flex flex-col h-full">
                  <!-- Drawer Header -->
                  <div class="p-6 border-b border-border">
                    <div class="flex items-center gap-3">
                      <div class="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <span class="text-white font-black text-xl">{{ $t('app.name_highlight')[0] }}</span>
                      </div>
                      <div class="flex flex-col text-left">
                        <span class="text-lg font-bold text-foreground leading-none">
                          <span class="text-primary">{{ $t('app.name_highlight') }}</span>{{ $t('app.name_rest') }}
                        </span>
                        <span class="text-[9px] font-medium text-muted-foreground/60 mt-0.5">{{ $t('app.subtitle') }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Drawer Navigation -->
                  <div class="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    <RouterLink 
                      v-for="link in navLinks" 
                      :key="link.href" 
                      :to="getLinkPath(link.href)" 
                      @click="isOpen = false"
                      class="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium font-khmer text-muted-foreground hover:bg-muted hover:text-primary transition-all group"
                      :class="{ 'bg-primary/5 text-primary ring-1 ring-primary/20 shadow-sm': isActive(link.href) }"
                    >
                      <component :is="link.icon" class="h-5 w-5 transition-transform group-hover:scale-110" />
                      {{ $t(link.titleKey) }}
                    </RouterLink>
                  </div>

                  <!-- Drawer Footer -->
                  <div class="p-6 bg-muted/30 border-t border-border mt-auto">
                    <div class="flex justify-center gap-3 mb-8">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        class="font-khmer h-11 px-6 rounded-xl transition-all border-border bg-background" 
                        :class="{ 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5': locale === 'km' }" 
                        @click="setLocale('km')"
                      >
                        ខ្មែរ
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        class="h-11 px-6 rounded-xl transition-all border-border bg-background font-medium" 
                        :class="{ 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5': locale === 'en' }" 
                        @click="setLocale('en')"
                      >
                        English
                      </Button>
                    </div>

                    <Button class="w-full h-14 bg-primary hover:bg-orange-600 text-white font-medium font-khmer rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95">
                      {{ $t('nav.donate_now') }}
                    </Button>
                    <p class="text-center text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-8 opacity-40 italic">
                      &copy; {{ new Date().getFullYear() }} {{ $t('app.name') }}
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MenuIcon, HomeIcon, FolderKanbanIcon, BookOpenIcon, PhoneIcon, CalendarIcon, GlobeIcon, ChevronDownIcon, NewspaperIcon, BarChart3Icon } from 'lucide-vue-next'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { locale, t } = useI18n()
const setLocale = (val: string) => {
  locale.value = val
}
// Mock usage for now, pending full i18n routing setup
const localePath = (path: string) => path
const isOpen = ref(false)

const navLinks = [
  { titleKey: 'nav.home', href: '/', icon: HomeIcon },
  { titleKey: 'nav.projects', href: '/#projects-section', icon: FolderKanbanIcon },
  { titleKey: 'nav.ceremonies', href: '/ceremonies', icon: CalendarIcon },
  { titleKey: 'nav.news', href: '/news', icon: NewspaperIcon },
  { titleKey: 'nav.library', href: '/articles', icon: BookOpenIcon },
  { titleKey: 'nav.reports', href: '/reports', icon: BarChart3Icon },
  { titleKey: 'nav.contact', href: '#contact-footer', icon: PhoneIcon },
]

const getLinkPath = (href: string) => {
  if (href.startsWith('#')) return href
  if (href.includes('#')) {
    const [path, hash] = href.split('#')
    return `${localePath(path)}#${hash}`
  }
  return localePath(href)
}


const isActive = (href: string) => {
    // Handle pure anchor links
    if (href.startsWith('#')) {
        return route.hash === href
    }

    const targetPath = href.split('#')[0]
    const currentPath = route.path
    const localizedTarget = localePath(targetPath)

    if (targetPath === '/' && !href.includes('#')) {
        return currentPath === localizedTarget && !route.hash
    }
    
    if (href.includes('#')) {
       const targetHash = href.split('#')[1]
       const pathsMatch = currentPath === localizedTarget || (localizedTarget === '/' && currentPath === '/en')
       return pathsMatch && route.hash === `#${targetHash}`
    }

    return currentPath.startsWith(localizedTarget) && localizedTarget !== '/' && localizedTarget !== '/en'
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
