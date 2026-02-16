<template>
  <div class="min-h-screen bg-background text-foreground transition-colors duration-500">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
// Main layout file
</script>

<style>
/* Global smooth transitions for theme switching */
body {
  transition: background-color 0.5s ease, color 0.5s ease;
}

/* Ensure no flash of light mode on load if possible */
.dark-mode body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
</style>
