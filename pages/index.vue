<!-- pages/index.vue -->
<template>
  <NuxtLayout name="default">
    <div class="min-h-screen bg-gray-50">
      <!-- Add Device Status Indicator using check-devices data -->
      <div class="p-4">
        <div class="bg-white rounded-lg shadow p-4 mb-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div
                :class="[
                  'w-3 h-3 rounded-full',
                  deviceStats.activeDevices > 0 ? 'bg-green-500' : 'bg-red-500',
                ]"
              ></div>
              <span class="font-medium">
                Device Status:
                <span
                  :class="
                    deviceStats.activeDevices > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  "
                >
                  {{ deviceStats.activeDevices > 0 ? "Online" : "Offline" }}
                </span>
              </span>
            </div>
            <div class="text-sm text-gray-500">
              Active Devices: {{ deviceStats.activeDevices }}/{{
                deviceStats.totalDevices
              }}
            </div>
          </div>
        </div>
      </div>
      <!-- Status Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <DashboardStatusCard
          v-for="sensor in sensors"
          :key="sensor.id"
          :title="sensor.title"
          :value="currentValues[sensor.id]"
          :unit="sensor.unit"
          :status="getStatus(sensor.id)"
          :trend="getTrend(sensor.id)"
          :is-device-online="deviceStats.activeDevices > 0"
        />
      </div>

      <!-- Sensor Graphs Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <DashboardSensorGraph
          v-for="sensor in sensors"
          :key="sensor.id"
          :sensor-id="sensor.id"
          :title="sensor.title"
          :data="sensorData[sensor.id]"
          :thresholds="sensor.thresholds"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { useSocket } from "~/composables/useSocket";
import { useSensorData } from "~/composables/useSensorData";
import { useGraphData } from "~/composables/useGraphData";
import { useDevice } from "~/composables/useDevice";

const socket = useSocket();
const { fetchAllData } = useSensorData();
const { addDataPoint, getFormattedData } = useGraphData();
const { deviceStats, checkDevices } = useDevice();

// Define reactive state for current values and graph data
const currentValues = ref({
  temperature: 0,
  humidity: 0,
  mq3: 0,
});

const sensorData = ref({
  temperature: [],
  humidity: [],
  mq3: [],
});

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
    title: "Alcohol Concentration",
    unit: "ppm",
    thresholds: { min: 0, max: 50 },
  },
];

const getStatus = (sensorId) => {
  const value = currentValues.value[sensorId];
  const threshold = sensors.find((s) => s.id === sensorId).thresholds;
  return value < threshold.min || value > threshold.max ? "warning" : "normal";
};

const getTrend = (sensorId) => {
  const data = sensorData.value[sensorId];
  if (data.length < 2) return "stable";
  const last = data[data.length - 1];
  const previous = data[data.length - 2];
  return last > previous ? "up" : last < previous ? "down" : "stable";
};

const maxRecords = 100; // Limit to last 100 records

onMounted(async () => {
  // fetch device status
  await checkDevices();
  // Set up periodic device status checking (every 30 seconds)
  const deviceCheckInterval = setInterval(async () => {
    await checkDevices();
  }, 30000);

  // Fetch all historical data
  const allData = await fetchAllData();
  if (allData && Array.isArray(allData)) {
    // Keep only the last maxRecords (e.g., 100) entries
    const limitedData = allData.slice(-maxRecords);
    // Add each record to the graph's data store
    limitedData.forEach((dataPoint) => {
      addDataPoint(dataPoint);
    });
    // Update the graph data for each sensor
    sensors.forEach((sensor) => {
      sensorData.value[sensor.id] = getFormattedData(sensor.id);
    });
    // Update current values to the latest record
    const latest = limitedData[limitedData.length - 1];
    currentValues.value = {
      temperature: latest.temperature,
      humidity: latest.humidity,
      mq3: latest.mq3,
    };
  }

  // Listen to real-time socket updates
  socket.socket.value.on("new-data", (data) => {
  if (deviceStats.value.activeDevices > 0) {
    console.log("New data received:", data);
    currentValues.value = {
      temperature: data.temperature,
      humidity: data.humidity,
      mq3: data.mq3,
    };
    addDataPoint(data);
    sensors.forEach((sensor) => {
      sensorData.value[sensor.id] = getFormattedData(sensor.id);
    });
  } else {
    console.log("Device is offline, ignoring new data");
  }
});

  // Clean up interval on component unmount
  onUnmounted(() => {
    clearInterval(deviceCheckInterval);
  });
});

definePageMeta({
  layout: "default",
});
</script>
  