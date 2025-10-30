import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    port: 5173,
    // historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8080',
      '/addUser': 'http://localhost:8080',
      '/login': 'http://localhost:8080'
    }
  }
})
