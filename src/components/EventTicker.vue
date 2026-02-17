<template>
  <div class="w-full bg-primary/95 backdrop-blur-sm text-white overflow-hidden relative border-b border-white/10">
    <div class="flex items-center h-9">
      <!-- Simple Label -->
      <div class="flex-shrink-0 h-full px-4 md:px-6 flex items-center gap-1.5 bg-white/10">
        <CalendarIcon class="h-3.5 w-3.5" />
        <span class="text-[10px] font-bold uppercase tracking-[0.15em]">{{ $t('events.upcoming') }}</span>
      </div>
      
      <!-- Scrolling Content -->
      <div class="flex-1 relative overflow-hidden">
        <!-- Show events if available -->
        <div 
          v-if="upcomingEvents.length > 0"
          class="flex gap-6 animate-scroll whitespace-nowrap py-2"
          :style="{ animationDuration: `${scrollDuration}s` }"
        >
          <!-- Multiple sets for continuous loop -->
          <template v-for="i in 12" :key="`set-${i}`">
            <div v-for="event in upcomingEvents" :key="`event-${i}-${event.id}`" class="flex items-center gap-2 px-3">
              <span class="text-xs font-medium">{{ event.title }}</span>
              <span class="text-[10px] opacity-50">•</span>
              <span class="text-[10px] font-semibold opacity-80">{{ formatDate(event.eventDate) }}</span>
            </div>
          </template>
        </div>
        
        <!-- Fallback message when no events - also scrolling -->
        <div v-else class="flex gap-6 animate-scroll whitespace-nowrap py-2" style="animation-duration: 40s;">
          <!-- Multiple sets for continuous loop -->
          <template v-for="i in 20" :key="`empty-${i}`">
            <div class="flex items-center gap-2 px-3">
              <span class="text-xs font-medium opacity-70">{{ $t('events.empty') }}</span>
            </div>
          </template>
        </div>
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

// Helper function to safely convert to Date
const toDate = (dateValue: any): Date => {
  if (!dateValue) return new Date()
  if (dateValue instanceof Date) return dateValue
  if (typeof dateValue === 'object' && 'toDate' in dateValue) {
    return dateValue.toDate()
  }
  return new Date(dateValue)
}

// Filter for upcoming events only
const upcomingEvents = computed(() => {
  const now = new Date()
  // Set now to start of day to include events happening today
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
    .slice(0, 5) // Show max 5 upcoming events
})

// Calculate scroll duration based on number of events
const scrollDuration = computed(() => {
  return Math.max(20, upcomingEvents.value.length * 8)
})

const formatDate = (date: any) => formatKhmerDate(date)
</script>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll linear infinite;
}

.animate-scroll:hover {
  animation-play-state: paused;
}
</style>
