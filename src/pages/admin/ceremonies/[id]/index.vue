<template>
  <div class="container py-10 space-y-10 min-h-screen">
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
      <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">{{ $t('common.processing') }}...</p>
    </div>

    <template v-else-if="ceremony">
      <!-- Standard Detail Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in duration-700">
        <div class="space-y-4">
          <RouterLink :to="`/admin/ceremonies`" class="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeftIcon class="h-3.5 w-3.5" /> 
            {{ $t('admin.ceremonies.title') }}
          </RouterLink>
          
          <div>
            <h1 class="text-4xl font-bold text-foreground font-khmer tracking-tight">
              {{ ceremony.title }}
            </h1>
            <div class="flex items-center gap-3 mt-1">
               <Badge variant="outline" class="rounded-lg bg-primary/5 text-primary border-primary/10">
                  {{ displayDate(ceremony.eventDate) }}
               </Badge>
               <span v-if="ceremony.location" class="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                  <MapPinIcon class="size-3.5" />
                  {{ ceremony.location }}
               </span>
            </div>
          </div>
        </div>
        
        <div class="flex flex-wrap items-center gap-3">
            <Button 
              class="h-11 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
              @click="handleAddIncome"
            >
              <PlusIcon class="mr-2 h-5 w-5" />
              {{ $t('admin.ceremony_finance.add_income') }}
            </Button>
            <Button 
              variant="outline" 
              class="h-11 px-8 border-rose-200 bg-card text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 font-bold rounded-2xl shadow-sm transition-all"
              @click="handleAddExpense"
            >
              <MinusIcon class="mr-2 h-4 w-4" />
              {{ $t('admin.ceremony_finance.add_expense') }}
            </Button>
        </div>
      </div>

      <!-- Detail View Table (Reduced version for standard Page) -->
      <div class="mt-4">
         <CeremonyFinanceTab 
            :ceremonyId="(route.params.id as string)" 
            @add-income="handleAddIncome"
            @add-expense="handleAddExpense"
            @edit-income="handleEditIncome"
            @edit-expense="handleEditExpense"
         />
      </div>

      
    </template>

    <div v-else class="py-24 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <FileXIcon class="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-medium text-foreground">{{ $t('admin.ceremonies.not_found') }}</h3>
      <p class="text-muted-foreground mt-1">{{ $t('admin.ceremonies.not_found_desc') }}</p>
      <Button variant="outline" class="mt-4" @click="router.push('/admin/ceremonies')">
        {{ $t('admin.back_to_ceremonies') }}
      </Button>
    </div>

    <!-- Inner Modals (Shared for both views) -->
    <Teleport to="body">
        <AddIncomeModal 
          :open="showAddIncomeModal"
          @update:open="val => !val && handleCloseIncome()"
          :ceremony-id="ceremony?.id || ''"
          :user-id="user?.uid || ''"
          :initial-data="editingIncome"
          @success="() => {}"
        />

        <AddExpenseModal 
          :open="showAddExpenseModal"
          @update:open="val => !val && handleCloseExpense()"
          :ceremony-id="ceremony?.id || ''"
          :user-id="user?.uid || ''"
          :initial-data="editingExpense"
          @success="() => {}"
        />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'
import { storeToRefs } from 'pinia'
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  PlusIcon, 
  MinusIcon,
  FileXIcon,
  MonitorPlayIcon
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CeremonyFinanceTab from '@/components/CeremonyFinanceTab.vue'
import AddIncomeModal from '@/components/AddIncomeModal.vue'
import AddExpenseModal from '@/components/AddExpenseModal.vue'
import { useCeremonyFinance } from '~/composables/useCeremonyFinance'
import { useArticles, type Article } from '~/composables/useArticles'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { formatKhmerDate } from '~/utils/date'
import type { CeremonyIncome, CeremonyExpense } from '~/types/ceremonyFinance'

const route = useRoute()
const router = useRouter()
const { getArticle } = useArticles()
const authStore = useAuthStore()
const uiStore = useUIStore()
const { user } = storeToRefs(authStore)
const { t } = useI18n()
const { fetchIncomes } = useCeremonyFinance()

const displayDate = (date: any) => {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : new Date(date)
  const lang = t('common.locale_key')
  if (lang === 'km') {
    return formatKhmerDate(d)
  }
  return format(d, 'dd MMMM yyyy')
}

const ceremonyId = route.params.id as string
const ceremony = ref<Article | null>(null)
const loading = ref(true)

const showAddIncomeModal = ref(false)
const showAddExpenseModal = ref(false)
const editingIncome = ref<CeremonyIncome | null>(null)
const editingExpense = ref<CeremonyExpense | null>(null)

// Safe date helper
const toDate = (t: any) => t?.toDate ? t.toDate() : new Date(t || Date.now())

const handleAddIncome = () => {
  editingIncome.value = null
  showAddIncomeModal.value = true
}

const handleAddExpense = () => {
  editingExpense.value = null
  showAddExpenseModal.value = true
}

const handleEditIncome = (income: CeremonyIncome) => {
  editingIncome.value = {
     ...income,
     createdAt: toDate(income.createdAt),
     updatedAt: income.updatedAt ? toDate(income.updatedAt) : undefined
  }
  showAddIncomeModal.value = true
}

const handleEditExpense = (expense: CeremonyExpense) => {
  editingExpense.value = {
      ...expense,
      createdAt: toDate(expense.createdAt),
      updatedAt: expense.updatedAt ? toDate(expense.updatedAt) : undefined,
      paidDate: expense.paidDate ? toDate(expense.paidDate) : undefined
  }
  showAddExpenseModal.value = true
}

const handleCloseIncome = () => {
  showAddIncomeModal.value = false
  editingIncome.value = null
}

const handleCloseExpense = () => {
  showAddExpenseModal.value = false
  editingExpense.value = null
}

onMounted(async () => {
  if (ceremonyId) {
    loading.value = true
    fetchIncomes(ceremonyId)
    
    try {
      const data = await getArticle(ceremonyId)
      if (data) {
        ceremony.value = data
      }
    } catch (error) {
      console.error('Failed to fetch ceremony:', error)
    } finally {
      loading.value = false
    }
  }
})

onUnmounted(() => {
  uiStore.setFinanceWorkspace(false)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.1);
  border-radius: 20px;
}
</style>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
</route>
