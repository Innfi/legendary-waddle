import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/workouts': 'http://localhost:8000',
      '/records': 'http://localhost:8000'
    }
  }
})