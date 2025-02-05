// pages/reports.vue
<template>
  <NuxtLayout name="default">
    <div class="min-h-screen bg-gray-50 p-4">
      <!-- Title -->
      <div class="py-6">
        <h1 class="text-2xl font-semibold text-gray-900">Reports</h1>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          v-for="summary in summaries"
          :key="summary.title"
          class="bg-white shadow rounded-lg p-6"
        >
          <h3 class="text-lg font-medium text-gray-900">{{ summary.title }}</h3>
          <div class="mt-2 grid grid-cols-2 gap-4">
            <div v-for="stat in summary.stats" :key="stat.label">
              <p class="text-sm text-gray-500">{{ stat.label }}</p>
              <p class="text-lg font-semibold">
                {{ stat.value }} {{ summary.unit }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Options -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Format</label
            >
            <select
              v-model="exportFormat"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="exportData"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from "vue";

const exportFormat = ref("csv");

const summaries = ref([
  {
    title: "Temperature",
    unit: "°C",
    stats: [
      { label: "Average", value: "25.5" },
      { label: "Max", value: "28.3" },
      { label: "Min", value: "22.1" },
      { label: "Alerts", value: "2" },
    ],
  },
  {
    title: "Humidity",
    unit: "%",
    stats: [
      { label: "Average", value: "45" },
      { label: "Max", value: "55" },
      { label: "Min", value: "35" },
      { label: "Alerts", value: "1" },
    ],
  },
  {
    title: "Air Quality",
    unit: "ppm",
    stats: [
      { label: "Average", value: "35" },
      { label: "Max", value: "45" },
      { label: "Min", value: "25" },
      { label: "Alerts", value: "3" },
    ],
  },
]);

const exportData = () => {
  console.log(`Exporting data in ${exportFormat.value} format`);
};

definePageMeta({
  layout: "default",
});
</script>