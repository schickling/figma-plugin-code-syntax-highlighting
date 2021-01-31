// import React, { FC, useEffect } from 'react'
// // import Refractor from 'react-refractor'

// // import js from 'refractor/lang/javascript'
// // import { theme } from '../themes/monokai'
// // import { cssFromTheme } from '../utils/cssFromThemeNew'
// import Editor, { monaco } from 'react-monaco-editor'
// import { ghTheme, monokaiTheme } from '../themes/vsc-themes'

// // import * as monaco from 'monaco-editor'
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// // import { theme } from './prism-theme'
// // Refractor.registerLanguage(js)

// export const Prism: FC<{ code: string }> = ({ code }) => {
//   return (
//     <Editor
//       height="100vh"
//       width="100%"
//       language="typescript"
//       // value={code ?? 'const x = false'}
//       value={'const x = false'}
//       editorWillMount={() => {
//         ;(window as any)['MonacoEnvironment'] = {
//           getWorker(_: any, label: string) {
//             if (label === 'json') {
//               return new jsonWorker()
//             }
//             if (label === 'css' || label === 'scss' || label === 'less') {
//               return new cssWorker()
//             }
//             if (
//               label === 'html' ||
//               label === 'handlebars' ||
//               label === 'razor'
//             ) {
//               return new htmlWorker()
//             }
//             if (label === 'typescript' || label === 'javascript') {
//               return new tsWorker()
//             }
//             return new editorWorker()
//           },
//         }
//         // monaco.editor.defineTheme('gh', ghTheme)
//         monaco.editor.defineTheme('monokai', monokaiTheme)
//       }}
//       options={{
//         minimap: { enabled: false },
//         folding: false,
//         scrollBeyondLastLine: false,
//         theme: 'vs-dark',
//         // theme: 'monokai',
//         // hover: { enabled: false },
//         // readOnly: true,

//         // scrollbar: {
//         //   alwaysConsumeMouseWheel: false,
//         // },
//       }}
//     />
//   )
//   // return <Refractor language="js" value={code} />
// }
