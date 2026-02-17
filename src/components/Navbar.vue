<template>
  <header 
    class="sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    :class="[
      y > 20 ? 'bg-background/80 h-16 shadow-sm border-border/40' : 'bg-transparent border-transparent h-20 md:h-24'
    ]"
  >
    <div class="w-full px-4 md:px-6 h-full flex items-center justify-between transition-all duration-300">
      <!-- Logo Area (Fixed Width for Balance) -->
      <div class="w-[200px] flex-shrink-0">
        <RouterLink to="/" class="flex items-center gap-3 transition-transform hover:scale-[1.02] w-fit">
          <div 
            class="rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-300"
            :class="y > 20 ? 'size-9 md:size-10' : 'size-11 md:size-12'"
          >
            <span class="text-white font-bold text-xl">{{ $t('app.name_highlight')[0] }}</span>
          </div>
          <div class="flex flex-col transition-all duration-300" :class="{ 'opacity-0 -translate-x-2 w-0 overflow-hidden': y > 20 && false }">
            <!-- Keeping text visible but slightly smaller on scroll is usually better -->
             <div class="flex flex-col transition-all duration-300" :class="y > 20 ? 'scale-90 origin-left' : 'scale-100 origin-left'">
                <span class="text-lg md:text-xl font-bold text-foreground leading-none">
                  <span class="text-primary">{{ $t('app.name_highlight') }}</span>{{ $t('app.name_rest') }}
                </span>
                <span class="text-[9px] font-medium text-muted-foreground/60 mt-0.5" :class="{ 'opacity-0 h-0': y > 20 }">{{ $t('app.subtitle') }}</span>
             </div>
          </div>
        </RouterLink>
      </div>

      <!-- Desktop Navigation (Centered) -->
      <nav class="hidden md:flex flex-1 items-center justify-center gap-8">
        <RouterLink 
          v-for="link in navLinks" 
          :key="link.href" 
          :to="getLinkPath(link.href)" 
          class="text-sm font-medium font-khmer text-muted-foreground transition-colors relative py-2 px-1 hover:text-primary"
          :class="{ 'font-semibold text-primary': isActive(link.href) }"
        >
          {{ $t(link.titleKey) }}
          <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-300 ease-out origin-left" :class="{ 'scale-x-100': isActive(link.href) }"></span>
        </RouterLink>
      </nav>

      <!-- Action Buttons (Right Aligned) -->
      <div class="flex items-center justify-end gap-3 md:gap-4 w-[200px] flex-shrink-0">
        <!-- Theme Switcher -->
        <ThemeSwitcher class="hidden md:flex" size="sm" />
        
        <!-- Language Switcher (Flag Toggle) -->
        <button 
          @click="toggleLocale"
          class="hidden md:flex items-center gap-2 pr-3 pl-2 py-1.5 rounded-sm border border-border/50 hover:bg-muted/50 transition-all bg-card/50 backdrop-blur-sm shadow-sm min-w-fit"
        >
          <img 
            v-if="locale === 'km'" 
            src="/images/khmer_flag.png" 
            alt="Khmer" 
            class="w-6 h-4 object-cover rounded-[2px] shadow-sm flex-shrink-0"
          />
          <img 
            v-else 
            src="/images/us_flag.webp" 
            alt="English" 
            class="w-6 h-4 object-cover rounded-[2px] shadow-sm flex-shrink-0"
          />
          <span class="text-sm font-medium font-khmer leading-none pt-0.5 whitespace-nowrap">
            {{ locale === 'km' ? 'ខ្មែរ' : 'EN' }}
          </span>
        </button>

        <!-- Donate Button (Desktop) -->
        <Button 
          class="hidden md:flex bg-primary hover:bg-orange-600 text-white font-medium font-khmer h-10 px-6 rounded-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 text-xs"
          @click="showDonationModal = true"
        >
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
                <SheetContent side="right" class="p-0 w-[320px] sm:w-[380px] border-l border-border/50 bg-background/95 backdrop-blur-3xl">
                  <div class="flex flex-col h-full">
                    <!-- Drawer Header -->
                    <div class="relative p-6 pb-8 border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
                      <div class="absolute top-0 right-0 p-4 opacity-50 mix-blend-overlay pointer-events-none">
                         <!-- Decorative pattern if needed -->
                      </div>
                      <div class="flex items-center gap-4">
                        <div class="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 ring-4 ring-background">
                          <span class="text-white font-bold text-2xl">{{ $t('app.name_highlight')[0] }}</span>
                        </div>
                        <div class="flex flex-col text-left">
                          <span class="text-xl font-bold text-foreground leading-none tracking-tight">
                            <span class="text-primary">{{ $t('app.name_highlight') }}</span>{{ $t('app.name_rest') }}
                          </span>
                          <span class="text-[10px] font-medium text-muted-foreground/80 mt-1 uppercase tracking-wider">{{ $t('app.subtitle') }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Drawer Navigation -->
                    <div class="flex-1 px-4 py-6 overflow-y-auto">
                      <div class="space-y-2">
                        <RouterLink 
                          v-for="link in navLinks" 
                          :key="link.href" 
                          :to="getLinkPath(link.href)" 
                          @click="isOpen = false"
                          class="flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-medium font-khmer text-muted-foreground transition-all group hover:bg-muted/60 active:scale-[0.98] active:bg-muted"
                          :class="{ 'bg-primary/5 text-primary ring-1 ring-primary/20 shadow-sm font-semibold': isActive(link.href) }"
                        >
                          <div 
                            class="size-10 rounded-xl flex items-center justify-center transition-colors"
                            :class="isActive(link.href) ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'"
                          >
                             <component :is="link.icon" class="h-5 w-5" />
                          </div>
                          {{ $t(link.titleKey) }}
                        </RouterLink>
                      </div>
                    </div>

                    <!-- Drawer Footer -->
                    <div class="p-6 bg-muted/20 border-t border-border/50 mt-auto backdrop-blur-sm">
                      <div class="flex items-center justify-between mb-6">
                         <span class="text-sm font-medium text-muted-foreground">App Settings</span>
                         <div class="flex items-center gap-3">
                           <!-- Language Toggle Mobile -->
                            <button 
                              @click="toggleLocale"
                              class="flex items-center gap-2 pr-3 pl-2 py-1.5 rounded-xl border border-border/50 bg-background shadow-sm active:scale-95 transition-all"
                            >
                              <img 
                                v-if="locale === 'km'" 
                                src="/images/khmer_flag.png" 
                                alt="Khmer" 
                                class="w-6 h-4 object-cover rounded-[2px] shadow-sm flex-shrink-0"
                              />
                              <img 
                                v-else 
                                src="/images/us_flag.webp" 
                                alt="English" 
                                class="w-6 h-4 object-cover rounded-[2px] shadow-sm flex-shrink-0"
                              />
                              <span class="text-xs font-bold font-khmer leading-none pt-0.5">
                                {{ locale === 'km' ? 'KH' : 'EN' }}
                              </span>
                            </button>
                         </div>
                      </div>

                      <Button 
                        class="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-lg font-khmer rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        @click="handleMobileDonate"
                      >
                        <HeartIcon class="w-5 h-5 fill-current" />
                        {{ $t('nav.donate_now') }}
                      </Button>
                      
                      <p class="text-center text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.2em] mt-6 opacity-30">
                        {{ $t('app.name') }}
                      </p>
                    </div>
                  </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </div>
    <!-- Donation Modal -->
    <DonationModal v-model:open="showDonationModal" />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MenuIcon, HomeIcon, FolderKanbanIcon, BookOpenIcon, CalendarIcon, NewspaperIcon, HeartIcon } from 'lucide-vue-next'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWindowScroll } from '@vueuse/core'
import DonationModal from '@/components/DonationModal.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

const route = useRoute()
const { locale } = useI18n()
const { y } = useWindowScroll()

const toggleLocale = () => {
  locale.value = locale.value === 'km' ? 'en' : 'km'
}

const handleMobileDonate = () => {
  isOpen.value = false
  showDonationModal.value = true
}

// Mock usage for now, pending full i18n routing setup
const localePath = (path: string) => path
const isOpen = ref(false)
const showDonationModal = ref(false)

const navLinks = [
  { titleKey: 'nav.home', href: '/', icon: HomeIcon },
  { titleKey: 'nav.projects', href: '/#projects-section', icon: FolderKanbanIcon },
  { titleKey: 'nav.ceremonies', href: '/ceremonies', icon: CalendarIcon },
  { titleKey: 'nav.news', href: '/news', icon: NewspaperIcon },
  { titleKey: 'nav.library', href: '/articles', icon: BookOpenIcon },
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
