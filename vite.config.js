import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. We create a fake local address '/netlify-api'
      '/netlify-api': {
        target: 'https://api.netlify.com/api/v1', // 2. It forwards here
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/netlify-api/, ''),
      },
    },
  },
})