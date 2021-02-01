import { StaticServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices'
import { LineTokens } from 'monaco-editor/esm/vs/editor/common/core/lineTokens'
import {
  TokenizationRegistry,
  TokenMetadata,
} from 'monaco-editor/esm/vs/editor/common/modes'
import { editor } from 'monaco-editor'
// import * as monaco from 'monaco-editor'
// import { ghTheme, monokaiTheme } from '../themes'

export type ExtractionResult = {
  lines: ExtractionResultLine[]
}

export type ExtractionResultLine = {
  tokens: ExtractionResultLineToken[]
}

export type ExtractionResultLineToken = {
  text: string
  tokenStyle: TokenStyle
  offsetStart: number
  offsetEnd: number
}

export type TokenStyle = {
  foreground: Color
  background: Color
  fontStyle: FontStyle
}

export type FontStyle = 'underline' | 'bold' | 'italic' | 'none'

export type Color = {
  rgba: { r: number; g: number; b: number; a: number }
}

export async function extract(
  code: string,
  language: string,
): Promise<ExtractionResult> {
  let textLines = code.split(/\r\n|\r|\n/)
  // console.log({ textLines })

  // console.log(monaco.editor)

  const modeService = StaticServices.modeService.get()
  console.log({ modeService })
  modeService.triggerMode(language)

  const themeService = StaticServices.standaloneThemeService.get()
  // themeService.defineTheme('gh', ghTheme)
  // monaco.editor.defineTheme('monokai', monokaiTheme)
  // themeService.setTheme('monokai')
  const tokenTheme = themeService.getColorTheme().tokenTheme
  const colorMap = tokenTheme.getColorMap()
  const tokenizationSupport = await TokenizationRegistry.getPromise(language)
  console.log({ tokenizationSupport })

  let state = tokenizationSupport.getInitialState()
  const lines = textLines.map<ExtractionResultLine>((line) => {
    // let tokenizeResult1 = tokenizationSupport.tokenize(line, state, 0)
    let tokenizeResult = tokenizationSupport.tokenize2(line, state, 0)
    // console.log({ tokenizeResult, tokenizeResult1 })
    LineTokens.convertToEndOffset(tokenizeResult.tokens, line.length)
    let lineTokens = new LineTokens(tokenizeResult.tokens, line)
    console.log({ lineTokens, tokens: tokenizeResult.tokens })

    const tokens = Array.from(
      Array(lineTokens.getCount()).keys(),
    ).map<ExtractionResultLineToken>((tokenIndex) => {
      const offsetStart = lineTokens.getStartOffset(tokenIndex)
      const offsetEnd = lineTokens.getEndOffset(tokenIndex)
      return {
        tokenStyle: getTokenStyle(lineTokens, tokenIndex, colorMap),
        offsetStart,
        offsetEnd,
        text: lineTokens.getLineContent().substring(offsetStart, offsetEnd),
      }
    })

    state = tokenizeResult.endState

    return { tokens }
  })

  return { lines }
}

function getTokenStyle(
  lineTokens: LineTokens,
  tokenIndex: number,
  colorMap: any,
): TokenStyle {
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
