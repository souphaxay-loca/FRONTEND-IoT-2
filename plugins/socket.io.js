// plugins/socket.io.js
import { io } from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp) => {
  // Use runtime config if available:
  const config = useRuntimeConfig()
  const socketUrl = config.public.socketUrl || 'http://localhost:3999'

  const socket = io(socketUrl, {
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

  socket.on('connect', () => {
    console.log('Socket connected successfully')
  })

  socket.on('connect_error', (error) => {
    console.log('Connection Error:', error.message)
  })

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason)
  })

  return {
    provide: {
      socket: socket
    }
  }
})
