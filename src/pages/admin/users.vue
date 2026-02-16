<template>
  <div class="container py-10 space-y-10 transition-colors duration-300">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-foreground font-khmer">{{ $t('admin.users.title') }}</h1>
        <p class="text-muted-foreground mt-1 font-medium">{{ $t('admin.users.subtitle') }}</p>
      </div>
      <Button @click="showAddUserModal = true" class="rounded-xl shadow-lg shadow-primary/20 font-bold h-11 px-6">
        <PlusIcon class="mr-2 h-4 w-4" />
        {{ $t('admin.users.add_new') }}
      </Button>
    </div>

    <!-- Users Table -->
    <div class="rounded-3xl border border-border bg-card shadow-sm overflow-x-auto ring-1 ring-border/5">
      <div class="min-w-[800px]">
        <Table>
        <TableHeader class="bg-muted/50">
          <TableRow class="hover:bg-transparent border-b-border">
            <TableHead class="font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60 py-5 pl-8">{{ $t('admin.users.table_name') }}</TableHead>
            <TableHead class="font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60 py-5">{{ $t('admin.users.table_phone') }}</TableHead>
            <TableHead class="font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60 py-5">{{ $t('admin.users.table_role') }}</TableHead>
            <TableHead class="font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60 py-5">{{ $t('admin.users.table_status') }}</TableHead>
            <TableHead class="font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60 py-5">{{ $t('admin.users.table_login') }}</TableHead>
            <TableHead class="font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60 py-5 text-right pr-8">{{ $t('admin.users.table_action') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="u in users" :key="u.uid" class="hover:bg-muted/50 transition-colors border-b-border last:border-0 group">
            <TableCell class="py-5 pl-8 text-left">
              <div class="flex items-center gap-4">
                <Avatar class="h-11 w-11 rounded-xl border-2 border-background shadow-sm ring-1 ring-border">
                  <AvatarImage v-if="u.photoURL" :src="u.photoURL" />
                  <AvatarFallback class="bg-muted text-muted-foreground font-black text-xs uppercase">{{ u.displayName?.slice(0, 2).toUpperCase() || 'U' }}</AvatarFallback>
                </Avatar>
                <div class="flex flex-col gap-0.5 text-left">
                  <span class="font-extrabold text-foreground flex items-center gap-2">
                    {{ u.displayName }}
                    <span v-if="u.role === 'super_admin'" class="inline-flex items-center rounded-md bg-red-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-red-600 ring-1 ring-inset ring-red-500/20">Super</span>
                  </span>
                  <span class="text-xs font-medium text-muted-foreground truncate max-w-[180px]">{{ u.email }}</span>
                </div>
              </div>
            </TableCell>
            <TableCell class="py-5 text-sm font-bold text-muted-foreground tabular-nums text-left">
              {{ u.phoneNumber || '-' }}
            </TableCell>
            <TableCell class="py-5 text-left">
              <Badge 
                :variant="u.role === 'staff' ? 'secondary' : 'default'" 
                :class="{
                  'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 ring-1 ring-blue-500/20' : u.role === 'admin',
                  'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 ring-1 ring-rose-500/20': u.role === 'super_admin',
                  'bg-muted text-muted-foreground hover:bg-muted/80 ring-1 ring-border': u.role === 'staff'
                }"
                class="uppercase text-[9px] font-black tracking-widest px-2.5 py-0.5 border-none"
              >
                {{ $t('admin.users.' + u.role) }}
              </Badge>
            </TableCell>
            <TableCell class="py-5 text-left">
              <div class="flex items-center gap-2">
                <div :class="u.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/30'" class="size-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                <span class="text-[11px] font-black uppercase tracking-wide text-muted-foreground font-mono">{{ $t('admin.users.' + u.status) }}</span>
              </div>
            </TableCell>
            <TableCell class="py-5 text-[11px] tabular-nums font-bold text-muted-foreground italic text-left">
              {{ formatDateTime(u.lastLoginAt) }}
            </TableCell>
            <TableCell class="text-right py-5 pr-8">
              <div v-if="u.role !== 'super_admin' || authStore.isSuperAdmin" class="flex justify-end gap-2">
                <Button variant="ghost" size="icon" class="h-8 w-8 rounded-lg hover:bg-muted transition-colors text-muted-foreground" @click="openEditProfile(u)">
                  <PencilIcon class="h-3.5 w-3.5" />
                </Button>
                <DropdownMenu v-if="u.uid !== authStore.user?.uid">
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8 p-0 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-48 bg-card border-border rounded-xl p-1 shadow-2xl">
                    <DropdownMenuLabel class="text-xs font-black uppercase tracking-widest text-muted-foreground p-3">{{ $t('admin.users.account_management') }}</DropdownMenuLabel>
                    <DropdownMenuSeparator class="bg-border" />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger class="rounded-lg font-bold">{{ $t('admin.users.change_role') }}</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent class="bg-card border-border rounded-xl p-1 shadow-2xl">
                          <DropdownMenuItem @click="updateUserRole(u, 'staff')" class="rounded-lg font-bold">{{ $t('admin.users.staff') }}</DropdownMenuItem>
                          <DropdownMenuItem @click="updateUserRole(u, 'admin')" class="rounded-lg font-bold">{{ $t('admin.users.admin') }}</DropdownMenuItem>
                          <DropdownMenuItem v-if="authStore.isSuperAdmin" @click="updateUserRole(u, 'super_admin')" class="text-rose-600 font-black rounded-lg">{{ $t('admin.users.super_admin') }}</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator class="bg-border" />
                    <DropdownMenuItem v-if="u.status !== 'active'" @click="updateUserStatus(u, 'active')" class="text-emerald-600 font-bold rounded-lg cursor-pointer">{{ $t('admin.users.set_active') }}</DropdownMenuItem>
                    <DropdownMenuItem v-if="u.status !== 'disabled'" @click="updateUserStatus(u, 'disabled')" class="text-rose-600 font-bold rounded-lg cursor-pointer">{{ $t('admin.users.disable_account') }}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div v-else class="flex justify-end">
                <Badge variant="outline" class="text-[8px] opacity-30 border-muted-foreground">PROTECTED</Badge>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-if="loading">
            <TableCell colspan="6" class="h-32 text-center">
               <div class="flex justify-center"><div class="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div></div>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="users.length === 0">
            <TableCell colspan="6" class="h-32 text-center text-muted-foreground italic font- khmer">
              មិនទាន់មានអ្នកប្រើប្រាស់នៅឡើយទេ
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent class="max-w-xl rounded-2xl p-0 border-none bg-card shadow-lg">
        <div class="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle class="text-xl font-semibold text-foreground font-khmer">{{ $t('admin.users.edit_profile') }}</DialogTitle>
              <DialogDescription class="font-normal text-muted-foreground">{{ $t('admin.users.edit_profile_description') }}</DialogDescription>
            </DialogHeader>
            <div v-if="editingUser" class="space-y-6">
              <div class="grid grid-cols-2 gap-6">
                <div class="grid gap-2">
                  <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.users.table_name') }}</Label>
                  <Input v-model="editForm.displayName" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                </div>
                <div class="grid gap-2">
                  <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">{{ $t('admin.users.table_phone') }}</Label>
                  <Input v-model="editForm.phoneNumber" placeholder="012xxxxxx" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
                </div>
              </div>
              <div class="grid gap-2">
                <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">Telegram Handle</Label>
                <Input v-model="editForm.telegramHandle" placeholder="@username" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-11" />
              </div>
              <div class="grid gap-2">
                <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">Note ផ្ទៃក្នុង</Label>
                <textarea 
                  v-model="editForm.note" 
                  class="flex min-h-[100px] w-full rounded-xl border border-border bg-muted/30 px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:bg-background transition-all resize-none font-normal"
                ></textarea>
              </div>
              <DialogFooter class="flex flex-row gap-3 pt-4">
                <Button variant="outline" class="flex-1 rounded-xl h-11 font-medium border-border text-muted-foreground hover:bg-muted bg-background/50" @click="showEditModal = false">{{ $t('admin.forms.cancel') }}</Button>
                <Button class="flex-1 rounded-xl h-11 font-medium bg-primary text-white hover:bg-primary/90 shadow-sm" @click="handleUpdateProfile" :disabled="saving">
                  <span v-if="saving" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  {{ $t('admin.users.save_user') }}
                </Button>
              </DialogFooter>
            </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Add User Modal (Reference Only) -->
    <Dialog v-model:open="showAddUserModal">
       <DialogContent class="max-w-md rounded-2xl p-8 border-none bg-card shadow-lg">
        <DialogHeader class="space-y-4 text-center items-center">
          <div class="size-14 rounded-2xl bg-orange-500/5 flex items-center justify-center text-orange-500 border border-orange-500/10">
             <ShieldAlertIcon class="size-7" />
          </div>
          <DialogTitle class="text-xl font-semibold text-foreground font-khmer">បន្ថែមបុគ្គលិកថ្មី</DialogTitle>
          <DialogDescription class="font-normal text-muted-foreground text-center leading-relaxed">
            ចំណាំ៖ អ្នកប្រើប្រាស់ដែលបន្ថែមនៅទីនេះ ត្រូវតែចុះឈ្មោះចូលប្រើប្រាស់ជាមុនសិន ឬប្រើប្រាស់ Cloud Functions ដើម្បីបង្កើត Auth User ។
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 text-center pt-4">
          <p class="text-sm font-normal text-muted-foreground">ក្នុងកំណែបច្ចុប្បន្ន សូមអោយបុគ្គលិកចុះឈ្មោះដោយខ្លួនឯងជាមុនសិន។ បន្ទាប់មក Admin អាចមកកំណត់តួនាទីនៅទីនេះបាន។</p>
          <DialogFooter class="pt-8">
            <Button variant="outline" class="w-full rounded-xl h-11 font-medium border-border bg-background/50 hover:bg-muted" @click="showAddUserModal = false">យល់ព្រម</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, MoreVerticalIcon, PencilIcon, ShieldAlertIcon } from 'lucide-vue-next'
