<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { useI18n } from 'vue-i18n';

interface Props {
  status: 'draft' | 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
}

const props = defineProps<Props>()

const { t } = useI18n()

const statusConfig = computed(() => {
  switch (props.status) {
    case 'draft':
      return {
        label: t('common.status_draft'),
        variant: 'secondary' as const,
        class: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
      }
    case 'planning':
      return {
        label: t('common.status_planning'),
        variant: 'outline' as const,
        class: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 border-dashed'
      }
    case 'active':
      return {
        label: t('common.status_active'),
        variant: 'default' as const,
        class: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 animate-pulse'
      }
    case 'paused':
      return {
        label: t('common.status_paused'),
        variant: 'outline' as const,
        class: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300'
      }
    case 'completed':
      return {
        label: t('common.status_completed'),
        variant: 'outline' as const,
        class: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300'
      }
    case 'cancelled':
      return {
        label: t('common.status_cancelled'),
        variant: 'destructive' as const,
        class: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 line-through'
      }
    default:
      return {
        label: props.status,
        variant: 'secondary' as const,
        class: ''
      }
  }
})
</script>

<template>
  <Badge :variant="statusConfig.variant" :class="statusConfig.class">
    {{ statusConfig.label }}
  </Badge>
</template>
