<template>
  <div class="min-h-screen bg-muted/30 py-8 print:bg-white print:py-0 transition-colors duration-300">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Report Container -->
    <div v-else-if="project" class="report-container mx-auto bg-card shadow-2xl print:shadow-none print:bg-white rounded-3xl overflow-hidden animate-in fade-in duration-500" style="width: 210mm; min-height: 297mm;">
      <div class="p-10 md:p-14">
          <!-- Header -->
          <div class="report-header border-b-4 border-primary pb-8 mb-10">
            <div class="flex items-start justify-between mb-6">
              <!-- Logo -->
              <div class="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center print:bg-primary/20">
                <img v-if="logoUrl" :src="logoUrl" alt="Pagoda Logo" class="w-20 h-20 object-contain" />
                <div v-else class="text-4xl">🏛️</div>
              </div>
              
              <!-- Center Title -->
              <div class="flex-1 text-center px-4">
                <h1 class="text-3xl font-black text-primary mb-2 font-khmer">របាយការណ៍បិទគម្រោង</h1>
                <h2 class="text-xl font-bold text-foreground/80 mb-1 uppercase tracking-tight">Project Closure Report</h2>
                <h3 class="text-lg font-bold text-foreground/60 font-khmer">វត្តនរាធិបតី (Wat Narea Thipadee)</h3>
                <p class="text-xs font-black text-muted-foreground mt-4 uppercase tracking-widest italic">កាលបរិច្ឆេទ: {{ formatDate(new Date()) }}</p>
              </div>

              <!-- Status Badge -->
              <div class="w-24 flex justify-end">
                 <Badge 
                  :class="{
                    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20': project.status === 'active',
                    'bg-blue-500/10 text-blue-600 border-blue-500/20': project.status === 'completed',
                    'bg-rose-500/10 text-rose-600 border-rose-500/20': project.status === 'paused'
                  }"
                  class="px-3 py-1 uppercase tracking-wider text-[9px] font-bold border rounded-full"
                >
                  {{ $t('common.status_' + project.status) }}
                </Badge>
              </div>
            </div>
          </div>

          <!-- Project Info Section -->
          <div class="project-info bg-muted/40 p-8 rounded-2xl mb-10 border border-border print:bg-gray-50">
            <h4 class="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-6 border-b border-border/50 pb-2">ព័ត៌មានគម្រោង (Project Information)</h4>
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-1">
                <label class="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest block">ឈ្មោះគម្រោង (Project Title)</label>
                <p class="font-black text-xl text-foreground font-khmer leading-tight">{{ project.title }}</p>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest block">រយៈពេល (Duration)</label>
                <p class="font-bold text-foreground tabular-nums">{{ formatDate(project.startDate) }} - {{ formatDate(new Date()) }}</p>
              </div>
              <div class="col-span-2 space-y-1">
                <label class="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest block">ការពិពណ៌នា (Description)</label>
                <p class="text-foreground/80 font-medium leading-relaxed font-khmer">{{ project.description }}</p>
              </div>
            </div>
          </div>

          <!-- Financial Summary - 3 Big Boxes -->
          <div class="financial-summary grid grid-cols-3 gap-6 mb-10">
            <!-- Total Income -->
            <div class="summary-box border-2 border-emerald-500/20 bg-emerald-500/5 p-6 rounded-2xl print:border-emerald-400 print:bg-emerald-50">
              <div class="flex items-center gap-2 mb-4">
                <ArrowUpRight class="h-6 w-6 text-emerald-500" />
                <h5 class="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-khmer">ចំណូលសរុប</h5>
              </div>
              <div class="space-y-1">
                <p class="text-3xl font-black text-emerald-500 tabular-nums">${{ totalIncome.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
                <p v-if="totalIncome.khr > 0" class="text-xl font-bold text-emerald-400 tabular-nums">៛{{ totalIncome.khr.toLocaleString() }}</p>
              </div>
              <p class="text-[9px] font-black text-emerald-600/40 mt-4 uppercase tracking-widest">Total Income</p>
            </div>

            <!-- Total Expense -->
            <div class="summary-box border-2 border-rose-500/20 bg-rose-500/5 p-6 rounded-2xl print:border-rose-400 print:bg-rose-50">
              <div class="flex items-center gap-2 mb-4">
                <ArrowDownLeft class="h-6 w-6 text-rose-500" />
                <h5 class="text-[10px] font-black text-rose-600 uppercase tracking-widest font-khmer">ចំណាយសរុប</h5>
              </div>
              <div class="space-y-1">
                <p class="text-3xl font-black text-rose-500 tabular-nums">${{ totalExpense.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
                <p v-if="totalExpense.khr > 0" class="text-xl font-bold text-rose-400 tabular-nums">៛{{ totalExpense.khr.toLocaleString() }}</p>
              </div>
              <p class="text-[9px] font-black text-rose-600/40 mt-4 uppercase tracking-widest">Total Expense</p>
            </div>

            <!-- Net Balance -->
            <div class="summary-box border-2 p-6 rounded-2xl" :class="netBalance.usd >= 0 ? 'border-primary/20 bg-primary/5 print:border-primary/40 print:bg-primary/5' : 'border-orange-500/20 bg-orange-500/5 print:border-orange-400 print:bg-orange-50'">
              <div class="flex items-center gap-2 mb-4">
                <Wallet class="h-6 w-6" :class="netBalance.usd >= 0 ? 'text-primary' : 'text-orange-500'" />
                <h5 class="text-[10px] font-black uppercase tracking-widest font-khmer" :class="netBalance.usd >= 0 ? 'text-primary' : 'text-orange-600'">សាច់ប្រាក់នៅសល់</h5>
              </div>
              <div class="space-y-1">
                <p class="text-3xl font-black tabular-nums" :class="netBalance.usd >= 0 ? 'text-primary' : 'text-orange-500'">${{ Math.abs(netBalance.usd).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
                <p v-if="netBalance.khr !== 0" class="text-xl font-bold tabular-nums" :class="netBalance.usd >= 0 ? 'text-primary/70' : 'text-orange-400'">៛{{ Math.abs(netBalance.khr).toLocaleString() }}</p>
              </div>
              <p class="text-[9px] font-black mt-4 uppercase tracking-widest" :class="netBalance.usd >= 0 ? 'text-primary/40' : 'text-orange-600/40'">
                {{ netBalance.usd >= 0 ? 'Net Surplus' : 'Net Deficit' }}
              </p>
            </div>
          </div>

          <!-- Expense Breakdown Table -->
          <div class="expense-breakdown mb-10">
            <h4 class="text-lg font-black text-foreground mb-6 flex items-center gap-3 font-khmer">
              <div class="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <ReceiptIcon class="h-4 w-4" />
              </div>
              ការចំណាយតាមប្រភេទ (Expense Breakdown)
            </h4>
            <div class="overflow-hidden rounded-2xl border border-border">
              <table class="w-full">
                <thead class="bg-muted text-foreground/70 print:bg-gray-800 print:text-white">
                  <tr>
                    <th class="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest">ប្រភេទ (Category)</th>
                    <th class="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest">ចំនួនទឹកប្រាក់ USD</th>
                    <th class="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest">ចំនួនទឹកប្រាក់ KHR</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="(amounts, category) in expensesByCategory" :key="category" class="hover:bg-muted/30 transition-colors">
                    <td class="px-8 py-5 font-black text-foreground/80 uppercase tracking-wide text-xs">{{ getCategoryLabel(category) }}</td>
                    <td class="px-8 py-5 text-right font-black text-foreground tabular-nums">${{ amounts.usd.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</td>
                    <td class="px-8 py-5 text-right font-black text-foreground tabular-nums">៛{{ amounts.khr.toLocaleString() }}</td>
                  </tr>
                  <tr v-if="Object.keys(expensesByCategory).length === 0">
                    <td colspan="3" class="px-8 py-12 text-center text-muted-foreground/30 italic font-bold">មិនមានទិន្នន័យចំណាយ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Top Donors Honor List -->
          <div class="top-donors mb-10">
            <h4 class="text-lg font-black text-foreground mb-6 flex items-center gap-3 font-khmer">
              <div class="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                  <Trophy class="h-4 w-4" />
              </div>
              សប្បុរសជនកំពូល (Top Donors - Honor List)
            </h4>
            <div class="grid grid-cols-1 gap-4">
              <div v-for="(donor, index) in topDonors" :key="index" class="flex items-center gap-6 p-6 bg-muted/30 rounded-2xl border border-border group hover:bg-muted transition-colors print:bg-yellow-50">
                <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary text-white font-black flex items-center justify-center text-xl shadow-lg shadow-primary/20">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <p class="font-black text-lg text-foreground font-khmer">{{ donor.name }}</p>
                </div>
                <div class="text-right">
                  <p class="font-black text-2xl text-primary tabular-nums">{{ donor.currency === 'KHR' ? '៛' : '$' }}{{ donor.amount.toLocaleString() }}</p>
                </div>
              </div>
              <div v-if="topDonors.length === 0" class="text-center py-12 text-muted-foreground/30 font-bold italic">
                មិនមានទិន្នន័យបច្ច័យ
              </div>
            </div>
          </div>

          <!-- Signature Section -->
          <div class="signature-section mt-16 pt-12 border-t-2 border-border page-break-before">
            <div class="grid grid-cols-3 gap-12 text-center">
              <div>
                <p class="font-black text-foreground mb-24 font-khmer">ហេរញ្ញិក</p>
                <div class="border-t-2 border-border/50 pt-4">
                  <p class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Treasurer</p>
                </div>
              </div>
              <div>
                <p class="font-black text-foreground mb-24 font-khmer">ប្រធានគណៈកម្មការ</p>
                <div class="border-t-2 border-border/50 pt-4">
                  <p class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Committee Head</p>
                </div>
              </div>
              <div>
                <p class="font-black text-foreground mb-24 font-khmer">ព្រះចៅអធិការ</p>
                <div class="border-t-2 border-border/50 pt-4">
                  <p class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Abbot</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>

    <!-- Floating Print Button -->
    <Button 
      @click="handlePrint" 
      class="fixed bottom-10 right-10 h-16 w-16 rounded-3xl shadow-2xl print:hidden bg-primary hover:bg-orange-500 text-white shadow-primary/40 group overflow-hidden"
      size="icon"
    >
      <PrinterIcon class="size-6 transition-transform group-hover:scale-110" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjects } from '~/composables/useProjects'
import { format } from 'date-fns'
import { ArrowUpRight, ArrowDownLeft, Wallet, ReceiptIcon, Trophy, PrinterIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'


const route = useRoute()
const projectId = route.params.id as string

const { getProject, fetchDonations, fetchExpenses, donations, expenses } = useProjects()

const project = ref<any>(null)
const loading = ref(true)
const logoUrl = ref('/logo.png') // Update with actual logo path

// Fetch project data
onMounted(async () => {
  try {
    project.value = await getProject(projectId)
    
    // Fetch donations and expenses
    fetchDonations(projectId)
    fetchExpenses(projectId)
    
    loading.value = false
  } catch (e) {
    console.error(e)
    loading.value = false
  }
})

// Calculate total income
const totalIncome = computed(() => {
  let usd = 0
  let khr = 0
  
  donations.value.forEach((donation: any) => {
    const amount = Number(donation.amount) || 0
    if (donation.currency === 'KHR') {
      khr += amount
    } else {
      usd += amount
    }
  })
  
  return { usd, khr }
})

// Calculate total expense
const totalExpense = computed(() => {
  let usd = 0
  let khr = 0
  
  expenses.value.forEach((expense: any) => {
    const amount = Number(expense.amount) || 0
    if (expense.currency === 'KHR') {
      khr += amount
    } else {
      usd += amount
    }
  })
  
  return { usd, khr }
})

// Calculate net balance
const netBalance = computed(() => {
  return {
    usd: totalIncome.value.usd - totalExpense.value.usd,
    khr: totalIncome.value.khr - totalExpense.value.khr
  }
})

// Group expenses by category
const expensesByCategory = computed(() => {
  const grouped: Record<string, { usd: number; khr: number }> = {}
  
  expenses.value.forEach((expense: any) => {
    const category = expense.category || 'other'
    if (!grouped[category]) {
      grouped[category] = { usd: 0, khr: 0 }
    }
    
    const amount = Number(expense.amount) || 0
    if (expense.currency === 'KHR') {
      grouped[category].khr += amount
    } else {
      grouped[category].usd += amount
    }
  })
  
  return grouped
})

// Group expenses by category
const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    material: 'សម្ភារៈ (Materials)',
    labor: 'ថ្លៃឈ្នួល (Labor)',
    utility: 'ទឹកភ្លើង/ផ្សេងៗ (Utility)',
    other: 'ផ្សេងៗ (Other)'
  }
  return labels[category] || category
}

// Get top 5 donors
const topDonors = computed(() => {
  return [...donations.value]
    .sort((a: any, b: any) => {
      const amountA = Number(a.amount) || 0
      const amountB = Number(b.amount) || 0
      return amountB - amountA
    })
    .slice(0, 5)
    .map((d: any) => ({
      name: d.donorName,
      amount: Number(d.amount) || 0,
      currency: d.currency || 'USD'
    }))
})

// Helper functions
const formatDate = (date: any) => {
  if (!date) return 'N/A'
  const d = date.toDate ? date.toDate() : new Date(date)
  return format(d, 'dd/MM/yyyy')
}

const handlePrint = () => {
  window.print()
}
</script>

<style scoped>
/* Print Styles */
@media print {
  body {
    margin: 0;
    padding: 0;
  }
  
  .report-container {
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  
  /* Force background colors */
  .summary-box,
  .project-info,
  .top-donors > div,
  thead {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  /* Page breaks */
  .page-break-before {
    page-break-before: always;
  }
  
  /* Hide elements */
  .print\:hidden {
    display: none !important;
  }
}

@page {
  size: A4;
  margin: 0;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
