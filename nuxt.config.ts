import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
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
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || 'http://localhost:3999',
      env: process.env.NODE_ENV || 'development'
    }
  }
});
