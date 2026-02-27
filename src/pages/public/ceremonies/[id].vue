<template>
  <div>
    <div class="min-h-screen bg-muted/30 pb-20 transition-colors duration-300">
      <div v-if="loading" class="flex justify-center py-40">
         <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
      </div>
  
      <article v-else-if="ceremony" class="animate-in fade-in duration-700">
        <!-- Header Image -->
        <div
            class="h-[350px] md:h-[500px] w-full relative overflow-hidden bg-slate-950 group"
            :class="{ 'cursor-pointer': ceremony.imageUrl }"
            @click="ceremony.imageUrl && openLightbox(ceremony.imageUrl)"
        >
            <!-- Image -->
            <img
                v-if="ceremony.imageUrl"
                :src="ceremony.imageUrl"
                :alt="ceremony.title"
                loading="lazy"
                @error="imageError = true"
                class="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
            />

            <!-- Placeholder -->
            <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800"
            >
                <div class="flex flex-col items-center gap-4 text-white/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off-icon lucide-image-off"><line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="13.5" x2="6" y1="13.5" y2="21"/><line x1="18" x2="21" y1="12" y2="15"/><path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"/><path d="M21 15V5a2 2 0 0 0-2-2H9"/></svg>
                <span class="text-xs uppercase tracking-[0.3em] font-black">
                    No Ceremony Image
                </span>
                </div>
            </div>

            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            <!-- Hover Zoom Icon (only if image exists) -->
            <div
                v-if="ceremony.imageUrl"
                class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <div class="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 text-white">
                <MaximizeIcon class="h-8 w-8" />
                </div>
            </div>

            <!-- Content -->
            <div class="absolute bottom-0 left-0 w-full p-6 md:p-12">
                <div class="container max-w-5xl mx-auto space-y-6 text-left">
                <div class="flex flex-wrap items-center gap-3">
                    <Badge
                    class="bg-primary text-white border-none shadow-xl shadow-primary/20 px-4 py-1.5 uppercase tracking-widest text-[10px] font-black w-fit"
                    >
                    {{ $t('ceremonies.title') }}
                    </Badge>

                    <div
                    v-if="ceremony.type && ceremony.type !== 'general'"
                    class="bg-indigo-600/90 backdrop-blur-sm text-white shadow-xl px-4 py-1.5 uppercase tracking-widest text-[10px] font-black rounded-full font-khmer"
                    >
                    {{ getTypeName(ceremony.type) }}
                    </div>

                    <div
                    v-if="ceremony.location"
                    class="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm shadow-lg shadow-black/20"
                    >
                    <MapPinIcon class="size-3 text-orange-400" />
                    <span>{{ ceremony.location }}</span>
                    </div>
                </div>

                <h1
                    class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl font-khmer max-w-4xl"
                >
                    {{ ceremony.title }}
                </h1>

                <div class="flex items-center gap-6 mt-6 text-white/60 text-xs font-black uppercase tracking-widest">
                    <div class="flex items-center gap-2">
                    <CalendarIcon class="h-4 w-4 text-primary" />
                    <span class="tabular-nums">
                        {{ formatDateRange(ceremony.eventDate, ceremony.endDate) }}
                    </span>
                    </div>
                </div>
                </div>
            </div>
        </div>
         <div class="container max-w-5xl -mt-12 relative z-10 px-4 mx-auto">
            <!-- Sections -->
            <div class="space-y-8">
                <!-- Invitation Section -->
                <div v-if="ceremony.content" class="bg-card rounded-3xl shadow-sm p-8 md:p-16 border border-border ring-1 ring-border/5">
                    <div class="flex items-center gap-4 mb-10">
                        <div class="h-px flex-1 bg-border/60"></div>
                        <span class="text-xs md:text-sm uppercase font-black tracking-[0.2em] whitespace-nowrap text-primary/80">{{ $t('admin.ceremonies.invitation_tab') }}</span>
                        <div class="h-px flex-1 bg-border/60"></div>
                    </div>
                    <div class="prose prose-xl dark:prose-invert max-w-none font-khmer leading-loose text-foreground/90 font-medium rik-editor-content" v-html="ceremony.content"></div>
                </div>
  
                 <!-- Schedule Section -->
                <div v-if="ceremony.schedule" class="bg-card rounded-3xl shadow-sm p-8 md:p-16 border border-border ring-1 ring-border/5">
                    <div class="flex items-center gap-4 mb-10">
                        <div class="h-px flex-1 bg-border/60"></div>
                        <span class="text-xs md:text-sm uppercase font-black tracking-[0.2em] whitespace-nowrap text-primary/80">{{ $t('admin.ceremonies.schedule_tab') }}</span>
                        <div class="h-px flex-1 bg-border/60"></div>
                    </div>
                    <div class="prose prose-xl dark:prose-invert max-w-none font-khmer leading-loose text-foreground/90 font-medium rik-editor-content" v-html="ceremony.schedule"></div>
                </div>
  
                <!-- Committee Section -->
                <div v-if="ceremony.committee" class="bg-card rounded-3xl shadow-sm p-8 md:p-16 border border-border ring-1 ring-border/5">
                    <div class="flex items-center gap-4 mb-10">
                        <div class="h-px flex-1 bg-border/60"></div>
                        <span class="text-xs md:text-sm uppercase font-black tracking-[0.2em] whitespace-nowrap text-primary/80">{{ $t('admin.ceremonies.committee_tab') }}</span>
                        <div class="h-px flex-1 bg-border/60"></div>
                    </div>
                    <div class="prose prose-xl dark:prose-invert max-w-none font-khmer leading-loose text-foreground/90 font-medium rik-editor-content" v-html="ceremony.committee"></div>
                </div>


                <!-- Action Footer -->
                <div class="bg-black dark:bg-white rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div class="space-y-1 text-center md:text-left">
                        <h4 class="text-xl font-bold text-white dark:text-black font-khmer">{{ $t('common.read_details') }}</h4>
                        <p class="text-white/40 dark:text-black text-xs uppercase font-black tracking-widest">{{ $t('ceremonies.subtitle') }}</p>
                    </div>
                    
                    <div class="flex flex-wrap justify-center gap-4">
                        <Button variant="outline" size="icon" class="rounded-xl transition-all hover:text-blue-500 hover:bg-blue-500/10 border-primary bg-white/5 text-primary dark:border-primary dark:bg-primary/5 dark:text-primary" @click="shareFacebook">
                           <FacebookIcon class="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" class="rounded-xl transition-all hover:text-primary hover:bg-primary/10 border-primary bg-white/5 text-primary dark:border-primary dark:bg-primary/5 dark:text-primary" @click="copyLink">
                           <LinkIcon class="h-5 w-5" />
                        </Button>
                        <div class="w-px h-10 bg-white/10 hidden md:block mx-2"></div>
                        <RouterLink to="/ceremonies">
                          <Button class="rounded-xl bg-white text-slate-900 hover:bg-white/90 h-10 px-6 font-black uppercase tracking-widest text-[10px]">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { CalendarIcon, FacebookIcon, LinkIcon, ArrowLeftIcon, MapPinIcon, MaximizeIcon, XIcon } from 'lucide-vue-next'
