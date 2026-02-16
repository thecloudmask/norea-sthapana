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
      dirs: ["src/components"]
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
      dirs: [
        "src/composables",
        "src/stores",
        "src/utils"
      ],
      vueTemplate: true
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxccHJvamVjdHNcXFxcbmFyZWFfc3RoYXBhbmFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHdvcmtzcGFjZVxcXFxwcm9qZWN0c1xcXFxuYXJlYV9zdGhhcGFuYVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovd29ya3NwYWNlL3Byb2plY3RzL25hcmVhX3N0aGFwYW5hL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBQYWdlcyBmcm9tICd2aXRlLXBsdWdpbi1wYWdlcydcclxuaW1wb3J0IExheW91dHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWxheW91dHMnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnfic6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgVnVlKCksXHJcbiAgICBQYWdlcyh7XHJcbiAgICAgIGRpcnM6ICdzcmMvcGFnZXMnLFxyXG4gICAgICBleGNsdWRlOiBbJyoqL2NvbXBvbmVudHMvKi52dWUnXSxcclxuICAgIH0pLFxyXG4gICAgTGF5b3V0cyh7XHJcbiAgICAgIGxheW91dHNEaXJzOiAnc3JjL2xheW91dHMnLFxyXG4gICAgICBkZWZhdWx0TGF5b3V0OiAnZGVmYXVsdCcsXHJcbiAgICB9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICBkdHM6IHRydWUsXHJcbiAgICAgIGRpcnM6IFsnc3JjL2NvbXBvbmVudHMnXSxcclxuICAgIH0pLFxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICAndnVlJyxcclxuICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgJ3Z1ZS1pMThuJyxcclxuICAgICAgICAnQHZ1ZXVzZS9jb3JlJyxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAnQHVuaGVhZC92dWUnOiBbJ3VzZUhlYWQnXSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBkdHM6IHRydWUsXHJcbiAgICAgIGRpcnM6IFtcclxuICAgICAgICAnc3JjL2NvbXBvc2FibGVzJyxcclxuICAgICAgICAnc3JjL3N0b3JlcycsXHJcbiAgICAgICAgJ3NyYy91dGlscycsXHJcbiAgICAgIF0sXHJcbiAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxyXG4gICAgfSksXHJcbiAgXSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUyxTQUFTLG9CQUFvQjtBQUNuVSxPQUFPLFNBQVM7QUFDaEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sYUFBYTtBQUNwQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLGVBQWU7QUFOeEIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUMvQixLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ2pDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLHFCQUFxQjtBQUFBLElBQ2pDLENBQUM7QUFBQSxJQUNELFFBQVE7QUFBQSxNQUNOLGFBQWE7QUFBQSxNQUNiLGVBQWU7QUFBQSxJQUNqQixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxLQUFLO0FBQUEsTUFDTCxNQUFNLENBQUMsZ0JBQWdCO0FBQUEsSUFDekIsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsVUFDRSxlQUFlLENBQUMsU0FBUztBQUFBLFFBQzNCO0FBQUEsTUFDRjtBQUFBLE1BQ0EsS0FBSztBQUFBLE1BQ0wsTUFBTTtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGFBQWE7QUFBQSxJQUNmLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
