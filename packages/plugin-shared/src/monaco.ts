import { StaticServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices'
import { LineTokens } from 'monaco-editor/esm/vs/editor/common/core/lineTokens'
import {
  TokenizationRegistry,
  TokenMetadata,
} from 'monaco-editor/esm/vs/editor/common/modes'
import type * as monaco from 'monaco-editor'
import { ThemeName } from './themes'

export type ExtractionResult = {
  lines: ExtractionResultLine[]
  lineHeight: number
  backgroundColor: Color
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

/** r, g, b value ranging from 0 to 255, a from 0 to 1 */
export type Color = {
  rgba: { r: number; g: number; b: number; a: number }
}

export async function extract({
  code,
  language,
  theme,
}: {
  code: string
  language: string
  theme: {
    name: ThemeName
    data: monaco.editor.IStandaloneThemeData
  }
}): Promise<ExtractionResult> {
  let textLines = code.split(/\r\n|\r|\n/)

  const modeService = StaticServices.modeService.get()
  console.log({ modeService })
  modeService.triggerMode(language)

  const themeService = StaticServices.standaloneThemeService.get()
  themeService.defineTheme(theme.name, theme.data)
  themeService.setTheme(theme.name)
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

  const backgroundColor = hexToColor(theme.data.colors['editor.background'])

  return { lines, backgroundColor, lineHeight: 10 }
}

function getTokenStyle(
  lineTokens: any,
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

function hexToColor(hex: string): Color {
  if (hex.startsWith('#')) {
    hex = hex.slice(1)
  }
  if (hex.length !== 6 && hex.length !== 8) {
    throw new Error(`Invalid hex ${hex}`)
  }

  const normalize = (_: number) => _ / 255

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const a = normalize(hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255)

  return { rgba: { r, g, b, a } }
}
