import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
      '@': resolve(__dirname, './src')
    }
  },
  plugins: [
    Vue(),
    Pages({
      dirs: [
        { dir: 'src/pages/public', baseRoute: '' },
        { dir: 'src/pages/admin', baseRoute: 'admin' }
      ],
      exclude: ['**/components/*.vue']
    }),
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'default'
    }),
    Components({
      dts: true,
      dirs: ['src/components'],
      deep: true,
      directoryAsNamespace: false
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/core',
        {
          '@unhead/vue': ['useHead']
        }
      ],
      dts: true,
      dirs: ['src/composables', 'src/stores', 'src/utils'],
      vueTemplate: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'vue-i18n'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          charts: ['apexcharts', 'vue3-apexcharts'],
          ui: ['@vueuse/core', '@unhead/vue']
        }
      }
    }
  }
})
