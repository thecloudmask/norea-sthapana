<template>
  <div class="container py-10">
    <div class="flex flex-col items-center justify-center text-center space-y-4 py-10">
      <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {{ $t('news.title') }}
      </h1>
      <p class="max-w-[700px] text-muted-foreground md:text-lg">
        {{ $t('news.subtitle') }}
      </p>
    </div>

    <!-- Filter Tabs -->
    <div class="flex justify-center mb-8">
      <Tabs default-value="all" class="w-full max-w-[400px]">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="all" @click="filterType = 'all'">{{ $t('common.filter_all') }}</TabsTrigger>
          <TabsTrigger value="event" @click="filterType = 'event'">{{ $t('admin.news.type_event') }}</TabsTrigger>
          <TabsTrigger value="news" @click="filterType = 'news'">{{ $t('admin.news.type_news') }}</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink v-for="item in filteredNews" :key="item.id" :to="`/news/${item.id}`" class="group h-full">
            <Card class="flex flex-col h-full overflow-hidden border-none shadow-sm transition-all hover:shadow-lg bg-card rounded-3xl ring-1 ring-border">
                <div class="aspect-video w-full bg-muted relative overflow-hidden">
                    <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div v-else class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <ImageIcon class="h-12 w-12 opacity-20" />
                    </div>
                    <div class="absolute top-2 right-2">
                        <Badge :variant="item.type === 'event' ? 'default' : 'secondary'" class="uppercase text-[10px] shadow-sm">
                            {{ item.type === 'event' ? $t('admin.news.type_event') : $t('admin.news.type_news') }}
                        </Badge>
                    </div>
                </div>
                
                <CardContent class="flex-1 p-6">
                    <div class="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <CalendarIcon class="h-3.5 w-3.5" />
                        <span>{{ formatDate(item.createdAt) }}</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-3 line-clamp-2">{{ item.title }}</h3>
                    <p class="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-4">
                        {{ stripHtml(item.content) }}
                    </p>
                    
                    <div v-if="item.type === 'event' && item.eventDate" class="bg-primary/5 p-3 rounded-lg border border-primary/10 flex items-center gap-3">
                        <div class="bg-primary/10 p-2 rounded-full text-primary">
                            <CalendarIcon class="h-5 w-5" />
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground font-medium uppercase">{{ $t('news.event_date') }}</p>
                            <p class="text-sm font-semibold text-primary">{{ formatDate(item.eventDate) }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </RouterLink>
    </div>
    
    <div v-if="!loading && filteredNews.length === 0" class="text-center py-20">
      <p class="text-muted-foreground">{{ $t('news.empty') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CalendarIcon, ImageIcon } from 'lucide-vue-next'
import { formatKhmerDate } from '~/utils/date'
import { useNews } from '~/composables/useNews'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const route = useRoute()
const router = useRouter()
const { newsList, loading, fetchNews } = useNews()
const filterType = ref('all')

onMounted(() => {
    fetchNews()
    if (route.query.type) filterType.value = route.query.type as string
})

watch(filterType, (val) => {
    const query: Record<string, string> = {}
    if (val && val !== 'all') query.type = val
    router.replace({ query })
})

const filteredNews = computed(() => {
    if (filterType.value === 'all') return newsList.value
    return newsList.value.filter(item => item.type === filterType.value)
})

const stripHtml = (html: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

const formatDate = (date: any) => formatKhmerDate(date)
</script>
