// components/layout/Navigation.vue
<template>
  <div>
    <!-- Navigation Sidebar -->
    <nav
      class="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 transform transition-all duration-300 ease-in-out z-40"
      :class="[
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0', // Always show on large screens
      ]"
    >
      <!-- Logo and Title -->
      <div class="p-4 border-b border-gray-700 flex items-center space-x-3">
        <LayoutDashboard class="w-6 h-6 text-blue-400" />
        <h1 class="text-xl font-bold" :class="isOpen ? 'pl-4 pt-2' : ''">
          IoT Monitoring
        </h1>
      </div>

      <!-- Navigation Links -->
      <div class="py-4">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
          :class="{ 'bg-gray-700': isCurrentRoute(item.path) }"
          @click="$emit('toggle-menu')"
        >
          <component :is="item.iconComponent" class="w-5 h-5 mr-1" />
          <span>{{ item.name }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Mobile Menu Toggle Button -->
    <button
      @click="$emit('toggle-menu')"
      class="fixed top-4 left-4 p-2 rounded-md bg-white text-grey-800 lg:hidden z-50"
      aria-label="Toggle Menu"
    >
      <Menu v-if="!isOpen" class="w-6 h-6" />
      <X v-else class="w-6 h-6" />
    </button>

    <!-- Mobile Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black opacity-50 transition-opacity duration-300 lg:hidden z-30"
      @click="$emit('toggle-menu')"
    ></div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import {
  LayoutDashboard,
  Home,
  History,
  FileText,
  Menu,
  X,
} from "lucide-vue-next";

const route = useRoute();
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const navigationItems = [
  {
    name: "Dashboard",
    path: "/",
    iconComponent: Home,
  },
  {
    name: "Historical Data",
    path: "/historical",
    iconComponent: History,
  },
  {
    name: "Reports",
    path: "/reports",
    iconComponent: FileText,
  },
];

const isCurrentRoute = (path) => {
  return route.path === path;
};
</script>