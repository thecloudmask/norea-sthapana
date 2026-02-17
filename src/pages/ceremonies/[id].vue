<template>
  <div class="min-h-screen bg-muted/30 pb-20 transition-colors duration-300">
    <div v-if="loading" class="flex justify-center py-40">
       <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
    </div>

    <article v-else-if="article" class="animate-in fade-in duration-700">
       <!-- Header Image -->
       <div class="h-[350px] md:h-[500px] w-full relative overflow-hidden bg-slate-950 cursor-pointer group" @click="openLightbox(article.imageUrl || 'https://images.unsplash.com/photo-1507692049790-de58293a469d?q=80&w=2070&auto=format&fit=crop')">
          <img :src="article.imageUrl || 'https://images.unsplash.com/photo-1507692049790-de58293a469d?q=80&w=2070&auto=format&fit=crop'" class="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 text-white">
                  <MaximizeIcon class="h-8 w-8" />
              </div>
          </div>
          <div class="absolute bottom-0 left-0 w-full p-6 md:p-12">
             <div class="container max-w-5xl mx-auto space-y-6 text-left">
                <div class="flex flex-wrap items-center gap-3">
                   <Badge class="bg-primary text-white border-none shadow-xl shadow-primary/20 px-4 py-1.5 uppercase tracking-widest text-[10px] font-black w-fit">{{ getCategoryLabel(article.category) }}</Badge>
                   <div v-if="article.location" class="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm shadow-lg shadow-black/20">
                      <MapPinIcon class="size-3 text-orange-400" />
                      <span>{{ article.location }}</span>
                   </div>
                </div>
                <h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl font-khmer max-w-4xl">{{ article.title }}</h1>
                <div class="flex items-center gap-6 mt-6 text-white/60 text-xs font-black uppercase tracking-widest text-left">
                   <div class="flex items-center gap-2">
                      <CalendarIcon class="h-4 w-4 text-primary" />
                      <span class="tabular-nums">{{ formatDateRange(article.eventDate, article.endDate) }}</span>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div class="container max-w-5xl -mt-12 relative z-10 px-4 mx-auto">
          <!-- Sections -->
          <div class="space-y-8">
              <!-- Invitation Section -->
              <div v-if="article.content" class="bg-card rounded-[2.5rem] shadow-2xl p-8 md:p-16 border border-border ring-1 ring-border/5">
                  <div class="flex items-center gap-4 mb-10">
                      <div class="h-px flex-1 bg-border/60"></div>
                      <span class="text-xs md:text-sm uppercase font-black tracking-[0.2em] whitespace-nowrap text-primary/80">{{ $t('admin.ceremonies.invitation_tab') }}</span>
                      <div class="h-px flex-1 bg-border/60"></div>
                  </div>
                  <div class="prose prose-xl dark:prose-invert max-w-none font-khmer leading-loose text-foreground/90 font-medium rik-editor-content" v-html="article.content"></div>
              </div>

              <!-- Schedule Section -->
              <div v-if="article.schedule" class="bg-card rounded-[2.5rem] shadow-2xl p-8 md:p-16 border border-border ring-1 ring-border/5">
                  <div class="flex items-center gap-4 mb-10">
                      <div class="h-px flex-1 bg-border/60"></div>
                      <span class="text-xs md:text-sm uppercase font-black tracking-[0.2em] whitespace-nowrap text-primary/80">{{ $t('admin.ceremonies.schedule_tab') }}</span>
                      <div class="h-px flex-1 bg-border/60"></div>
                  </div>
                  <div class="prose prose-xl dark:prose-invert max-w-none font-khmer leading-loose text-foreground/90 font-medium rik-editor-content" v-html="article.schedule"></div>
              </div>

              <!-- Committee Section -->
              <div v-if="article.committee" class="bg-card rounded-[2.5rem] shadow-2xl p-8 md:p-16 border border-border ring-1 ring-border/5">
                  <div class="flex items-center gap-4 mb-10">
                      <div class="h-px flex-1 bg-border/60"></div>
                      <span class="text-xs md:text-sm uppercase font-black tracking-[0.2em] whitespace-nowrap text-primary/80">{{ $t('admin.ceremonies.committee_tab') }}</span>
                      <div class="h-px flex-1 bg-border/60"></div>
                  </div>
                  <div class="prose prose-xl dark:prose-invert max-w-none font-khmer leading-loose text-foreground/90 font-medium rik-editor-content" v-html="article.committee"></div>
              </div>

              <!-- Action Footer -->
              <div class="bg-black dark:bg-white rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                  <div class="space-y-1 text-center md:text-left">
                      <h4 class="text-xl font-bold text-white dark:text-black font-khmer">{{ $t('common.read_details') }}</h4>
                      <p class="text-white/40 dark:text-black text-xs uppercase font-black tracking-widest">{{ $t('ceremonies.subtitle') }}</p>
                  </div>
                  
                  <div class="flex flex-wrap justify-center gap-4">
                      <Button variant="outline" size="icon" class="rounded-2xl transition-all hover:text-blue-500 hover:bg-blue-500/10 border-primary bg-white/5 text-primary dark:border-primary dark:bg-primary/5 dark:text-primary" @click="shareFacebook">
                         <FacebookIcon class="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" class="rounded-2xl transition-all hover:text-primary hover:bg-primary/10 border-primary bg-white/5 text-primary dark:border-primary dark:bg-primary/5 dark:text-primary" @click="copyLink">
                         <LinkIcon class="h-5 w-5" />
                      </Button>
                      <div class="w-px h-10 bg-white/10 hidden md:block mx-2"></div>
                      <RouterLink to="/ceremonies">
                        <Button class="rounded-2xl bg-white text-slate-900 hover:bg-white/90 h-10 px-6 font-black uppercase tracking-widest text-[10px]">
                            <ArrowLeftIcon class="h-3 w-3 mr-2" />
                            {{ $t('ceremonies.title') }}
                        </Button>
                      </RouterLink>
                  </div>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CalendarIcon, FacebookIcon, LinkIcon, ArrowLeftIcon, MapPinIcon, MaximizeIcon, XIcon } from 'lucide-vue-next'
import { formatKhmerDate } from '~/utils/date'
import { doc, getDoc } from 'firebase/firestore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { db } from '~/utils/firebase'

const route = useRoute()
const { t } = useI18n()

const article = ref<any>(null)
const loading = ref(true)

const fetchArticleById = async (id: string) => {
    loading.value = true
    try {
        const docRef = doc(db, 'articles', id)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
            article.value = { id: snap.id, ...snap.data() }
        }
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchArticleById(route.params.id as string)
})

const getCategoryLabel = (cat: string) => {
    switch (cat) {
        case 'ceremony': return t('ceremonies.title')
        default: return t('ceremonies.title')
    }
}

const formatDateRange = (start: any, end: any) => {
    if (!start) return ''
    const startD = start.toDate ? start.toDate() : new Date(start)
    const formattedStart = formatKhmerDate(startD, 'dd/MM/yyyy')
    
    if (!end) return formattedStart
    
    const endD = end.toDate ? end.toDate() : new Date(end)
    const formattedEnd = formatKhmerDate(endD, 'dd/MM/yyyy')
    
    if (formattedStart === formattedEnd) return formattedStart
    
    return `${formatKhmerDate(startD, 'dd')} - ${formattedEnd}`
}

// Share
const shareFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
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
.rik-editor-content p {
    margin-bottom: 1.5rem;
}
.rik-editor-content ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
}
.rik-editor-content ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
}
</style>
