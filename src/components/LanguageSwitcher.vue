<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="default" class="flex gap-2 px-3 font-khmer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors h-11 rounded-xl border border-border/50 bg-background/50">
        <GlobeIcon class="h-5 w-5 text-slate-500" />
        <span class="text-sm font-medium text-foreground">{{ locale === 'km' ? 'ខ្មែរ' : 'EN' }}</span>
        <ChevronDownIcon class="h-4 w-4 text-slate-400" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="rounded-xl shadow-xl border-border bg-card p-1 z-[100]">
      <DropdownMenuItem @click="setLocale('km')" class="font-khmer font-medium cursor-pointer rounded-lg px-3 py-2.5 hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between gap-4">
        <span>ខ្មែរ (Khmer)</span>
        <CheckIcon v-if="locale === 'km'" class="h-4 w-4 text-primary" />
      </DropdownMenuItem>
      <DropdownMenuItem @click="setLocale('en')" class="font-medium cursor-pointer rounded-lg px-3 py-2.5 hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between gap-4">
        <span>English</span>
        <CheckIcon v-if="locale === 'en'" class="h-4 w-4 text-primary" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { GlobeIcon, ChevronDownIcon, CheckIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const { locale } = useI18n()
const setLocale = (val: string) => { 
  console.log('🌐 [LanguageSwitcher] Setting locale to:', val)
  locale.value = val 
}
</script>
