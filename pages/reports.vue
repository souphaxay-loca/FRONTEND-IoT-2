<template>
  <NuxtLayout name="default">
    <div class="min-h-screen bg-gray-50 p-4">
      <!-- Title -->
      <div class="py-6">
        <h1 class="text-2xl font-semibold text-gray-900">Reports</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-4">
        <p class="text-gray-600">Loading report data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-4">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Report Content -->
      <template v-else>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div
            v-for="summary in summaries"
            :key="summary.title"
            class="bg-white shadow rounded-lg p-6"
          >
            <h3 class="text-lg font-medium text-gray-900">
              {{ summary.title }}
            </h3>
            <!-- Update the stats display in the template -->
            <div class="mt-2 grid grid-cols-2 gap-4">
              <div v-for="stat in summary.stats" :key="stat.label">
                <p class="text-sm text-gray-500">{{ stat.label }}</p>
                <p class="text-lg font-semibold">
                  {{ stat.value }}
                  {{ stat.label !== "Alerts" ? summary.unit : "" }}
                </p>
                <!-- Add alert description -->
                <p
                  v-if="stat.label === 'Alerts' && stat.description"
                  class="text-xs text-gray-500 mt-1"
                >
                  ({{ stat.description }})
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Export Options -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Time Range</label
              >
              <select
                v-model="timeRange"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                @click="exportData"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full disabled:bg-gray-400"
                :disabled="loading"
              >
                {{ loading ? "Exporting..." : "Export Report" }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSensorData } from "~/composables/useSensorData";

const { loading, error, fetchAllData } = useSensorData();
const exportFormat = ref("csv");
const timeRange = ref("24h");
const summaries = ref([]);

// Calculate statistics from sensor data
const calculateStats = (data, sensorKey) => {
  const values = data.map((item) => item[sensorKey]);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  // Calculate alerts with timestamps and threshold information
  const alerts = data.filter((item) => {
    const value = item[sensorKey];
    const timestamp = new Date(item.timestamp).toLocaleString();
    let alert = false;
    let reason = "";

    if (sensorKey === "temperature") {
      if (value > 30) {
        alert = true;
        reason = "High Temperature";
      } else if (value < 20) {
        alert = true;
        reason = "Low Temperature";
      }
    } else if (sensorKey === "humidity") {
      if (value > 60) {
        alert = true;
        reason = "High Humidity";
      } else if (value < 30) {
        alert = true;
        reason = "Low Humidity";
      }
    } else if (sensorKey === "mq3" && value > 50) {
      alert = true;
      reason = "High Alcohol Level";
    }

    if (alert) {
      console.log(`${reason} alert at ${timestamp}: ${value}`);
    }
    return alert;
  }).length;

  return {
    average: avg.toFixed(1),
    max: max.toFixed(1),
    min: min.toFixed(1),
    alerts: {
      count: alerts,
      description: getAlertDescription(sensorKey, alerts),
    },
  };
};

// Add helper function for alert descriptions
const getAlertDescription = (sensorKey, alertCount) => {
  if (alertCount === 0) return "No alerts";

  let description = "";
  switch (sensorKey) {
    case "temperature":
      description = `${alertCount} temperature readings outside 20-30°C range`;
      break;
    case "humidity":
      description = `${alertCount} humidity readings outside 30-60% range`;
      break;
    case "mq3":
      description = `${alertCount} alcohol readings above 50 ppm`;
      break;
  }
  return description;
};

// Update the summaries template to show alert descriptions
const updateSummaries = (data) => {
  const tempStats = calculateStats(data, "temperature");
  const humidityStats = calculateStats(data, "humidity");
  const mq3Stats = calculateStats(data, "mq3");

  summaries.value = [
    {
      title: "Temperature",
      unit: "°C",
      stats: [
        { label: "Average", value: tempStats.average },
        { label: "Max", value: tempStats.max },
        { label: "Min", value: tempStats.min },
        {
          label: "Alerts",
          value: tempStats.alerts.count,
          description: tempStats.alerts.description,
        },
      ],
    },
    {
      title: "Humidity",
      unit: "%",
      stats: [
        { label: "Average", value: humidityStats.average },
        { label: "Max", value: humidityStats.max },
        { label: "Min", value: humidityStats.min },
        {
          label: "Alerts",
          value: humidityStats.alerts.count,
          description: humidityStats.alerts.description,
        },
      ],
    },
    {
      title: "Alcohol Concentration",
      unit: "ppm",
      stats: [
        { label: "Average", value: mq3Stats.average },
        { label: "Max", value: mq3Stats.max },
        { label: "Min", value: mq3Stats.min },
        {
          label: "Alerts",
          value: mq3Stats.alerts.count,
          description: mq3Stats.alerts.description,
        },
      ],
    },
  ];
};

// Export data function
const exportData = async () => {
  const data = await fetchAllData();
  if (!data || !data.length) return;

  // Filter data based on time range
  const now = new Date();
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.timestamp);
    switch (timeRange.value) {
      case "24h":
        return now - itemDate <= 24 * 60 * 60 * 1000;
      case "7d":
        return now - itemDate <= 7 * 24 * 60 * 60 * 1000;
      case "30d":
        return now - itemDate <= 30 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });

  // Export based on format
  if (exportFormat.value === "csv") {
    const csv = convertToCSV(filteredData);
    downloadFile(csv, "sensor-report.csv", "text/csv");
  } else {
    const json = JSON.stringify(filteredData, null, 2);
    downloadFile(json, "sensor-report.json", "application/json");
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  const headers = ["timestamp", "temperature", "humidity", "mq3"];
  const rows = data.map((item) =>
    headers.map((header) => item[header]).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};

// Helper function to download file
const downloadFile = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Load initial data
onMounted(async () => {
  const data = await fetchAllData();
  if (data && data.length) {
    updateSummaries(data);
  }
});

definePageMeta({
  layout: "default",
});
</script>