<template>
  <div class="min-h-screen bg-muted/30">
    <!-- 2. Hero Section -->
    <section class="relative h-[600px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <!-- Placeholder for Temple Image - using gradient/pattern as fallback -->
        <div class="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900 z-10"></div>
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#ffffff 2px, transparent 2px); background-size: 40px 40px;"></div>
        <!-- Simulating an image -->
        <img src="https://images.unsplash.com/photo-1620933934526-2c502fb3569c?q=80&w=2070&auto=format&fit=crop" class="w-full h-full object-cover opacity-50" alt="Temple Background" />
      </div>

      <!-- Hero Content -->
      <div class="relative z-20 container text-center space-y-8 px-4 flex flex-col items-center">
        <h1 class="text-4xl font-black tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-2xl">
          {{ $t('hero.title_start') }} <span class="text-primary">{{ $t('hero.title_highlight') }}</span>
        </h1>
        <p class="mx-auto max-w-[700px] text-white/90 text-lg md:text-2xl drop-shadow-md font-medium tracking-wide">
          {{ $t('hero.subtitle') }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Button size="lg" class="bg-primary hover:bg-orange-500 text-white font-black font-khmer rounded-2xl px-10 h-16 text-lg shadow-2xl shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0" @click="scrollToDonation">
            {{ $t('hero.cta_donate') }}
          </Button>
          <Button size="lg" class="bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold font-khmer rounded-2xl px-10 h-16 text-lg shadow-xl shadow-white/10 transition-all hover:-translate-y-1 active:translate-y-0" @click="scrollToProjects">
            {{ $t('hero.cta_projects') }}
          </Button>
        </div>
      </div>
    </section>

     <!-- 3. Abbot's Message -->
     <section class="py-20 container">
       <div class="grid md:grid-cols-2 gap-12 items-center bg-card p-8 md:p-12 rounded-3xl shadow-sm border border-border">
          <!-- Monk's Portrait -->
          <div class="relative aspect-[3/4] md:aspect-square rounded-2xl overflow-hidden shadow-xl ring-1 ring-border">
             <img src="https://placehold.co/600x800/orange/white?text=Abbot+Portrait" alt="Abbot" class="w-full h-full object-cover" />
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             <div class="absolute bottom-6 left-6 text-white">
                <p class="text-sm opacity-90">{{ $t('abbot.title_small') }}</p>
                <h3 class="text-xl font-bold">{{ $t('abbot.name') }}</h3>
             </div>
          </div>
          <!-- Message Text -->
          <div class="space-y-6">
             <h2 class="text-3xl md:text-4xl font-bold text-foreground font-khmer leading-tight">
                {{ $t('abbot.title_main') }}
             </h2>
             <div class="w-20 h-1.5 bg-primary rounded-full"></div>
             <blockquote class="text-muted-foreground text-lg leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2">
                "{{ $t('abbot.quote') }}"
             </blockquote>
             <Button variant="ghost" class="text-primary hover:text-primary-foreground hover:bg-primary group p-0 px-4">
                {{ $t('common.read_more') }} <ArrowRightIcon class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
             </Button>
          </div>
       </div>
     </section>

     <!-- 4. Active Projects (Transparency Core) -->
     <section id="projects-section" class="py-20 bg-muted/30 border-t border-border">
       <div class="container space-y-12">
         <div class="text-center space-y-4 max-w-2xl mx-auto">
            <Badge variant="outline" class="border-primary text-primary px-4 py-1 text-sm">{{ $t('projects.transparency_badge') }}</Badge>
            <h2 class="text-3xl md:text-4xl font-bold text-foreground">{{ $t('projects.title') }}</h2>
            <p class="text-muted-foreground text-lg">{{ $t('projects.subtitle') }}</p>
         </div>

         <div v-if="loadingProjects" class="flex justify-center py-20">
           <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
         </div>

         <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Project Card -->
            <Card v-for="project in projects" :key="project.id" class="flex flex-col overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group bg-card rounded-2xl h-full">
               <!-- Image -->
               <div class="aspect-[4/3] overflow-hidden relative">
                  <img 
                     :src="project.bannerUrl || 'https://images.unsplash.com/photo-1542125387-c71a34d5218d?q=80&w=2070'" 
                     :alt="project.title" 
                     class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                  />
                   <div class="absolute top-4 right-4">
                      <StatusBadge :status="project.status" />
                   </div>
               </div>

               <!-- Content -->
               <CardContent class="flex-1 p-6 space-y-6">
                  <div>
                     <h3 class="text-xl font-bold text-foreground mb-2 line-clamp-2 h-14">{{ project.title }}</h3>
                     <p class="text-muted-foreground text-sm line-clamp-2">{{ project.description }}</p>
                  </div>

                  <!-- Progress Bar -->
                  <div class="space-y-3">
                     <div class="flex justify-between items-end text-sm">
                        <div>
                           <p class="text-muted-foreground text-xs uppercase tracking-widest font-semibold">{{ $t('projects.raised') }}</p>
                           <p class="font-bold text-foreground text-lg font-mono">${{ (project.currentAmount || 0).toLocaleString() }}</p>
                        </div>
                        <div class="text-right">
                           <p class="text-muted-foreground text-xs uppercase tracking-widest font-semibold">{{ $t('projects.goal') }}</p>
                           <p class="font-bold text-muted-foreground/80 text-sm font-mono">${{ (project.goalAmount || 1).toLocaleString() }}</p>
                        </div>
                     </div>
                     <div class="relative h-2.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                           class="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                           :style="{ width: `${Math.min(((project.currentAmount || 0) / (project.goalAmount || 1)) * 100, 100)}%` }"
                        ></div>
                     </div>
                     <div class="text-right text-xs font-bold text-primary">
                        {{ Math.round(((project.currentAmount || 0) / (project.goalAmount || 1)) * 100) }}% {{ $t('projects.complete') }}
                     </div>
                  </div>
               </CardContent>

               <CardFooter class="p-6 pt-0">
                  <RouterLink :to="`/project/${project.id}`" class="w-full">
                     <Button class="w-full bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 h-10 font-bold tracking-wide">
                        {{ $t('common.view_details') }}
                     </Button>
                  </RouterLink>
               </CardFooter>
            </Card>

            <!-- Project Fallback -->
            <div v-if="!loadingProjects && projects.length === 0" class="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl">
               <p class="text-muted-foreground">{{ $t('projects.empty') }}</p>
            </div>
         </div>

         <div class="text-center pt-8">
            <RouterLink to="/#projects-section">
               <Button variant="outline" size="lg" class="border-border hover:bg-muted text-muted-foreground">
                  {{ $t('common.view_all_projects') }} <ArrowRightIcon class="ml-2 h-4 w-4" />
               </Button>
            </RouterLink>
         </div>
       </div>
     </section>

     <!-- 5. Upcoming Events -->
     <section class="py-20 container">
        <div class="flex items-end justify-between mb-12">
           <div>
             <h2 class="text-3xl font-bold text-foreground mb-2">{{ $t('events.title') }}</h2>
             <p class="text-muted-foreground">{{ $t('events.subtitle') }}</p>
           </div>
           <RouterLink to="/ceremonies">
              <Button variant="link" class="text-primary p-0 h-auto font-bold">{{ $t('events.see_all') }} &rarr;</Button>
           </RouterLink>
        </div>

        <div v-if="loadingArticles" class="grid md:grid-cols-3 gap-8">
           <div v-for="i in 3" :key="i" class="h-64 bg-muted animate-pulse rounded-2xl"></div>
        </div>

        <div v-else class="grid md:grid-cols-3 gap-8">
           <Card v-for="event in upcomingEvents" :key="event.id" class="group border border-border hover:border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden bg-card">
              <div class="relative h-48 overflow-hidden">
                 <img :src="event.imageUrl || 'https://placehold.co/600x400/orange/white?text=Event'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                 <!-- Date Badge -->
                 <div class="absolute top-4 left-4 bg-card rounded-xl p-2 text-center shadow-md min-w-[60px]">
                    <span class="block text-xs font-bold text-muted-foreground uppercase tracking-widest">{{ getMonth(event.eventDate || event.createdAt) }}</span>
                    <span class="block text-2xl font-black text-foreground leading-none pb-1">{{ getDay(event.eventDate || event.createdAt) }}</span>
                 </div>
              </div>
              <CardContent class="p-6">
                 <!-- Location Badge (Mock) -->
                 <div class="flex items-center gap-2 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
                    <MapPinIcon class="w-3 h-3" />
                    <span>{{ $t('events.location_default') }}</span>
                 </div>
                 <h3 class="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">{{ event.title }}</h3>
                 <p class="text-muted-foreground text-sm line-clamp-2">{{ event.content }}</p>
              </CardContent>
           </Card>

            <div v-if="upcomingEvents.length === 0" class="col-span-full py-12 text-center bg-muted/30 rounded-2xl">
               <CalendarIcon class="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
               <p class="text-muted-foreground font-medium">{{ $t('events.empty') }}</p>
            </div>
        </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { ArrowRightIcon, CalendarIcon, MapPinIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useProjects } from '~/composables/useProjects'
import { useArticles } from '~/composables/useArticles'
import { format } from 'date-fns'
import StatusBadge from '~/components/StatusBadge.vue'

const { projects, loading: loadingProjects, fetchProjects } = useProjects()
const { articles, loading: loadingArticles, fetchArticles } = useArticles()

// Upcoming Events: category 'ceremony'
const upcomingEvents = computed(() => {
  console.log('🔄 [Home Page] Recomputing upcomingEvents, articles count:', articles.value.length)
  return articles.value
    .filter((a) => a.category === 'ceremony')
    .slice(0, 3)
})

onMounted(() => {
  fetchProjects()
  fetchArticles()
})

const scrollToProjects = () => {
    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToDonation = () => {
    document.getElementById('contact-footer')?.scrollIntoView({ behavior: 'smooth' })
}

// Date helpers
const getMonth = (date: any) => {
    if (!date) return 'DEC'
    const d = date.toDate ? date.toDate() : new Date(date)
    return format(d, 'MMM')
}

const getDay = (date: any) => {
    if (!date) return '01'
    const d = date.toDate ? date.toDate() : new Date(date)
    return format(d, 'dd')
}

// Fetch data on mount
onMounted(() => {
    console.log('🚀 [Home Page] onMounted called')
    console.log('🚀 [Home Page] Fetching projects and articles...')
    fetchProjects()
    fetchArticles()
})
</script>
