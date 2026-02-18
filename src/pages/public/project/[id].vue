<template>
  <div class="min-h-screen bg-muted/30 pb-20 transition-colors duration-300">
    <div v-if="loading" class="flex justify-center py-40">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>

    <div v-else-if="project" class="animate-in fade-in duration-500">
      <!-- Banner -->
      <div class="relative h-[250px] md:h-[400px] w-full overflow-hidden">
        <img :src="project.bannerUrl || 'https://images.unsplash.com/photo-1542125387-c71a34d5218d?q=80&w=2070&auto=format&fit=crop'" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/40 flex items-end">
          <div class="container pb-20 md:pb-24">
            <h1 class="text-3xl md:text-5xl font-black text-white drop-shadow-lg">{{ project.title }}</h1>
          </div>
        </div>
      </div>

      <div class="container -mt-10 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
           <div class="lg:col-span-2 space-y-8">
             <Card class="bg-card">
               <CardHeader>
                 <CardTitle class="text-foreground">{{ $t('projects.description_title') }}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p class="text-muted-foreground leading-relaxed whitespace-pre-wrap">{{ project.description }}</p>
               </CardContent>
             </Card>

             <!-- Project Updates Timeline -->
             <Card v-if="updates.length > 0" class="overflow-hidden border-none shadow-md ring-1 ring-border bg-card">
               <CardHeader class="pb-2 bg-muted/50 border-b border-border">
                 <div class="flex items-center gap-2">
                   <div class="p-2 bg-indigo-500/10 rounded-full text-indigo-600 dark:text-indigo-400">
                     <CheckIcon class="w-4 h-4" />
                   </div>
                   <CardTitle class="text-lg font-bold text-foreground">{{ $t('projects.updates_title') }}</CardTitle>
                 </div>
               </CardHeader>
               <CardContent class="p-0">
                 <div class="divide-y divide-border">
                   <div v-for="update in updates" :key="update.id" class="p-6 group hover:bg-muted/50 transition-colors">
                     <div class="flex flex-col gap-4">
                       <div class="flex items-center justify-between">
                          <h4 class="font-bold text-foreground text-lg">{{ update.title }}</h4>
                          <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full border border-border">{{ formatDate(update.createdAt) }}</span>
                       </div>
                       
                       <div v-if="update.imageUrl" class="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
                         <img :src="update.imageUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                       </div>
                       
                       <p class="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">{{ update.description }}</p>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>

             <!-- Progress Card -->
             <Card class="overflow-hidden border-none shadow-md ring-1 ring-border bg-card">
               <CardHeader class="pb-2 bg-muted/50 border-b border-border">
                 <div class="flex items-center justify-between">
                   <div class="flex items-center gap-2">
                     <div class="p-2 bg-primary/10 rounded-full text-primary">
                       <TrendingUp class="w-4 h-4" />
                     </div>
                     <CardTitle class="text-lg font-bold text-foreground">{{ $t('projects.progress_title') }}</CardTitle>
                   </div>
                   <Badge variant="secondary" class="font-bold text-primary bg-primary/5 border-primary/20 text-sm px-3 py-1">
                     {{ Math.min(progress, 100).toFixed(0) }} {{ $t('projects.percent_complete') }}
                   </Badge>
                 </div>
               </CardHeader>
               <CardContent class="space-y-6 pt-6">
                   <!-- Progress Bar -->
                  <div class="relative pt-2">
                    <Progress :model-value="progress" class="h-4 rounded-full bg-muted" />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Received Block -->
                    <div class="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 flex flex-col gap-3">
                      <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                        <DollarSign class="w-4 h-4" />
                        <span>{{ $t('projects.total_received') }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">$ {{ totalDonations.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
                        <span v-if="totalDonations.khr > 0" class="text-sm font-bold text-emerald-600/60 font-mono">៛ {{ totalDonations.khr.toLocaleString() }}</span>
                      </div>
                    </div>

                    <!-- Expenses Block -->
                    <div class="bg-rose-500/10 rounded-xl p-4 border border-rose-500/20 flex flex-col gap-3">
                      <div class="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium text-sm">
                        <CreditCard class="w-4 h-4" />
                        <span>{{ $t('admin.expenses') }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">$ {{ totalExpenses.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
                        <span v-if="totalExpenses.khr > 0" class="text-sm font-bold text-rose-600/60 font-mono">៛ {{ totalExpenses.khr.toLocaleString() }}</span>
                      </div>
                    </div>

                    <!-- Balance Block -->
                    <div class="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 flex flex-col gap-3">
                      <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
                        <Wallet class="w-4 h-4" />
                        <span>{{ $t('admin.balance') }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">$ {{ (totalDonations.usd - totalExpenses.usd).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
                        <span v-if="totalDonations.khr > 0 || totalExpenses.khr > 0" class="text-sm font-bold text-blue-600/60 font-mono">៛ {{ (totalDonations.khr - totalExpenses.khr).toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Goal info -->
                  <div class="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border italic text-muted-foreground text-sm">
                    <div class="flex items-center gap-2">
                        <Target class="w-4 h-4" />
                        <span>{{ $t('projects.goal_title') }}: ${{ project.goalAmount.toLocaleString() }}</span>
                    </div>
                    <span>{{ $t('projects.goal_subtitle') }}</span>
                  </div>
               </CardContent>
             </Card>

             <!-- Top Donors -->
             <Card v-if="topDonors.length > 0" class="overflow-hidden border-none shadow-md ring-1 ring-amber-500/20 bg-amber-500/10">
               <CardHeader class="pb-2 bg-amber-500/5 border-b border-amber-500/20">
                 <div class="flex items-center gap-2">
                   <div class="p-2 bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400">
                     <Trophy class="w-4 h-4" />
                   </div>
                   <CardTitle class="text-lg font-bold text-amber-800 dark:text-amber-300">{{ $t('projects.top_donors') }}</CardTitle>
                 </div>
               </CardHeader>
               <CardContent class="p-0">
                 <div class="divide-y divide-amber-500/10">
                   <div v-for="(donor, index) in topDonors" :key="donor.id" class="p-4 flex items-center justify-between hover:bg-amber-500/10 transition-colors">
                     <div class="flex items-center space-x-4">
                       <div class="relative">
                         <div class="h-12 w-12 rounded-full border-2 border-amber-500/30 bg-background flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-lg shadow-sm">
                           {{ (donor.donorName || '?').charAt(0).toUpperCase() }}
                         </div>
                         <div class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm border border-white dark:border-slate-900">
                           {{ index + 1 }}
                         </div>
                       </div>
                       <div>
                         <p class="font-bold text-base text-amber-900 dark:text-amber-100">{{ donor.donorName }}</p>
                         <p class="text-[10px] text-amber-600 font-medium uppercase tracking-wider">{{ getDonationTypeLabel(donor) }}</p>
                       </div>
                     </div>
                     <div class="text-right">
                        <p class="font-black text-lg text-amber-600 dark:text-amber-400 drop-shadow-sm font-mono">
                         {{ donor.currency === 'KHR' ? '៛' : '$' }} {{ Number(donor.amount).toLocaleString() }}
                       </p>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>

             <!-- Recent Donors Table-like Card -->
             <Card class="overflow-hidden border-none shadow-md ring-1 ring-border bg-card">
               <CardHeader class="pb-2 bg-muted/50 border-b border-border">
                 <div class="flex items-center gap-2">
                   <div class="p-2 bg-orange-500/10 rounded-full text-orange-600">
                     <Users class="w-4 h-4" />
                   </div>
                   <CardTitle class="text-lg font-bold text-foreground">{{ $t('projects.recent_donors') }}</CardTitle>
                 </div>
               </CardHeader>
               <CardContent class="p-0">
                 <div class="divide-y divide-border">
                   <div v-for="donor in donations.slice(0, 10)" :key="donor.id" class="p-4 flex items-center justify-between hover:bg-muted/50 transition-all duration-200 group">
                     <div class="flex items-center space-x-4">
                       <!-- Avatar -->
                       <div class="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground font-bold shadow-sm group-hover:scale-110 transition-transform">
                         {{ (donor.donorName || '?').charAt(0).toUpperCase() }}
                       </div>
                       
                       <!-- Info -->
                       <div>
                         <p class="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{{ donor.donorName }}</p>
                         <div class="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                           <Calendar class="w-3 h-3" />
                           <span>{{ formatDate(donor.createdAt) }}</span>
                         </div>
                       </div>
                     </div>

                     <!-- Amount & Type -->
                     <div class="text-right flex flex-col items-end">
                       <p class="font-bold text-base tabular-nums font-mono" :class="donor.currency === 'KHR' ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'">
                         {{ donor.currency === 'KHR' ? '៛' : '$' }} {{ (Number(donor.amount) || 0).toLocaleString() }}
                       </p>
                       <div class="flex items-center gap-1 mt-1">
                         <Badge variant="outline" class="text-[9px] h-4 px-1.5 font-normal bg-background border-border uppercase">
                           {{ getDonationTypeLabel(donor) }}
                         </Badge>
                         <span v-if="donor.type === 'item' && donor.itemName" class="text-[10px] text-muted-foreground italic">
                           ({{ donor.itemName }}{{ donor.itemQty ? `: ${donor.itemQty}` : '' }})
                         </span>
                       </div>
                     </div>
                   </div>

                   <!-- Empty State -->
                   <div v-if="donations.length === 0" class="p-12 text-center flex flex-col items-center justify-center text-muted-foreground gap-3">
                     <div class="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30">
                       <Users class="w-6 h-6" />
                     </div>
                     <span class="text-sm font-medium">{{ $t('projects.no_donors') }}</span>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>

           <!-- Sidebar (Donation Info) -->
           <div class="space-y-6">
             <Card class="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 sticky top-24 overflow-hidden">
               <div class="absolute top-0 right-0 p-4 opacity-10">
                 <HeartIcon :size="120" />
               </div>
               <CardHeader class="relative z-10 text-center">
                 <CardTitle class="text-2xl font-black text-white">{{ $t('donation.join_title') }}</CardTitle>
                 <CardDescription class="text-primary-foreground/70">{{ $t('donation.scan_subtitle') }}</CardDescription>
               </CardHeader>
               <CardContent class="relative z-10 space-y-6">
                 <div class="bg-white rounded-2xl p-4 aspect-square flex flex-col items-center justify-center shadow-inner">
                   <img v-if="project.qrCodeUrl" :src="project.qrCodeUrl" class="w-full h-full object-contain" />
                   <div v-else class="flex flex-col items-center justify-center text-slate-300 space-y-2">
                     <QrCodeIcon :size="64" />
                     <span class="text-xs">{{ $t('donation.no_qr') }}</span>
                   </div>
                 </div>

                 <div class="space-y-4">
                    <div class="flex items-center space-x-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                      <HeartIcon class="text-white" :size="24" />
                      <span class="font-medium text-sm">{{ $t('donation.thank_you') }}</span>
                    </div>
                    <p class="text-center text-[10px] text-primary-foreground/60 leading-tight">
                      {{ $t('donation.disclaimer') }}
                    </p>
                 </div>
               </CardContent>
             </Card>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { QrCodeIcon, HeartIcon, Target, TrendingUp, Users, Calendar, DollarSign, Trophy, CheckIcon, CreditCard, Wallet } from 'lucide-vue-next'
import { formatKhmerDate } from '~/utils/date'
import { useRoute } from 'vue-router'
import { useProjects } from '@/composables/useProjects'
import { useI18n } from 'vue-i18n'
import { useKhrRate } from '~/composables/useKhrRate'

const route = useRoute()
const { getProject, donations, fetchDonations, fetchUpdates, updates, expenses, fetchExpenses } = useProjects()
const { t } = useI18n()
const { khrRate } = useKhrRate()

const project = ref<any>(null)
const loading = ref(true)

const totalDonations = computed(() => {
  return donations.value.reduce((acc, d) => {
    const amount = Number(d.amount) || 0
    if (d.currency === 'KHR') {
      acc.khr += amount
    } else {
      acc.usd += amount
    }
    return acc
  }, { usd: 0, khr: 0 })
})

const totalExpenses = computed(() => {
  return expenses.value.reduce((acc, e) => {
    const amount = Number(e.amount) || 0
    if (e.currency === 'KHR') {
      acc.khr += amount
    } else {
      acc.usd += amount
    }
    return acc
  }, { usd: 0, khr: 0 })
})

const topDonors = computed(() => {
  return [...donations.value]
    .sort((a, b) => {
        const valA = Number(a.amount) / (a.currency === 'KHR' ? khrRate.value : 1)
        const valB = Number(b.amount) / (b.currency === 'KHR' ? khrRate.value : 1)
        return valB - valA
    })
    .slice(0, 3)
})

const progress = computed(() => {
  if (!project.value?.goalAmount) return 0
  const totalInUsd = totalDonations.value.usd + (totalDonations.value.khr / khrRate.value)
  return (totalInUsd / project.value.goalAmount) * 100
})

let unsubscribe: any
let unsubUpdates: any
let unsubExpenses: any

onMounted(async () => {
  const data = await getProject(route.params.id as string)
  if (data) {
    project.value = data
    unsubscribe = fetchDonations(data.id!)
    unsubUpdates = fetchUpdates(data.id!)
    unsubExpenses = fetchExpenses(data.id!)
  }
  loading.value = false
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  if (unsubUpdates) unsubUpdates()
  if (unsubExpenses) unsubExpenses()
})

const getDonationTypeLabel = (donor: any) => {
  if (donor.type === 'item') return t('donation.type_item')
  if (donor.paymentMethod === 'qr') return t('donation.type_qr')
  if (donor.paymentMethod === 'transfer') return t('donation.type_transfer')
  return t('donation.type_cash')
}

const formatDate = (date: any) => formatKhmerDate(date)
</script>
