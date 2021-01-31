#!/usr/bin/env node
const { build } = require('estrella')
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')

build({
  entry: 'src/ui/ui.tsx',
  bundle: true,
  sourcemap: 'inline',
  // minify: false,
  loader: { '.ttf': 'dataurl' },
  define: { 'process.env.NODE_ENV': 'development' },
  onEnd: callback('main'),
})

build({
  entry: 'src/ops/plugin.ts',
  outfile: 'build/plugin.js',
  bundle: true,
})

const htmlTemplate = (js, workerScripts, css) => `\
<html>
  <head>
    <meta charset="utf-8">
    <style id="prism"></style>
    <style>
    ${css}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript">
    ${js.replaceAll(`</script>`, `<" + "/script>`)}
    </script>
    ${workerScripts}
  </body>
</html>

`

const workerDefs = {
  ts: 'node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js',
  json: 'node_modules/monaco-editor/esm/vs/language/json/json.worker.js',
  // html: 'node_modules/monaco-editor/esm/vs/language/html/html.worker.js',
  // css: 'node_modules/monaco-editor/esm/vs/language/css/css.worker.js',
  editor: 'node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
}

Object.entries(workerDefs).forEach(([key, entry]) =>
  build({
    entry,
    bundle: true,
    onEnd: callback(key),
  }),
)

const cache = {}

const keys = Object.keys(workerDefs).concat(['main'])

function callback(key) {
  return (_config, result) => {
    if (result.errors.length === 0 && result.js) {
      cache[key] = result.js
      makeHTML()
    } else {
      console.error(result.errors)
    }
  }
}

async function makeHTML() {
  if (keys.some((key) => cache[key] === undefined)) {
    return
  }

  const workerScripts = Object.keys(workerDefs)
    .map(
      (key) => `\
<script id="${key}-worker" type="javascript/worker">
${cache[key]}
</script>
`,
    )
    .join('\n')

  const css = await fetch(
    'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css',
  ).then((_) => _.text())

  const content = htmlTemplate(cache['main'], workerScripts, css)
  const filePath = path.join(__dirname, 'build/ui.html')
  fs.writeFileSync(filePath, content)
  console.log(`Wrote ${filePath}`)
}
