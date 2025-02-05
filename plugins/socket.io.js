// plugins/socket.io.js
import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const socket = io('http://localhost:3999', {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    // Simplified transport configuration to match backend
    transports: ['polling', 'websocket'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  // Better error handling and logging
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