import { collection, query, getDocs, doc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore'
import { initFirebase } from '~/utils/firebase'
import { useAuthStore, type UserProfile } from '~/stores/auth'
import { format } from 'date-fns'


const authStore = useAuthStore()
const { db } = initFirebase()
const users = ref<UserProfile[]>([])
const loading = ref(true)
const saving = ref(false)
const showAddUserModal = ref(false)
const showEditModal = ref(false)

const editingUser = ref<UserProfile | null>(null)
const editForm = ref({
  displayName: '',
  phoneNumber: '',
  telegramHandle: '',
  note: ''
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const q = query(collection(db, 'users'), orderBy('updatedAt', 'desc'))
    const querySnapshot = await getDocs(q)
    users.value = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id
    }) as UserProfile)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const updateUserStatus = async (user: UserProfile, newStatus: UserProfile['status']) => {
  // Security Guard: Admin cannot disable Super Admin
  if (user.role === 'super_admin' && !authStore.isSuperAdmin) return
  // Security Guard: Cannot disable self
  if (user.uid === authStore.user?.uid) return

  try {
    await updateDoc(doc(db, 'users', user.uid), { 
      status: newStatus,
      updatedAt: serverTimestamp() 
    })
    user.status = newStatus
  } catch (err) {
    console.error(err)
  }
}

