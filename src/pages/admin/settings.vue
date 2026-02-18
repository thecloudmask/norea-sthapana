<template>
  <div class="space-y-10 transition-colors duration-300">
    <div class="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 class="text-3xl font-medium text-foreground font-khmer tracking-tight">{{ t('admin.settings.title') }}</h1>
        <p class="text-muted-foreground font-normal">{{ t('admin.settings.subtitle') }}</p>
    </div>
    
    <Tabs default-value="general" class="space-y-10">
        <div class="flex justify-start">
            <TabsList class="bg-muted p-1 rounded-2xl h-14 w-fit flex border border-border/50">
                <TabsTrigger value="general" class="rounded-xl font-medium px-8 h-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all text-sm font-khmer">
                    {{ t('admin.settings.general_settings') }}
                </TabsTrigger>
                <TabsTrigger value="appearance" class="rounded-xl font-medium px-8 h-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all text-sm font-khmer">
                    {{ t('admin.settings.appearance') }}
                </TabsTrigger>
            </TabsList>
        </div>
        
        <TabsContent value="general" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none">
            <Card class="bg-card border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
                <CardHeader class="border-b border-border bg-muted/30 pb-6 pt-6 px-8">
                    <CardTitle class="text-xl font-medium text-foreground font-khmer tracking-tight">{{ t('admin.settings.temple_info') }}</CardTitle>
                    <CardDescription class="text-foreground/70 font-medium mt-2 font-khmer text-sm">
                        {{ t('admin.settings.temple_info_desc') }}
                    </CardDescription>
                </CardHeader>
                <CardContent class="p-8 space-y-8">
                    <div class="grid gap-4">
                        <Label for="templeName" class="text-sm font-medium text-foreground/70 ml-1 font-khmer">{{ t('admin.settings.temple_name') }}</Label>
                        <Input id="templeName" v-model="form.templeName" placeholder="វត្តនរាធិបតី" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-12 px-5" />
                    </div>
                    <div class="grid gap-4">
                        <Label for="address" class="text-sm font-medium text-foreground/70 ml-1 font-khmer">{{ t('admin.settings.address') }}</Label>
                        <Input id="address" v-model="form.address" placeholder="ភូមិ..., ឃុំ..., ស្រុក..., ខេត្ត..." class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-12 px-5" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="grid gap-4">
                            <Label for="phone" class="text-sm font-medium text-foreground/70 ml-1 font-khmer">{{ t('admin.settings.phone') }}</Label>
                            <Input id="phone" v-model="form.contactPhone" placeholder="012 345 678" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-12 px-5" />
                        </div>
                        <div class="grid gap-4">
                            <Label for="email" class="text-sm font-medium text-foreground/70 ml-1 font-khmer">{{ t('admin.settings.email') }}</Label>
                            <Input id="email" v-model="form.email" placeholder="info@watnarea.org" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-12 px-5" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter class="p-8 pt-4 flex justify-end bg-muted/10 border-t border-border/50">
                    <Button :disabled="loading" @click="handleSave" class="rounded-xl h-11 px-8 font-medium bg-primary text-white hover:bg-orange-600 transition-all active:scale-95 shadow-sm">
                        <span v-if="loading" class="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        {{ loading ? t('admin.settings.saving') : t('admin.forms.save_changes') }}
                    </Button>
                </CardFooter>
            </Card>

            <!-- Donation Information Card -->
            <Card class="bg-card border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
                <CardHeader class="border-b border-border bg-muted/30 pb-6 pt-6 px-8">
                    <CardTitle class="text-xl font-medium text-foreground font-khmer tracking-tight">{{ t('admin.settings.donation_info') }}</CardTitle>
                    <CardDescription class="text-foreground/70 font-medium mt-2 font-khmer text-sm">
                        {{ t('admin.settings.donation_info_desc') }}
                    </CardDescription>
                </CardHeader>
                <CardContent class="p-8 space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="grid gap-4">
                            <Label for="bankName" class="text-sm font-medium text-foreground/70 ml-1 font-khmer">{{ t('admin.settings.bank_name') }}</Label>
                            <Input id="bankName" v-model="form.bankName" placeholder="ABA Bank" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-12 px-5" />
                        </div>
                         <div class="grid gap-4">
                            <Label for="bankAccountName" class="text-sm font-medium text-foreground/70 ml-1 font-khmer">{{ t('admin.settings.account_name') }}</Label>
                            <Input id="bankAccountName" v-model="form.bankAccountName" placeholder="WAT NAREA..." class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-12 px-5" />
                        </div>
                    </div>
                    <div class="grid gap-4">
                         <Label for="bankAccountNumber" class="text-sm font-medium text-foreground/70 ml-1 font-khmer">{{ t('admin.settings.bank_account') }}</Label>
                         <Input id="bankAccountNumber" v-model="form.bankAccountNumber" placeholder="000 123 456" class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-12 px-5 font-mono" />
                    </div>
                     <div class="grid gap-4">
                        <Label for="qrCodeUrl" class="text-sm font-medium text-foreground/70 ml-1 font-khmer">{{ t('admin.settings.qr_code_url') }}</Label>
                        
                        <div class="flex flex-col gap-4">
                            <!-- QR Code Preview & Upload Area -->
                            <div class="flex flex-col sm:flex-row items-start gap-6 p-6 rounded-2xl bg-muted/20 border border-dashed border-border/60">
                                <div class="relative size-40 rounded-xl bg-background border border-border shadow-inner overflow-hidden flex items-center justify-center group flex-shrink-0">
                                    <img 
                                        v-if="form.qrCodeUrl" 
                                        :src="form.qrCodeUrl" 
                                        alt="QR Preview" 
                                        class="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div v-else class="flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                                        <QrCodeIcon class="size-12" />
                                        <span class="text-[10px] uppercase font-semibold tracking-widest">No Image</span>
                                    </div>
                                    
                                    <!-- Overlay Remove Button -->
                                    <button 
                                        v-if="form.qrCodeUrl" 
                                        type="button" 
                                        @click="form.qrCodeUrl = ''" 
                                        class="absolute top-2 right-2 size-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-rose-600"
                                    >
                                        <TrashIcon class="size-4" />
                                    </button>
                                </div>

                                <div class="flex flex-col gap-3 justify-center">
                                    <div class="space-y-1">
                                        <h4 class="text-sm font-semibold text-foreground font-khmer">{{ t('admin.qr_code') }}</h4>
                                        <p class="text-xs text-muted-foreground leading-relaxed">{{ t('admin.qr_code_subtitle') }}</p>
                                    </div>
                                    
                                    <div class="flex items-center gap-3">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            class="rounded-xl h-10 px-4 border-border bg-background hover:bg-muted text-xs font-semibold transition-all"
                                            @click="qrInput?.click()"
                                            :disabled="uploadingImage"
                                        >
                                            <span v-if="uploadingImage" class="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                                            <UploadCloudIcon v-else class="mr-2 h-4 w-4 text-primary" />
                                            {{ uploadingImage ? 'Uploading...' : t('admin.change_qr') }}
                                        </Button>
                                        <input 
                                            ref="qrInput" 
                                            type="file" 
                                            accept="image/*" 
                                            class="hidden" 
                                            @change="handleImageUpload" 
                                        />
                                        <span v-if="form.qrCodeUrl" class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                            <CheckCircleIcon class="size-3" />
                                            Image Uploaded
                                        </span>
                                    </div>
                                    <p class="text-[10px] text-muted-foreground/60 italic">Recommended: 1:1 Aspect Ratio (Square), PNG or JPG</p>
                                </div>
                            </div>
                            
                            <!-- Manual URL Fallback -->
                            <div class="grid gap-2">
                                <Label for="manualUrl" class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 ml-1">Or Manual URL</Label>
                                <Input id="manualUrl" v-model="form.qrCodeUrl" placeholder="https://res.cloudinary.com/..." class="rounded-xl border-border bg-muted/30 font-normal focus:bg-background transition-all h-10 px-4 text-xs" />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter class="p-8 pt-4 flex justify-end bg-muted/10 border-t border-border/50">
                    <Button :disabled="loading" @click="handleSave" class="rounded-xl h-11 px-8 font-medium bg-primary text-white hover:bg-orange-600 transition-all active:scale-95 shadow-sm">
                        <span v-if="loading" class="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        {{ loading ? t('admin.settings.saving') : t('admin.forms.save_changes') }}
                    </Button>
                </CardFooter>
            </Card>

            <!-- KHR Exchange Rate Card -->
            <Card class="bg-card border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
                <CardHeader class="border-b border-border bg-muted/30 pb-6 pt-6 px-8">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <TrendingUpIcon class="size-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <CardTitle class="text-xl font-medium text-foreground font-khmer tracking-tight">អត្រាប្តូរប្រាក់ KHR/USD</CardTitle>
                            <CardDescription class="text-foreground/70 font-medium mt-1 font-khmer text-sm">
                                កំណត់ចំនួន រៀល (KHR) ស្មើ 1 ដុល្លារ (USD) — ប្រើសម្រាប់គណនាហិរញ្ញវត្ថុទាំងអស់
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent class="p-8 space-y-6">
                    <!-- Current Rate Display -->
                    <div class="flex items-center justify-between p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                        <div class="space-y-1">
                            <p class="text-xs font-semibold uppercase tracking-widest text-amber-600/70 dark:text-amber-400/70">អត្រាបច្ចុប្បន្ន</p>
                            <p class="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">
                                ៛ {{ rateForm.toLocaleString() }}
                                <span class="text-base font-normal text-amber-600/60">/ $1</span>
                            </p>
                        </div>
                        <div class="text-right space-y-1">
                            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">ឧទាហរណ៍</p>
                            <p class="text-sm font-medium text-foreground/70">
                                $100 = ៛ {{ (100 * rateForm).toLocaleString() }}
                            </p>
                            <p class="text-sm font-medium text-foreground/70">
                                ៛ 10,000 = ${{ (10000 / rateForm).toFixed(2) }}
                            </p>
                        </div>
                    </div>

                    <!-- Rate Input -->
                    <div class="grid gap-4">
                        <Label for="khrRate" class="text-sm font-medium text-foreground/70 ml-1 font-khmer">
                            ចំនួន រៀល ក្នុង 1 ដុល្លារ
                        </Label>
                        <div class="flex items-center gap-3">
                            <div class="relative flex-1">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">៛</span>
                                <Input
                                    id="khrRate"
                                    v-model.number="rateForm"
                                    type="number"
                                    min="1000"
                                    max="10000"
                                    step="100"
                                    class="rounded-xl border-border bg-muted/30 font-mono font-bold focus:bg-background transition-all h-12 pl-10 pr-5 text-lg"
                                />
                            </div>
                            <span class="text-muted-foreground font-medium text-sm whitespace-nowrap">រៀល / 1 USD</span>
                        </div>
                        <p class="text-xs text-muted-foreground/60 ml-1">អត្រាស្ដង់ដារ: ៛4,100 / $1 — ផ្លាស់ប្ដូរតាមអត្រាប្ដូរប្រាក់ជាក់ស្ដែង</p>
                    </div>
                </CardContent>
                <CardFooter class="p-8 pt-4 flex justify-end bg-muted/10 border-t border-border/50">
                    <Button :disabled="savingRate" @click="handleSaveRate" class="rounded-xl h-11 px-8 font-medium bg-amber-500 text-white hover:bg-amber-600 transition-all active:scale-95 shadow-sm">
                        <span v-if="savingRate" class="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        {{ savingRate ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកអត្រា' }}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>

        <TabsContent value="appearance" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none">
            <Card class="bg-card border-none ring-1 ring-border rounded-2xl overflow-hidden shadow-sm">
                <CardHeader class="border-b border-border bg-muted/30 pb-6 pt-6 px-8">
                    <CardTitle class="text-lg font-medium text-foreground tracking-tight font-khmer">{{ t('admin.settings.theme_preferences') }}</CardTitle>
                    <CardDescription class="text-muted-foreground font-normal mt-1 font-khmer text-sm">
                        {{ t('admin.settings.theme_desc') }}
                    </CardDescription>
                </CardHeader>
                <CardContent class="p-8 space-y-10">
                    <div class="flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border/50 shadow-sm">
                        <div class="space-y-1">
                            <Label for="dark-mode-switch" class="text-base font-medium text-foreground font-khmer">
                                {{ t('admin.settings.dark_mode') }}
                            </Label>
                            <p class="text-sm font-normal text-muted-foreground leading-relaxed max-w-md font-khmer">
                                {{ t('admin.settings.dark_mode_desc') }}
                            </p>
                        </div>
                        <Switch 
                            id="dark-mode-switch" 
                            :checked="isDarkTheme" 
                            @update:checked="toggleDarkMode" 
                            class="scale-125"
                        />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button 
                            v-for="mode in (['light', 'dark', 'auto'] as const)" 
                            :key="mode" 
                            @click="setTheme(mode)"
                            class="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:bg-muted/10 active:scale-95"
                            :class="colorMode === mode ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card/40'"
                        >
                            <div class="size-12 rounded-xl flex items-center justify-center transition-all duration-300" :class="colorMode === mode ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground group-hover:bg-background'">
                                <SunIcon v-if="mode === 'light'" class="size-5" />
                                <MoonIcon v-if="mode === 'dark'" class="size-5" />
                                <MonitorIcon v-if="mode === 'auto'" class="size-5" />
                            </div>
                            <span class="text-xs font-medium" :class="colorMode === mode ? 'text-primary' : 'text-muted-foreground/60'">{{ mode }}</span>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { SunIcon, MoonIcon, MonitorIcon, QrCodeIcon, UploadCloudIcon, TrashIcon, CheckCircleIcon, TrendingUpIcon } from 'lucide-vue-next'
