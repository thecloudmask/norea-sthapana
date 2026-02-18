<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent side="bottom" class="h-[90vh] sm:h-[85vh] w-full max-w-4xl mx-auto rounded-t-[32px] p-0 border-none bg-card shadow-2xl flex flex-col">
      <div class="p-6 flex-1 overflow-y-auto custom-scrollbar">
        <SheetHeader class="mb-8">
          <div class="flex items-center justify-between gap-4">
             <SheetTitle class="text-2xl font-bold text-foreground font-khmer">
               {{ isEditing ? $t('admin.ceremony_finance.edit_income') : $t('admin.ceremony_finance.add_income') }}
             </SheetTitle>
             <Button v-if="!isEditing" variant="ghost" size="sm" @click="closeModal" class="h-8 px-2 text-muted-foreground hover:text-foreground">
                {{ $t('common.close') }}
             </Button>
          </div>
          <SheetDescription class="text-muted-foreground mt-2">
            {{ $t('admin.ceremony_finance.donor_info') }}
          </SheetDescription>
        </SheetHeader>

        <!-- Duplicate Warning (Only for new entries) -->
        <div v-if="!isEditing && duplicateWarning.isDuplicate" class="mb-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 space-y-3 animate-in fade-in zoom-in duration-300">
          <div class="flex items-start gap-3">
            <AlertTriangleIcon class="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div class="flex-1 space-y-2">
              <p class="text-sm font-semibold text-orange-600 uppercase tracking-wider text-[10px]">
                {{ $t('admin.ceremony_finance.duplicate_warning.title') }}
              </p>
              <p class="text-xs text-orange-600/80 leading-relaxed">
                {{ $t('admin.ceremony_finance.duplicate_warning.message') }}
              </p>
              <div v-for="record in duplicateWarning.similarRecords" :key="record.id" class="bg-card/50 rounded-xl p-3 border border-orange-500/10">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-bold text-sm text-foreground font-khmer">{{ record.donorName }}</p>
                    <p class="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">
                      {{ record.currency === 'USD' ? $t('common.currency_usd') : $t('common.currency_khr') }}{{ record.amount.toLocaleString() }} • 
                      {{ $t(`admin.ceremony_finance.payment_methods.${record.paymentMethod}`) }}
                    </p>
                  </div>
                  <span class="text-[10px] bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground">
                    {{ formatTimeAgo(record.createdAt) }}
                  </span>
                </div>
              </div>
              <p class="text-xs text-orange-600 font-bold mt-2">
                {{ $t('admin.ceremony_finance.duplicate_warning.question') }}
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Receipt Number (Read-only for Edit) -->
          <div v-if="isEditing" class="space-y-2.5 bg-muted/30 p-4 rounded-2xl border border-border/50">
             <Label class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
               {{ $t('admin.ceremony_finance.receipt_number') }}
             </Label>
             <div class="text-lg font-mono font-bold text-primary">{{ initialData?.receiptNumber }}</div>
          </div>

          <!-- Donor Name -->
          <div class="space-y-2.5">
            <Label for="donorName" class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center justify-between">
              <span>{{ $t('admin.ceremony_finance.donor_name') }}</span>
              <span class="text-rose-500 text-sm">*</span>
            </Label>
            <Input 
              id="donorName"
              v-model="formData.donorName"
              ref="nameInput"
              required
              :placeholder="$t('admin.ceremony_finance.donor_name')"
              class="rounded-xl border-border bg-muted/20 h-12 text-base font-khmer focus:ring-2 focus:ring-primary/20 transition-all font-medium py-3 px-4"
            />
          </div>

          <!-- Donor Phone -->
          <div class="space-y-2.5">
            <Label for="donorPhone" class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {{ $t('admin.ceremony_finance.donor_phone') }} ({{ $t('admin.ceremony_finance.form.optional') }})
            </Label>
            <Input 
              id="donorPhone"
              v-model="formData.donorPhone"
              type="tel"
              :placeholder="$t('admin.ceremony_finance.donor_phone')"
              class="rounded-xl border-border bg-muted/20 h-12 text-base focus:ring-2 focus:ring-primary/20 transition-all font-medium py-3 px-4"
            />
          </div>

          <!-- Amount & Currency -->
          <div class="grid grid-cols-5 gap-4">
            <div class="col-span-3 space-y-2.5">
              <Label for="amount" class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center justify-between">
                <span>{{ $t('admin.ceremony_finance.amount') }}</span>
                <span class="text-rose-500 text-sm">*</span>
              </Label>
              <Input 
                id="amount"
                v-model.number="formData.amount"
                type="number"
                step="0.01"
                min="0"
                required
                :placeholder="$t('admin.ceremony_finance.form.enter_amount')"
                class="rounded-xl border-border bg-muted/20 h-12 text-lg font-bold tabular-nums focus:ring-2 focus:ring-primary/20 transition-all py-3 px-4"
              />
            </div>
            <div class="col-span-2 space-y-2.5">
              <Label for="currency" class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center justify-between">
                <span>{{ $t('admin.ceremony_finance.currency') }}</span>
                <span class="text-rose-500 text-sm">*</span>
              </Label>
              <Select v-model="formData.currency" required>
                <SelectTrigger class="rounded-xl border-border bg-muted/20 h-12 font-bold">
                  <SelectValue :placeholder="$t('admin.ceremony_finance.form.select_currency')" />
                </SelectTrigger>
                <SelectContent class="bg-card border-border rounded-xl">
                  <SelectItem value="USD" class="font-normal">{{ $t('common.currency_usd') }}</SelectItem>
                  <SelectItem value="KHR" class="font-normal">{{ $t('common.currency_khr') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="space-y-2.5">
            <Label for="paymentMethod" class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center justify-between">
              <span>{{ $t('admin.ceremony_finance.payment_method') }}</span>
              <span class="text-rose-500 text-sm">*</span>
            </Label>
            <Select v-model="formData.paymentMethod" required>
              <SelectTrigger class="rounded-xl border-border bg-muted/20 h-12 font-medium">
                <SelectValue :placeholder="$t('admin.ceremony_finance.form.select_payment')" />
              </SelectTrigger>
              <SelectContent class="bg-card border-border rounded-xl shadow-xl">
                <SelectItem value="cash" class="font-medium font-khmer">{{ $t('admin.ceremony_finance.payment_methods.cash') }}</SelectItem>
                <SelectItem value="aba" class="font-medium font-khmer">{{ $t('admin.ceremony_finance.payment_methods.aba') }}</SelectItem>
                <SelectItem value="acleda" class="font-medium font-khmer">{{ $t('admin.ceremony_finance.payment_methods.acleda') }}</SelectItem>
                <SelectItem value="wing" class="font-medium font-khmer">{{ $t('admin.ceremony_finance.payment_methods.wing') }}</SelectItem>
                <SelectItem value="truemoney" class="font-medium font-khmer">{{ $t('admin.ceremony_finance.payment_methods.truemoney') }}</SelectItem>
                <SelectItem value="qr" class="font-medium font-khmer">{{ $t('admin.ceremony_finance.payment_methods.qr') }}</SelectItem>
                <SelectItem value="other" class="font-medium font-khmer">{{ $t('admin.ceremony_finance.payment_methods.other') }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Payment Method Other -->
          <div v-if="formData.paymentMethod === 'other'" class="space-y-2.5 animate-in slide-in-from-top-1 duration-200">
            <Label for="paymentMethodOther" class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {{ $t('admin.ceremony_finance.payment_methods.other') }}
            </Label>
            <Input 
              id="paymentMethodOther"
              v-model="formData.paymentMethodOther"
              :placeholder="$t('admin.ceremony_finance.payment_methods.other')"
              class="rounded-xl border-border bg-muted/20 h-12 font-medium py-3 px-4"
            />
          </div>

          <!-- Description -->
          <div class="space-y-2.5">
            <Label for="description" class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {{ $t('admin.ceremony_finance.description') }} ({{ $t('admin.ceremony_finance.form.optional') }})
            </Label>
            <Textarea 
              id="description"
              v-model="formData.description"
              :placeholder="$t('admin.ceremony_finance.form.enter_description')"
              class="rounded-xl border-border bg-muted/20 min-h-[100px] resize-none font-khmer py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>

          <!-- Receipt Image Upload -->
          <div class="space-y-4 pt-4 border-t border-border/50">
            <Label class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{{ $t('admin.ceremony_finance.receipt') }} ({{ $t('admin.ceremony_finance.form.optional') }})</Label>
            
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3">
                 <div class="relative flex-1">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      @change="handleImageUpload" 
                      :disabled="uploadingImage" 
                      class="rounded-xl border-border bg-muted/20 text-[10px] h-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                    />
                 </div>
                 <div v-if="uploadingImage" class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent flex-shrink-0"></div>
              </div>
              
              <div v-if="formData.receiptUrl" class="relative group aspect-video w-full max-w-[300px] rounded-2xl overflow-hidden border border-border bg-muted shadow-inner self-center">
                  <img :src="formData.receiptUrl" class="w-full h-full object-contain" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button type="button" variant="destructive" size="sm" class="rounded-xl h-8" @click="formData.receiptUrl = ''">
                        <TrashIcon class="size-3.5 mr-1" />
                        Remove
                      </Button>
                  </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer Actions -->
      <div class="p-6 border-t border-border/50 bg-muted/10">
        <div class="flex flex-col gap-3">
          <Button 
            @click="handleSubmit" 
            :disabled="loading"
            class="w-full h-14 text-lg font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
          >
            <span v-if="loading" class="mr-2 h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent"></span>
            <span v-else class="flex items-center gap-2">
               <SaveIcon class="size-5" />
               {{ isEditing ? $t('admin.ceremony_finance.form.save') : $t('admin.ceremony_finance.add_income') }}
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            @click="closeModal" 
            class="w-full h-12 rounded-xl text-muted-foreground hover:bg-muted font-medium"
          >
            <CheckCircle2Icon class="size-4 mr-2" />
            {{ $t('admin.forms.cancel') }}
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, nextTick } from 'vue'
import { AlertTriangleIcon, SaveIcon, CheckCircle2Icon, TrashIcon } from 'lucide-vue-next'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCeremonyFinance } from '~/composables/useCeremonyFinance'
import { useCloudinary } from '~/composables/useCloudinary'
import type { IncomeFormData, DuplicateCheckResult, CeremonyIncome } from '~/types/ceremonyFinance'
import { useToast } from '@/components/ui/toast/use-toast'
import { useI18n } from 'vue-i18n'
import { formatDistanceToNow } from 'date-fns'
import { km, enUS } from 'date-fns/locale'

const locales: Record<string, any> = { km, en: enUS }

const props = defineProps<{
  open: boolean
  ceremonyId: string
  userId: string
  initialData?: CeremonyIncome | null
  existingIncomes?: CeremonyIncome[]
}>()

const emit = defineEmits(['update:open', 'success'])

const { t } = useI18n()
const { toast } = useToast()
const { addIncome, updateIncome, checkDuplicateIncomesLocal } = useCeremonyFinance()
const { uploadImage } = useCloudinary()

const nameInput = ref<any>(null)
const forceSave = ref(false)
const loading = ref(false)
const uploadingImage = ref(false)
const duplicateWarning = ref<DuplicateCheckResult>({
  isDuplicate: false,
  similarRecords: [],
  confidence: 'low'
})

const isEditing = computed(() => !!props.initialData)

const formData = reactive<IncomeFormData>({
  donorName: '',
  donorPhone: '',
  amount: 0,
  currency: 'USD',
  paymentMethod: 'cash',
  paymentMethodOther: '',
  description: '',
  receiptUrl: ''
})

const closeModal = () => {
  emit('update:open', false)
}

const resetForm = () => {
  formData.donorName = ''
  formData.donorPhone = ''
  formData.amount = 0
  formData.description = ''
  formData.receiptUrl = ''
  // Stick values: currency, paymentMethod
  duplicateWarning.value = {
    isDuplicate: false,
    similarRecords: [],
    confidence: 'low'
  }
  forceSave.value = false
  
  // Refocus name input for next fast entry
  nextTick(() => {
    nameInput.value?.$el?.focus()
  })
}

const resetAllFields = () => {
  resetForm()
  formData.currency = 'USD'
  formData.paymentMethod = 'cash'
  formData.paymentMethodOther = ''
}

// Watch initialData
watch(() => props.initialData, (val) => {
  if (val) {
    formData.donorName = val.donorName
    formData.donorPhone = val.donorPhone || ''
    formData.amount = val.amount
    formData.currency = val.currency
    formData.paymentMethod = val.paymentMethod
    formData.paymentMethodOther = val.paymentMethod === 'other' ? (val as any).paymentMethodOther || '' : '' 
    formData.description = val.description || ''
    formData.receiptUrl = val.receiptUrl || ''
  } else {
    resetAllFields()
  }
}, { immediate: true })

// Reset form when drawer closes
watch(() => props.open, (val) => {
  if (!val) {
    setTimeout(() => {
        if (!props.open) resetAllFields()
    }, 300)
  }
})

// Real-time duplicate check
watch(
  [() => formData.donorName, () => formData.amount, () => formData.currency],
  () => {
    checkDuplicate()
  }
)

const checkDuplicate = () => {
  if (isEditing.value || !formData.donorName || !formData.amount || !props.existingIncomes) {
    duplicateWarning.value = { isDuplicate: false, similarRecords: [], confidence: 'low' }
    return
  }
  
  forceSave.value = false
  
  const result = checkDuplicateIncomesLocal(
    props.existingIncomes,
    formData.donorName,
    formData.amount,
    formData.currency
  )
  
  duplicateWarning.value = result
}

const handleImageUpload = async (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadingImage.value = true
  try {
    const url = await uploadImage(file)
    formData.receiptUrl = url
    toast({
      title: t('admin.ceremony_finance.messages.upload_success'),
      description: t('admin.ceremony_finance.messages.upload_success_desc'),
    })
  } catch (err: any) {
    toast({
      title: t('admin.ceremony_finance.messages.upload_error'),
      description: err.message,
      variant: 'destructive',
    })
  } finally {
    uploadingImage.value = false
  }
}

const handleSubmit = async () => {
  if (!isEditing.value && !forceSave.value) {
    checkDuplicate()
    
    if (duplicateWarning.value.isDuplicate) {
      forceSave.value = true
      toast({
        title: t('admin.ceremony_finance.duplicate_warning.title'),
        description: t('admin.ceremony_finance.duplicate_warning.question'),
        variant: 'destructive'
      })
      return
    }
  }

  loading.value = true
  
  try {
    let result;
    
    if (isEditing.value && props.initialData) {
        result = await updateIncome(props.initialData.id, formData, props.userId)
    } else {
        result = await addIncome(props.ceremonyId, formData, props.userId)
    }
    
    if (result.success) {
      toast({
        title: isEditing.value 
            ? t('admin.ceremony_finance.messages.update_success') 
            : t('admin.ceremony_finance.messages.add_success'),
        description: `${t('admin.ceremony_finance.donor_name')}: ${formData.donorName} (${formData.currency === 'USD' ? t('common.currency_usd') : t('common.currency_khr')}${formData.amount.toLocaleString()})`,
      })
      
      emit('success')
      
      if (isEditing.value) {
        closeModal()
      } else {
        // POS MODE: Fast entry - Keep open but clear personal fields
        resetForm()
      }
    } else {
      toast({
        title: isEditing.value 
            ? t('admin.ceremony_finance.messages.update_error')
            : t('admin.ceremony_finance.messages.add_error'),
        description: result.error,
        variant: 'destructive'
      })
    }
  } catch (error: any) {
    toast({
      title: t('common.error'),
      description: error.message,
      variant: 'destructive'
    })
  } finally {
    loading.value = false
  }
}

const formatTimeAgo = (date: any) => {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : new Date(date)
  const activeLocale = locales[t('common.locale_key') || 'km'] || km
  return formatDistanceToNow(d, { addSuffix: true, locale: activeLocale })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.2);
}
</style>
