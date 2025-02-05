<!-- components/dashboard/StatusCard.vue -->
<template>
    <div class="bg-white rounded-lg shadow p-6">
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
      
      <div class="mt-4 flex items-baseline">
        <p class="text-4xl font-semibold text-gray-900">
          {{ value }}
        </p>
        <p class="ml-2 text-xl text-gray-500">{{ unit }}</p>
      </div>
      
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
  })
  </script>