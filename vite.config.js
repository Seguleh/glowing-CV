import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Ensure correct base path for GitHub Pages (repository pages)
  // When publishing to https://seguleh.github.io/glowing-CV/ set base to '/glowing-CV/'
  base: '/glowing-CV/',
  plugins: [vue()],
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  build: {
    target: 'esnext'
  }
})
