<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useColorMode } from '@vueuse/core'
import {
  DownloadIcon,
  DollarSignIcon,
  CreditCardIcon,
  ActivityIcon,
  FileBarChartIcon,
  SearchIcon,
  CalendarIcon,
  Building2Icon,
  SparklesIcon,
  PrinterIcon
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDonations } from '~/composables/useDonations'
import { useExpenses } from '~/composables/useExpenses'
import { useProjects } from '~/composables/useProjects'
import { useCeremonyFinance } from '~/composables/useCeremonyFinance'
import { useArticles } from '~/composables/useArticles'
import { format } from 'date-fns'
import { useKhrRate } from '~/composables/useKhrRate'

const { t } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const route = useRoute()
const router = useRouter()
const { khrRate } = useKhrRate()
// Report Mode
const reportMode = ref<'projects' | 'ceremonies'>('projects')

// Composables
const { donations, fetchAllDonations, loading: loadingDonations } = useDonations()
const { expenses, fetchAllExpenses: fetchAllProjectExpenses, loading: loadingExpenses } = useExpenses()
const { projects, fetchProjects } = useProjects()

const { 
    incomes: ceremonyIncomes, 
    expenses: ceremonyExpenses, 
    fetchAllIncomes: fetchAllCeremonyIncomes, 
    fetchAllExpenses: fetchAllCeremonyExpenses,
    loading: loadingCeremonyFinance 
} = useCeremonyFinance()
const { articles, fetchArticles, loading: loadingArticles } = useArticles()

// Filter States
const selectedProject = ref('all')
const selectedCeremony = ref('all')
const startDate = ref('')
const endDate = ref('')
const searchQuery = ref('')
const listType = ref<'all' | 'income' | 'expense'>('all')

const loading = computed(() => 
    loadingDonations.value || 
    loadingExpenses.value || 
    loadingCeremonyFinance.value || 
    loadingArticles.value
)

const ceremonies = computed(() => articles.value.filter(a => a.category === 'ceremony'))

// Data Helpers
const toDate = (date: any) => {
  if (!date) return new Date(0)
  return date.toDate ? date.toDate() : new Date(date)
}

// Unified Active Data
const activeIncomes = computed(() => {
    if (reportMode.value === 'projects') {
        return donations.value.map(d => ({ ...d, _type: 'income', _source: 'project' }))
    } else {
        return ceremonyIncomes.value.map(i => ({ ...i, _type: 'income', _source: 'ceremony' }))
    }
})

const activeExpenses = computed(() => {
    if (reportMode.value === 'projects') {
        return expenses.value.map(e => ({ ...e, _type: 'expense', _source: 'project' }))
    } else {
        return ceremonyExpenses.value.map(e => ({ ...e, _type: 'expense', _source: 'ceremony' }))
    }
})

// Filtered Data
const filteredIncomes = computed(() => {
  return activeIncomes.value.filter(d => {
    const dDate = toDate(d.createdAt)
    const matchesEntity = reportMode.value === 'projects' 
        ? (selectedProject.value === 'all' || (d as any).projectId === selectedProject.value)
        : (selectedCeremony.value === 'all' || (d as any).ceremonyId === selectedCeremony.value)
        
    const matchesStart = !startDate.value || dDate >= new Date(startDate.value)
    const matchesEnd = !endDate.value || dDate <= new Date(endDate.value)
    const matchesSearch = !searchQuery.value || d.donorName.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    return matchesEntity && matchesStart && matchesEnd && matchesSearch
  })
})

const filteredExpenses = computed(() => {
  return activeExpenses.value.filter(e => {
    const eDate = toDate(e.createdAt)
    const matchesEntity = reportMode.value === 'projects'
        ? (selectedProject.value === 'all' || (e as any).projectId === selectedProject.value)
        : (selectedCeremony.value === 'all' || (e as any).ceremonyId === selectedCeremony.value)

    const matchesStart = !startDate.value || eDate >= new Date(startDate.value)
    const matchesEnd = !endDate.value || eDate <= new Date(endDate.value)
    const targetTitle = (e as any).title || (e as any).itemName || (e as any).donorName || ''
    const matchesSearch = !searchQuery.value || targetTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    return matchesEntity && matchesStart && matchesEnd && matchesSearch
  })
})

