#!/usr/bin/env node

// @ts-check
const { build } = require('estrella')
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch').default

build({
  entry: 'src/ui/ui.tsx',
  bundle: true,
  sourcemap: 'inline',
  // minify: false,
  // loader: { '.ttf': 'dataurl' },
  define: { 'process.env.NODE_ENV': 'development' },
  onEnd: callback('main'),
})

build({
  entry: 'src/plugin/plugin.ts',
  outfile: 'build/plugin.js',
  bundle: true,
  sourcemap: 'inline',
  target: 'es6',
  minify: false,
})

const htmlTemplate = (js, css) => `\
<html>
  <head>
    <meta charset="utf-8">
    <style id="prism"></style>
    <style>
    ${css}
    </style>
  </head>
  <body>
    <div id="iframe"></div>
    <script type="text/javascript">
    ${js.replaceAll(`</script>`, `<" + "/script>`)}
    </script>
  </body>
</html>

`

const cache = {}

const keys = ['main']

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

  const css = await fetch(
    'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css',
  ).then((_) => _.text())

  const content = htmlTemplate(cache['main'], css)
  const filePath = path.join(__dirname, 'build/ui.html')
  fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true })
  fs.writeFileSync(filePath, content)
  console.log(`Wrote ${filePath}`)
}
