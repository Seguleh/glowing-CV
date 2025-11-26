import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
const repoBase = process.env.SITE_BASE || '/glowing-CV/'

export default defineConfig({
  // Allow overriding base via environment variable SITE_BASE for flexibility
  base: repoBase,
  plugins: [vue()],
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  build: {
    target: 'esnext'
  }
})
