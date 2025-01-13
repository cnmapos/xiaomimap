import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api1': {
        target: 'http://first-backend:8080',
        changeOrigin: true
      },
      '/api2': {
        target: 'http://second-backend:9090',
        changeOrigin: true
      },
    }
  }
}) 