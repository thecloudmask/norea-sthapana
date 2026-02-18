<template>
  <div>
    <div class="min-h-screen bg-muted/30 pb-20 transition-colors duration-300">
      <div v-if="loading" class="flex justify-center py-40">
         <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
      </div>
  
      <article v-else-if="newsItem" class="animate-in fade-in duration-700">
         <!-- Header Image -->
         <div class="h-[350px] md:h-[500px] w-full relative overflow-hidden bg-slate-950 cursor-pointer group" @click="openLightbox(newsItem.imageUrl || 'https://images.unsplash.com/photo-1507692049790-de58293a469d?q=80&w=2070&auto=format&fit=crop')">
            <img :src="newsItem.imageUrl || 'https://images.unsplash.com/photo-1507692049790-de58293a469d?q=80&w=2070&auto=format&fit=crop'" class="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div class="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 text-white">
                     <MaximizeIcon class="h-8 w-8" />
                 </div>
            </div>
            <div class="absolute bottom-0 left-0 w-full p-6 md:p-12">
               <div class="container max-w-5xl mx-auto space-y-6 text-left">
                  <Badge :variant="newsItem.type === 'event' ? 'default' : 'secondary'" class="bg-primary text-white border-none shadow-xl shadow-primary/20 px-4 py-1.5 uppercase tracking-widest text-[10px] font-black w-fit">
                      {{ newsItem.type === 'event' ? $t('admin.news.type_event') : $t('admin.news.type_news') }}
                  </Badge>
                  <h1 class="text-3xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl font-khmer max-w-4xl">{{ newsItem.title }}</h1>
                  <div class="flex items-center gap-6 mt-6 text-white/60 text-xs font-black uppercase tracking-widest">
                     <div class="flex items-center gap-2">
                        <CalendarIcon class="h-4 w-4 text-primary" />
                        <span class="tabular-nums">{{ formatDate(newsItem.createdAt) }}</span>
                     </div>
                     <div v-if="newsItem.eventDate" class="flex items-center gap-2">
                         <HistoryIcon class="h-4 w-4 text-primary" />
                         <span>{{ formatDate(newsItem.eventDate) }}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
  
         <div class="container max-w-5xl -mt-12 relative z-10 px-4 mx-auto">
            <!-- Main Content Card -->
            <div class="bg-card rounded-3xl shadow-sm p-8 md:p-16 mb-12 border border-border ring-1 ring-border/5">
                <!-- Normal Content Body -->
                <div class="prose prose-xl dark:prose-invert max-w-none font-khmer leading-loose text-foreground/90 font-medium rich-text-content" v-html="newsItem.content"></div>
  
                <!-- Share Section -->
                <div class="border-t border-border mt-16 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 px-2">
                   <div class="flex items-center gap-3">
                      <span class="font-black text-xs uppercase tracking-widest text-muted-foreground/60">{{ $t('article.share_label') }}:</span>
                      <div class="flex gap-3">
                          <Button variant="outline" size="icon" class="rounded-xl transition-all hover:text-blue-500 hover:bg-blue-500/10 border-border bg-muted/30" @click="shareFacebook">
                             <FacebookIcon class="h-5 w-5" />
                          </Button>
                          <Button variant="outline" size="icon" class="rounded-xl transition-all hover:text-sky-500 hover:bg-sky-500/10 border-border bg-muted/30" @click="shareTwitter">
                             <TwitterIcon class="h-5 w-5" />
                          </Button>
                          <Button variant="outline" size="icon" class="rounded-xl transition-all hover:text-primary hover:bg-primary/10 border-border bg-muted/30" @click="copyLink">
                             <LinkIcon class="h-5 w-5" />
                          </Button>
                      </div>
                   </div>
                   
                   <RouterLink to="/news" class="text-primary hover:opacity-70 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 bg-muted/50 px-6 py-3 rounded-xl border border-border transition-all hover:gap-4">
                      <ArrowLeftIcon class="h-3 w-3" />
                      {{ $t('news.title') }}
                   </RouterLink>
                </div>
            </div>
         </div>
      </article>
    </div>
  
    <!-- Lightbox -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showLightbox" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12" @click="showLightbox = false">
          <button class="absolute top-8 right-8 text-white/60 hover:text-white transition-colors bg-white/10 p-4 rounded-2xl border border-white/10">
              <XIcon class="h-6 w-6" />
          </button>
          <img :src="lightboxImage" class="max-w-full max-h-full object-contain rounded-lg animate-in fade-in zoom-in duration-500 shadow-2xl" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { CalendarIcon, HistoryIcon, FacebookIcon, TwitterIcon, LinkIcon, ArrowLeftIcon, MaximizeIcon, XIcon } from 'lucide-vue-next'
import { formatKhmerDate } from '~/utils/date'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useNews } from '~/composables/useNews'

const route = useRoute()
const { t } = useI18n()

const newsItem = ref<any>(null)
const loading = ref(true)
const { getNews } = useNews()

const fetchNewsById = async (id: string) => {
    loading.value = true
    try {
        const data = await getNews(id)
        if (data) {
            newsItem.value = data
        }
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const stripHtml = (html: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

useHead({
  title: computed(() => newsItem.value?.title ? `${newsItem.value.title} - Narea Sthapana` : 'Narea Sthapana'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => newsItem.value?.content ? stripHtml(newsItem.value.content).substring(0, 160) : '') 
    },
    { 
      property: 'og:title', 
      content: computed(() => newsItem.value?.title || 'Narea Sthapana') 
    },
    { 
      property: 'og:image', 
      content: computed(() => newsItem.value?.imageUrl || '') 
    }
  ]
})

onMounted(() => {
    fetchNewsById(route.params.id as string)
})

const formatDate = (date: any) => formatKhmerDate(date)

// Share
const shareFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}
const shareTwitter = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(newsItem.value.title)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}
const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert(t('article.link_copied'))
}

// Lightbox Logic
const showLightbox = ref(false)
const lightboxImage = ref('')
const openLightbox = (url: string) => {
    lightboxImage.value = url
    showLightbox.value = true
}
</script>

<style>
.rich-text-content p {
    margin-bottom: 1.5rem;
    text-align: inherit;
}
.rich-text-content ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
}
.rich-text-content ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
}
</style>
