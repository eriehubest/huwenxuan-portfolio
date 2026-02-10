import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import restart from 'vite-plugin-restart'

// https://vite.dev/config/
export default defineConfig({
  publicDir: './static/',
  plugins: [
    tailwindcss(),
    react(),
    restart({ restart: [ './static/**', ] })
  ],

  base: '/huwenxuan-portfolio',
})
