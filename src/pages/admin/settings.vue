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
import { SunIcon, MoonIcon, MonitorIcon } from 'lucide-vue-next'
import { useSettings } from '~/composables/useSettings'
import { useI18n } from 'vue-i18n'
import { useColorMode } from '@vueuse/core'



const { t } = useI18n()
const { settings, fetchSettings, saveSettings, loading } = useSettings()
const colorMode = useColorMode()

const form = ref({
    templeName: '',
    address: '',
    contactPhone: '',
    email: ''
})

onMounted(async () => {
    await fetchSettings()
    if (settings.value) {
        form.value = {
            templeName: settings.value.templeName || '',
            address: settings.value.address || '',
            contactPhone: settings.value.contactPhone || '',
            email: settings.value.email || ''
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

const handleSave = async () => {
    try {
        await saveSettings(form.value)
        // Success notification logic could be added here
    } catch (e) {
        console.error('Save failed', e)
    }
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
