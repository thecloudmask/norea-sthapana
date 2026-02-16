<template>
  <div class="container py-10 space-y-10 transition-colors duration-300">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-4">
        <RouterLink to="/admin" class="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ArrowLeftIcon class="h-3.5 w-3.5" /> 
          {{ $t('admin.forms.back_to_dashboard') }}
        </RouterLink>
        <div>
          <h1 class="text-3xl font-bold text-foreground font-khmer">{{ $t('admin.ceremonies.title') }}</h1>
          <p class="text-muted-foreground mt-1 font-medium">{{ $t('admin.ceremonies.subtitle') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Select v-model="statusFilter">
          <SelectTrigger class="w-[150px] rounded-xl border-border h-11 bg-card shadow-sm font-bold">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent class="bg-card border-border rounded-xl p-1 shadow-lg">
            <SelectItem value="all" class="font-bold">ទាំងអស់ (All)</SelectItem>
            <SelectItem value="published" class="font-bold text-emerald-600">Published</SelectItem>
            <SelectItem value="draft" class="font-bold text-slate-500">Draft</SelectItem>
            <SelectItem value="archived" class="font-bold text-orange-500">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button @click="openCreateModal" class="rounded-xl shadow-lg shadow-primary/20 font-bold h-11 px-6">
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
                            <span class="text-[10px] text-white/70 font-bold uppercase tracking-wider block">{{ formatDate(item.eventDate || item.createdAt) }}</span>
                            <h3 class="text-lg font-bold text-white leading-tight font-khmer line-clamp-1 truncate">{{ item.title }}</h3>
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
                        class="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-sm border-none ring-1 ring-black/5"
                        :class="{
                          'bg-emerald-500 text-white': item.status === 'published',
                          'bg-slate-500 text-white': item.status === 'draft', 
                          'bg-orange-500 text-white': item.status === 'archived'
                        }"
                     >
                        {{ item.status || 'draft' }}
                     </Badge>
                     <Badge v-if="item.isFeatured" class="uppercase text-[9px] font-bold tracking-wider px-2.5 py-1 shadow-sm bg-orange-500 text-white border-none w-fit">
                        {{ $t('admin.ceremonies.featured_badge') }}
                     </Badge>
                </div>
            </div>
            <CardContent class="flex-1 p-6 space-y-4">
                <p class="text-sm font-medium text-muted-foreground line-clamp-3 leading-relaxed font-khmer text-left">{{ item.content }}</p>
                <div class="grid grid-cols-2 gap-4 text-xs font-medium text-muted-foreground border-t border-border pt-4">
                    <div class="flex items-center gap-2">
                        <MapPinIcon class="h-3.5 w-3.5 text-primary" />
                        <span class="truncate">{{ item.location || 'No location' }}</span>
                    </div>
                    <div v-if="item.eventDate" class="flex items-center gap-2 justify-end">
                        <CalendarIcon class="h-3.5 w-3.5 text-primary" />
                        <span>{{ formatDate(item.eventDate) }}</span>
                    </div>
                    <div v-if="item.startTime" class="col-span-2 flex items-center gap-2 text-primary font-bold bg-primary/5 p-2 rounded-lg justify-center">
                        <ClockIcon class="h-3.5 w-3.5" />
                        <span>{{ item.startTime }} - {{ item.endTime || '...' }}</span>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Empty State -->
        <div v-if="ceremonies.length === 0" class="col-span-full py-32 text-center rounded-3xl bg-muted/30 border-2 border-dashed border-border flex flex-col items-center justify-center gap-4">
           <div class="size-20 rounded-full bg-card shadow-sm flex items-center justify-center text-muted-foreground/30 ring-1 ring-border">
              <ImageIcon class="w-10 h-10" />
           </div>
           <p class="font-extrabold text-foreground text-lg">មិនទាន់មានកម្មវិធីបុណ្យ</p>
           <Button @click="openCreateModal" variant="outline" class="mt-4 rounded-xl border-border bg-background/50 font-bold">
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
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent class="bg-card border-border rounded-xl p-1 shadow-lg">
                                <SelectItem value="draft" class="rounded-lg font-normal text-slate-600">Draft (ព្រាង)</SelectItem>
                                <SelectItem value="published" class="rounded-lg font-bold text-emerald-600">Published (ផ្សាយ)</SelectItem>
                                <SelectItem value="archived" class="rounded-lg font-normal text-orange-600">Archived (រក្សាទុក)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="grid gap-2">
                        <Label for="eventDate" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.ceremonies.event_date') }} *</Label>
                        <Input id="eventDate" type="date" v-model="eventDateInput" required class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                    </div>
                </div>

                <div class="grid gap-2">
                    <Label for="location" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">ទីតាំង (Location)</Label>
                    <Input id="location" v-model="formData.location" placeholder="Ex: Main Hall, Stupa..." class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                </div>

                <div class="grid grid-cols-2 gap-6">
                     <div class="grid gap-2">
                        <Label for="startTime" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">ម៉ោងចាប់ផ្តើម (Start Time)</Label>
                        <Input id="startTime" type="time" v-model="formData.startTime" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="endTime" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">ម៉ោងបញ្ចប់ (End Time)</Label>
                        <Input id="endTime" type="time" v-model="formData.endTime" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                    </div>
                </div>

                <div class="grid gap-2">
                  <Label for="content" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.library.article_content') }} *</Label>
                  <Textarea id="content" v-model="formData.content" required :placeholder="$t('admin.ceremonies.placeholder_content')" rows="6" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all resize-none" />
                </div>
                
                <div class="flex items-center space-x-3 py-2">
                    <input type="checkbox" id="isFeatured" v-model="formData.isFeatured" class="size-5 rounded-lg border-border bg-muted/30 text-primary focus:ring-primary ring-offset-background" />
                    <Label for="isFeatured" class="font-khmer font-medium text-foreground">{{ $t('admin.ceremonies.is_featured') }}</Label>
                </div>

                <div class="grid gap-2 pt-4 border-t border-border">
                  <Label class="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{{ $t('admin.forms.receipt') }}</Label>
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
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'
import { PlusIcon, PencilIcon, TrashIcon, ImageIcon, CalendarIcon, ArrowLeftIcon, MapPinIcon, ClockIcon } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useArticles } from '~/composables/useArticles'
import { useCloudinary } from '~/composables/useCloudinary'
import { formatKhmerDate } from '~/utils/date'


