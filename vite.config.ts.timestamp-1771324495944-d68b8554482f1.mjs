// vite.config.ts
import { defineConfig } from "file:///D:/workspace/projects/narea_sthapana/node_modules/vite/dist/node/index.js";
import Vue from "file:///D:/workspace/projects/narea_sthapana/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Pages from "file:///D:/workspace/projects/narea_sthapana/node_modules/vite-plugin-pages/dist/index.js";
import Layouts from "file:///D:/workspace/projects/narea_sthapana/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Components from "file:///D:/workspace/projects/narea_sthapana/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///D:/workspace/projects/narea_sthapana/node_modules/unplugin-auto-import/dist/vite.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "D:\\workspace\\projects\\narea_sthapana";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "~": resolve(__vite_injected_original_dirname, "./src"),
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  plugins: [
    Vue(),
    Pages({
      dirs: "src/pages",
      exclude: ["**/components/*.vue"]
    }),
    Layouts({
      layoutsDirs: "src/layouts",
      defaultLayout: "default"
    }),
    Components({
      dts: true,
      dirs: ["src/components"],
      deep: true,
      directoryAsNamespace: false
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/core",
        {
          "@unhead/vue": ["useHead"]
        }
      ],
      dts: true,
      dirs: ["src/composables", "src/stores", "src/utils"],
      vueTemplate: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue", "vue-router", "vue-i18n"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"],
          charts: ["apexcharts", "vue3-apexcharts"],
          ui: ["@vueuse/core", "@unhead/vue"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxccHJvamVjdHNcXFxcbmFyZWFfc3RoYXBhbmFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHdvcmtzcGFjZVxcXFxwcm9qZWN0c1xcXFxuYXJlYV9zdGhhcGFuYVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovd29ya3NwYWNlL3Byb2plY3RzL25hcmVhX3N0aGFwYW5hL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgUGFnZXMgZnJvbSAndml0ZS1wbHVnaW4tcGFnZXMnXHJcbmltcG9ydCBMYXlvdXRzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ34nOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKVxuICAgIH1cbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIFZ1ZSgpLFxuICAgIFBhZ2VzKHtcbiAgICAgIGRpcnM6ICdzcmMvcGFnZXMnLFxuICAgICAgZXhjbHVkZTogWycqKi9jb21wb25lbnRzLyoudnVlJ11cbiAgICB9KSxcbiAgICBMYXlvdXRzKHtcbiAgICAgIGxheW91dHNEaXJzOiAnc3JjL2xheW91dHMnLFxuICAgICAgZGVmYXVsdExheW91dDogJ2RlZmF1bHQnXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkdHM6IHRydWUsXG4gICAgICBkaXJzOiBbJ3NyYy9jb21wb25lbnRzJ10sXG4gICAgICBkZWVwOiB0cnVlLFxuICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IGZhbHNlXG4gICAgfSksXG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgICd2dWUnLFxuICAgICAgICAndnVlLXJvdXRlcicsXG4gICAgICAgICd2dWUtaTE4bicsXG4gICAgICAgICdAdnVldXNlL2NvcmUnLFxuICAgICAgICB7XG4gICAgICAgICAgJ0B1bmhlYWQvdnVlJzogWyd1c2VIZWFkJ11cbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGR0czogdHJ1ZSxcbiAgICAgIGRpcnM6IFsnc3JjL2NvbXBvc2FibGVzJywgJ3NyYy9zdG9yZXMnLCAnc3JjL3V0aWxzJ10sXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZVxuICAgIH0pXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZ1ZTogWyd2dWUnLCAndnVlLXJvdXRlcicsICd2dWUtaTE4biddLFxuICAgICAgICAgIGZpcmViYXNlOiBbJ2ZpcmViYXNlL2FwcCcsICdmaXJlYmFzZS9hdXRoJywgJ2ZpcmViYXNlL2ZpcmVzdG9yZScsICdmaXJlYmFzZS9zdG9yYWdlJ10sXG4gICAgICAgICAgY2hhcnRzOiBbJ2FwZXhjaGFydHMnLCAndnVlMy1hcGV4Y2hhcnRzJ10sXG4gICAgICAgICAgdWk6IFsnQHZ1ZXVzZS9jb3JlJywgJ0B1bmhlYWQvdnVlJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1MsU0FBUyxvQkFBb0I7QUFDblUsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sV0FBVztBQUNsQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxlQUFlO0FBTnhCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDL0IsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUNqQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxNQUNKLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxxQkFBcUI7QUFBQSxJQUNqQyxDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTixhQUFhO0FBQUEsTUFDYixlQUFlO0FBQUEsSUFDakIsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsS0FBSztBQUFBLE1BQ0wsTUFBTSxDQUFDLGdCQUFnQjtBQUFBLE1BQ3ZCLE1BQU07QUFBQSxNQUNOLHNCQUFzQjtBQUFBLElBQ3hCLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFVBQ0UsZUFBZSxDQUFDLFNBQVM7QUFBQSxRQUMzQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxNQUNMLE1BQU0sQ0FBQyxtQkFBbUIsY0FBYyxXQUFXO0FBQUEsTUFDbkQsYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLEtBQUssQ0FBQyxPQUFPLGNBQWMsVUFBVTtBQUFBLFVBQ3JDLFVBQVUsQ0FBQyxnQkFBZ0IsaUJBQWlCLHNCQUFzQixrQkFBa0I7QUFBQSxVQUNwRixRQUFRLENBQUMsY0FBYyxpQkFBaUI7QUFBQSxVQUN4QyxJQUFJLENBQUMsZ0JBQWdCLGFBQWE7QUFBQSxRQUNwQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
