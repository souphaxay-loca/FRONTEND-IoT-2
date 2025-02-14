<template>
  <div
    class="bg-white rounded-lg shadow p-6 relative"
    :class="{ 'opacity-75': !isDeviceOnline }"
  >
    <!-- Offline Overlay -->
    <div
      v-if="!isDeviceOnline"
      class="absolute inset-0 bg-gray-50 bg-opacity-90 rounded-lg flex items-center justify-center z-10"
    >
      <div class="text-center">
        <span class="text-red-500 font-medium">Device Offline</span>
        <p class="text-sm text-gray-500 mt-1">No live updates available</p>
      </div>
    </div>

    <!-- Live Indicator -->
    <div class="absolute top-2 right-2">
      <span class="flex items-center">
        <!-- Green pulsing dot for normal status and online -->
        <template v-if="status === 'normal' && isDeviceOnline">
          <span
            class="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
          ></span>
        </template>
        <!-- Red dot for warning -->
        <template v-else-if="status === 'warning' && isDeviceOnline">
          <span
            class="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
          ></span>
        </template>
        <!-- Gray dot for offline -->
        <template v-else>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-gray-400"
          ></span>
        </template>
      </span>
    </div>

    <!-- Header: Title and Status Badge -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <span
        class="px-3 py-1 rounded-full text-sm"
        :class="{
          'bg-green-100 text-green-800': status === 'normal' && isDeviceOnline,
          'bg-red-100 text-red-800': status === 'warning' && isDeviceOnline,
          'bg-gray-100 text-gray-800': !isDeviceOnline,
        }"
      >
        {{ isDeviceOnline ? status : "offline" }}
      </span>
    </div>

    <!-- Value and Unit with a fade transition -->
    <div class="mt-4 flex items-baseline">
      <transition name="fade" mode="out-in">
        <p
          key="value"
          class="text-4xl font-semibold"
          :class="isDeviceOnline ? 'text-gray-900' : 'text-gray-500'"
        >
          {{ value }}
        </p>
      </transition>
      <p class="ml-2 text-xl text-gray-500">{{ unit }}</p>
    </div>

    <!-- Trend Indicator -->
    <div class="mt-4 flex items-center">
      <span
        class="text-sm"
        :class="{
          'text-green-500': trend === 'up' && isDeviceOnline,
          'text-red-500': trend === 'down' && isDeviceOnline,
          'text-gray-500': trend === 'stable' || !isDeviceOnline,
        }"
      >
        <template v-if="isDeviceOnline">
          <template v-if="trend === 'up'">↑ Rising</template>
          <template v-if="trend === 'down'">↓ Falling</template>
          <template v-if="trend === 'stable'">→ Stable</template>
        </template>
        <template v-else> No live updates </template>
      </span>
    </div>
  </div>
</template>

<script setup>
// Props remain the same
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "normal",
  },
  trend: {
    type: String,
    default: "stable",
  },
  isDeviceOnline: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>