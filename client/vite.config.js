import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    open: true,
    proxy: {
      '/v1': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
    },
  },
})

