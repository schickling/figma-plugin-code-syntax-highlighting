;(window as any).global = window

import React from 'react'
import ReactDOM from 'react-dom'
import Main from './pages/Main'

import './index.css'
import 'react-figma-plugin-ds/figma-plugin-ds.css'

// self['MonacoEnvironment'] = {
//   getWorker: function (moduleId, label) {
//     if (label === 'json') {
//       return getWorker('json')
//     }
//     // if (label === 'css' || label === 'scss' || label === 'less') {
//     //   return './css.worker.js'
//     // }
//     // if (label === 'html' || label === 'handlebars' || label === 'razor') {
//     //   return './html.worker.js'
//     // }
//     if (label === 'typescript' || label === 'javascript') {
//       return getWorker('ts')
//     }
//     return getWorker('editor')
//   },
//   // getWorkerUrl: function (moduleId, label) {
//   //   if (label === 'json') {
//   //     return './json.worker.js'
//   //   }
//   //   // if (label === 'css' || label === 'scss' || label === 'less') {
//   //   //   return './css.worker.js'
//   //   // }
//   //   // if (label === 'html' || label === 'handlebars' || label === 'razor') {
//   //   //   return './html.worker.js'
//   //   // }
//   //   if (label === 'typescript' || label === 'javascript') {
//   //     return './ts.worker.js'
//   //   }
//   //   return './editor.worker.js'
//   // },
// }

function getWorker(key: string): Worker {
  const blob = new Blob([document.getElementById(`${key}-worker`).textContent])
  return new Worker(window.URL.createObjectURL(blob))
}

ReactDOM.render(<Main />, document.getElementById('root'))
