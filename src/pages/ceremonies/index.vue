<template>
  <div class="min-h-screen bg-muted/30 transition-colors duration-300">
    <!-- Header / Banner -->
    <div class="bg-primary pt-24 pb-16 text-center text-white px-4 relative overflow-hidden">
        <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
        <div class="relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
           <h1 class="text-3xl md:text-5xl font-black mb-4 font-khmer uppercase tracking-tight">{{ $t('ceremonies.title') }}</h1>
           <p class="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              {{ $t('ceremonies.subtitle') }}
           </p>
        </div>
    </div>

    <div class="container -mt-8 relative z-10 pb-20 px-4 md:px-6">
       <!-- Search & Filter -->
       <div class="bg-card rounded-2xl shadow-xl p-4 md:p-6 mb-12 border border-border ring-1 ring-border/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div class="flex flex-col md:flex-row gap-6 items-center">
                <div class="relative flex-1 w-full group">
                    <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 h-5 w-5 group-focus-within:text-primary transition-colors" />
                    <Input 
                       v-model="searchQuery" 
                       :placeholder="$t('ceremonies.search_placeholder')" 
                       class="pl-12 h-14 text-lg rounded-xl border-border bg-muted/30 focus:bg-background transition-all font-medium"
                    />
                </div>
                <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <Button 
                       v-for="status in (['all', 'upcoming', 'past'] as const)"
                       :key="status"
                       variant="outline" 
                       :class="[
                         filterStatus === status 
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:bg-primary/90' 
                            : 'bg-background hover:bg-muted border-border text-muted-foreground'
                       ]"
                       @click="filterStatus = status"
                       class="rounded-xl px-6 h-12 font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap"
                    >
                       {{ status === 'all' ? $t('common.filter_all') : $t(`common.filter_${status}`) }}
                    </Button>
                </div>
            </div>
       </div>

       <!-- Content Grid -->
       <div v-if="loading" class="flex justify-center py-24">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
       </div>

       <div v-else-if="filteredCeremonies.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
           <RouterLink v-for="item in filteredCeremonies" :key="item.id" :to="`/articles/${item.id}`" class="group h-full">
               <Card class="h-full overflow-hidden border-none shadow-sm ring-1 ring-border bg-card hover:shadow-2xl hover:ring-primary/20 transition-all duration-500 flex flex-col rounded-3xl">
                   <div class="aspect-video relative overflow-hidden bg-muted">
                       <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground/20">
                           <CalendarIcon class="h-16 w-16" />
                       </div>
                       
                       <!-- Date Badge -->
                       <div v-if="item.eventDate" class="absolute top-4 right-4 bg-background/95 backdrop-blur-md shadow-lg px-3 py-2 rounded-2xl flex flex-col items-center min-w-[65px] border border-border/50 ring-1 ring-white/10"
                            :class="{ 'grayscale opacity-60 scale-95': isPast(item.eventDate) }">
                           <span class="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{{ getMonth(item.eventDate) }}</span>
                           <span class="text-2xl font-black text-foreground leading-none mt-1">{{ getDay(item.eventDate) }}</span>
                       </div>

                       <!-- Past Badge Overlay -->
                       <div v-if="isPast(item.eventDate)" class="absolute top-4 left-4 bg-muted/90 backdrop-blur-md text-muted-foreground px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-border flex items-center gap-1.5">
                           <HistoryIcon class="size-3" />
                           {{ $t('common.status_past') }}
                       </div>
                   </div>
                   <CardContent class="flex-1 p-8 flex flex-col text-left space-y-4">
                       <h3 class="text-xl md:text-2xl font-black font-khmer group-hover:text-primary transition-colors line-clamp-2 leading-snug text-foreground">
                           {{ item.title }}
                       </h3>
                       <p class="text-muted-foreground line-clamp-3 text-sm font-medium leading-relaxed flex-1">
                           {{ item.content }}
                       </p>
                       <div class="pt-6 border-t border-border flex items-center justify-between">
                            <div class="flex items-center text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest tabular-nums italic">
                                <CalendarIcon class="h-3.5 w-3.5 mr-2 opacity-50" />
                                <span>{{ formatDate(item.eventDate || item.createdAt) }}</span>
                            </div>
                            <span class="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group-hover:gap-3 transition-all">
                                {{ $t('common.read_details') }}
                                <ArrowRightIcon class="h-3 w-3" />
                            </span>
                       </div>
                   </CardContent>
               </Card>
           </RouterLink>
       </div>

       <div v-else class="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-border animate-in zoom-in duration-500">
           <div class="size-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground/20 mx-auto mb-6">
                <SearchXIcon class="h-10 w-10" />
           </div>
           <p class="text-muted-foreground font-bold text-lg mb-6">{{ $t('ceremonies.empty') }}</p>
           <Button variant="outline" @click="searchQuery = ''" class="rounded-xl border-border px-8 font-black uppercase tracking-widest text-[10px] h-12 hover:bg-muted bg-background/50">
                {{ $t('common.reset_filters') }}
           </Button>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { SearchIcon, CalendarIcon, SearchXIcon, HistoryIcon, ArrowRightIcon } from 'lucide-vue-next'
import { formatKhmerDate, toKhmerNumerals } from '~/utils/date'
import { useArticles } from '~/composables/useArticles'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const { articles, loading, fetchArticles } = useArticles()
const searchQuery = ref('')
const filterStatus = ref<'all' | 'upcoming' | 'past'>('all')

onMounted(() => {
    fetchArticles()
})

const filteredCeremonies = computed(() => {
    return articles.value.filter(item => {
        // Filter only ceremonies
        if (item.category !== 'ceremony') return false
        
        // Filter by Status (Upcoming/Past)
        if (filterStatus.value !== 'all') {
            const isItemPast = isPast(item.eventDate)
            if (filterStatus.value === 'upcoming' && isItemPast) return false
            if (filterStatus.value === 'past' && !isItemPast) return false
        }

        // Search filter
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            return item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
        }
        return true
    }).sort((a, b) => {
        const dateA = getDateObj(a.eventDate)
        const dateB = getDateObj(b.eventDate)
        return dateB.getTime() - dateA.getTime()
    })
})

const getDateObj = (date: any): Date => {
    if (!date) return new Date(0)
    if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate()
    }
    return new Date(date)
}

const isPast = (date: any) => {
    if (!date) return false
    const d = getDateObj(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d < today
}

const formatDate = (date: any) => formatKhmerDate(date)

const getMonth = (date: any) => {
    if (!date) return ''
    const d = getDateObj(date)
    return formatKhmerDate(d, 'MMM')
}

const getDay = (date: any) => {
    if (!date) return ''
    const d = getDateObj(date)
    return toKhmerNumerals(d.getDate())
}
</script>
