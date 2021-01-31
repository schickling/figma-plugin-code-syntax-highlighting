import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import * as path from 'path'

const packagesDir = path.join(__dirname, '..')

const alias = {
  'react-figma-plugin-ds':
    path.resolve(packagesDir, 'react-figma-plugin-ds/src') + '/',
}

// const monaco = `monaco-editor/esm/vs`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    global: 'window',
  },
  // optimizeDeps: {
  //   include: [
  //     `${monaco}/language/json/json.worker`,
  //     `${monaco}/language/css/css.worker`,
  //     `${monaco}/language/html/html.worker`,
  //     `${monaco}/language/typescript/ts.worker`,
  //     `${monaco}/editor/editor.worker`,
  //   ],
  // },
  alias,
})
