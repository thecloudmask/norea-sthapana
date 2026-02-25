// vite.config.ts
import { defineConfig } from "file:///D:/workspace/projects/norea-project/narea_sthapana/node_modules/vite/dist/node/index.js";
import Vue from "file:///D:/workspace/projects/norea-project/narea_sthapana/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Pages from "file:///D:/workspace/projects/norea-project/narea_sthapana/node_modules/vite-plugin-pages/dist/index.js";
import Layouts from "file:///D:/workspace/projects/norea-project/narea_sthapana/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Components from "file:///D:/workspace/projects/norea-project/narea_sthapana/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///D:/workspace/projects/norea-project/narea_sthapana/node_modules/unplugin-auto-import/dist/vite.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "D:\\workspace\\projects\\norea-project\\narea_sthapana";
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
      dirs: [
        { dir: "src/pages/public", baseRoute: "" },
        { dir: "src/pages/admin", baseRoute: "admin" }
      ],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxccHJvamVjdHNcXFxcbm9yZWEtcHJvamVjdFxcXFxuYXJlYV9zdGhhcGFuYVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcd29ya3NwYWNlXFxcXHByb2plY3RzXFxcXG5vcmVhLXByb2plY3RcXFxcbmFyZWFfc3RoYXBhbmFcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3dvcmtzcGFjZS9wcm9qZWN0cy9ub3JlYS1wcm9qZWN0L25hcmVhX3N0aGFwYW5hL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IFBhZ2VzIGZyb20gJ3ZpdGUtcGx1Z2luLXBhZ2VzJ1xuaW1wb3J0IExheW91dHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWxheW91dHMnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICd+JzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJylcbiAgICB9XG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBWdWUoKSxcbiAgICBQYWdlcyh7XG4gICAgICBkaXJzOiBbXG4gICAgICAgIHsgZGlyOiAnc3JjL3BhZ2VzL3B1YmxpYycsIGJhc2VSb3V0ZTogJycgfSxcbiAgICAgICAgeyBkaXI6ICdzcmMvcGFnZXMvYWRtaW4nLCBiYXNlUm91dGU6ICdhZG1pbicgfVxuICAgICAgXSxcbiAgICAgIGV4Y2x1ZGU6IFsnKiovY29tcG9uZW50cy8qLnZ1ZSddXG4gICAgfSksXG4gICAgTGF5b3V0cyh7XG4gICAgICBsYXlvdXRzRGlyczogJ3NyYy9sYXlvdXRzJyxcbiAgICAgIGRlZmF1bHRMYXlvdXQ6ICdkZWZhdWx0J1xuICAgIH0pLFxuICAgIENvbXBvbmVudHMoe1xuICAgICAgZHRzOiB0cnVlLFxuICAgICAgZGlyczogWydzcmMvY29tcG9uZW50cyddLFxuICAgICAgZGVlcDogdHJ1ZSxcbiAgICAgIGRpcmVjdG9yeUFzTmFtZXNwYWNlOiBmYWxzZVxuICAgIH0pLFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW1wb3J0czogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAndnVlLWkxOG4nLFxuICAgICAgICAnQHZ1ZXVzZS9jb3JlJyxcbiAgICAgICAge1xuICAgICAgICAgICdAdW5oZWFkL3Z1ZSc6IFsndXNlSGVhZCddXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBkdHM6IHRydWUsXG4gICAgICBkaXJzOiBbJ3NyYy9jb21wb3NhYmxlcycsICdzcmMvc3RvcmVzJywgJ3NyYy91dGlscyddLFxuICAgICAgdnVlVGVtcGxhdGU6IHRydWVcbiAgICB9KVxuICBdLFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2dWU6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAndnVlLWkxOG4nXSxcbiAgICAgICAgICBmaXJlYmFzZTogWydmaXJlYmFzZS9hcHAnLCAnZmlyZWJhc2UvYXV0aCcsICdmaXJlYmFzZS9maXJlc3RvcmUnLCAnZmlyZWJhc2Uvc3RvcmFnZSddLFxuICAgICAgICAgIGNoYXJ0czogWydhcGV4Y2hhcnRzJywgJ3Z1ZTMtYXBleGNoYXJ0cyddLFxuICAgICAgICAgIHVpOiBbJ0B2dWV1c2UvY29yZScsICdAdW5oZWFkL3Z1ZSddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtWLFNBQVMsb0JBQW9CO0FBQy9XLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsZUFBZTtBQU54QixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQy9CLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsTUFDSixNQUFNO0FBQUEsUUFDSixFQUFFLEtBQUssb0JBQW9CLFdBQVcsR0FBRztBQUFBLFFBQ3pDLEVBQUUsS0FBSyxtQkFBbUIsV0FBVyxRQUFRO0FBQUEsTUFDL0M7QUFBQSxNQUNBLFNBQVMsQ0FBQyxxQkFBcUI7QUFBQSxJQUNqQyxDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTixhQUFhO0FBQUEsTUFDYixlQUFlO0FBQUEsSUFDakIsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsS0FBSztBQUFBLE1BQ0wsTUFBTSxDQUFDLGdCQUFnQjtBQUFBLE1BQ3ZCLE1BQU07QUFBQSxNQUNOLHNCQUFzQjtBQUFBLElBQ3hCLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFVBQ0UsZUFBZSxDQUFDLFNBQVM7QUFBQSxRQUMzQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxNQUNMLE1BQU0sQ0FBQyxtQkFBbUIsY0FBYyxXQUFXO0FBQUEsTUFDbkQsYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLEtBQUssQ0FBQyxPQUFPLGNBQWMsVUFBVTtBQUFBLFVBQ3JDLFVBQVUsQ0FBQyxnQkFBZ0IsaUJBQWlCLHNCQUFzQixrQkFBa0I7QUFBQSxVQUNwRixRQUFRLENBQUMsY0FBYyxpQkFBaUI7QUFBQSxVQUN4QyxJQUFJLENBQUMsZ0JBQWdCLGFBQWE7QUFBQSxRQUNwQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
