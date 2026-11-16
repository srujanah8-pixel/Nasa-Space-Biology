
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [resolve(__dirname, '.')]
    }
  }
})
