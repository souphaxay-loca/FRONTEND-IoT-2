// layouts/default.vue
<template>
  <div class="min-h-screen bg-gray-50">
    <Navigation :is-open="isOpen" @toggle-menu="toggleMenu" />
    <main
      class="lg:ml-64 transition-all duration-200 min-h-screen relative"
      :class="{ 'ml-0': !isOpen }"
    >
      <!-- Header -->
      <header class="bg-white shadow px-4 py-4 relative z-20">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>

      <!-- Content -->
      <div class="p-4 relative z-20">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navigation from "~/components/layout/Navigation.vue";

// Initialize with false, then update on mount
const isOpen = ref(false);

onMounted(() => {
  // Update the value based on screen size only when component is mounted
  if (process.client) {
    isOpen.value = window.innerWidth >= 1024;
  }
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>