const updateUserRole = async (user: UserProfile, newRole: UserProfile['role']) => {
  // Security Guard: Admin cannot change Super Admin role
  if (user.role === 'super_admin' && !authStore.isSuperAdmin) return
  // Security Guard: Only super admin can create super admin
  if (newRole === 'super_admin' && !authStore.isSuperAdmin) return

  try {
    await updateDoc(doc(db, 'users', user.uid), { 
      role: newRole,
      updatedAt: serverTimestamp() 
    })
    user.role = newRole
  } catch (err) {
    console.error(err)
  }
}

const openEditProfile = (user: UserProfile) => {
  editingUser.value = user
  editForm.value = {
    displayName: user.displayName || '',
    phoneNumber: user.phoneNumber || '',
    telegramHandle: user.telegramHandle || '',
    note: user.note || ''
  }
  showEditModal.value = true
}

const handleUpdateProfile = async () => {
  if (!editingUser.value) return
  saving.value = true
  try {
    await updateDoc(doc(db, 'users', editingUser.value.uid), {
      ...editForm.value,
      updatedAt: serverTimestamp()
    })
    // Sync local state
    Object.assign(editingUser.value, editForm.value)
    showEditModal.value = false
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const formatDateTime = (ts: any) => {
  if (!ts) return 'Never'
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return format(date, 'dd/MM/yy HH:mm')
}

onMounted(fetchUsers)
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
