import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path required for GitHub Pages project sites
  base: process.env.GITHUB_ACTIONS ? '/Proyecto_2ev/' : '/',
})
