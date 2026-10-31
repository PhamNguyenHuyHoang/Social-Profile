import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const sourceRoot = fileURLToPath(new URL('./src', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  root: sourceRoot,
  publicDir: resolve(sourceRoot, '../public'),
  // This Pages site uses the custom domain at its root.
  base: '/',
  plugins: [react()],
  build: {
    outDir: resolve(sourceRoot, '../dist'),
    assetsDir: 'site-assets',
    emptyOutDir: true,
  },
})
