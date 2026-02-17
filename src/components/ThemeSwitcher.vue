<script setup lang="ts">
import { computed } from "vue";
import { useColorMode } from "@vueuse/core";
import { MoonIcon, SunIcon } from "lucide-vue-next";

defineProps<{
  size?: "default" | "sm";
}>();

const mode = useColorMode();
const isDark = computed(() => mode.value === 'dark');

const toggleTheme = () => {
  mode.value = isDark.value ? 'light' : 'dark';
};
</script>

<template>
  <button
    @click="toggleTheme"
    class="relative flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-muted text-foreground overflow-hidden"
    :class="size === 'sm' ? 'w-9 h-9 min-w-[36px]' : 'w-10 h-10 min-w-[40px]'"
    :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
  >
    <Transition name="theme-rotate" mode="out-in">
      <SunIcon 
        v-if="!isDark" 
        class="absolute" 
        :class="size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'"
      />
      <MoonIcon 
        v-else 
        class="absolute" 
        :class="size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'"
      />
    </Transition>
    <span class="sr-only">Toggle theme</span>
  </button>
</template>

<style scoped>
.theme-rotate-enter-active,
.theme-rotate-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-rotate-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}
</style>
