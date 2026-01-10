import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '::',
    allowedHosts: [
      'crudely-glaived-cordell.ngrok-free.dev'
    ],
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //     secure: false,      
    //     ws: true,
    //     rewrite: (path) => path.replace(/^\/api/, "")
    //   },
    // },
    hmr: {
      clientPort: 443
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './'),
    }},
})