import { useSettings } from '~/composables/useSettings'
import { useCloudinary } from '~/composables/useCloudinary'
import { useI18n } from 'vue-i18n'
import { useColorMode } from '@vueuse/core'
import { useToast } from '@/components/ui/toast/use-toast'
import { useKhrRate } from '~/composables/useKhrRate'

const { t } = useI18n()
const { settings, fetchSettings, saveSettings, loading } = useSettings()
const { uploadImage } = useCloudinary()
const { toast } = useToast()
const colorMode = useColorMode()
const { khrRate, saveKhrRate } = useKhrRate()

const uploadingImage = ref(false)
const savingRate = ref(false)
const qrInput = ref<HTMLInputElement | null>(null)
const rateForm = ref<number>(khrRate.value)

const form = ref({
    templeName: '',
    address: '',
    contactPhone: '',
    email: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
    qrCodeUrl: ''
})

onMounted(async () => {
    await fetchSettings()
    if (settings.value) {
        form.value = {
            templeName: settings.value.templeName || '',
            address: settings.value.address || '',
            contactPhone: settings.value.contactPhone || '',
            email: settings.value.email || '',
            bankName: settings.value.bankName || '',
            bankAccountNumber: settings.value.bankAccountNumber || '',
            bankAccountName: settings.value.bankAccountName || '',
            qrCodeUrl: settings.value.qrCodeUrl || ''
        }
        if ((settings.value as any).khrRate) {
            rateForm.value = (settings.value as any).khrRate
        }
    }
})

