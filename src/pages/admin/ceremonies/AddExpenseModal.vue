<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent side="bottom" class="h-[90vh] sm:h-[85vh] w-full max-w-4xl mx-auto rounded-t-[32px] p-0 border-none bg-card shadow-xl flex flex-col">
      <div class="p-6 flex-1 overflow-y-auto custom-scrollbar">
        <SheetHeader class="mb-8">
          <div class="flex items-center justify-between gap-4">
            <SheetTitle class="text-2xl font-semibold text-foreground font-khmer uppercase tracking-tight">
              {{ isEditing ? $t('admin.ceremony_finance.edit_expense') : $t('admin.ceremony_finance.add_expense') }}
            </SheetTitle>
            <Button v-if="!isEditing" variant="ghost" size="sm" @click="closeModal" class="h-8 px-2 text-muted-foreground hover:text-foreground">
               {{ $t('common.close') }}
            </Button>
          </div>
          <SheetDescription class="text-muted-foreground mt-2">
            {{ $t('admin.ceremony_finance.expense_form_desc') }}
          </SheetDescription>
        </SheetHeader>

        <form @submit.prevent="handleSubmit" class="space-y-6">
           <div v-if="isEditing" class="space-y-2.5 bg-muted/30 p-4 rounded-2xl border border-border/50">
              <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 font-khmer">
                {{ $t('admin.ceremony_finance.expense_number') }}
              </Label>
              <div class="text-lg font-mono font-semibold text-destructive tracking-tight">{{ initialData?.expenseNumber }}</div>
           </div>

          <!-- Item Name -->
          <div class="space-y-2.5">
            <Label for="itemName" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 flex items-center justify-between">
              <span class="font-khmer">{{ $t('admin.ceremony_finance.item_name') }}</span>
              <span class="text-rose-500 text-sm">*</span>
            </Label>
            <Input 
              id="itemName"
              v-model="formData.itemName"
              ref="itemInput"
              required
              :placeholder="$t('admin.ceremony_finance.item_name')"
              class="rounded-xl border-border bg-muted/30 h-11 text-base font-khmer focus:bg-background transition-all font-normal py-3 px-4"
            />
          </div>

          <!-- Category -->
          <div class="space-y-2.5">
            <Label for="category" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 flex items-center justify-between">
              <span class="font-khmer">{{ $t('admin.ceremony_finance.category') }}</span>
              <span class="text-rose-500 text-sm">*</span>
            </Label>
            <Select v-model="formData.category" required>
              <SelectTrigger class="rounded-xl border-border bg-muted/30 h-11 font-normal font-khmer focus:bg-background transition-all">
                <SelectValue :placeholder="$t('admin.ceremony_finance.form.select_category')" />
              </SelectTrigger>
              <SelectContent class="bg-card border-border rounded-xl font-khmer font-normal z-[100]">
                <SelectItem value="food" class="font-normal">{{ $t('admin.ceremony_finance.expense_categories.food') }}</SelectItem>
                <SelectItem value="transport" class="font-normal">{{ $t('admin.ceremony_finance.expense_categories.transport') }}</SelectItem>
                <SelectItem value="venue" class="font-normal">{{ $t('admin.ceremony_finance.expense_categories.venue') }}</SelectItem>
                <SelectItem value="materials" class="font-normal">{{ $t('admin.ceremony_finance.expense_categories.materials') }}</SelectItem>
                <SelectItem value="service" class="font-normal">{{ $t('admin.ceremony_finance.expense_categories.service') }}</SelectItem>
                <SelectItem value="monks" class="font-normal">{{ $t('admin.ceremony_finance.expense_categories.monks') }}</SelectItem>
                <SelectItem value="music" class="font-normal">{{ $t('admin.ceremony_finance.expense_categories.music') }}</SelectItem>
                <SelectItem value="other" class="font-normal">{{ $t('admin.ceremony_finance.expense_categories.other') }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Quantity & Unit Price -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2.5">
              <Label for="quantity" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 font-khmer">
                {{ $t('admin.ceremony_finance.quantity') }}
              </Label>
              <Input 
                id="quantity"
                v-model.number="formData.quantity"
                type="number"
                min="1"
                :placeholder="$t('admin.ceremony_finance.quantity')"
                class="rounded-xl border-border bg-muted/30 h-11 text-base font-semibold tabular-nums focus:bg-background transition-all py-3 px-4"
                @input="calculateTotal"
              />
            </div>
            <div class="space-y-2.5">
              <Label for="unitPrice" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 font-khmer">
                {{ $t('admin.ceremony_finance.unit_price') }}
              </Label>
              <Input 
                id="unitPrice"
                v-model.number="formData.unitPrice"
                type="number"
                step="0.01"
                min="0"
                :placeholder="$t('admin.ceremony_finance.unit_price')"
                class="rounded-xl border-border bg-muted/30 h-11 text-base font-semibold tabular-nums focus:bg-background transition-all py-3 px-4"
                @input="calculateTotal"
              />
            </div>
          </div>

          <!-- Amount & Currency -->
          <div class="grid grid-cols-5 gap-4">
            <div class="col-span-3 space-y-2.5">
              <Label for="amount" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 flex items-center justify-between">
                <span class="font-khmer">{{ $t('admin.ceremony_finance.amount') }}</span>
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
                class="rounded-xl border-border bg-muted/30 h-11 text-lg font-bold tabular-nums focus:bg-background transition-all py-3 px-4"
              />
            </div>
            <div class="col-span-2 space-y-2.5">
              <Label for="currency" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 flex items-center justify-between">
                <span class="font-khmer">{{ $t('admin.ceremony_finance.currency') }}</span>
                <span class="text-rose-500 text-sm">*</span>
              </Label>
              <Select v-model="formData.currency" required>
                <SelectTrigger class="rounded-xl border-border bg-muted/30 h-11 font-bold text-center focus:bg-background transition-all">
                  <SelectValue :placeholder="$t('admin.ceremony_finance.form.select_currency')" />
                </SelectTrigger>
                <SelectContent class="bg-card border-border rounded-xl z-[100]">
                  <SelectItem value="USD" class="font-normal">{{ $t('common.currency_usd') }}</SelectItem>
                  <SelectItem value="KHR" class="font-normal">{{ $t('common.currency_khr') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Vendor & Paid By -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2.5">
              <Label for="vendor" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 font-khmer">
                {{ $t('admin.ceremony_finance.vendor') }}
              </Label>
              <Input 
                id="vendor"
                v-model="formData.vendor"
                :placeholder="$t('admin.ceremony_finance.vendor')"
                class="rounded-xl border-border bg-muted/30 h-11 text-base font-khmer focus:bg-background transition-all font-normal py-3 px-4"
              />
            </div>
            <div class="space-y-2.5">
              <Label for="paidBy" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 font-khmer">
                {{ $t('admin.ceremony_finance.paid_by') }}
              </Label>
              <Input 
                id="paidBy"
                v-model="formData.paidBy"
                :placeholder="$t('admin.ceremony_finance.paid_by')"
                class="rounded-xl border-border bg-muted/30 h-11 text-base font-khmer focus:bg-background transition-all font-normal py-3 px-4"
              />
            </div>
          </div>

          <!-- Paid Date -->
          <div class="space-y-2.5">
            <Label for="paidDate" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 font-khmer">
              {{ $t('admin.ceremony_finance.paid_date') }}
            </Label>
            <Input 
              id="paidDate"
              v-model="paidDateInput"
              type="date"
              class="rounded-xl border-border bg-muted/30 h-11 text-base focus:bg-background transition-all font-normal py-3 px-4"
            />
          </div>

          <!-- Description -->
          <div class="space-y-2.5">
            <Label for="description" class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 font-khmer">
              {{ $t('admin.ceremony_finance.description') }}
            </Label>
            <Textarea 
              id="description"
              v-model="formData.description"
              :placeholder="$t('admin.ceremony_finance.form.enter_description')"
              class="rounded-xl border-border bg-muted/30 min-h-[100px] resize-none font-khmer py-3 px-4 focus:bg-background transition-all font-normal"
            />
          </div>

          <!-- Receipt Image Upload -->
          <div class="space-y-4 pt-4 border-t border-border/50">
            <Label class="text-xs font-medium uppercase tracking-wider text-muted-foreground/80 font-khmer">{{ $t('admin.ceremony_finance.receipt') }} ({{ $t('admin.ceremony_finance.form.optional') }})</Label>
            
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3">
                 <div class="relative flex-1">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      @change="handleImageUpload" 
                      :disabled="uploadingImage" 
                      class="rounded-xl border-border bg-muted/30 text-[10px] h-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
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
            class="w-full h-11 text-base font-medium rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:scale-[0.98] transition-all"
          >
            <span v-if="loading" class="mr-2 h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent"></span>
            <span v-else class="flex items-center gap-2">
               <SaveIcon class="size-5" />
               {{ isEditing ? $t('admin.ceremony_finance.form.save') : $t('admin.ceremony_finance.add_expense') }}
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            @click="closeModal" 
            class="w-full h-11 rounded-xl text-muted-foreground hover:bg-muted font-medium"
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
import { SaveIcon, CheckCircle2Icon, TrashIcon } from 'lucide-vue-next'
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
import type { ExpenseFormData, CeremonyExpense } from '~/types/ceremonyFinance'
import { useToast } from '@/components/ui/toast/use-toast'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  open: boolean
  ceremonyId: string
  userId: string
  initialData?: CeremonyExpense | null
}>()

const emit = defineEmits(['update:open', 'success'])

const { t } = useI18n()
const { toast } = useToast()
const { addExpense, updateExpense } = useCeremonyFinance()
const { uploadImage } = useCloudinary()

const itemInput = ref<any>(null)
const loading = ref(false)
const uploadingImage = ref(false)
const paidDateInput = ref('')

const isEditing = computed(() => !!props.initialData)

const formData = reactive<ExpenseFormData>({
  itemName: '',
  category: 'food',
  amount: 0,
  currency: 'USD',
  quantity: undefined,
  unitPrice: undefined,
  vendor: '',
  description: '',
  paidBy: '',
  paidDate: undefined,
  receiptUrl: ''
})

const closeModal = () => {
  emit('update:open', false)
}

const resetForm = () => {
  formData.itemName = ''
  formData.amount = 0
  formData.quantity = undefined
  formData.unitPrice = undefined
  formData.vendor = ''
  formData.description = ''
  formData.paidBy = ''
  formData.paidDate = undefined
  formData.receiptUrl = ''
  paidDateInput.value = ''
  
  // Sticky: category, currency
  
  // Refocus for fast entry
  nextTick(() => {
    itemInput.value?.$el?.focus()
  })
}

const resetAllFields = () => {
  resetForm()
  formData.category = 'food'
  formData.currency = 'USD'
}

watch(() => props.initialData, (val) => {
  if (val) {
    formData.itemName = val.itemName
    formData.category = val.category
    formData.amount = val.amount
    formData.currency = val.currency
    formData.quantity = val.quantity
    formData.unitPrice = val.unitPrice
    formData.vendor = val.vendor || ''
    formData.description = val.description || ''
    formData.paidBy = val.paidBy || ''
    formData.receiptUrl = val.receiptUrl || ''
    
    // Handle date
    if (val.paidDate) {
      try {
        const d = (val.paidDate as any).toDate ? (val.paidDate as any).toDate() : new Date(val.paidDate)
        paidDateInput.value = d.toISOString().split('T')[0]
      } catch (e) {
        paidDateInput.value = ''
      }
    } else {
        paidDateInput.value = ''
    }
  } else {
    resetAllFields()
  }
}, { immediate: true })

watch(() => props.open, (val) => {
  if (!val) {
      setTimeout(() => {
          if (!props.open) resetAllFields()
      }, 300)
  }
})

const calculateTotal = () => {
  if (formData.quantity && formData.unitPrice) {
    formData.amount = formData.quantity * formData.unitPrice
  }
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
  loading.value = true
  
  try {
    if (paidDateInput.value) {
      formData.paidDate = new Date(paidDateInput.value)
    } else {
        formData.paidDate = undefined
    }
    
    let result;
    
    if (isEditing.value && props.initialData) {
        result = await updateExpense(props.initialData.id, formData, props.userId)
    } else {
        result = await addExpense(props.ceremonyId, formData, props.userId)
    }
    
    if (result.success) {
      toast({
        title: isEditing.value 
            ? t('admin.ceremony_finance.messages.update_success')
            : t('admin.ceremony_finance.messages.add_success'),
         description: `${t('admin.ceremony_finance.item_name')}: ${formData.itemName}`,
      })
      
      emit('success')
      
      if (isEditing.value) {
        closeModal()
      } else {
        // POS MODE: Fast entry
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
</style>
