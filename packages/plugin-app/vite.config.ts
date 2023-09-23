import reactRefresh from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'

const packagesDir = path.join(__dirname, '..')

const alias = {
  '@internal/plugin-shared': path.resolve(packagesDir, 'plugin-shared/src') + '/',
}

// const monaco = `monaco-editor/esm/vs`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias,
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         prettier: ['prettier'],
  //       },
  //     },
  //   },
  // },
})
