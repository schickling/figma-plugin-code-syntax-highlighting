#!/usr/bin/env node

// @ts-check
const { build, cliopts } = require('estrella')
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch').default

const isDev = cliopts.watch
const buildDirSuffix = isDev ? 'dev' : 'prod'
const buildDir = `build-${buildDirSuffix}`

const appUrl = isDev ? 'http://localhost:3000' : 'https://figma-code.vercel.app'

build({
  entry: 'src/ui/ui.tsx',
  bundle: true,
  sourcemap: 'inline',
  // minify: false,
  // loader: { '.ttf': 'dataurl' },
  define: {
    'process.env.NODE_ENV': 'development',
    'process.env.APP_URL': appUrl,
  },
  onEnd: callback('main'),
})

build({
  entry: 'src/plugin/plugin.ts',
  outfile: `${buildDir}/plugin.js`,
  bundle: true,
  sourcemap: 'inline',
  target: 'es6',
  minify: false,
})

makeManifest()

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
  const filePath = path.join(__dirname, buildDir, 'ui.html')
  fs.mkdirSync(path.join(__dirname, buildDir), { recursive: true })
  fs.writeFileSync(filePath, content)
  console.log(`Wrote ${filePath}`)
}

async function makeManifest() {
  const name = isDev
    ? 'Code Syntax Highlighter (Dev)'
    : 'Code Syntax Highlighter'
  const data = {
    api: '1.0.0',
    id: '938793197191698232',
    name,
    main: 'plugin.js',
    ui: 'ui.html',
  }
  await fs.promises.mkdir(path.join(__dirname, buildDir), { recursive: true })
  await fs.promises.writeFile(
    path.join(__dirname, buildDir, 'manifest.json'),
    JSON.stringify(data, null, 2),
  )
}