const { articles, loading, fetchArticles, addArticle, updateArticle, deleteArticle } = useArticles()
const { uploadImage } = useCloudinary()

const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const saving = ref(false)
const deleting = ref(false)
const uploadingImage = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const itemToDelete = ref<any>(null)

const formData = ref({
  title: '',
  content: '',
  category: 'ceremony',
  eventDate: null as Date | null,
  imageUrl: '',
  isFeatured: false,
  status: 'draft' as 'draft' | 'published' | 'archived',
  location: '',
  startTime: '',
  endTime: ''
})

const eventDateInput = ref('')

// Filter only ceremony articles
const ceremonies = computed(() => {
  return articles.value.filter(a => a.category === 'ceremony')
})

const statusFilter = ref('all')

const filteredCeremonies = computed(() => {
  let items = ceremonies.value
  if (statusFilter.value !== 'all') {
    items = items.filter(i => (i.status || 'draft') === statusFilter.value)
  }
  return items
})

onMounted(() => {
  fetchArticles()
})

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    title: '',
    content: '',
    category: 'ceremony',
    eventDate: null,
    imageUrl: '',
    isFeatured: false,
    status: 'draft',
    location: '',
    startTime: '',
    endTime: ''
  }
  eventDateInput.value = ''
  showCreateModal.value = true
}

const openEditModal = (item: any) => {
  isEditing.value = true
  editingId.value = item.id
  formData.value = {
    title: item.title,
    content: item.content,
    category: 'ceremony',
    eventDate: item.eventDate,
    imageUrl: item.imageUrl || '',
    isFeatured: item.isFeatured || false,
    status: item.status || 'draft',
    location: item.location || '',
    startTime: item.startTime || '',
    endTime: item.endTime || ''
  }
  if (item.eventDate) {
    const date = item.eventDate.toDate ? item.eventDate.toDate() : new Date(item.eventDate)
    eventDateInput.value = date.toISOString().split('T')[0]
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
      eventDate: eventDateInput.value ? new Date(eventDateInput.value) : null
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
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
