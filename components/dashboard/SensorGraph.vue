<!-- components/dashboard/SensorGraph.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-medium text-gray-900 mb-4">{{ title }} History</h3>
    <div class="relative h-64 w-full">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  sensorId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // Expect an array of objects: [{ timestamp, value }, ...]
  data: {
    type: Array,
    required: true,
  },
  thresholds: {
    type: Object,
    required: true,
  },
});

const chartRef = ref(null);
let chart = null;

const createChart = () => {
  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext("2d");
  if (chart) {
    chart.destroy();
  }

  // Extract labels and sensor values from data objects
  const labels = props.data.map((point) => point.timestamp);
  const sensorValues = props.data.map((point) => point.value);

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: props.title,
          data: sensorValues,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Min Threshold",
          data: Array(sensorValues.length).fill(props.thresholds.min),
          borderColor: "#EF4444",
          borderDash: [5, 5],
          fill: false,
        },
        {
          label: "Max Threshold",
          data: Array(sensorValues.length).fill(props.thresholds.max),
          borderColor: "#EF4444",
          borderDash: [5, 5],
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      plugins: {
        legend: { display: true, position: "top" },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0, 0, 0, 0.1)" },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
};

watch(
  () => props.data,
  (newData) => {
    if (chart) {
      const newLabels = newData.map((point) => point.timestamp);
      const newValues = newData.map((point) => point.value);
      chart.data.labels = newLabels;
      chart.data.datasets[0].data = newValues;
      chart.data.datasets[1].data = Array(newValues.length).fill(
        props.thresholds.min
      );
      chart.data.datasets[2].data = Array(newValues.length).fill(
        props.thresholds.max
      );
      chart.update("none");
    }
  },
  { deep: true }
);

onMounted(() => {
  createChart();
});

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>
  