import { formatKhmerDate } from '~/utils/date'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useCeremonies } from '~/composables/useCeremonies'

const route = useRoute()
const { t } = useI18n()

const ceremony = ref<any>(null)
const loading = ref(true)
const imageError = ref(false)
const { fetchCeremony } = useCeremonies()

let unsubscribe: any

const fetchCeremonyById = (id: string) => {
    loading.value = true
    unsubscribe = fetchCeremony(id, (data) => {
        ceremony.value = data
        loading.value = false
    })
}

const getTypeName = (type: string | undefined) => {
    switch (type) {
        case 'kathen': return 'កឋិនទាន'
        case 'vassa': return 'ចូល/ចេញវស្សា'
        case 'phchoum_ben': return 'ភ្ជុំបិណ្ឌ'
        case 'flower': return 'បុណ្យផ្កាប្រាក់'
        default: return 'បុណ្យទូទៅ'
    }
}

const stripHtml = (html: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

useHead({
  title: computed(() => ceremony.value?.title ? `${ceremony.value.title} - Narea Sthapana` : 'Narea Sthapana'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => ceremony.value?.content ? stripHtml(ceremony.value.content).substring(0, 160) : '') 
    },
    { 
      property: 'og:title', 
      content: computed(() => ceremony.value?.title || 'Narea Sthapana') 
    },
    { 
      property: 'og:image', 
      content: computed(() => ceremony.value?.imageUrl || '') 
    }
  ]
})

onMounted(() => {
    fetchCeremonyById(route.params.id as string)
})

onUnmounted(() => {
    if (unsubscribe) unsubscribe()
})



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
