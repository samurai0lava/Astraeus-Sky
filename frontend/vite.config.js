import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // Allows access from outside the container
    port: 5173,         // Standard Vite port
    watch: {
      usePolling: true, // Necessary for Hot Module Replacement on some systems
    },
    proxy: {
      // This sends any request starting with /api to the backend container
      '/api': {
        target: 'http://backend-api:5000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
})