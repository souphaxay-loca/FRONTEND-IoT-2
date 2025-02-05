<!-- components/dashboard/SensorGraph.vue -->
<template>
    <div class="bg-white rounded-lg shadow p-4 relative">
      <!-- Live Update Indicator -->
      <!-- <div class="absolute top-2 right-2">
        <span class="flex items-center">
          <span class="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div> -->
  
      <!-- Card Header -->
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ title }} Trend</h3>
      
      <!-- Chart Container -->
      <div class="relative h-64 w-full">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </template>
      
  <script setup>
  import { ref, onMounted, watch, onBeforeUnmount } from "vue";
  import Chart from "chart.js/auto";
  import "chartjs-adapter-date-fns"; // Import the date-fns adapter for time scale
  
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
    
    chart = new Chart(ctx, {
      type: "line",
      data: {
        // Convert timestamps to Date objects for the time scale
        labels: props.data.map((point) => new Date(point.timestamp)),
        datasets: [
          {
            label: props.title,
            data: props.data.map((point) => point.value),
            borderColor: "#3B82F6",
            borderWidth: 3,
            fill: false,
            tension: 0.4, // Adjust tension for slight curvature
            pointRadius: 2,
            pointBackgroundColor: "#3B82F6",
          },
          {
            label: "Min Threshold",
            data: Array(props.data.length).fill(props.thresholds.min),
            borderColor: "#EF4444",
            borderDash: [10, 30],
            borderWidth: 1,
            fill: false,
          },
          {
            label: "Max Threshold",
            data: Array(props.data.length).fill(props.thresholds.max),
            borderColor: "#EF4444",
            borderDash: [5, 5],
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          legend: { display: true, position: "bottom" },
        },
        scales: {
          x: {
            type: "time", // Use time scale for the x-axis
            time: {
              unit: "minute", // Adjust based on your data granularity
              tooltipFormat: "PPpp",
            },
            grid: { display: false },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0, 0, 0, 0.1)" },
          },
        },
      },
    });
  };
  
  watch(
    () => props.data,
    (newData) => {
      if (chart) {
        chart.data.labels = newData.map((point) => new Date(point.timestamp));
        chart.data.datasets[0].data = newData.map((point) => point.value);
        chart.data.datasets[1].data = Array(newData.length).fill(props.thresholds.min);
        chart.data.datasets[2].data = Array(newData.length).fill(props.thresholds.max);
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
  
  <style scoped>
  /* You can add additional custom styling here if needed */
  </style>
  