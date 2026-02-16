<template>
  <div class="min-h-screen bg-muted/30 pb-20 transition-colors duration-300">
    <div v-if="loading" class="flex justify-center py-40">
       <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
    </div>

    <article v-else-if="article" class="animate-in fade-in duration-700">
       <!-- Header Image -->
       <div class="h-[350px] md:h-[500px] w-full relative overflow-hidden bg-slate-950">
          <img :src="article.imageUrl || 'https://images.unsplash.com/photo-1507692049790-de58293a469d?q=80&w=2070&auto=format&fit=crop'" class="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div class="absolute bottom-0 left-0 w-full p-6 md:p-12">
             <div class="container max-w-5xl mx-auto space-y-6 text-left">
                <Badge class="bg-primary text-white border-none shadow-xl shadow-primary/20 px-4 py-1.5 uppercase tracking-widest text-[10px] font-black">{{ getCategoryLabel(article.category) }}</Badge>
                <h1 class="text-3xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl font-khmer max-w-4xl">{{ article.title }}</h1>
                <div class="flex items-center gap-6 mt-6 text-white/60 text-xs font-black uppercase tracking-widest">
                   <div class="flex items-center gap-2">
                      <CalendarIcon class="h-4 w-4 text-primary" />
                      <span class="tabular-nums">{{ formatDate(article.createdAt) }}</span>
                   </div>
                   <div class="flex items-center gap-2">
                      <UserIcon class="h-4 w-4 text-primary" />
                      <span>{{ article.author || 'Admin' }}</span>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div class="container max-w-5xl -mt-12 relative z-10 px-4 mx-auto">
          <!-- Main Content Card -->
          <div class="bg-card rounded-[2.5rem] shadow-2xl p-8 md:p-16 mb-12 border border-border ring-1 ring-border/5">
             
              <!-- Quote Generator (Proverb Only) -->
              <div v-if="article.category === 'proverb'" class="mb-16">
                 <div id="quote-card-container" class="relative group overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/10 transition-all hover:scale-[1.01] duration-500 ring-1 ring-border/10">
                     <!-- The Canvas Area -->
                     <div id="quote-card" class="bg-[#2c1810] p-10 md:p-20 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[450px]">
                         <!-- Background Texture -->
                         <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#ea580c 2px, transparent 2px); background-size: 30px 30px;"></div>
                         <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60"></div>
                         <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                         <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                         
                         <!-- Content -->
                         <div class="relative z-10 space-y-8 max-w-2xl px-4">
                             <QuoteIcon class="h-16 w-16 text-primary mx-auto opacity-80" />
                             <h2 class="text-3xl md:text-5xl font-black text-white font-khmer leading-snug drop-shadow-2xl tracking-wide">
                                 "{{ article.title }}"
                             </h2>
                             <div class="w-24 h-1.5 bg-primary/80 mx-auto rounded-full shadow-[0_0_15px_rgba(234,88,12,0.5)]"></div>
                             <p class="text-white/90 text-xl md:text-2xl font-medium italic font-khmer opacity-90 leading-relaxed">
                                 {{ article.content }}
                             </p>
                             <div class="pt-8">
                                <p class="text-primary text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                                    {{ $t('common.temple_name') }}
                                </p>
                             </div>
                         </div>
                     </div>

                     <!-- Overlay Action -->
                     <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-md">
                         <Button size="lg" class="bg-white text-black hover:bg-slate-100 font-black rounded-2xl h-14 px-10 gap-3 shadow-2xl shadow-white/20 uppercase tracking-widest text-xs" @click="downloadQuote">
                             <DownloadIcon class="h-5 w-5" />
                             {{ $t('article.download_quote') }}
                         </Button>
                     </div>
                 </div>
                 <p class="text-center text-[10px] font-black text-muted-foreground/40 mt-6 uppercase tracking-widest">
                     {{ $t('article.download_instruction') }}
                 </p>
              </div>

              <!-- Normal Content Body -->
              <div class="prose prose-lg dark:prose-invert max-w-none font-khmer leading-loose text-foreground/80 font-medium">
                 <p class="whitespace-pre-wrap">{{ article.content }}</p>
              </div>

              <!-- Share Section -->
              <div class="border-t border-border mt-16 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 px-2">
                 <div class="flex items-center gap-3">
                    <span class="font-black text-xs uppercase tracking-widest text-muted-foreground/60">{{ $t('article.share_label') }}:</span>
                    <div class="flex gap-3">
                        <Button variant="outline" size="icon" class="rounded-2xl transition-all hover:text-blue-500 hover:bg-blue-500/10 border-border bg-muted/30" @click="shareFacebook">
                           <FacebookIcon class="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" class="rounded-2xl transition-all hover:text-sky-500 hover:bg-sky-500/10 border-border bg-muted/30" @click="shareTwitter">
                           <TwitterIcon class="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" class="rounded-2xl transition-all hover:text-primary hover:bg-primary/10 border-border bg-muted/30" @click="copyLink">
                           <LinkIcon class="h-5 w-5" />
                        </Button>
                    </div>
                 </div>
                 
                 <RouterLink to="/articles" class="text-primary hover:opacity-70 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 bg-muted/50 px-6 py-3 rounded-2xl border border-border transition-all hover:gap-4">
                    <ArrowLeftIcon class="h-3 w-3" />
                    {{ $t('article.back_to_library') }}
                 </RouterLink>
              </div>
          </div>
       </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CalendarIcon, UserIcon, QuoteIcon, DownloadIcon, FacebookIcon, TwitterIcon, LinkIcon, ArrowLeftIcon } from 'lucide-vue-next'
import { formatKhmerDate } from '~/utils/date'
import * as htmlToImage from 'html-to-image'
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
        case 'proverb': return t('categories.proverb')
        case 'history': return t('categories.history')
        case 'buddhist_history': return t('categories.buddhist_history')
        default: return t('categories.general')
    }
}

const formatDate = (date: any) => formatKhmerDate(date)

// Quote Generator
const downloadQuote = async () => {
    const node = document.getElementById('quote-card')
    if (!node) return
    
    try {
        const dataUrl = await htmlToImage.toPng(node)
        const link = document.createElement('a')
        link.download = `quote-${article.value.id}.png`
        link.href = dataUrl
        link.click()
    } catch (error) {
        console.error('oops, something went wrong!', error)
    }
}

// Share
const shareFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}
const shareTwitter = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(article.value.title)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}
const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert(t('article.link_copied'))
}
</script>
