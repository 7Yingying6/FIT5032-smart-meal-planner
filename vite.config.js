import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Vue-related libraries
          'vue-vendor': ['vue', 'vue-router'],
          // Separate Firebase-related libraries
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Separate UI libraries
          'ui-vendor': ['bootstrap', '@iconify/vue'],
          // Separate utility libraries
          'utils-vendor': ['jquery', 'datatables.net', 'jspdf', 'papaparse']
        }
      }
    },
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Compression configuration
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Development server configuration
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  // Pre-build optimization
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'bootstrap',
      '@iconify/vue'
    ]
  }
})
