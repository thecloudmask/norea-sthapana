<template>
  <div class="w-full bg-primary text-white overflow-hidden relative border-b border-white/10 h-9 flex items-center">
    <!-- Label -->
    <div class="flex-shrink-0 h-full px-4 md:px-6 flex items-center gap-1.5 bg-white/10 relative z-20 shadow-[4px_0_8px_rgba(0,0,0,0.1)] backdrop-blur-md">
      <CalendarIcon class="h-3.5 w-3.5" />
      <span class="text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap">{{ $t('events.upcoming') }}</span>
    </div>

    <!-- Scrolling Track -->
    <div class="flex-1 overflow-hidden relative h-full flex items-center">
      <div v-if="upcomingEvents.length > 0" class="flex whitespace-nowrap h-full items-center marquee-container">
        <!-- We use 3 copies to ensure a full screen is always covered even for short content -->
        <div class="marquee-content flex items-center">
          <template v-for="i in 4" :key="`set-${i}`">
            <div v-for="event in upcomingEvents" :key="`e-${i}-${event.id}`" class="flex items-center gap-2 px-10">
              <span class="text-xs font-semibold">{{ event.title }}</span>
              <span class="text-[10px] opacity-40">•</span>
              <span class="text-[10px] font-bold tracking-wider text-white/90">{{ formatDate(event.eventDate) }}</span>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="px-6 text-xs opacity-70 italic whitespace-nowrap">
        {{ $t('events.empty') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'
import { useArticles } from '~/composables/useArticles'
import { formatKhmerDate } from '~/utils/date'

const { articles, fetchArticles } = useArticles()

onMounted(() => {
  fetchArticles()
})

const toDate = (dateValue: any): Date => {
  if (!dateValue) return new Date()
  if (dateValue instanceof Date) return dateValue
  if (typeof dateValue === 'object' && 'toDate' in dateValue) {
    return dateValue.toDate()
  }
  return new Date(dateValue)
}

const upcomingEvents = computed(() => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  
  return articles.value
    .filter(item => {
      if (item.category !== 'ceremony' || !item.eventDate) return false
      const eventDate = toDate(item.eventDate)
      return eventDate >= now
    })
    .sort((a, b) => {
      const dateA = toDate(a.eventDate)
      const dateB = toDate(b.eventDate)
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, 10)
})

const formatDate = (date: any) => formatKhmerDate(date)
</script>

<style scoped>
.marquee-container {
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee-content {
  display: flex;
  width: max-content;
  animation: marquee 60s linear infinite;
  will-change: transform;
}

@keyframes marquee {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-25%, 0, 0); } /* We animate -25% because we have 4 sets (100% / 4) */
}

.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}
</style>
