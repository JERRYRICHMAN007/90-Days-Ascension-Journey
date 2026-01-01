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
    host: '127.0.0.1', // IPv4 to avoid ::1 permission issues on Windows
    port: 5173, // Default Vite port to dodge conflicts on 3000
    strictPort: false, // Allow fallback to next available port
    open: true, // Automatically open browser
  },
})

