<!-- pages/index.vue -->
<template>
  <NuxtLayout name="default">
    <div class="min-h-screen bg-gray-50">
      <!-- Connection Status Indicator -->
      <!-- <div class="p-4">
        <span v-if="isConnected" class="text-green-600 font-bold">
          Connected
        </span>
        <span v-else class="text-red-600 font-bold"> Disconnected </span>
      </div> -->
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

const socket = useSocket();
const { fetchAllData } = useSensorData();
const { addDataPoint, getFormattedData } = useGraphData();

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
  });
});

definePageMeta({
  layout: "default",
});
</script>
  