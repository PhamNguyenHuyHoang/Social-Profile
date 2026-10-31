import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // This Pages site uses the custom domain at its root.
  base: '/',
  plugins: [react()],
})
