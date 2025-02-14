import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

export const useDevice = () => {
  const deviceStats = ref({
    devicesMarkedOffline: 0,
    totalDevices: 0,
    offlineDevices: 0,
    activeDevices: 0
  })
  const loading = ref(false)
  const error = ref(null)
  const config = useRuntimeConfig()

  // Fetch device status based on heartbeat data
  const checkDevices = async () => {
    loading.value = true
    try {
      const response = await fetch(`${config.public.apiUrl}/api/check-devices`)
      console.log('res', response)
      const data = await response.json()
      deviceStats.value = data
      loading.value = false
      return data
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.error('Error checking devices:', err)
      return null
    }
  }

  return {
    deviceStats,
    loading,
    error,
    checkDevices
  }
}