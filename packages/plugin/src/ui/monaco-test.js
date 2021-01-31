// @ts-check
// import {
//   colorize,
//   tokenize,
// } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneEditor'
import { LineTokens } from 'monaco-editor/esm/vs/editor/common/core/lineTokens'
import {
  TokenizationRegistry,
  TokenMetadata,
} from 'monaco-editor/esm/vs/editor/common/modes'
// import { Colorizer } from 'monaco-editor/esm/vs/editor/standalone/browser/colorizer'
import { StaticServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices'
import * as monaco from 'monaco-editor'

const code = `\
function alt<A>(that: Lazy<Option<A>>): (fa: Option<A>) => Option<A>
`

// monaco.editor.setModelLanguage()

// const colorResult = Colorizer.colorize(
//   StaticServices.modeService.get(),
//   code,
//   'typescript',
//   {},
// )

window.addEventListener('load', () => {
  main().catch((e) => console.error(e))
  // monaco.editor.colorizeElement(document.getElementById('root'), {})
})

async function main() {
  // const editor = monaco.editor.create(document.getElementById('editor'))

  const language = 'typescript'
  // const tokens = await tokenize(code, language)
  // console.log(tokens)

  let lines = code.split(/\r\n|\r|\n/)
  console.log({ lines })

  const modeService = StaticServices.modeService.get()
  console.log({ modeService })
  modeService.triggerMode(language)

  const themeService = StaticServices.standaloneThemeService.get()
  const tokenTheme = themeService.getColorTheme().tokenTheme
  const colorMap = tokenTheme.getColorMap()
  console.log({ theme: tokenTheme })
  // const lang = modeService.getModeId(language)
  // console.log({ lang })
  const tokenizationSupport = await TokenizationRegistry.getPromise(language)
  // console.log({ tokenizationSupport })
  let state = tokenizationSupport.getInitialState()
  for (let i = 0, length = lines.length; i < length; i++) {
    let line = lines[i]
    // let tokenizeResult1 = tokenizationSupport.tokenize(line, state, 0)
    let tokenizeResult = tokenizationSupport.tokenize2(line, state, 0)
    // console.log({ tokenizeResult, tokenizeResult1 })
    LineTokens.convertToEndOffset(tokenizeResult.tokens, line.length)
    let lineTokens = new LineTokens(tokenizeResult.tokens, line)
    console.log({ lineTokens, tokens: tokenizeResult.tokens })

    for (let k = 0; k < lineTokens.getCount(); k++) {
      console.log({
        className: lineTokens.getClassName(k),
        foreground: lineTokens.getForeground(k),
      })
      lineTokens.getLineContent()
      const tokenStyle = getTokenStyle(lineTokens, k, colorMap)
      console.log({
        tokenStyle,
        start: lineTokens.getStartOffset(k),
        end: lineTokens.getEndOffset(k),
      })
    }

    state = tokenizeResult.endState
  }

  // const html = await colorize(code, 'typescript', {})

  // console.log(html)
  // document.querySelector('#root').innerHTML = html
}

function getTokenStyle(
  /** @type LineTokens */
  lineTokens,
  tokenIndex,
  colorMap,
) {
  const metaData = lineTokens.getMetadata(tokenIndex)
  const foregroundIndex = TokenMetadata.getForeground(metaData)
  const backgroundIndex = TokenMetadata.getBackground(metaData)
  const fontStyleIndex = TokenMetadata.getFontStyle(metaData)
  const fontStyle =
    fontStyleIndex & 1
      ? 'italic'
      : fontStyleIndex & 2
      ? 'bold'
      : fontStyleIndex & 4
      ? 'underline'
      : 'none'

  return {
    fontStyle,
    foreground: colorMap[foregroundIndex],
    background: colorMap[backgroundIndex],
  }
}