const displayedTransactions = computed(() => {
    let list: any[] = []
    if (listType.value === 'all') {
        list = [
            ...filteredIncomes.value.map(d => ({ ...d, _type: 'income' })),
            ...filteredExpenses.value.map(e => ({ ...e, _type: 'expense', donorName: (e as any).title || (e as any).itemName || (e as any).donorName }))
        ]
    } else if (listType.value === 'income') {
        list = filteredIncomes.value.map(d => ({ ...d, _type: 'income' }))
    } else {
        list = filteredExpenses.value.map(e => ({ ...e, _type: 'expense', donorName: (e as any).title || (e as any).itemName || (e as any).donorName }))
    }
    
    return list.sort((a,b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
})

// Metrics
const totalRevenue = computed(() => {
  const usd = filteredIncomes.value.filter(d => d.currency !== 'KHR').reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
  const khr = filteredIncomes.value.filter(d => d.currency === 'KHR').reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
  return { usd, khr }
})

const totalExpenses = computed(() => {
  const usd = filteredExpenses.value.filter(e => (e as any).currency !== 'KHR').reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  const khr = filteredExpenses.value.filter(e => (e as any).currency === 'KHR').reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  return { usd, khr }
})

const netBalance = computed(() => {
  return {
    usd: totalRevenue.value.usd - totalExpenses.value.usd,
    khr: totalRevenue.value.khr - totalExpenses.value.khr
  }
})

// Cash Flow: Opening Balance (Before Start Date)
const openingBalance = computed(() => {
    if (!startDate.value) return { usd: 0, khr: 0 }
    
    const start = new Date(startDate.value)
    
    // Filter ALL records before start date
    const prevIncomes = activeIncomes.value.filter(d => toDate(d.createdAt) < start)
    const prevExpenses = activeExpenses.value.filter(e => toDate(e.createdAt) < start)

    // Calculate Totals
    const incomeUSD = prevIncomes.filter(i => i.currency !== 'KHR').reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
    const incomeKHR = prevIncomes.filter(i => i.currency === 'KHR').reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
    
    const expenseUSD = prevExpenses.filter(e => (e as any).currency !== 'KHR').reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    const expenseKHR = prevExpenses.filter(e => (e as any).currency === 'KHR').reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

    return {
        usd: incomeUSD - expenseUSD,
        khr: incomeKHR - expenseKHR
    }
})

const closingBalance = computed(() => {
    return {
        usd: openingBalance.value.usd + netBalance.value.usd,
        khr: openingBalance.value.khr + netBalance.value.khr
    }
})

// Chart Data: Revenue Trend
const trendSeries = computed(() => {
    const groups: Record<string, number> = {}
    filteredIncomes.value.forEach(d => {
        const date = format(toDate(d.createdAt), 'MMM dd')
        const amount = d.currency === 'KHR' ? d.amount / khrRate.value : d.amount
        groups[date] = (groups[date] || 0) + amount
    })
    
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    return [{
        name: t('admin.revenue'),
        data: sortedDates.map(date => ({ x: date, y: Math.round(groups[date]) }))
    }]
})

const trendOptions = computed(() => ({
    chart: { 
        type: 'area', 
        toolbar: { show: false }, 
        zoom: { enabled: false }, 
        fontFamily: 'Inter, sans-serif',
        background: 'transparent'
    },
    theme: { mode: isDark.value ? 'dark' : 'light' },
    colors: [reportMode.value === 'projects' ? '#10b981' : '#8b5cf6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [20, 100] } },
    xaxis: { type: 'category', axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (val: number) => `$${val.toLocaleString()}` } },
    grid: { borderColor: 'rgba(0,0,0,0.05)', strokeDashArray: 4 },
    tooltip: { theme: 'light', x: { show: true } }
}))

// Chart Data: Income Breakdown
const incomeCategorySeries = computed(() => {
    const groups: Record<string, number> = {}
    filteredIncomes.value.forEach(d => {
        const method = (d as any).paymentMethod || 'cash'
        const amount = d.currency === 'KHR' ? d.amount / khrRate.value : d.amount
        groups[method] = (groups[method] || 0) + amount
    })
    return Object.values(groups)
})

const incomeCategoryOptions = computed(() => {
    const groups: Record<string, number> = {}
    filteredIncomes.value.forEach(d => {
        const method = (d as any).paymentMethod || 'cash'
        const amount = d.currency === 'KHR' ? d.amount / khrRate.value : d.amount
        groups[method] = (groups[method] || 0) + amount
    })
    return {
        chart: { type: 'donut', background: 'transparent' },
        theme: { mode: isDark.value ? 'dark' : 'light' },
        labels: Object.keys(groups).map(k => k.toUpperCase()),
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
        legend: { position: 'bottom', fontSize: '10px' },
        plotOptions: { pie: { donut: { size: '70%' } } },
        stroke: { show: false },
        dataLabels: { enabled: false }
    }
})

// Chart Data: Expense Categories
const categorySeries = computed(() => {
    const groups: Record<string, number> = {}
    filteredExpenses.value.forEach(e => {
        const amount = (e as any).currency === 'KHR' ? e.amount / khrRate.value : e.amount
        groups[e.category || 'other'] = (groups[e.category || 'other'] || 0) + amount
    })
    return Object.values(groups)
})

const categoryOptions = computed(() => {
    const groups: Record<string, number> = {}
    filteredExpenses.value.forEach(e => {
        const amount = (e as any).currency === 'KHR' ? e.amount / khrRate.value : e.amount
        groups[e.category || 'other'] = (groups[e.category || 'other'] || 0) + amount
    })
    return {
        chart: { type: 'donut', background: 'transparent' },
        theme: { mode: isDark.value ? 'dark' : 'light' },
        labels: Object.keys(groups).map(k => {
            if (reportMode.value === 'ceremonies') {
                return t(`admin.ceremony_finance.expense_categories.${k}`)
            }
            return t(`expense_categories.${k}`)
        }),
        colors: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1'],
        legend: { position: 'bottom', fontSize: '10px' },
        plotOptions: { pie: { donut: { size: '70%' } } },
        stroke: { show: false },
        dataLabels: { enabled: false }
    }
})

const handleExport = (id: string) => {
  let headers: string[] = []
  let rows: any[][] = []
  let filename = `report-${reportMode.value}-${id}-${format(new Date(), 'yyyy-MM-dd')}`

  if (id === 'donation_list') {
    headers = ['Date', 'Name', 'Amount', 'Currency', 'Method', 'Parent Entity']
    rows = filteredIncomes.value.map(d => {
      const parent = reportMode.value === 'projects' 
        ? projects.value.find(p => p.id === (d as any).projectId)?.title
        : ceremonies.value.find(c => c.id === (d as any).ceremonyId)?.title
      return [
        format(toDate(d.createdAt), 'yyyy-MM-dd HH:mm'),
        d.donorName,
        d.amount,
        d.currency,
        (d as any).paymentMethod || 'cash',
        parent || 'N/A'
      ]
    })
  } else if (id === 'expense_audit') {
    headers = ['Date', 'Title', 'Amount', 'Currency', 'Category', 'Payee', 'Parent Entity']
    rows = filteredExpenses.value.map(e => {
      const parent = reportMode.value === 'projects'
        ? projects.value.find(p => p.id === (e as any).projectId)?.title
        : ceremonies.value.find(c => c.id === (e as any).ceremonyId)?.title
      return [
        format(toDate(e.createdAt), 'yyyy-MM-dd HH:mm'),
        (e as any).title || (e as any).itemName || (e as any).donorName,
        e.amount,
        (e as any).currency || 'USD',
        e.category || 'other',
        (e as any).payeeName || (e as any).vendor || (e as any).paidBy || 'N/A',
        parent || 'N/A'
      ]
    })
  }

  const csvContent = "\uFEFF" 
    + headers.join(",") + "\n" 
    + rows.map(r => r.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement("a")
  link.setAttribute("href", URL.createObjectURL(blob))
  link.setAttribute("download", `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const printReport = () => {
    window.print()
}

onMounted(() => {
    fetchAllDonations()
    fetchAllProjectExpenses()
    fetchProjects()
    fetchAllCeremonyIncomes()
    fetchAllCeremonyExpenses()
    fetchArticles()
    // Read URL params on mount
    if (route.query.mode) reportMode.value = route.query.mode as 'projects' | 'ceremonies'
    if (route.query.project) selectedProject.value = route.query.project as string
    if (route.query.ceremony) selectedCeremony.value = route.query.ceremony as string
    if (route.query.start) startDate.value = route.query.start as string
    if (route.query.end) endDate.value = route.query.end as string
    if (route.query.q) searchQuery.value = route.query.q as string
    if (route.query.type) listType.value = route.query.type as 'all' | 'income' | 'expense'
})

// Sync all filter states to URL
watch([reportMode, selectedProject, selectedCeremony, startDate, endDate, searchQuery, listType], () => {
    const query: Record<string, string> = {}
    if (reportMode.value !== 'projects') query.mode = reportMode.value
    if (selectedProject.value !== 'all') query.project = selectedProject.value
    if (selectedCeremony.value !== 'all') query.ceremony = selectedCeremony.value
    if (startDate.value) query.start = startDate.value
    if (endDate.value) query.end = endDate.value
    if (searchQuery.value) query.q = searchQuery.value
    if (listType.value !== 'all') query.type = listType.value
    router.replace({ query })
})

// Reset entity filters when mode changes
watch(reportMode, () => {
    selectedProject.value = 'all'
    selectedCeremony.value = 'all'
})
</script>

<template>
  <div class="space-y-6 p-2 md:p-4 transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 pb-2 print:hidden">
      <div class="space-y-1">
        <h1 class="text-3xl md:text-4xl font-medium text-foreground font-khmer">{{ t('admin.sidebar.reports') }}</h1>
        <p class="text-muted-foreground font-normal">{{ t('admin.dashboard_subtitle') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" class="rounded-xl h-11 px-4 border-border bg-card shadow-sm hover:bg-muted font-medium" @click="printReport">
            <PrinterIcon class="mr-2 h-4 w-4" />
            <span class="hidden sm:inline">Print Report</span>
        </Button>
        <Button variant="outline" class="rounded-xl h-11 px-6 border-border bg-card shadow-sm hover:bg-muted font-medium" @click="handleExport('donation_list')">
            <DownloadIcon class="mr-2 h-4 w-4" />
            <span class="hidden sm:inline">Export Income</span>
        </Button>
        <Button variant="outline" class="rounded-xl h-11 px-6 border-border bg-card shadow-sm hover:bg-muted font-medium" @click="handleExport('expense_audit')">
            <DownloadIcon class="mr-2 h-4 w-4" />
            <span class="hidden sm:inline">Export Expenses</span>
        </Button>
      </div>
    </div>

    <!-- Print Header (Visible only on print) -->
    <div class="hidden print:block text-center mb-8 border-b border-black pb-4">
        <h1 class="text-2xl font-bold font-khmer uppercase mb-1">របាយការណ៍ហិរញ្ញវត្ថុ</h1>
        <h2 class="text-xl font-bold uppercase text-gray-600">Financial Report</h2>
        <div class="flex justify-center gap-8 mt-4 text-sm font-medium">
            <p>From: {{ startDate ? format(new Date(startDate), 'dd/MM/yyyy') : 'Beginning' }}</p>
            <p>To: {{ endDate ? format(new Date(endDate), 'dd/MM/yyyy') : 'Now' }}</p>
        </div>
    </div>

    <!-- Mode Toggle -->
    <div class="flex justify-center md:justify-start print:hidden">
        <Tabs v-model="reportMode" class="w-fit bg-muted/50 p-1 rounded-2xl ring-1 ring-border">
            <TabsList class="bg-transparent h-12 gap-1 rounded-xl">
                <TabsTrigger value="projects" class="rounded-lg px-6 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 uppercase text-[10px] font-bold tracking-widest h-10">
                    <Building2Icon class="size-3.5" />
                    Construction Projects
                </TabsTrigger>
                <TabsTrigger value="ceremonies" class="rounded-lg px-6 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 uppercase text-[10px] font-bold tracking-widest h-10">
                    <SparklesIcon class="size-3.5" />
                    Ceremony Events
                </TabsTrigger>
            </TabsList>
        </Tabs>
    </div>

    <!-- Filters Bar -->
    <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden print:hidden">
        <CardContent class="p-4 md:p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="space-y-2">
                    <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                        {{ reportMode === 'projects' ? 'Project' : 'Ceremony Event' }}
                    </label>
                    
                    <Select v-if="reportMode === 'projects'" v-model="selectedProject">
                        <SelectTrigger class="rounded-xl h-11 bg-muted/30 border-none ring-1 ring-border/50 focus:ring-primary">
                            <SelectValue placeholder="All Projects" />
                        </SelectTrigger>
                        <SelectContent class="rounded-xl">
                            <SelectItem value="all">All Projects</SelectItem>
                            <SelectItem v-for="p in projects" :key="p.id" :value="p.id!">
                                {{ p.title }}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select v-else v-model="selectedCeremony">
                        <SelectTrigger class="rounded-xl h-11 bg-muted/30 border-none ring-1 ring-border/50 focus:ring-primary">
                            <SelectValue placeholder="All Ceremonies" />
                        </SelectTrigger>
                        <SelectContent class="rounded-xl">
                            <SelectItem value="all">All Ceremonies</SelectItem>
                            <SelectItem v-for="c in ceremonies" :key="c.id" :value="c.id!">
                                {{ c.title }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">From Date</label>
                    <div class="relative">
                        <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <Input type="date" v-model="startDate" class="rounded-xl h-11 pl-10 bg-muted/30 border-none ring-1 ring-border/50 focus:ring-primary" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">To Date</label>
                    <div class="relative">
                        <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <Input type="date" v-model="endDate" class="rounded-xl h-11 pl-10 bg-muted/30 border-none ring-1 ring-border/50 focus:ring-primary" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Search</label>
                    <div class="relative">
                        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <Input v-model="searchQuery" placeholder="Search donors or titles..." class="rounded-xl h-11 pl-10 bg-muted/30 border-none ring-1 ring-border/50 focus:ring-primary" />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Cash Flow Statement Card -->
    <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden print:ring-black print:shadow-none print:break-inside-avoid">
        <CardHeader class="pb-4 bg-muted/20 border-b border-border/50">
            <CardTitle class="text-lg font-medium tracking-tight font-khmer uppercase">របាយការណ៍លំហូរសាច់ប្រាក់ (Cash Flow Statement)</CardTitle>
        </CardHeader>
        <CardContent class="p-0">
            <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
                <!-- USD Column -->
                <div class="p-6 space-y-4">
                    <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">USD Currency</p>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-muted-foreground">Opening Balance</span>
                        <span class="font-mono font-medium" :class="openingBalance.usd >= 0 ? 'text-primary' : 'text-rose-500'">
                            ${{ openingBalance.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-muted-foreground">+ Total Income</span>
                        <span class="font-mono font-medium text-emerald-500">
                            ${{ totalRevenue.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-muted-foreground">- Total Expenses</span>
                        <span class="font-mono font-medium text-rose-500">
                            ${{ totalExpenses.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                        </span>
                    </div>
                    <div class="pt-4 border-t border-dashed border-border flex justify-between items-center">
                        <span class="text-sm font-bold uppercase">Closing Balance</span>
                        <span class="font-mono font-bold text-lg" :class="closingBalance.usd >= 0 ? 'text-foreground' : 'text-rose-500'">
                            ${{ closingBalance.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                        </span>
                    </div>
                </div>

                <!-- KHR Column -->
                <div class="p-6 space-y-4">
                    <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">KHR Currency</p>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-muted-foreground">Opening Balance</span>
                        <span class="font-mono font-medium" :class="openingBalance.khr >= 0 ? 'text-primary' : 'text-rose-500'">
                            ៛{{ openingBalance.khr.toLocaleString() }}
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-muted-foreground">+ Total Income</span>
                        <span class="font-mono font-medium text-emerald-500">
                            ៛{{ totalRevenue.khr.toLocaleString() }}
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-muted-foreground">- Total Expenses</span>
                        <span class="font-mono font-medium text-rose-500">
                            ៛{{ totalExpenses.khr.toLocaleString() }}
                        </span>
                    </div>
                    <div class="pt-4 border-t border-dashed border-border flex justify-between items-center">
                        <span class="text-sm font-bold uppercase">Closing Balance</span>
                        <span class="font-mono font-bold text-lg" :class="closingBalance.khr >= 0 ? 'text-foreground' : 'text-rose-500'">
                            ៛{{ closingBalance.khr.toLocaleString() }}
                        </span>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Metrics Grid -->
    <div class="grid gap-6 md:grid-cols-3 print:hidden">
        <!-- Revenue Card -->
        <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/20">
                <CardTitle class="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{{ t('admin.ceremony_finance.total_income') }}</CardTitle>
                <div class="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                    <DollarSignIcon class="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent class="pt-6">
                <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
                <div v-else class="space-y-1">
                    <div class="flex items-center gap-2">
                        <div class="text-3xl font-medium text-foreground tabular-nums tracking-tight">
                            {{ t('common.currency_usd') }} {{ totalRevenue.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                        </div>
                    </div>
                    <div class="text-lg font-medium text-muted-foreground/60 tabular-nums">
                        {{ t('common.currency_khr') }} {{ totalRevenue.khr.toLocaleString() }}
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Expenses Card -->
        <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/20">
                <CardTitle class="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{{ t('admin.ceremony_finance.total_expense') }}</CardTitle>
                <div class="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-sm shadow-red-500/10">
                    <CreditCardIcon class="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent class="pt-6">
                <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
                <div v-else class="space-y-1">
                    <div class="text-3xl font-medium text-foreground tabular-nums tracking-tight text-rose-500">
                        {{ t('common.currency_usd') }} {{ totalExpenses.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                    </div>
                    <div class="text-lg font-medium text-muted-foreground/60 tabular-nums">
                        {{ t('common.currency_khr') }} {{ totalExpenses.khr.toLocaleString() }}
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Net Balance Card -->
        <Card class="rounded-3xl border-none ring-1 ring-border shadow-sm bg-card overflow-hidden group transition-all">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3 bg-muted/20">
                <CardTitle class="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{{ t('admin.ceremony_finance.balance') }}</CardTitle>
                <div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-sm shadow-blue-500/10">
                    <ActivityIcon class="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent class="pt-6">
                <div v-if="loading" class="h-16 w-full bg-muted animate-pulse rounded-2xl"></div>
                <div v-else class="space-y-1">
                    <div class="text-3xl font-medium tabular-nums tracking-tight font-sans" :class="netBalance.usd >= 0 ? 'text-primary' : 'text-rose-500'">
                        {{ t('common.currency_usd') }} {{ netBalance.usd.toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                    </div>
                    <div class="text-lg font-medium text-muted-foreground/60 tabular-nums">
                        {{ t('common.currency_khr') }} {{ netBalance.khr.toLocaleString() }}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>

    <!-- Charts Row -->
    <div class="grid gap-6 lg:grid-cols-12">
        <!-- Revenue Trend -->
        <Card class="lg:col-span-12 rounded-3xl border-none ring-1 ring-border bg-card shadow-sm overflow-hidden">
            <CardHeader class="pb-2">
                <CardTitle class="text-xl font-medium text-foreground uppercase tracking-tight font-khmer">និន្នាការហិរញ្ញវត្ថុ (Revenue Trend)</CardTitle>
                <CardDescription class="text-xs font-medium text-muted-foreground">ផ្អែកតាមការច្រោះទិន្នន័យ (Based on current filters)</CardDescription>
            </CardHeader>
            <CardContent class="pb-6">
                <div class="h-[300px] w-full mt-4">
                    <apexchart 
                        v-if="trendSeries[0].data.length > 0"
                        type="area" 
                        height="300" 
                        :options="trendOptions" 
                        :series="trendSeries" 
                    />
                    <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-4 bg-muted/5 rounded-2xl border border-dashed border-border/50">
                        <FileBarChartIcon class="size-10 opacity-20" />
                        <span class="text-[10px] font-bold uppercase tracking-widest">No data for selected range</span>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Income Breakdown -->
        <Card class="lg:col-span-6 rounded-3xl border-none ring-1 ring-border bg-card shadow-sm overflow-hidden flex flex-col">
            <CardHeader class="pb-2">
                <CardTitle class="text-xl font-medium text-foreground uppercase tracking-tight font-khmer">ការបែងចែកចំណូល (Income)</CardTitle>
                <CardDescription class="text-xs font-medium text-muted-foreground">តាមមធ្យោបាយបង់ប្រាក់ (By payment method)</CardDescription>
            </CardHeader>
            <CardContent class="flex-1 flex flex-col justify-center py-6">
                <div v-if="incomeCategorySeries.length > 0" class="w-full">
                    <apexchart 
                        type="donut" 
                        height="400" 
                        :options="incomeCategoryOptions" 
                        :series="incomeCategorySeries" 
                    />
                </div>
                <div v-else class="flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 bg-muted/5 rounded-2xl border border-dashed border-border/50 min-h-[300px]">
                    <ActivityIcon class="size-10 opacity-20" />
                    <span class="text-[10px] font-bold uppercase tracking-widest">No income record found</span>
                </div>
            </CardContent>
        </Card>

        <!-- Category Breakdown -->
        <Card class="lg:col-span-6 rounded-3xl border-none ring-1 ring-border bg-card shadow-sm overflow-hidden flex flex-col">
            <CardHeader class="pb-2">
                <CardTitle class="text-xl font-medium text-foreground uppercase tracking-tight font-khmer">ការបែងចែកចំណាយ (Expenses)</CardTitle>
                <CardDescription class="text-xs font-medium text-muted-foreground">តាមប្រភេទចំណាយ (By category)</CardDescription>
            </CardHeader>
            <CardContent class="flex-1 flex flex-col justify-center py-6">
                <div v-if="categorySeries.length > 0" class="w-full">
                    <apexchart 
                        type="donut" 
                        height="400" 
                        :options="categoryOptions" 
                        :series="categorySeries" 
                    />
                </div>
                <div v-else class="flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 bg-muted/5 rounded-2xl border border-dashed border-border/50 min-h-[300px]">
                    <ActivityIcon class="size-10 opacity-20" />
                    <span class="text-[10px] font-bold uppercase tracking-widest">No expense found</span>
                </div>
            </CardContent>
        </Card>
    </div>

    <!-- Detailed List Section -->
    <Card class="rounded-3xl border-none ring-1 ring-border bg-card shadow-sm overflow-hidden">
        <CardHeader class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 bg-muted/5">
            <div>
                <CardTitle class="text-lg font-medium tracking-tight font-khmer">ប្រតិបត្តិការលម្អិត (Detailed Transactions)</CardTitle>
                <CardDescription class="text-xs font-medium text-muted-foreground mt-1">Donations & Expenses matching your filters</CardDescription>
            </div>
            
            <Tabs v-model="listType" class="bg-muted/30 p-1 rounded-xl ring-1 ring-border/50">
                <TabsList class="bg-transparent h-9 gap-1 rounded-lg">
                    <TabsTrigger value="all" class="rounded-md px-4 uppercase text-[9px] font-bold tracking-widest h-7">All</TabsTrigger>
                    <TabsTrigger value="income" class="rounded-md px-4 uppercase text-[9px] font-bold tracking-widest h-7 text-emerald-500 data-[state=active]:bg-emerald-500/10">Income</TabsTrigger>
                    <TabsTrigger value="expense" class="rounded-md px-4 uppercase text-[9px] font-bold tracking-widest h-7 text-rose-500 data-[state=active]:bg-rose-500/10">Expense</TabsTrigger>
                </TabsList>
            </Tabs>
        </CardHeader>
        <CardContent class="p-0">
            <div class="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 z-10">
                        <tr>
                            <th class="p-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                            <th class="p-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description / Donor</th>
                            <th class="p-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Property</th>
                            <th class="p-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/50">
                        <!-- Mixed List -->
                        <tr v-for="item in displayedTransactions" :key="item.id" class="hover:bg-muted/30 transition-colors group">
                            <td class="p-4 px-6">
                                <span class="text-xs font-medium tabular-nums text-muted-foreground/60">{{ format(toDate(item.createdAt), 'dd MMM yyyy HH:mm') }}</span>
                            </td>
                            <td class="p-4 px-6">
                                <div class="flex flex-col">
                                    <span class="text-sm font-medium text-foreground font-khmer">{{ item.donorName }}</span>
                                    <div class="flex items-center gap-2 mt-0.5">
                                        <div class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider" :class="item._type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'">
                                            {{ item._type }}
                                        </div>
                                        <span class="text-[9px] font-medium text-muted-foreground/40 italic">
                                            {{ item._type === 'income' ? ((item as any).paymentMethod || 'cash') : (item as any).category }}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td class="p-4 px-6">
                                <span class="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                                    {{ 
                                        reportMode === 'projects' 
                                        ? projects.find(p => p.id === (item as any).projectId)?.title || 'No Project'
                                        : ceremonies.find(c => c.id === (item as any).ceremonyId)?.title || 'No Ceremony'
                                    }}
                                </span>
                            </td>
                            <td class="p-4 px-6 text-right">
                                <div class="flex flex-col items-end">
                                    <span class="text-sm font-bold tabular-nums" :class="item._type === 'income' ? 'text-foreground' : 'text-rose-500'">
                                        <span class="text-[10px] font-medium mr-1 opacity-50">{{ item.currency === 'KHR' ? 'áŸ›' : '$' }}</span>{{ item.amount.toLocaleString() }}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Empty state for list -->
            <div v-if="displayedTransactions.length === 0" class="py-20 flex flex-col items-center justify-center text-muted-foreground/20 gap-4">
                <SearchIcon class="size-12 opacity-10" />
                <span class="text-[10px] font-bold uppercase tracking-[0.3em]">No matching transactions</span>
            </div>
        </CardContent>
    </Card>
  </div>
</template>

<style>
@media print {
    /* Hide layout elements that are outside this component if possible via global connection.
       Since we can't easily target Nuxt layout elements from a scoped style without :global/deep,
       we use global selectors.
    */
    aside, header, nav, .sidebar, .header, .layout-sidebar, .layout-header {
        display: none !important;
    }
    main {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: none !important;
        overflow: visible !important;
    }
    body {
        background: white !important;
        color: black !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    /* Hide scrollbars */
    ::-webkit-scrollbar { display: none; }

    /* Ensure cards break properly */
    .card, .p-card {
        break-inside: avoid;
        box-shadow: none !important;
        border: 1px solid #000 !important;
    }
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
