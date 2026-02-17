<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-xl p-0 overflow-hidden bg-card border-none shadow-2xl rounded-[2rem] max-h-[90vh] flex flex-col">
      <!-- Header with premium gradient - Compact Version -->
      <div class="relative bg-gradient-to-br from-primary to-orange-600 px-6 py-8 text-center overflow-hidden flex-shrink-0">
        <div class="absolute inset-0 opacity-15 pattern-grid-lg"></div>
        
        <div class="relative z-10 flex flex-col items-center gap-3">
          <div class="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg ring-1 ring-white/30 animate-in zoom-in duration-500">
             <HeartHandshakeIcon class="size-6 text-white" />
          </div>
          <div class="space-y-1">
            <DialogTitle class="text-xl md:text-2xl font-bold font-khmer text-white tracking-tight">
              {{ $t('donation.title') }}
            </DialogTitle>
            <DialogDescription class="text-white/90 font-medium font-khmer text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
              {{ $t('donation.subtitle') }}
            </DialogDescription>
          </div>
        </div>
        
        <button 
          @click="isOpen = false"
          class="absolute top-4 right-4 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all active:scale-95 group"
        >
          <XIcon class="size-4" />
        </button>
      </div>

      <!-- Main Content - Scrollable with optimized spacing -->
      <div class="px-6 py-6 overflow-y-auto custom-scrollbar space-y-8">
        <div class="grid md:grid-cols-2 gap-8">
          
          <!-- QR Code Section -->
          <div class="flex flex-col items-center gap-4">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 w-full text-center">{{ $t('donation.scan_qr') }}</h3>
            <div class="p-3 bg-white rounded-[1.5rem] shadow-xl shadow-primary/5 ring-1 ring-border/50 relative group">
               <div class="size-48 bg-white rounded-xl flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-[1.02] duration-500">
                  <img 
                    v-if="settings?.qrCodeUrl" 
                    :src="settings.qrCodeUrl" 
                    alt="KHQR Code" 
                    class="w-full h-full object-contain p-2"
                  />
                  <div v-else class="flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                      <QrCodeIcon class="size-12 opacity-20" />
                      <span class="text-[9px] uppercase font-bold tracking-widest">{{ $t('donation.no_qr') }}</span>
                  </div>
               </div>
            </div>
            
            <div class="bg-primary/5 rounded-full px-3 py-1.5 flex items-center gap-2 text-primary font-bold text-[10px]">
              <ScanIcon class="size-3" />
              <span>SCAN ANY KHQR</span>
            </div>
          </div>

          <!-- Bank Details Section -->
          <div class="flex flex-col gap-4">
              <h3 class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{{ $t('donation.bank_transfer') }}</h3>
              
              <div class="space-y-4">
                <div class="bg-muted/30 rounded-2xl border border-border/60 p-5 space-y-4 hover:bg-muted/40 transition-colors group">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-3">
                            <div class="size-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-primary/20">
                                {{ settings?.bankName?.substring(0, 3) || 'ABA' }}
                            </div>
                            <div class="flex flex-col">
                                <span class="text-[9px] uppercase text-muted-foreground font-black tracking-widest mb-0.5">{{ $t('donation.account_number') }}</span>
                                <span class="text-base font-mono font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                                  {{ settings?.bankAccountNumber || '--- --- ---' }}
                                </span>
                            </div>
                        </div>
                        <Button 
                          v-if="settings?.bankAccountNumber"
                          variant="secondary" 
                          size="icon" 
                          class="size-8 rounded-lg bg-background shadow-sm hover:bg-primary hover:text-white transition-all active:scale-90" 
                          @click="copyToClipboard(settings.bankAccountNumber)"
                        >
                            <CopyIcon class="size-3.5" />
                        </Button>
                    </div>

                    <div class="h-px bg-gradient-to-r from-border/0 via-border to-border/0"></div>

                    <div class="flex items-center gap-3">
                        <div class="size-10 flex-shrink-0 flex items-center justify-center text-muted-foreground/40">
                          <Building2Icon class="size-5" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[9px] uppercase text-muted-foreground font-black tracking-widest mb-0.5">{{ $t('donation.account_name') }}</span>
                            <span class="text-sm font-bold font-khmer text-foreground tracking-tight">{{ settings?.bankAccountName || '---' }}</span>
                        </div>
                    </div>
                </div>
              </div>
          </div>
        </div>
      </div>

       <!-- Footer - Compact -->
       <div class="px-6 py-4 bg-muted/40 border-t border-border flex flex-col items-center gap-3 flex-shrink-0">
          <p class="text-[10px] text-muted-foreground text-center max-w-xs leading-relaxed font-khmer">
            {{ $t('donation.disclaimer') }}
          </p>
          <div class="flex items-center gap-2 text-primary">
            <HeartHandshakeIcon class="size-3 fill-primary/10" />
            <span class="text-[9px] font-black uppercase tracking-widest">{{ $t('donation.thank_you') }}</span>
          </div>
       </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  HeartHandshakeIcon, 
  XIcon, 
  QrCodeIcon, 
  ScanIcon, 
  Building2Icon,
  CopyIcon 
} from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import { useSettings } from '@/composables/useSettings'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const { toast } = useToast()
const { settings, fetchSettings } = useSettings()

onMounted(() => {
    fetchSettings()
})

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast({
      description: "លេខគណនីបានចម្លង! (Copied!)",
      duration: 2000,
    })
  } catch (err) {
    console.error('Failed to copy', err)
  }
}
</script>

<style scoped>
.pattern-grid-lg {
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 24px 24px;
}
</style>
