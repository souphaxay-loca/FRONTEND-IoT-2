// composables/useSensorData.js
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

export const useSensorData = () => {
  const loading = ref(false)
  const error = ref(null)
  const config = useRuntimeConfig()

  // Fetch all sensor data from the API endpoint.
  // This URL will be `${config.public.apiUrl}/api/sensor-data`
  const fetchAllData = async () => {
    loading.value = true
    try {
      const response = await fetch(`${config.public.apiUrl}/api/sensor-data`)
      const data = await response.json()
      loading.value = false
      return data  // Returns an array of sensor data objects.
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error fetching sensor data:', err)
      return []
    }
  }

  // Optionally, if you want the latest data point:
  const fetchLatestData = async () => {
    const data = await fetchAllData()
    if (Array.isArray(data) && data.length > 0) {
      return data[data.length - 1]
    }
    return null
  }

  return {
    loading,
    error,
    fetchAllData,
    fetchLatestData
  }
}
