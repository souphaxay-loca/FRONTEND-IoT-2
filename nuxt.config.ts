// nuxt.config.js
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  app: {
    head: {
        title: "IoT Real-Time Monitoring",
        meta: [
            { name: "description", content: "IoT Dashboard for monitoring devices and sensors" }
        ],
        link: [
          {rel: 'icon', type: 'image/png', href: '/meme.png'}
        ]
    }
  },
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  build: {
    transpile: ['chart.js']
  },
  plugins: [
    '~/plugins/socket.io.js'
  ],
  components: {
    global: true,
    dirs: [
      {
        path: '~/components/dashboard',
        prefix: 'Dashboard'
      },
      {
        path: '~/components/layout',
        prefix: 'Layout'
      }
    ]
  },
  runtimeConfig: {
    public: {
      // Use the provided online API URL by default.
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'https://backend-iot-t13g.onrender.com',
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || 'https://backend-iot-t13g.onrender.com',
      env: process.env.NODE_ENV || 'development'
    }
  }
});
