<template>
  <div class="container py-10 space-y-10 transition-colors duration-300">
    <!-- Header Section -->
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-4">
        <RouterLink to="/admin" class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors">
          <ArrowLeftIcon class="h-3.5 w-3.5" /> 
          {{ $t('admin.forms.back_to_dashboard') }}
        </RouterLink>
        <div>
          <h1 class="text-3xl md:text-4xl font-medium text-foreground font-khmer uppercase tracking-tight">{{ $t('admin.ceremonies.title') }}</h1>
          <p class="text-muted-foreground mt-1 font-normal">{{ $t('admin.ceremonies.subtitle') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <Input v-model="searchQuery" :placeholder="$t('common.search_placeholder')" class="pl-9 h-11 w-[220px] rounded-xl border-border bg-card font-medium focus:ring-1 focus:ring-primary shadow-sm" />
        </div>
        <Select v-model="statusFilter">
          <SelectTrigger class="w-[180px] rounded-xl border-border h-11 bg-card shadow-sm font-medium">
            <SelectValue :placeholder="$t('admin.ceremonies.status_filter')" />
          </SelectTrigger>
          <SelectContent class="bg-card border-border rounded-xl p-1 shadow-lg">
            <SelectItem value="all" class="font-medium rounded-lg">{{ $t('common.filter_all') }}</SelectItem>
            <SelectItem value="published" class="font-medium rounded-lg text-emerald-600">{{ $t('admin.forms.status_published') }}</SelectItem>
            <SelectItem value="draft" class="font-medium rounded-lg text-slate-500">{{ $t('admin.forms.status_draft') }}</SelectItem>
            <SelectItem value="archived" class="font-medium rounded-lg text-orange-500">{{ $t('admin.forms.status_archived') }}</SelectItem>
          </SelectContent>
        </Select>
        <Button @click="openCreateModal" class="rounded-xl shadow-sm bg-primary hover:bg-primary/90 text-white font-medium h-11 px-6 active:scale-[0.98] transition-all">
          <PlusIcon class="mr-2 h-4 w-4" />
          {{ $t('admin.ceremonies.add_new') }}
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-24">
       <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
    </div>

    <!-- Ceremony Grid -->
    <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="item in filteredCeremonies" :key="item.id" class="group flex flex-col overflow-hidden border-none shadow-sm ring-1 ring-border rounded-3xl transition-all hover:shadow-xl bg-card">
            <div class="aspect-video w-full bg-muted relative overflow-hidden">
                <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/30">
                    <ImageIcon class="h-12 w-12" />
                </div>
                
                <!-- Action Overlay -->
                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="flex items-center justify-between">
                         <div class="space-y-1 min-w-0 pr-4 text-left">
                            <span class="text-[10px] text-white/70 font-semibold uppercase tracking-wider block">{{ formatDate(item.eventDate || item.createdAt) }}</span>
                            <h3 class="text-lg font-semibold text-white leading-tight font-khmer line-clamp-1 truncate">{{ item.title }}</h3>
                         </div>
                         <div class="flex gap-2 flex-shrink-0">
                             <Button variant="secondary" size="icon" class="h-9 w-9 bg-background text-foreground rounded-xl shadow-xl hover:bg-muted border-none" @click="openEditModal(item)">
                                <PencilIcon class="h-3.5 w-3.5" />
                             </Button>
                             <Button variant="secondary" size="icon" class="h-9 w-9 bg-rose-500 text-white rounded-xl shadow-xl hover:bg-rose-600 border-none" @click="confirmDelete(item)">
                                <TrashIcon class="h-3.5 w-3.5" />
                             </Button>
                         </div>
                    </div>
                </div>



                <!-- Status Badge -->
                <div class="absolute top-4 left-4 drop-shadow-lg flex flex-col gap-2">
                     <Badge 
                        class="text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 shadow-sm border-none ring-1 ring-black/5"
                        :class="{
                          'bg-emerald-500 text-white': item.status === 'published',
                          'bg-slate-500 text-white': item.status === 'draft', 
                          'bg-orange-500 text-white': item.status === 'archived'
                        }"
                     >
                        {{ item.status || 'draft' }}
                     </Badge>
                     <Badge v-if="item.isFeatured" class="uppercase text-[9px] font-semibold tracking-wider px-2.5 py-1 shadow-sm bg-orange-500 text-white border-none w-fit">
                        {{ $t('admin.ceremonies.featured_badge') }}
                     </Badge>
                </div>
            </div>
            <CardContent class="flex-1 p-6 space-y-4">
                <p class="text-sm font-medium text-muted-foreground line-clamp-3 leading-relaxed font-khmer text-left">{{ stripHtml(item.content) }}</p>
                <div class="grid grid-cols-2 gap-4 text-xs font-medium text-muted-foreground border-t border-border pt-4">
                    <div class="flex items-center gap-2">
                        <MapPinIcon class="h-3.5 w-3.5 text-primary" />
                        <span class="truncate">{{ item.location || $t('admin.ceremonies.no_location') }}</span>
                    </div>
                    <div v-if="item.eventDate" class="flex items-center gap-2 justify-end">
                        <CalendarIcon class="h-3.5 w-3.5 text-primary" />
                        <span class="truncate">{{ formatDateRange(item.eventDate, item.endDate) }}</span>
                    </div>
                    <div v-if="item.location" class="col-span-2 flex items-center gap-2 text-primary font-semibold bg-primary/5 p-2 rounded-lg justify-center overflow-hidden">
                        <MapPinIcon class="h-3.5 w-3.5 flex-shrink-0" />
                        <span class="truncate">{{ item.location }}</span>
                    </div>
                </div>
            </CardContent>
            <div class="px-6 pb-6 pt-0 flex gap-2">
               <Button @click="openDetail(item.id || '')" variant="outline" class="w-full h-11 rounded-xl border-border text-muted-foreground font-medium hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm bg-background/50 active:scale-[0.98]">
                  <span class="mr-2 font-khmer">{{ $t('admin.ceremonies.manage_details') }}</span>
                  <ArrowRightIcon class="h-4 w-4" />
               </Button>
            </div>
        </Card>

        <!-- Empty State -->
        <div v-if="ceremonies.length === 0" class="col-span-full py-32 text-center rounded-3xl bg-muted/30 border-2 border-dashed border-border flex flex-col items-center justify-center gap-4">
           <div class="size-20 rounded-full bg-card shadow-sm flex items-center justify-center text-muted-foreground/30 ring-1 ring-border">
              <ImageIcon class="w-10 h-10" />
           </div>
           <p class="font-bold text-foreground text-lg font-khmer">{{ $t('admin.ceremonies.empty') }}</p>
           <Button @click="openCreateModal" variant="outline" class="mt-4 rounded-xl border-border bg-background/50 font-medium h-11 px-8 active:scale-[0.98] transition-all">
              {{ $t('admin.ceremonies.add_new') }}
           </Button>
        </div>
    </div>

    <!-- Create/Edit Modal -->
    <Dialog v-model:open="showCreateModal">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none bg-card shadow-lg">
        <div class="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle class="text-xl font-semibold text-foreground font-khmer">
                {{ isEditing ? $t('admin.ceremonies.edit_ceremony') : $t('admin.ceremonies.add_new') }}
              </DialogTitle>
              <DialogDescription class="font-normal text-muted-foreground">
                {{ isEditing ? $t('admin.ceremonies.edit_ceremony') : $t('admin.ceremonies.add_new') }}
              </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSave" class="space-y-6">
              <div class="grid gap-6">
                <div class="grid gap-2">
                  <Label for="title" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.ceremonies.ceremony_title') }} *</Label>
                  <Input id="title" v-model="formData.title" required :placeholder="$t('admin.ceremonies.placeholder_title')" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                </div>
                <div class="grid grid-cols-2 gap-6">
                    <div class="grid gap-2">
                        <Label for="status" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.forms.status') }} *</Label>
                        <Select v-model="formData.status" required>
                            <SelectTrigger class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11 text-left">
                                <SelectValue :placeholder="$t('admin.forms.select_status')" />
                            </SelectTrigger>
                            <SelectContent class="bg-card border-border rounded-xl p-1 shadow-lg">
                                <SelectItem value="draft" class="rounded-lg font-normal text-slate-600">{{ $t('admin.forms.status_draft') }}</SelectItem>
                                <SelectItem value="published" class="rounded-lg font-semibold text-emerald-600">{{ $t('admin.forms.status_published') }}</SelectItem>
                                <SelectItem value="archived" class="rounded-lg font-normal text-orange-600">{{ $t('admin.forms.status_archived') }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="grid gap-2">
                        <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 flex items-center justify-between">
                            <span class="font-khmer">{{ $t('admin.ceremonies.event_date') }} *</span>
                            <div class="flex items-center gap-2 cursor-pointer select-none" @click="isMultiDay = !isMultiDay">
                                <span class="text-[10px] text-primary/60 font-khmer uppercase tracking-wider font-medium">{{ isMultiDay ? $t('admin.ceremonies.multi_day') : $t('admin.ceremonies.single_day') }}</span>
                                <div class="w-7 h-4 rounded-full bg-muted relative transition-colors" :class="{'bg-primary/20': isMultiDay}">
                                    <div class="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform" :class="{'translate-x-3': isMultiDay}"></div>
                                </div>
                            </div>
                        </Label>
                        <div class="grid grid-cols-2 gap-2" v-if="isMultiDay">
                             <Input type="date" v-model="eventDateInput" required class="rounded-xl border-border bg-muted/30 font-normal h-11" />
                             <Input type="date" v-model="endDateInput" required class="rounded-xl border-border bg-muted/30 font-normal h-11" />
                        </div>
                        <Input v-else id="eventDate" type="date" v-model="eventDateInput" required class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                    </div>
                </div>

                <div class="grid gap-2">
                    <Label for="location" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 font-khmer">{{ $t('footer.location') }}</Label>
                    <Input id="location" v-model="formData.location" :placeholder="$t('admin.forms.placeholder_location')" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                </div>



                <!-- Detailed Sections with Tabs -->
                <div class="space-y-4 border-t border-border pt-6">
                    <div class="flex items-center gap-6 border-b border-border overflow-x-auto">
                        <button 
                            v-for="tab in ['invitation', 'schedule', 'committee']" 
                            :key="tab"
                            type="button"
                            @click="activeTab = tab"
                            class="pb-3 text-[10px] font-medium uppercase tracking-widest transition-all relative whitespace-nowrap"
                            :class="activeTab === tab ? 'text-primary' : 'text-muted-foreground/60 hover:text-muted-foreground'"
                        >
                            {{ $t(`admin.ceremonies.${tab}_tab`) }}
                            <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all"></div>
                        </button>
                    </div>

                    <div class="mt-4">
                        <div v-show="activeTab === 'invitation'" class="space-y-2 animate-in fade-in duration-300">
                             <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.ceremonies.invitation_tab') }} *</Label>
                             <RichEditor v-model="formData.content" :placeholder="$t('admin.ceremonies.placeholder_invitation')" />
                        </div>
                        <div v-show="activeTab === 'schedule'" class="space-y-2 animate-in fade-in duration-300">
                             <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.ceremonies.schedule_tab') }}</Label>
                             <RichEditor v-model="formData.schedule" :placeholder="$t('admin.ceremonies.placeholder_schedule')" />
                        </div>
                        <div v-show="activeTab === 'committee'" class="space-y-2 animate-in fade-in duration-300">
                             <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.ceremonies.committee_tab') }}</Label>
                             <RichEditor v-model="formData.committee" :placeholder="$t('admin.ceremonies.placeholder_committee')" />
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center space-x-3 py-2 border-t border-border pt-6">
                    <input type="checkbox" id="isFeatured" v-model="formData.isFeatured" class="size-5 rounded-lg border-border bg-muted/30 text-primary focus:ring-primary ring-offset-background" />
                    <Label for="isFeatured" class="font-khmer font-medium text-foreground">{{ $t('admin.ceremonies.is_featured') }}</Label>
                </div>

                <div class="grid gap-2 pt-4 border-t border-border">
                  <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 font-khmer">{{ $t('admin.forms.receipt') }}</Label>
                  <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                       <Input type="file" accept="image/*" @change="handleImageUpload" :disabled="uploadingImage" class="rounded-xl border-border bg-muted/50 text-[10px]" />
                       <div v-if="uploadingImage" class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent flex-shrink-0"></div>
                    </div>
                    
                    <div v-if="formData.imageUrl" class="relative aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted shadow-inner">
                        <img :src="formData.imageUrl" class="w-full h-full object-cover" />
                        <button type="button" @click="formData.imageUrl = ''" class="absolute top-3 right-3 bg-rose-500 text-white p-2 rounded-full shadow-lg hover:bg-rose-600 transition-colors">
                          <TrashIcon class="h-4 w-4" />
                        </button>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter class="flex flex-row gap-3 pt-4">
                <Button type="button" variant="outline" @click="showCreateModal = false" class="flex-1 rounded-xl h-11 font-medium border-border text-muted-foreground hover:bg-muted bg-background/50">{{ $t('admin.forms.cancel') }}</Button>
                <Button type="submit" :disabled="saving || uploadingImage" class="flex-1 rounded-xl h-11 font-medium bg-primary text-white hover:bg-primary/90 shadow-sm">
                  <span v-if="saving" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  {{ isEditing ? $t('admin.forms.save_changes') : $t('admin.ceremonies.add_new') }}
                </Button>
              </DialogFooter>
            </form>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation -->
    <Dialog v-model:open="showDeleteConfirm">
      <DialogContent class="max-w-md rounded-2xl p-8 border-none bg-card shadow-lg">
        <DialogHeader class="space-y-4 text-center items-center">
            <div class="size-14 rounded-2xl bg-rose-500/5 flex items-center justify-center text-rose-500 border border-rose-500/10">
                <TrashIcon class="size-7" />
            </div>
          <DialogTitle class="text-xl font-semibold text-rose-600 font-khmer">{{ $t('admin.confirmations.delete_title', { type: $t('admin.confirmations.delete_types.update') }) }}?</DialogTitle>
          <DialogDescription class="text-muted-foreground font-normal leading-relaxed font-khmer text-center">
            {{ $t('admin.confirmations.delete_desc', { name: itemToDelete?.title }) }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="pt-8 grid grid-cols-2 gap-3">
          <Button variant="outline" @click="showDeleteConfirm = false" class="rounded-xl h-11 font-medium border-border text-muted-foreground hover:bg-muted bg-background/50">{{ $t('admin.forms.cancel') }}</Button>
          <Button variant="destructive" @click="handleDelete" :disabled="deleting" class="rounded-xl h-11 font-medium bg-rose-500 hover:bg-rose-600 shadow-sm">
            <span v-if="deleting" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ $t('admin.confirmations.confirm_delete') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>


  </div>
    <!-- Full Screen Detail Overlay -->
    <Teleport to="body">
      <div v-if="showDetailOverlay && selectedCeremonyId" class="fixed inset-0 z-[45] bg-background animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-y-auto w-full h-full pointer-events-auto">
         <div class="w-full min-h-screen bg-background p-4 md:p-12 space-y-4">
            <div v-if="detailLoading" class="flex flex-col items-center justify-center py-20 gap-4">
              <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
              <p class="text-sm font-bold text-muted-foreground uppercase tracking-widest">{{ $t('common.processing') }}...</p>
            </div>

            <template v-else-if="detailCeremony">
              <!-- Standard Detail Header -->
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in duration-700">
                <div class="space-y-4">
                  <button @click="closeDetail" class="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <ArrowLeftIcon class="h-3.5 w-3.5" /> 
                    {{ $t('admin.ceremonies.title') }}
                  </button>
                  
                  <div>
                    <h1 class="text-4xl font-bold text-foreground font-khmer tracking-tight">
                      {{ detailCeremony.title }}
                    </h1>
                    <div class="flex items-center gap-3 mt-1">
                       <Badge variant="outline" class="rounded-lg bg-primary/5 text-primary border-primary/10">
                          {{ detailDisplayDate(detailCeremony.eventDate) }}
                       </Badge>
                       <span v-if="detailCeremony.location" class="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                          <MapPinIcon class="size-3.5" />
                          {{ detailCeremony.location }}
                       </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-end gap-3 pb-1">
                   <Button variant="outline" class="h-10 rounded-xl border-border bg-card hover:bg-muted font-medium shadow-sm transition-all" @click="showFinanceSummary = !showFinanceSummary">
                      <LayoutDashboardIcon class="mr-2 h-4 w-4" />
                      {{ showFinanceSummary ? 'Hide Cards' : 'Show Cards' }}
                   </Button>
                </div>
              </div>

              <!-- Detail View Table -->
              <div class="mt-4">
                 <CeremonyFinanceTab 
                    :ceremonyId="selectedCeremonyId" 
                    :showSummaryCards="showFinanceSummary"
                    @add-income="detailHandleAddIncome"
                    @add-expense="detailHandleAddExpense"
                    @edit-income="detailHandleEditIncome"
                    @edit-expense="detailHandleEditExpense"
                 />
              </div>
            </template>

            <div v-else class="py-24 text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <FileXIcon class="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 class="text-lg font-medium text-foreground">{{ $t('admin.ceremonies.not_found') }}</h3>
              <p class="text-muted-foreground mt-1">{{ $t('admin.ceremonies.not_found_desc') }}</p>
              <Button variant="outline" class="mt-4" @click="closeDetail">
                {{ $t('admin.back_to_ceremonies') }}
              </Button>
            </div>

            <!-- Inner Modals -->
            <Teleport to="body">
                <AddIncomeModal 
                  v-if="detailShowAddIncomeModal"
                  :open="detailShowAddIncomeModal"
                  @update:open="(val: any) => !val && detailHandleCloseIncome()"
                  :ceremony-id="detailCeremony?.id || ''"
                  :user-id="user?.uid || ''"
                  :initial-data="detailEditingIncome"
                  @success="() => {}"
                />

                <AddExpenseModal 
                  v-if="detailShowAddExpenseModal"
                  :open="detailShowAddExpenseModal"
                  @update:open="(val: any) => !val && detailHandleCloseExpense()"
                  :ceremony-id="detailCeremony?.id || ''"
                  :user-id="user?.uid || ''"
                  :initial-data="detailEditingExpense"
                  @success="() => {}"
                />
            </Teleport>
         </div>
      </div>
    </Teleport>
</template>

<script setup lang="ts">

import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ImageIcon, 
  CalendarIcon, 
  ArrowLeftIcon, 
  MapPinIcon, 
  ArrowRightIcon,
  SearchIcon,
  LayoutDashboardIcon
} from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import RichEditor from '@/components/ui/RichEditor.vue'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useArticles } from '~/composables/useArticles'
import { useCloudinary } from '~/composables/useCloudinary'
import { formatKhmerDate } from '~/utils/date'
import CeremonyFinanceTab from './CeremonyFinanceTab.vue'
import AddIncomeModal from './AddIncomeModal.vue'
import AddExpenseModal from './AddExpenseModal.vue'
import { useCeremonyFinance } from '~/composables/useCeremonyFinance'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { FileXIcon, MinusIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { type Article } from '~/composables/useArticles'
import type { CeremonyIncome, CeremonyExpense } from '~/types/ceremonyFinance'


const { articles, loading, fetchArticles, addArticle, updateArticle, deleteArticle } = useArticles()
const { uploadImage } = useCloudinary()
const route = useRoute()
const router = useRouter()


const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const saving = ref(false)
const deleting = ref(false)
const uploadingImage = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const itemToDelete = ref<any>(null)
const activeTab = ref('invitation')

const selectedCeremonyId = ref<string | null>(null)
const showDetailOverlay = ref(false)
const showFinanceSummary = ref(true)

const formData = ref({
  title: '',
  content: '',
  schedule: '',
  committee: '',
  category: 'ceremony',
  eventDate: null as Date | null,
  endDate: null as Date | null,
  imageUrl: '',
  isFeatured: false,
  status: 'draft' as 'draft' | 'published' | 'archived',
  location: ''
})

const eventDateInput = ref('')
const endDateInput = ref('')
const isMultiDay = ref(false)

// Filter only ceremony articles
const ceremonies = computed(() => {
  return articles.value.filter(a => a.category === 'ceremony')
})

const statusFilter = ref('all')
const searchQuery = ref('')

const filteredCeremonies = computed(() => {
  let items = ceremonies.value
  if (statusFilter.value !== 'all') {
    items = items.filter(i => (i.status || 'draft') === statusFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(i => i.title.toLowerCase().includes(q) || (i.location && i.location.toLowerCase().includes(q)))
  }
  return items
})

onMounted(async () => {
  await fetchArticles()
  if (route.query.status) statusFilter.value = route.query.status as string
  if (route.query.ceremonyId) {
    // If ID is valid string
    const id = route.query.ceremonyId as string
    if (id) openDetail(id)
  }
})

watch(statusFilter, (val) => {
  const query = { ...route.query }
  if (val && val !== 'all') query.status = val
  else delete query.status
  router.replace({ query })
})

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  activeTab.value = 'invitation'
  formData.value = {
    title: '',
    content: '',
    schedule: '',
    committee: '',
    category: 'ceremony',
    eventDate: null,
    endDate: null,
    imageUrl: '',
    isFeatured: false,
    status: 'draft',
    location: ''
  }
  eventDateInput.value = ''
  endDateInput.value = ''
  isMultiDay.value = false
  showCreateModal.value = true
}

const openEditModal = (item: any) => {
  isEditing.value = true
  editingId.value = item.id
  activeTab.value = 'invitation'
  formData.value = {
    title: item.title,
    content: item.content,
    schedule: item.schedule || '',
    committee: item.committee || '',
    category: 'ceremony',
    eventDate: item.eventDate,
    endDate: item.endDate || null,
    imageUrl: item.imageUrl || '',
    isFeatured: item.isFeatured || false,
    status: item.status || 'draft',
    location: item.location || ''
  }
  if (item.eventDate) {
    const date = item.eventDate.toDate ? item.eventDate.toDate() : new Date(item.eventDate)
    eventDateInput.value = date.toISOString().split('T')[0]
  }
  if (item.endDate) {
    const date = item.endDate.toDate ? item.endDate.toDate() : new Date(item.endDate)
    endDateInput.value = date.toISOString().split('T')[0]
    isMultiDay.value = true
  } else {
    endDateInput.value = ''
    isMultiDay.value = false
  }
  showCreateModal.value = true
}

const handleImageUpload = async (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadingImage.value = true
  try {
    const url = await uploadImage(file)
    formData.value.imageUrl = url
  } catch (err) {
    console.error('Image upload failed:', err)
  } finally {
    uploadingImage.value = false
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    const data = {
      ...formData.value,
      category: 'ceremony' as const,
      eventDate: eventDateInput.value ? new Date(eventDateInput.value) : null,
      endDate: isMultiDay.value && endDateInput.value ? new Date(endDateInput.value) : null
    }

    if (isEditing.value && editingId.value) {
      await updateArticle(editingId.value, data)
    } else {
      await addArticle(data)
    }
    
    showCreateModal.value = false
    await fetchArticles()
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item: any) => {
  itemToDelete.value = item
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    await deleteArticle(itemToDelete.value.id)
    showDeleteConfirm.value = false
    itemToDelete.value = null
    await fetchArticles()
  } catch (err) {
    console.error(err)
  } finally {
    deleting.value = false
  }
}

const formatDate = (date: any) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return formatKhmerDate(d, 'dd/MM/yyyy')
}

const formatDateRange = (start: any, end: any) => {
    if (!start) return ''
    const startDate = start.toDate ? start.toDate() : new Date(start)
    const formattedStart = formatKhmerDate(startDate, 'dd/MM/yyyy')
    
    if (!end) return formattedStart
    
    const endDate = end.toDate ? end.toDate() : new Date(end)
    const formattedEnd = formatKhmerDate(endDate, 'dd/MM/yyyy')
    
    if (formattedStart === formattedEnd) return formattedStart
    
    // Check if same month and year to shorten if needed, but for now simple range
    return `${formatKhmerDate(startDate, 'dd')} - ${formattedEnd}`
}

const stripHtml = (html: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

const openDetail = async (id: string) => {
  selectedCeremonyId.value = id
  showDetailOverlay.value = true
  document.body.style.overflow = 'hidden'
  router.push({ query: { ...route.query, ceremonyId: id } })
  await loadDetailData(id)
}

const closeDetail = () => {
  showDetailOverlay.value = false
  selectedCeremonyId.value = null
  document.body.style.overflow = ''
  uiStore.setFinanceWorkspace(false)
  
  const query = { ...route.query }
  delete query.ceremonyId
  router.replace({ query })
}

// Detail Logic
const { getArticle } = useArticles()
const { fetchIncomes } = useCeremonyFinance()
const authStore = useAuthStore()
const uiStore = useUIStore()
const { user } = storeToRefs(authStore)

const detailCeremony = ref<Article | null>(null)
const detailLoading = ref(true)
const detailShowAddIncomeModal = ref(false)
const detailShowAddExpenseModal = ref(false)
const detailEditingIncome = ref<CeremonyIncome | null>(null)
const detailEditingExpense = ref<CeremonyExpense | null>(null)

const detailDisplayDate = (date: any) => {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : new Date(date)
  return formatKhmerDate(d)
}

const toDate = (t: any) => t?.toDate ? t.toDate() : new Date(t || Date.now())

const detailHandleAddIncome = () => {
  detailEditingIncome.value = null
  detailShowAddIncomeModal.value = true
}

const detailHandleAddExpense = () => {
  detailEditingExpense.value = null
  detailShowAddExpenseModal.value = true
}

const detailHandleEditIncome = (income: CeremonyIncome) => {
  detailEditingIncome.value = {
     ...income,
     createdAt: toDate(income.createdAt),
     updatedAt: income.updatedAt ? toDate(income.updatedAt) : undefined
  }
  detailShowAddIncomeModal.value = true
}

const detailHandleEditExpense = (expense: CeremonyExpense) => {
  detailEditingExpense.value = {
      ...expense,
      createdAt: toDate(expense.createdAt),
      updatedAt: expense.updatedAt ? toDate(expense.updatedAt) : undefined,
      paidDate: expense.paidDate ? toDate(expense.paidDate) : undefined
  }
  detailShowAddExpenseModal.value = true
}

const detailHandleCloseIncome = () => {
  detailShowAddIncomeModal.value = false
  detailEditingIncome.value = null
}

const detailHandleCloseExpense = () => {
  detailShowAddExpenseModal.value = false
  detailEditingExpense.value = null
}

const loadDetailData = async (id: string) => {
  if (id) {
    detailLoading.value = true
    // Reset state
    detailCeremony.value = null
    fetchIncomes(id)
    
    try {
      const data = await getArticle(id)
      if (data) {
        detailCeremony.value = data
      }
    } catch (error) {
      console.error('Failed to fetch ceremony:', error)
    } finally {
      detailLoading.value = false
    }
  }
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
