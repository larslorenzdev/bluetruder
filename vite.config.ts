import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
  },
  css: {
    postcss: {
      plugins: [require('autoprefixer')],
    },
  },
  server: {
    strictPort: true,
    port: 3000,
    host: '0.0.0.0',
  },
  preview: {
    strictPort: true,
    port: 3000,
    host: '0.0.0.0',
  },
})
