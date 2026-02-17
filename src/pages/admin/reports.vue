<template>
  <div class="space-y-10 p-2 md:p-4 transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 class="text-3xl md:text-4xl font-medium text-foreground font-khmer">{{ t('admin.sidebar.reports') }}</h1>
        <p class="text-muted-foreground font-normal">{{ t('admin.dashboard_subtitle') }}</p>
    </div>

    <!-- Metrics Cards -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <!-- Revenue -->
        <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
                <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ t('admin.revenue') }}</CardTitle>
                <div class="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <DollarSignIcon class="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent class="pt-6">
                <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
                <div v-else class="space-y-1">
                    <div class="text-3xl font-medium text-foreground tabular-nums tracking-tight">{{ t('common.currency_usd') }} {{ totalRevenue.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                    <div class="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tighter">{{ t('common.currency_khr') }} {{ totalRevenue.khr.toLocaleString() }}</div>
                </div>
            </CardContent>
        </Card>

        <!-- Expenses -->
        <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
                <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ t('admin.expenses') }}</CardTitle>
                <div class="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                    <CreditCardIcon class="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent class="pt-6">
                <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
                <div v-else class="space-y-1">
                    <div class="text-3xl font-medium text-foreground tabular-nums tracking-tight text-rose-500">{{ t('common.currency_usd') }} {{ totalExpenses.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                    <div class="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tighter">{{ t('common.currency_khr') }} {{ totalExpenses.khr.toLocaleString() }}</div>
                </div>
            </CardContent>
        </Card>

        <!-- Balance -->
        <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/30">
                <CardTitle class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{{ t('admin.balance') }}</CardTitle>
                <div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <ActivityIcon class="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent class="pt-6">
                <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
                <div v-else class="space-y-1">
                    <div class="text-3xl font-medium tabular-nums tracking-tight font-sans text-primary">{{ t('common.currency_usd') }} {{ netBalance.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</div>
                    <div class="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-tighter">{{ t('common.currency_khr') }} {{ netBalance.khr.toLocaleString() }}</div>
                </div>
            </CardContent>
        </Card>
    </div>

    <div class="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-4 border-primary pl-4">Download Reports</div>

    <!-- Report Cards -->
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-left">
        <Card v-for="report in reportTypes" :key="report.id" class="rounded-3xl border-none ring-1 ring-border bg-card overflow-hidden hover:shadow-2xl transition-all group flex flex-col">
          <CardHeader class="p-8 flex-1">
            <div class="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 border border-primary/20">
              <component :is="report.icon" class="h-8 w-8" />
            </div>
            <CardTitle class="text-xl font-medium text-foreground tracking-tight font-khmer">{{ report.title }}</CardTitle>
            <CardDescription class="text-sm font-medium text-muted-foreground mt-2 leading-relaxed font-khmer">{{ report.description }}</CardDescription>
          </CardHeader>
          <CardFooter class="p-4 pt-0">
            <Button variant="ghost" class="w-full h-14 rounded-2xl justify-between group px-6 bg-muted/30 font-semibold uppercase tracking-widest text-[10px] hover:bg-primary/10 hover:text-primary transition-all" @click="handleExport(report.id)">
              <span>Download CSV</span>
              <DownloadIcon class="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </Button>
          </CardFooter>
        </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  DownloadIcon,
  DollarSignIcon,
  CreditCardIcon,
  ActivityIcon,
  FileBarChartIcon,
  ClipboardListIcon,
  PieChartIcon
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDonations } from '~/composables/useDonations'
import { useExpenses } from '~/composables/useExpenses'

const { t } = useI18n()
const { donations, fetchAllDonations, loading: loadingDonations } = useDonations()
const { expenses, fetchAllExpenses, loading: loadingExpenses } = useExpenses()
const loading = computed(() => loadingDonations.value || loadingExpenses.value)

// Metrics
const totalRevenue = computed(() => {
    const usd = donations.value.filter(d => d.currency !== 'KHR').reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
    const khr = donations.value.filter(d => d.currency === 'KHR').reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
    return { usd, khr }
})

const totalExpenses = computed(() => {
    const usd = expenses.value.filter(e => (e as any).currency !== 'KHR').reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    const khr = expenses.value.filter(e => (e as any).currency === 'KHR').reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    return { usd, khr }
})

const netBalance = computed(() => {
    return {
        usd: totalRevenue.value.usd - totalExpenses.value.usd,
        khr: totalRevenue.value.khr - totalExpenses.value.khr
    }
})

// Report Types using translations if possible, falling back to direct strings for now to match dashboard style
const reportTypes = computed(() => [
  { id: 'financial_summary', title: 'សង្ខេបហិរញ្ញវត្ថុ', description: 'របាយការណ៍បូកសរុបចំណូលចំណាយប្រចាំខែ', icon: FileBarChartIcon },
  { id: 'donation_list', title: 'បញ្ជីសប្បុរសជន', description: 'បញ្ជីរាយនាមសប្បុរសជនទាំងអស់', icon: ClipboardListIcon },
  { id: 'expense_audit', title: 'សមតុល្យចំណាយ', description: 'របាយការណ៍ចំណាយលម្អិតសម្រាប់ការចុះសវនកម្ម', icon: PieChartIcon },
])

const handleExport = (id: string) => {
  let headers: string[] = []
  let rows: any[][] = []
  let filename = `report-${id}-${new Date().toISOString().split('T')[0]}`

  if (id === 'donation_list') {
    headers = ['Date', 'Donor Name', 'Amount', 'Currency', 'Method', 'Type', 'Project ID']
    rows = donations.value.map(d => {
      const date = d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt || Date.now())
      return [
        date.toISOString().split('T')[0],
        d.donorName,
        d.amount,
        d.currency,
        d.paymentMethod,
        (d as any).type || 'cash',
        (d as any).projectId || 'N/A'
      ]
    })
  } else if (id === 'expense_audit') {
    headers = ['Date', 'Title', 'Amount', 'Currency', 'Category', 'Payee', 'Project ID']
    rows = expenses.value.map(e => {
      const date = e.createdAt?.toDate ? e.createdAt.toDate() : new Date(e.createdAt || Date.now())
      return [
        date.toISOString().split('T')[0],
        e.title,
        e.amount,
        (e as any).currency || 'USD',
        e.category,
        (e as any).payeeName || 'N/A',
        (e as any).projectId || 'N/A'
      ]
    })
  } else if (id === 'financial_summary') {
    headers = ['Category', 'USD Amount', 'KHR Amount']
    rows = [
      ['Total Revenue', totalRevenue.value.usd, totalRevenue.value.khr],
      ['Total Expenses', totalExpenses.value.usd, totalExpenses.value.khr],
      ['Net Balance', netBalance.value.usd, netBalance.value.khr]
    ]
  }

  if (rows.length === 0 && id !== 'financial_summary') {
    alert('No data available for this report.')
    return
  }

  const csvContent = "\uFEFF" // UTF-8 BOM for Excel Khmer support
    + headers.join(",") + "\n" 
    + rows.map(r => r.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
    fetchAllDonations()
    fetchAllExpenses()
})
</script>

<style scoped>
/* No scoped styles needed yet */
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
