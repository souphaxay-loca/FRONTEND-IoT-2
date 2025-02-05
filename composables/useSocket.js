// composables/useSocket.js
import { ref } from 'vue'
import { io } from 'socket.io-client'

export const useSocket = () => {
  const socket = ref(null)
  const isConnected = ref(false)
  const lastError = ref(null)

  if (!socket.value) {
    socket.value = io('http://localhost:3999', {
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