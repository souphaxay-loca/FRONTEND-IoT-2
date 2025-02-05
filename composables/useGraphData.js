// composables/useGraphData.js
import { ref, computed } from 'vue'

export const useGraphData = () => {
  const chartData = ref([])
  const maxDataPoints = 20 // Maximum number of points to show on graph

  // Process new data point
  const addDataPoint = (newData) => {
    chartData.value.push(newData)
    
    // Keep only last maxDataPoints points
    if (chartData.value.length > maxDataPoints) {
      chartData.value.shift()
    }
  }

  // Clear all data
  const clearData = () => {
    chartData.value = []
  }

  // Get formatted data for specific sensor
  const getFormattedData = (sensorId) => {
    return chartData.value.map(data => ({
      timestamp: new Date(data.timestamp),
      value: data[sensorId]
    }))
  }
  

  // Get min/max values for a sensor
  const getDataRange = (sensorId) => {
    const values = chartData.value.map(data => data[sensorId])
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    }
  }

  return {
    chartData,
    addDataPoint,
    clearData,
    getFormattedData,
    getDataRange
  }
}