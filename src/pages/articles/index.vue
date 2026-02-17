<template>
  <div class="min-h-screen bg-muted/30 transition-colors duration-300">
    <!-- Header / Banner -->
    <div class="bg-primary pt-24 pb-16 text-center text-white px-4 relative overflow-hidden">
        <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
        <div class="relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
           <h1 class="text-3xl md:text-5xl font-bold mb-4 font-khmer uppercase tracking-tight">{{ $t('library.title') }}</h1>
           <p class="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              {{ $t('library.subtitle') }}
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
                       :placeholder="$t('library.search_placeholder')" 
                       class="pl-12 h-14 text-lg rounded-xl border-border bg-muted/30 focus:bg-background transition-all font-medium"
                    />
                </div>
                <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <Button 
                       v-for="cat in (['all', 'proverb', 'history', 'buddhist_history', 'general'] as const)"
                       :key="cat"
                       variant="outline" 
                       :class="[
                         selectedCategory === cat 
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:bg-primary/90' 
                            : 'bg-background hover:bg-muted border-border text-muted-foreground'
                       ]"
                       @click="selectedCategory = cat"
                       class="rounded-xl px-6 h-12 font-semibold uppercase tracking-widest text-[10px] transition-all whitespace-nowrap"
                    >
                       {{ cat === 'all' ? $t('common.filter_all') : $t(`admin.library.${cat}`) }}
                    </Button>
                </div>
            </div>
       </div>

       <!-- Content Grid -->
       <div v-if="loading" class="flex justify-center py-24">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
       </div>

       <div v-else-if="filteredArticles.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
           <RouterLink v-for="article in filteredArticles" :key="article.id" :to="`/articles/${article.id}`" class="group h-full">
               <Card class="h-full overflow-hidden border-none shadow-sm ring-1 ring-border bg-card hover:shadow-2xl hover:ring-primary/20 transition-all duration-500 flex flex-col rounded-3xl">
                   <div class="aspect-video relative overflow-hidden bg-muted">
                       <img v-if="article.imageUrl" :src="article.imageUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground/20">
                           <BookOpenIcon class="h-16 w-16" />
                       </div>
                       <Badge class="absolute top-4 right-4 bg-background/90 text-foreground shadow-sm hover:bg-background border-none uppercase text-[9px] font-semibold tracking-widest px-3 py-1.5 backdrop-blur-md">
                           {{ getCategoryLabel(article.category) }}
                       </Badge>
                   </div>
                   <CardContent class="flex-1 p-8 flex flex-col text-left">
                       <h3 class="text-xl md:text-2xl font-semibold font-khmer mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-snug text-foreground">
                           {{ article.title }}
                       </h3>
                       <p class="text-muted-foreground line-clamp-3 text-sm font-medium leading-relaxed mb-8 flex-1">
                           {{ stripHtml(article.content) }}
                       </p>
                       <div class="flex items-center justify-between pt-6 border-t border-border">
                            <div class="flex items-center text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest tabular-nums italic">
                                <CalendarIcon class="h-3.5 w-3.5 mr-2 opacity-50" />
                                {{ formatDate(article.createdAt) }}
                            </div>
                            <span class="text-primary font-semibold uppercase tracking-widest text-[10px] flex items-center gap-2 group-hover:gap-3 transition-all">
                                {{ $t('common.read_more') }}
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
           <p class="text-muted-foreground font-semibold text-lg mb-6">{{ $t('library.empty') }}</p>
           <Button variant="outline" @click="selectedCategory = 'all'; searchQuery = ''" class="rounded-xl border-border px-8 font-semibold uppercase tracking-widest text-[10px] h-12 hover:bg-muted bg-background/50">
                {{ $t('common.reset_filters') }}
           </Button>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SearchIcon, BookOpenIcon, CalendarIcon, SearchXIcon, ArrowRightIcon } from 'lucide-vue-next'
import { formatKhmerDate } from '~/utils/date'
import { useArticles } from '~/composables/useArticles'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useI18n } from 'vue-i18n'

const { articles, loading, fetchArticles } = useArticles()
const searchQuery = ref('')
const selectedCategory = ref<string>('all')

const route = useRoute()
const router = useRouter()

onMounted(() => {
    fetchArticles()
    if (route.query.category) {
        selectedCategory.value = route.query.category as string
    }
    // Redirect if category is ceremony
    if (selectedCategory.value === 'ceremony') {
        router.push('/ceremonies')
    }
})

const filteredArticles = computed(() => {
    return articles.value.filter(article => {
        // Exclude ceremonies from library
        if (article.category === 'ceremony') return false

        // Filter by Category
        if (selectedCategory.value !== 'all' && article.category !== selectedCategory.value) {
            return false
        }
        // Filter by Search Query
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            return article.title.toLowerCase().includes(query) || article.content.toLowerCase().includes(query)
        }
        return true
    })
})

const { t } = useI18n()

const getCategoryLabel = (cat: string) => {
    switch (cat) {
        case 'ceremony': return t('admin.ceremonies.title')
        case 'proverb': return t('admin.library.proverb')
        case 'history': return t('admin.library.history')
        case 'buddhist_history': return t('admin.library.buddhist_history')
        default: return t('admin.library.general')
    }
}

const stripHtml = (html: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

const formatDate = (date: any) => formatKhmerDate(date)
</script>
