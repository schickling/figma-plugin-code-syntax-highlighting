import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import * as path from 'path'

const packagesDir = path.join(__dirname, '..')

const alias = {
  '@internal/plugin-shared':
    path.resolve(packagesDir, 'plugin-shared/src') + '/',
}

// const monaco = `monaco-editor/esm/vs`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    // this is needed for react-figma-plugin-ds to work
    // global: 'window',
  },
  alias,
})
