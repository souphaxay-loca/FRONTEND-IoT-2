<!-- pages/historical.vue -->
<template>
    <NuxtLayout name="default">
      <div class="min-h-screen bg-gray-50 p-4">
        <!-- Title -->
        <div class="py-6">
          <h1 class="text-2xl font-semibold text-gray-900">Historical Data</h1>
        </div>
  
        <!-- Date Range Selector -->
        <div class="bg-white shadow rounded-lg p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="datetime-local"
                v-model="startDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="datetime-local"
                v-model="endDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="fetchHistoricalData"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
              >
                Fetch Data
              </button>
            </div>
          </div>
        </div>
  
        <!-- Data Table -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature (°C)
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Humidity (%)
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Air Quality (ppm)
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(record, index) in filteredData" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(record.timestamp) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.temperature }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.humidity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.mq3 }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </NuxtLayout>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useSensorData } from "~/composables/useSensorData";
  
  const startDate = ref("");
  const endDate = ref("");
  const data = ref([]);
  
  const { fetchAllData } = useSensorData();
  
  // Fetch all data from the backend and then filter by date on the client side.
  const fetchHistoricalData = async () => {
    const result = await fetchAllData();
    if (result && Array.isArray(result)) {
      data.value = result;
    }
  };
  
  // Compute filtered data based on the selected date range.
  const filteredData = computed(() => {
    let filtered = data.value;
    
    if (startDate.value) {
      const start = new Date(startDate.value);
      filtered = filtered.filter(record => new Date(record.timestamp) >= start);
    }
    
    if (endDate.value) {
      const end = new Date(endDate.value);
      filtered = filtered.filter(record => new Date(record.timestamp) <= end);
    }
    
    return filtered;
  });
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  definePageMeta({
    layout: "default",
  });
  </script>
  