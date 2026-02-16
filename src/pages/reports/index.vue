<template>
  <div class="min-h-screen bg-muted/30 transition-colors duration-300">
    <!-- Header / Banner -->
    <div class="bg-primary pt-24 pb-16 text-center text-white px-4 relative overflow-hidden">
        <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
        <div class="relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
           <h1 class="text-3xl md:text-5xl font-black mb-4 font-khmer uppercase tracking-tight">{{ $t('reports_page.title') }}</h1>
           <p class="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              {{ $t('reports_page.subtitle') }}
           </p>
        </div>
    </div>

    <div class="container -mt-8 relative z-10 pb-20 px-4 md:px-6">
       
       <!-- Content Grid -->
       <div v-if="loading" class="flex justify-center py-24">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
       </div>

       <!-- Donations List -->
       <div v-else class="space-y-8">
           <Card class="bg-card border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader class="border-b border-border bg-muted/30 p-6">
                    <div class="flex items-center justify-between">
                        <CardTitle class="text-xl font-bold flex items-center gap-2">
                             <HeartHandshakeIcon class="h-5 w-5 text-primary" />
                             {{ $t('reports_page.donations') }}
                        </CardTitle>
                        <Badge variant="outline" class="font-mono">{{ donations.length }} Records</Badge>
                    </div>
                </CardHeader>
                <div class="divide-y divide-border">
                    <div v-for="item in donations" :key="item.id" class="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                        <div class="flex items-center gap-4">
                            <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {{ item.donorName.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                                <h3 class="font-bold text-foreground">{{ item.donorName }}</h3>
                                <p class="text-xs text-muted-foreground">{{ formatDate(item.createdAt) }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                             <p class="font-bold font-mono text-lg" :class="item.currency === 'USD' ? 'text-emerald-600' : 'text-blue-600'">
                                {{ item.currency === 'USD' ? '$' : '៛' }}{{ item.amount.toLocaleString() }}
                             </p>
                             <Badge variant="secondary" class="text-[9px] uppercase tracking-wider">{{ item.paymentMethod }}</Badge>
                        </div>
                    </div>

                     <div v-if="donations.length === 0" class="py-12 text-center text-muted-foreground">
                        {{ $t('reports_page.empty') }}
                    </div>
                </div>
           </Card>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { HeartHandshakeIcon } from 'lucide-vue-next'
import { formatKhmerDate } from '~/utils/date'
import { useDonations } from '~/composables/useDonations'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const { donations, loading, fetchAllDonations } = useDonations()

onMounted(() => {
    fetchAllDonations()
})

const formatDate = (date: any) => formatKhmerDate(date)
</script>
