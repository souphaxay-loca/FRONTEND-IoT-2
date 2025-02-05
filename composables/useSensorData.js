// composables/useSensorData.js
import { ref } from 'vue'

export const useSensorData = () => {
  const loading = ref(false)
  const error = ref(null)

  // Fetch latest sensor data
  const fetchLatestData = async () => {
    loading.value = true
    try {
      const response = await fetch('http://localhost:3999/api/sensor-data')
      const data = await response.json()
      loading.value = false
      return data
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error fetching sensor data:', err)
      return null
    }
  }

  // Fetch historical data with date range
  const fetchHistoricalData = async (startDate, endDate) => {
    loading.value = true
    try {
      const response = await fetch(`http://localhost:3999/api/sensor-data?startDate=${startDate}&endDate=${endDate}`)
      const data = await response.json()
      loading.value = false
      return data
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error fetching historical data:', err)
      return []
    }
  }

  return {
    loading,
    error,
    fetchLatestData,
    fetchHistoricalData
  }
}