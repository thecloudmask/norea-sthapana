<script setup lang="ts">
import { watch } from "vue";
import { useColorMode } from "@vueuse/core";
import { MoonIcon, SunIcon, LaptopIcon } from "lucide-vue-next";

const props = defineProps<{
  size?: "default" | "sm";
}>();

const colorMode = useColorMode();

watch(colorMode, (val) => {
  console.log("🌓 [ThemeSwitcher] Mode changed to:", val);
});

const modes = [
  { value: "light", icon: SunIcon, label: "Light" },
  { value: "dark", icon: MoonIcon, label: "Dark" },
  { value: "auto", icon: LaptopIcon, label: "System" },
] as const;
</script>

<template>
  <div
    class="flex items-center gap-1 bg-muted/50 rounded-xl border border-border/50"
    :class="size === 'sm' ? 'p-1' : 'p-1.5 rounded-2xl'"
  >
    <button
      v-for="mode in modes"
      :key="mode.value"
      @click="colorMode = mode.value"
      class="transition-all duration-200 flex items-center justify-center"
      :class="[
        colorMode === mode.value
          ? 'bg-background text-primary shadow-sm ring-1 ring-border/20'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted',
        size === 'sm' ? 'p-1 rounded-full' : 'p-1 rounded-xl',
      ]"
      :title="mode.label"
    >
      <component
        :is="mode.icon"
        :class="size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'"
      />
    </button>
  </div>
</template>
