<template>
  <div class="container py-10 space-y-10 transition-colors duration-300">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-semibold tracking-tight text-foreground font-khmer uppercase">{{ $t('admin.projects_admin.title') }}</h1>
        <p class="text-muted-foreground mt-1 font-medium">{{ $t('admin.projects_admin.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <Select v-model="statusFilter">
          <SelectTrigger class="w-[180px] rounded-xl border-border shadow-sm font-semibold h-11 bg-card">
            <SelectValue :placeholder="$t('admin.forms.status')" />
          </SelectTrigger>
          <SelectContent class="rounded-xl p-1 shadow-xl border-border">
            <SelectItem value="all" class="rounded-lg font-semibold">{{ $t('admin.projects_admin.filter_all') }}</SelectItem>
            <SelectItem value="planning" class="rounded-lg font-semibold">{{ $t('common.status_planning') }}</SelectItem>
            <SelectItem value="draft" class="rounded-lg font-semibold">{{ $t('admin.projects_admin.filter_draft') }}</SelectItem>
            <SelectItem value="active" class="rounded-lg font-semibold">{{ $t('admin.projects_admin.filter_active') }}</SelectItem>
            <SelectItem value="paused" class="rounded-lg font-semibold">{{ $t('admin.projects_admin.filter_paused') }}</SelectItem>
            <SelectItem value="completed" class="rounded-lg font-semibold">{{ $t('admin.projects_admin.filter_completed') }}</SelectItem>
            <SelectItem value="cancelled" class="rounded-lg font-semibold">{{ $t('common.status_cancelled') }}</SelectItem>
          </SelectContent>
        </Select>
        <Button @click="openCreateModal" class="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 font-semibold transition-all">
          <PlusIcon class="mr-2 h-4 w-4" />
          {{ $t('admin.forms.create_project') }}
        </Button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-24">
       <div class="relative">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <div class="absolute inset-0 flex items-center justify-center">
             <div class="size-2 rounded-full bg-primary animate-pulse"></div>
          </div>
       </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card v-for="project in filteredProjects" :key="project.id" class="group flex flex-col overflow-hidden border-none shadow-sm ring-1 ring-border rounded-3xl transition-all hover:shadow-xl bg-card">
        <div class="aspect-video w-full bg-muted relative overflow-hidden">
           <img v-if="project.bannerUrl" :src="project.bannerUrl" class="w-full h-full object-cover" />
           <div v-else class="flex items-center justify-center h-full text-muted-foreground/30">
              <FolderIcon class="h-12 w-12" />
           </div>
           
           <!-- Status Badge Overlay -->
           <div class="absolute top-4 left-4 drop-shadow-lg">
              <StatusBadge :status="project.status" class="ring-1 ring-black/5" />
           </div>

           <!-- Action Overlay -->
           <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <Button variant="secondary" size="icon" class="h-10 w-10 bg-background text-foreground rounded-xl shadow-xl transition-colors hover:bg-muted" @click="openEditProject(project)">
                <PencilIcon class="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="secondary" size="icon" class="h-10 w-10 bg-background text-foreground rounded-xl shadow-xl transition-colors hover:bg-muted">
                    <MoreVerticalIcon class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="rounded-xl shadow-2xl border-border p-2 min-w-[160px]">
                  <DropdownMenuItem @click="openEditProject(project)" class="rounded-lg font-semibold">{{ $t('admin.projects_admin.edit_project') }}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="confirmDeleteProject(project)" class="rounded-lg text-rose-600 font-extrabold focus:bg-rose-500/10 focus:text-rose-600">
                    <Trash2Icon class="mr-2 h-3.5 w-3.5" />
                    {{ $t('admin.projects_admin.delete_project') }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
           </div>
        </div>
        
        <CardContent class="flex-1 p-6 space-y-6">
           <div>
              <h3 class="text-xl font-semibold font-khmer text-foreground line-clamp-1 group-hover:text-primary transition-colors">{{ project.title }}</h3>
              <p class="text-sm font-medium text-muted-foreground line-clamp-2 mt-2 leading-relaxed font-khmer">{{ stripHtml(project.description) }}</p>
           </div>
           
           <div class="space-y-4 bg-muted/30 p-4 rounded-2xl ring-1 ring-border">
              <div class="grid grid-cols-2 gap-4 border-b border-border pb-3">
                 <div class="flex flex-col">
                    <span class="text-[10px] uppercase font-semibold tracking-widest text-muted-foreground flex items-center gap-1">
                      <ArrowUpCircleIcon class="w-3 h-3 text-emerald-500" />
                      {{ $t('admin.projects_admin.raised') }}
                    </span>
                    <span class="text-base font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tighter">${{ (project.currentAmount || 0).toLocaleString() }}</span>
                 </div>
                 <div class="flex flex-col text-right border-l border-border pl-4">
                    <span class="text-[10px] uppercase font-semibold tracking-widest text-muted-foreground flex items-center justify-end gap-1">
                      {{ $t('admin.expenses') }}
                      <ArrowDownCircleIcon class="w-3 h-3 text-rose-500" />
                    </span>
                    <span class="text-base font-semibold text-rose-600 dark:text-rose-400 tabular-nums tracking-tighter">${{ (project.totalExpensesUsd || 0).toLocaleString() }}</span>
                 </div>
              </div>

              <div class="flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest">
                 <div class="text-muted-foreground flex items-center gap-1">
                    <span class="text-muted-foreground/60">{{ $t('projects.goal') }}:</span>
                    <span class="text-foreground">${{ project.goalAmount.toLocaleString() }}</span>
                 </div>
                 <div class="text-primary font-semibold">
                    {{ Math.round(((project.currentAmount || 0) / (project.goalAmount || 1)) * 100) }}% {{ $t('admin.projects_admin.complete') }}
                 </div>
              </div>

              <Progress :model-value="((project.currentAmount || 0) / (project.goalAmount || 1)) * 100" class="h-1.5 bg-muted" />
           </div>
        </CardContent>
        <CardFooter class="px-6 pb-6 pt-0">
           <RouterLink :to="`/admin/projects/${project.id}`" class="w-full">
              <Button variant="outline" class="w-full h-11 rounded-xl border-border text-muted-foreground font-semibold hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm bg-background/50">
                 <span class="mr-2 font-khmer">{{ $t('admin.projects_admin.view_details') }}</span>
                 <ArrowRightIcon class="h-4 w-4" />
              </Button>
           </RouterLink>
        </CardFooter>
      </Card>
      
      <!-- Empty State -->
      <div v-if="projects.length === 0" class="col-span-full py-32 text-center rounded-3xl bg-muted/30 border-2 border-dashed border-border flex flex-col items-center justify-center gap-4">
         <div class="size-20 rounded-full bg-card shadow-sm flex items-center justify-center text-muted-foreground/30 ring-1 ring-border">
            <FolderOpenIcon class="w-10 h-10" />
         </div>
         <div class="max-w-[300px] space-y-1">
            <p class="font-extrabold text-foreground text-lg">{{ $t('admin.projects_admin.empty_title') }}</p>
            <p class="text-sm font-medium text-muted-foreground">{{ $t('admin.projects_admin.empty_desc') }}</p>
         </div>
         <Button @click="openCreateModal" variant="outline" class="mt-4 rounded-xl border-border font-semibold">{{ $t('admin.forms.create_project') }}</Button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Dialog v-model:open="showModal">
       <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none bg-card shadow-lg">
          <div class="p-8 space-y-8">
            <DialogHeader>
                <DialogTitle class="text-2xl font-semibold text-foreground font-khmer">
                    {{ isEditing ? $t('admin.projects_admin.edit_project') : $t('admin.forms.create_project') }}
                </DialogTitle>
                <DialogDescription class="font-normal text-muted-foreground">
                    {{ $t('admin.forms.project_settings_desc') }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSave" class="space-y-6">
                <div class="grid gap-6">
                    <div class="grid gap-2">
                        <Label for="title" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.forms.project_name') }} *</Label>
                        <Input id="title" v-model="formData.title" required placeholder="ឧ. កសាងសាលាឆាន់" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                    </div>
                    
                    <div class="grid gap-2">
                        <Label for="description" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.forms.project_desc') }} *</Label>
                        <RichEditor v-model="formData.description" :placeholder="$t('admin.forms.project_desc')" />
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div class="grid gap-2">
                            <Label for="goalAmount" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.forms.goal_amount') }} ($) *</Label>
                            <Input id="goalAmount" type="number" v-model="formData.goalAmount" required class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                        </div>
                        
                        <div class="grid gap-2">
                            <Label for="status" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.forms.status') }} *</Label>
                            <Select v-model="formData.status" required>
                                <SelectTrigger class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11 text-left">
                                    <SelectValue :placeholder="$t('admin.forms.status')" />
                                </SelectTrigger>
                                <SelectContent class="rounded-xl p-1 shadow-lg border-border bg-card">
                                    <SelectItem value="planning" class="rounded-lg font-normal">{{ $t('common.status_planning') }}</SelectItem>
                                    <SelectItem value="draft" class="rounded-lg font-normal">{{ $t('admin.projects_admin.filter_draft') }}</SelectItem>
                                    <SelectItem value="active" class="rounded-lg font-normal">{{ $t('admin.projects_admin.filter_active') }}</SelectItem>
                                    <SelectItem value="paused" class="rounded-lg font-normal">{{ $t('admin.projects_admin.filter_paused') }}</SelectItem>
                                    <SelectItem value="completed" class="rounded-lg font-normal">{{ $t('admin.projects_admin.filter_completed') }}</SelectItem>
                                    <SelectItem value="cancelled" class="rounded-lg font-normal">{{ $t('common.status_cancelled') }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    
                    <div class="grid grid-cols-2 gap-6">
                        <div class="grid gap-2">
                            <Label for="location" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.forms.location') }}</Label>
                            <Input id="location" v-model="formData.location" :placeholder="$t('admin.forms.placeholder_location')" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                        </div>
                        <div class="grid gap-2">
                             <Label for="deadline" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.forms.deadline') }}</Label>
                             <Input id="deadline" type="date" v-model="deadlineInput" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                    <div class="space-y-4">
                        <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.forms.banner_image') }}</Label>
                        <div class="relative group aspect-video rounded-2xl bg-muted/30 border-2 border-dashed border-border overflow-hidden flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-all">
                            <template v-if="formData.bannerUrl">
                                <img :src="formData.bannerUrl" class="absolute inset-0 w-full h-full object-cover" />
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button type="button" variant="secondary" size="sm" class="rounded-xl" @click="formData.bannerUrl = ''">Remove</Button>
                                </div>
                            </template>
                            <template v-else>
                                <div v-if="uploadingBanner" class="flex flex-col items-center gap-2">
                                    <div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                    <span class="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Uploading...</span>
                                </div>
                                <label v-else class="cursor-pointer flex flex-col items-center gap-2 p-4 text-center">
                                    <UploadIcon class="h-6 w-6 text-muted-foreground/30" />
                                    <span class="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">Upload Banner</span>
                                    <input type="file" class="hidden" accept="image/*" @change="handleBannerUpload" />
                                </label>
                            </template>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <Label class="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">QR Code Image</Label>
                        <div class="relative group aspect-square max-w-[120px] mx-auto rounded-2xl bg-muted/30 border-2 border-dashed border-border overflow-hidden flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-all">
                            <template v-if="formData.qrCodeUrl">
                                <img :src="formData.qrCodeUrl" class="absolute inset-0 w-full h-full object-cover" />
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button type="button" variant="secondary" size="icon" class="rounded-lg h-8 w-8" @click="formData.qrCodeUrl = ''">
                                        <TrashIcon class="h-4 w-4" />
                                    </Button>
                                </div>
                            </template>
                            <template v-else>
                                <div v-if="uploadingQR" class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                <label v-else class="cursor-pointer p-4">
                                    <QrCodeIcon class="h-6 w-6 text-muted-foreground/30" />
                                    <input type="file" class="hidden" accept="image/*" @change="handleQRUpload" />
                                </label>
                            </template>
                        </div>
                    </div>
                </div>

                <DialogFooter class="flex flex-row gap-3 pt-4">
                    <Button type="button" variant="outline" @click="showModal = false" class="flex-1 rounded-xl h-11 font-medium border-border text-muted-foreground hover:bg-muted bg-background/50">{{ $t('admin.forms.cancel') }}</Button>
                    <Button type="submit" :disabled="saving || uploadingBanner || uploadingQR" class="flex-1 rounded-xl h-11 font-medium bg-primary text-white hover:bg-primary/90 shadow-sm">
                        <span v-if="saving" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        {{ isEditing ? $t('admin.forms.save_changes') : $t('admin.forms.create_project') }}
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
          <div class="h-14 w-14 rounded-2xl bg-rose-500/5 flex items-center justify-center text-rose-500 border border-rose-500/10">
             <Trash2Icon class="h-7 w-7" />
          </div>
          <DialogTitle class="text-xl font-semibold text-foreground font-khmer text-center">{{ $t('admin.projects_admin.confirm_delete_title') }}</DialogTitle>
          <DialogDescription class="font-normal text-muted-foreground leading-relaxed text-center">
            {{ $t('admin.projects_admin.confirm_delete_desc') }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="grid grid-cols-2 gap-3 pt-8">
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
console.log('🏁 [Admin Projects] Script setup starting...')
import { ref, computed, onMounted } from 'vue'
import { PlusIcon, FolderIcon, MoreVerticalIcon, PencilIcon, Trash2Icon, ArrowRightIcon, FolderOpenIcon, UploadIcon, QrCodeIcon, TrashIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from 'lucide-vue-next'
import { useProjects } from '~/composables/useProjects'
import { useCloudinary } from '~/composables/useCloudinary'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import RichEditor from '@/components/ui/RichEditor.vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import StatusBadge from '~/components/StatusBadge.vue'


const { projects, loading, fetchProjects, createProject, updateProject, deleteProject } = useProjects()
const { uploadImage } = useCloudinary()

const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const projectToDelete = ref<any>(null)
const saving = ref(false)
const deleting = ref(false)
const uploadingBanner = ref(false)
const uploadingQR = ref(false)
const statusFilter = ref('all')

const formData = ref({
   title: '',
   description: '',
   goalAmount: 0,
   status: 'draft' as 'draft' | 'planning' | 'active' | 'paused' | 'completed' | 'cancelled',
   bannerUrl: '',
   qrCodeUrl: '',
   location: '',
   deadline: null as Date | null
})

const deadlineInput = computed({
    get: () => {
        if (!formData.value.deadline) return ''
        const d = new Date(formData.value.deadline)
        if (isNaN(d.getTime())) return ''
        return d.toISOString().split('T')[0]
    },
    set: (val) => {
        formData.value.deadline = val ? new Date(val) : null
    }
})

const filteredProjects = computed(() => {
  if (statusFilter.value === 'all') return projects.value
  return projects.value.filter(p => p.status === statusFilter.value)
})

onMounted(() => {
   fetchProjects()
})

const openCreateModal = () => {
   isEditing.value = false
   editingId.value = null
   formData.value = {
      title: '',
      description: '',
      goalAmount: 0,
      status: 'planning',
      bannerUrl: '',
      qrCodeUrl: '',
      location: '',
      deadline: null
   }
   // default status could be 'draft' or 'planning'
   showModal.value = true
}

const openEditProject = (project: any) => {
   isEditing.value = true
   editingId.value = project.id
   formData.value = {
      title: project.title,
      description: project.description,
      goalAmount: project.goalAmount,
      status: project.status || 'active',
      bannerUrl: project.bannerUrl || '',
      qrCodeUrl: project.qrCodeUrl || '',
      location: project.location || '',
      deadline: project.deadline ? (project.deadline.toDate ? project.deadline.toDate() : new Date(project.deadline)) : null
   }
   showModal.value = true
}

const handleBannerUpload = async (event: Event) => {
   const file = (event.target as HTMLInputElement).files?.[0]
   if (!file) return
   uploadingBanner.value = true
   try {
      formData.value.bannerUrl = await uploadImage(file)
   } catch (e) {
      console.error(e)
   } finally {
      uploadingBanner.value = false
   }
}

const handleQRUpload = async (event: Event) => {
   const file = (event.target as HTMLInputElement).files?.[0]
   if (!file) return
   uploadingQR.value = true
   try {
      formData.value.qrCodeUrl = await uploadImage(file)
   } catch (e) {
      console.error(e)
   } finally {
      uploadingQR.value = false
   }
}

const handleSave = async () => {
   saving.value = true
   try {
      if (isEditing.value && editingId.value) {
         await updateProject(editingId.value, formData.value)
      } else {
         await createProject({
            ...formData.value,
            currentAmount: 0,
            startDate: new Date()
         })
      }
      showModal.value = false
      await fetchProjects()
   } catch (e) {
      console.error(e)
   } finally {
      saving.value = false
   }
}

const confirmDeleteProject = (project: any) => {
   projectToDelete.value = project
   showDeleteConfirm.value = true
}

const handleDelete = async () => {
   if (!projectToDelete.value?.id) return
   deleting.value = true
   try {
      await deleteProject(projectToDelete.value.id)
      showDeleteConfirm.value = false
      await fetchProjects()
   } catch (e) {
      console.error(e)
   } finally {
      deleting.value = false
   }
}

// Fetch projects on mount
onMounted(() => {
   console.log('📋 [Admin Projects] onMounted called')
   console.log('📋 [Admin Projects] Fetching projects...')
   fetchProjects()
})

const stripHtml = (html: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
