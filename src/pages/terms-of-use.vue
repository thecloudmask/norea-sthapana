<template>
  <div class="min-h-screen bg-slate-50 py-24">
    <div class="container max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 mb-8">
        <h1 class="text-3xl md:text-4xl font-semibold font-khmer text-slate-900 mb-2">{{ $t('terms.title') }}</h1>
        <p class="text-slate-500 mb-8">{{ $t('terms.last_updated') }}: {{ new Date().toLocaleDateString(locale === 'km' ? 'km-KH' : 'en-US') }}</p>

        <div class="prose prose-slate max-w-none font-khmer leading-relaxed">
          <h2 class="text-xl font-semibold text-slate-800 mt-8 mb-4">{{ $t('terms.section1_title') }}</h2>
          <p>
            {{ $t('terms.section1_content') }}
          </p>

          <h2 class="text-xl font-semibold text-slate-800 mt-8 mb-4">{{ $t('terms.section2_title') }}</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>{{ $t('terms.section2_item1') }}</li>
            <li>{{ $t('terms.section2_item2') }}</li>
            <li>{{ $t('terms.section2_item3') }}</li>
          </ul>

          <h2 class="text-xl font-semibold text-slate-800 mt-8 mb-4">{{ $t('terms.section3_title') }}</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>{{ $t('terms.section3_item1') }}</li>
            <li>{{ $t('terms.section3_item2') }}</li>
          </ul>

          <h2 class="text-xl font-semibold text-slate-800 mt-8 mb-4">{{ $t('terms.section4_title') }}</h2>
          <p>
            {{ $t('terms.section4_content') }}
          </p>

          <h2 class="text-xl font-semibold text-slate-800 mt-8 mb-4">{{ $t('terms.section5_title') }}</h2>
          <p>{{ $t('terms.section5_intro') }}</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>{{ $t('terms.section5_item1') }}</li>
            <li>{{ $t('terms.section5_item2') }}</li>
          </ul>

          <h2 class="text-xl font-semibold text-slate-800 mt-8 mb-4">{{ $t('terms.section6_title') }}</h2>
          <p>
            {{ $t('terms.section6_content') }}
          </p>

          <h2 class="text-xl font-semibold text-slate-800 mt-8 mb-4">{{ $t('terms.section7_title') }}</h2>
          <p>
            {{ $t('terms.section7_content') }}
            <br />
            {{ $t('footer.contact_title') }}: info@nareasthapana.com
            <br />
            {{ $t('login.password') }}: 012 345 678
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n()

useHead({
  title: `${t('terms.title')} - ${t('app.name')}`,
  meta: [
    { name: 'description', content: t('terms.section1_content') }
  ]
})
</script>
