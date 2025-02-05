// composables/useSocket.js
import { ref } from 'vue'
import { io } from 'socket.io-client'
import { useRuntimeConfig } from '#imports'  // Import Nuxt's runtime config helper

export const useSocket = () => {
  // Use runtime config to dynamically set the socket URL.
  const config = useRuntimeConfig()
  const socketUrl = config.public.socketUrl || 'http://localhost:3999'

  // Create a reactive reference for the socket and connection state.
  const socket = ref(null)
  const isConnected = ref(false)
  const lastError = ref(null)

  // Create the socket only once.
  if (!socket.value) {
    socket.value = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['polling', 'websocket'],
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    // Set up socket event listeners.
    socket.value.on('connect', () => {
      isConnected.value = true
      lastError.value = null
      console.log('Socket connected successfully')
    })

    socket.value.on('disconnect', (reason) => {
      isConnected.value = false
      console.log('Socket disconnected:', reason)
    })

    socket.value.on('connect_error', (error) => {
      isConnected.value = false
      lastError.value = error.message
      console.log('Connection Error:', error.message)
    })
  }

  return {
    socket,
    isConnected,
    lastError
  }
}
