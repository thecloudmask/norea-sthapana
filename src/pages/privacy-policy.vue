<template>
  <div class="min-h-screen bg-slate-50 py-24">
    <div class="container max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 mb-8">
        <h1 class="text-3xl md:text-4xl font-bold font-khmer text-slate-900 mb-2">{{ $t('privacy.title') }}</h1>
        <p class="text-slate-500 mb-8">{{ $t('privacy.last_updated') }}: {{ new Date().toLocaleDateString(locale === 'km' ? 'km-KH' : 'en-US') }}</p>

        <div class="prose prose-slate max-w-none font-khmer leading-relaxed">
          <h2 class="text-xl font-bold text-slate-800 mt-8 mb-4">{{ $t('privacy.section1_title') }}</h2>
          <p>
            {{ $t('privacy.section1_content') }}
          </p>

          <h2 class="text-xl font-bold text-slate-800 mt-8 mb-4">{{ $t('privacy.section2_title') }}</h2>
          <p>{{ $t('privacy.section2_intro') }}</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>{{ $t('privacy.section2_item1') }}</li>
            <li>{{ $t('privacy.section2_item2') }}</li>
            <li>{{ $t('privacy.section2_item3') }}</li>
          </ul>

          <h2 class="text-xl font-bold text-slate-800 mt-8 mb-4">{{ $t('privacy.section3_title') }}</h2>
          <p>{{ $t('privacy.section3_intro') }}</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>{{ $t('privacy.section3_item1') }}</li>
            <li>{{ $t('privacy.section3_item2') }}</li>
            <li>{{ $t('privacy.section3_item3') }}</li>
          </ul>

          <h2 class="text-xl font-bold text-slate-800 mt-8 mb-4">{{ $t('privacy.section4_title') }}</h2>
          <p>
            {{ $t('privacy.section4_content') }}
          </p>

          <h2 class="text-xl font-bold text-slate-800 mt-8 mb-4">{{ $t('privacy.section5_title') }}</h2>
          <p>
            {{ $t('privacy.section5_content') }}
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
const { locale, t } = useI18n()

useHead({
  title: `${t('privacy.title')} - ${t('app.name')}`,
  meta: [
    { name: 'description', content: t('privacy.section1_content') }
  ]
})
</script>
