<template>
  <div class="container py-10 space-y-10 transition-colors duration-300">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-4">
        <RouterLink to="/admin" class="text-[11px] font-medium text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ArrowLeftIcon class="h-3.5 w-3.5" /> 
          {{ $t('admin.forms.back_to_dashboard') }}
        </RouterLink>
        <div>
          <h1 class="text-3xl font-medium text-foreground font-khmer">{{ $t('admin.news.title') }}</h1>
          <p class="text-muted-foreground mt-1 font-medium">{{ $t('admin.news.subtitle') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Button @click="openCreateModal" class="rounded-xl shadow-lg shadow-primary/20 font-medium h-11 px-6">
          <PlusIcon class="mr-2 h-4 w-4" />
          {{ $t('admin.news.add_new') }}
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-24">
       <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
    </div>

    <!-- News Grid -->
    <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="item in newsList" :key="item.id" class="group flex flex-col overflow-hidden border-none shadow-sm ring-1 ring-border rounded-3xl transition-all hover:shadow-xl bg-card">
            <div class="aspect-video w-full bg-muted relative overflow-hidden">
                <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/30">
                    <ImageIcon class="h-12 w-12" />
                </div>
                
                <!-- Action Overlay -->
                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="flex items-center justify-between">
                         <div class="space-y-1 min-w-0 pr-4 text-left">
                            <span class="text-[10px] text-white/70 font-medium block">{{ formatDate(item.createdAt) }}</span>
                            <h3 class="text-lg font-medium text-white leading-tight font-khmer line-clamp-1 truncate">{{ item.title }}</h3>
                         </div>
                         <div class="flex gap-2 flex-shrink-0">
                             <Button variant="secondary" size="icon" class="h-9 w-9 bg-background text-foreground rounded-xl shadow-xl hover:bg-muted transition-colors border-none" @click="openEditModal(item)">
                                <PencilIcon class="h-3.5 w-3.5" />
                             </Button>
                             <Button variant="secondary" size="icon" class="h-9 w-9 bg-rose-500 text-white rounded-xl shadow-xl hover:bg-rose-600 border-none transition-colors" @click="confirmDelete(item)">
                                <TrashIcon class="h-3.5 w-3.5" />
                             </Button>
                         </div>
                    </div>
                </div>

                <!-- Type Badge -->
                <div class="absolute top-4 left-4 drop-shadow-lg">
                     <Badge class="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-sm border-none ring-1 ring-black/5" :variant="item.type === 'event' ? 'default' : 'secondary'">
                        {{ item.type === 'event' ? $t('admin.news.type_event') : $t('admin.news.type_news') }}
                     </Badge>
                </div>
            </div>
            <CardContent class="flex-1 p-6 space-y-4">
                <p class="text-sm font-medium text-muted-foreground line-clamp-3 leading-relaxed font-khmer text-left">{{ item.content }}</p>
                <div v-if="item.type === 'event' && item.eventDate" class="pt-4 border-t border-border flex items-center gap-2 text-[11px] font-medium text-primary">
                    <CalendarIcon class="h-3.5 w-3.5" />
                    <span>{{ formatDate(item.eventDate) }}</span>
                </div>
            </CardContent>
        </Card>

        <!-- Empty State -->
        <div v-if="newsList.length === 0" class="col-span-full py-32 text-center rounded-3xl bg-muted/30 border-2 border-dashed border-border flex flex-col items-center justify-center gap-4">
           <div class="size-20 rounded-full bg-card shadow-sm flex items-center justify-center text-muted-foreground/30 ring-1 ring-border">
              <NewspaperIcon class="w-10 h-10" />
           </div>
           <p class="font-medium text-foreground text-lg">មិនទាន់មានដំណឹង</p>
           <Button @click="openCreateModal" variant="outline" class="mt-4 rounded-xl border-border bg-background/50 font-medium">
              {{ $t('admin.news.add_new') }}
           </Button>
        </div>
    </div>

    <!-- Create/Edit Modal -->
    <Dialog v-model:open="showCreateModal">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none bg-card shadow-lg">
        <div class="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle class="text-xl font-medium text-foreground font-khmer">
                {{ isEditing ? $t('admin.news.edit_news') : $t('admin.news.add_new') }}
              </DialogTitle>
              <DialogDescription class="font-normal text-muted-foreground">
                {{ isEditing ? $t('admin.news.edit_news') : $t('admin.news.add_new') }}
              </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSave" class="space-y-6">
              <div class="grid gap-6">
                <div class="grid gap-2">
                  <Label for="title" class="text-xs font-medium text-foreground/70">{{ $t('admin.news.news_title') }} *</Label>
                  <Input id="title" v-model="formData.title" required :placeholder="$t('admin.news.placeholder_title')" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                </div>
                
                <div class="grid grid-cols-2 gap-6">
                  <div class="grid gap-2">
                    <Label for="type" class="text-xs font-medium text-foreground/70">{{ $t('admin.forms.type') }} *</Label>
                    <Select v-model="formData.type">
                        <SelectTrigger class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11 text-left">
                            <SelectValue :placeholder="$t('admin.forms.select')" />
                        </SelectTrigger>
                        <SelectContent class="bg-card border-border rounded-xl p-1 shadow-lg">
                            <SelectItem value="news" class="rounded-lg font-normal">{{ $t('admin.news.type_news') }}</SelectItem>
                            <SelectItem value="event" class="rounded-lg font-bold text-primary">{{ $t('admin.news.type_event') }}</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  
                  <div v-if="formData.type === 'event'" class="grid gap-2 animate-in fade-in zoom-in duration-300">
                      <Label for="eventDate" class="text-xs font-medium text-foreground/70">{{ $t('admin.ceremonies.event_date') }}</Label>
                      <Input id="eventDate" type="date" v-model="eventDateInput" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                  </div>
                </div>

                <div class="grid gap-2">
                  <Label for="content" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.news.news_content') }} *</Label>
                  <Textarea id="content" v-model="formData.content" required :placeholder="$t('admin.news.placeholder_content')" rows="8" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all resize-none" />
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
                  {{ isEditing ? $t('admin.forms.save_changes') : $t('admin.news.add_new') }}
                </Button>
              </DialogFooter>
            </form>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirm -->
    <Dialog v-model:open="showDeleteConfirm">
        <DialogContent class="max-w-md rounded-2xl p-8 border-none bg-card shadow-lg">
            <DialogHeader class="space-y-4 text-center items-center">
                <div class="size-14 rounded-2xl bg-rose-500/5 flex items-center justify-center text-rose-500 border border-rose-500/10">
                    <TrashIcon class="size-7" />
                </div>
                <DialogTitle class="text-xl font-semibold text-rose-600 font-khmer">លុបដំណឹងចេញ?</DialogTitle>
                <DialogDescription class="text-muted-foreground font-normal leading-relaxed font-khmer text-center">
                    តើអ្នកពិតជាចង់លុបដំណឹង <span class="font-medium text-foreground">"{{ itemToDelete?.title }}"</span> នេះចេញពីប្រព័ន្ធមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានឡើយ។
                </DialogDescription>
            </DialogHeader>
            <DialogFooter class="pt-8 grid grid-cols-2 gap-3">
                <Button variant="outline" @click="showDeleteConfirm = false" class="rounded-xl h-11 font-medium border-border text-muted-foreground hover:bg-muted bg-background/50">បោះបង់</Button>
                <Button variant="destructive" :disabled="deleting" @click="handleDelete" class="rounded-xl h-11 font-medium bg-rose-500 hover:bg-rose-600 shadow-sm">
                    <span v-if="deleting" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    បញ្ជាក់ការលុប
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PlusIcon, PencilIcon, TrashIcon, ImageIcon, CalendarIcon, ArrowLeftIcon, NewspaperIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { useNews, type NewsItem } from '~/composables/useNews'
import { useCloudinary } from '~/composables/useCloudinary'
import { Timestamp } from 'firebase/firestore'

const { newsList, loading, fetchNews, addNews, updateNews, deleteNews } = useNews()
const { uploadImage } = useCloudinary()

const showCreateModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const uploadingImage = ref(false)

const itemToDelete = ref<NewsItem | null>(null)
const editingId = ref<string | null>(null)

const formData = ref({
    title: '',
    type: 'news' as 'news' | 'event',
    content: '',
    imageUrl: '',
    eventDate: null as Date | string | null
})

// Computed for date input (YYYY-MM-DD)
const eventDateInput = computed({
    get: () => {
        if (!formData.value.eventDate) return ''
        const d = new Date(formData.value.eventDate)
        if (isNaN(d.getTime())) return '' // Invalid date
        return d.toISOString().split('T')[0]
    },
    set: (val) => {
        formData.value.eventDate = val ? new Date(val) : null
    }
})

onMounted(() => {
    fetchNews()
})

const openCreateModal = () => {
    isEditing.value = false
    editingId.value = null
    formData.value = {
        title: '',
        type: 'news',
        content: '',
        imageUrl: '',
        eventDate: null
    }
    showCreateModal.value = true
}

const openEditModal = (item: NewsItem) => {
    isEditing.value = true
    editingId.value = item.id!
    
    // Convert timestamp/date
    let eDate = null
    if (item.eventDate) {
         if ((item.eventDate as any).toDate) {
             eDate = (item.eventDate as any).toDate()
         } else {
             eDate = new Date(item.eventDate as string | Date | number)
         }
    }

    formData.value = {
        title: item.title,
        type: item.type,
        content: item.content,
        imageUrl: item.imageUrl || '',
        eventDate: eDate
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
        console.error(err)
    } finally {
        uploadingImage.value = false
    }
}

const handleSave = async () => {
    saving.value = true
    try {
        const data = {
            ...formData.value,
            eventDate: formData.value.type === 'event' && formData.value.eventDate ? Timestamp.fromDate(new Date(formData.value.eventDate)) : null
        }

        if (isEditing.value && editingId.value) {
            await updateNews(editingId.value, data)
        } else {
            await addNews(data)
        }
        showCreateModal.value = false
    } catch (err) {
        console.error(err)
    } finally {
        saving.value = false
    }
}

const confirmDelete = (item: NewsItem) => {
    itemToDelete.value = item
    showDeleteConfirm.value = true
}

const handleDelete = async () => {
    if (!itemToDelete.value?.id) return
    deleting.value = true
    try {
        await deleteNews(itemToDelete.value.id)
        showDeleteConfirm.value = false
    } catch (err) {
        console.error(err)
    } finally {
        deleting.value = false
        itemToDelete.value = null
    }
}

const formatDate = (date: any) => {
    if (!date) return '-'
    const d = date.toDate ? date.toDate() : new Date(date)
    return format(d, 'dd/MM/yyyy')
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
