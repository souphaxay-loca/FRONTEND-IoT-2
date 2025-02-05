<template>
    <div class="bg-white rounded-lg shadow p-6 relative">
      <!-- Live Indicator -->
      <div class="absolute top-2 right-2">
        <span class="flex items-center">
          <!-- Green pulsing dot for normal status -->
          <template v-if="status === 'normal'">
            <span class="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </template>
          <!-- Red pulsing dot for warning status -->
          <template v-else>
            <span class="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </template>
        </span>
      </div>
  
      <!-- Header: Title and Status Badge -->
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
        <span
          class="px-3 py-1 rounded-full text-sm"
          :class="{
            'bg-green-100 text-green-800': status === 'normal',
            'bg-red-100 text-red-800': status === 'warning'
          }"
        >
          {{ status }}
        </span>
      </div>
  
      <!-- Value and Unit with a fade transition -->
      <div class="mt-4 flex items-baseline">
        <transition name="fade" mode="out-in">
          <p key="value" class="text-4xl font-semibold text-gray-900">
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
            'text-green-500': trend === 'up',
            'text-red-500': trend === 'down',
            'text-gray-500': trend === 'stable'
          }"
        >
          <template v-if="trend === 'up'">↑ Rising</template>
          <template v-if="trend === 'down'">↓ Falling</template>
          <template v-if="trend === 'stable'">→ Stable</template>
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'normal'
    },
    trend: {
      type: String,
      default: 'stable'
    }
  });
  </script>
  
  <style scoped>
  /* Fade transition for value changes */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  