const isDarkTheme = computed(() => colorMode.value === 'dark')

const setTheme = (mode: 'light' | 'dark' | 'auto') => {
    colorMode.value = mode
}

const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
}

const handleImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    uploadingImage.value = true
    try {
        const url = await uploadImage(file)
        form.value.qrCodeUrl = url
        toast({
            title: "ជោគជ័យ",
            description: "រូបភាព QR ត្រូវបានបង្ហោះរួចរាល់",
            duration: 3000
        })
    } catch (e: any) {
        console.error('Upload failed', e)
        toast({
            title: "បរាជ័យ",
            description: e.message || "ការបង្ហោះរូបភាពមានបញ្ហា",
            variant: "destructive",
            duration: 3000
        })
    } finally {
        uploadingImage.value = false
        input.value = ''
    }
}

const handleSave = async () => {
    try {
        await saveSettings(form.value)
        toast({
            title: "ជោគជ័យ",
            description: "ការផ្លាស់ប្តូរត្រូវបានរក្សាទុក",
            duration: 3000
        })
    } catch (e: any) {
        console.error('Save failed', e)
        toast({
            title: "បរាជ័យ",
            description: "មិនអាចរក្សាទុកការផ្លាស់ប្តូរបានទេ",
            variant: "destructive",
            duration: 3000
        })
    }
}

const handleSaveRate = async () => {
    if (!rateForm.value || rateForm.value < 100) return
    savingRate.value = true
    try {
        await saveKhrRate(rateForm.value)
        toast({
            title: "ជោគជ័យ",
            description: `អត្រាប្ដូរប្រាក់ត្រូវបានកំណត់ ៛${rateForm.value.toLocaleString()} / $1`,
            duration: 3000
        })
    } catch (e: any) {
        toast({
            title: "បរាជ័យ",
            description: "មិនអាចរក្សាទុកអត្រាប្ដូរប្រាក់បានទេ",
            variant: "destructive",
            duration: 3000
        })
    } finally {
        savingRate.value = false
    }
}</script>

<route lang="yaml">
meta:
  layout: admin
</route>
