import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.resolve();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    },
  },
  publicDir: 'public',
  assetsInclude: ['**/*.TTF', '**/*.ttf'],

  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@api', replacement: path.resolve(__dirname, 'src/api') },
      { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components'),
      },
      { find: '@data', replacement: path.resolve(__dirname, 'src/data'),},
      { find: '@layout', replacement: path.resolve(__dirname, 'src/layout') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@router', replacement: path.resolve(__dirname, 'src/router') },
      { find: '@store', replacement: path.resolve(__dirname, 'src/store') },
      { find: '@styles', replacement: path.resolve(__dirname, 'src/styles') },
    ],
  },

})
