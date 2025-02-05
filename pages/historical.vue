<!-- pages/historical.vue -->
<template>
  <NuxtLayout name="default">
    <div class="min-h-screen bg-gray-50 p-6">
      <!-- Page Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Historical Data</h1>
        <p class="mt-2 text-gray-600">
          Review sensor readings over time. Choose between a graphical view or a
          detailed table.
        </p>
      </header>

      <!-- Date Range Selector Card -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              for="start-date"
              class="block text-sm font-medium text-gray-700"
              >Start Date</label
            >
            <input
              id="start-date"
              type="datetime-local"
              v-model="startDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              for="end-date"
              class="block text-sm font-medium text-gray-700"
              >End Date</label
            >
            <input
              id="end-date"
              type="datetime-local"
              v-model="endDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="fetchHistoricalData"
              class="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Fetch Data
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs for switching views -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              @click="activeTab = 'graph'"
              :class="
                activeTab === 'graph' ? activeTabClasses : inactiveTabClasses
              "
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Graph
            </button>
            <button
              @click="activeTab = 'table'"
              :class="
                activeTab === 'table' ? activeTabClasses : inactiveTabClasses
              "
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              Table
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Graph View -->
        <div v-if="activeTab === 'graph'">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">
              Sensor Graphs
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardSensorGraph
                v-for="sensor in sensors"
                :key="sensor.id"
                :sensor-id="sensor.id"
                :title="sensor.title"
                :data="graphData[sensor.id]"
                :thresholds="sensor.thresholds"
              />
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div
          v-else-if="activeTab === 'table'"
          class="bg-white shadow overflow-hidden rounded-lg"
          style="max-height: 500px; overflow-y: auto"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timestamp
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Temperature (°C)
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Humidity (%)
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
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
              <!-- Fallback message if no data is available -->
              <tr v-if="filteredData.length === 0">
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                  No data available for the selected date range.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
  
  <script setup>
import { ref, computed } from "vue";
import { useSensorData } from "~/composables/useSensorData";

// Define sensor configurations (as used in dashboard)
const sensors = [
  {
    id: "temperature",
    title: "Temperature",
    unit: "°C",
    thresholds: { min: 20, max: 30 },
  },
  {
    id: "humidity",
    title: "Humidity",
    unit: "%",
    thresholds: { min: 30, max: 60 },
  },
  {
    id: "mq3",
    title: "Air Quality",
    unit: "ppm",
    thresholds: { min: 0, max: 50 },
  },
];

// Reactive state for date range and raw data
const startDate = ref("");
const endDate = ref("");
const data = ref([]);

// Tab state: either 'graph' or 'table'
const activeTab = ref("graph");

// Styling for active/inactive tabs
const activeTabClasses = "border-blue-500 text-blue-600";
const inactiveTabClasses =
  "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

// Fetch all data from the backend using our composable
const { fetchAllData } = useSensorData();
const fetchHistoricalData = async () => {
  const result = await fetchAllData();
  if (result && Array.isArray(result)) {
    data.value = result;
  }
};

// Compute filtered data based on the selected date range
const filteredData = computed(() => {
  let filtered = data.value;
  if (startDate.value) {
    const start = new Date(startDate.value);
    filtered = filtered.filter((record) => new Date(record.timestamp) >= start);
  }
  if (endDate.value) {
    const end = new Date(endDate.value);
    filtered = filtered.filter((record) => new Date(record.timestamp) <= end);
  }
  return filtered;
});

// Compute formatted graph data for each sensor based on the filtered data.
const graphData = computed(() => {
  const result = {};
  sensors.forEach((sensor) => {
    result[sensor.id] = filteredData.value.map((record) => ({
      timestamp: new Date(record.timestamp), // Use Date objects here
      value: record[sensor.id],
    }));
  });
  return result;
});

// Utility function to format timestamps for the table view
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

definePageMeta({
  layout: "default",
});
</script>
  