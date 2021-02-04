import { ExtractionResult } from './monaco'

export type RunArgs = {
  result: ExtractionResult
  fontFamily: string
  fontStyles: FontStyles
  fontSize: number
  overwriteText: boolean
  includeBackground: boolean
}

type FontStyles = {
  bold: string
  italic: string
  normal: string
}

export function getFontStyles(
  availableFonts: Font[],
  selectedFontFamily: string,
): FontStyles {
  const fontStyles = availableFonts
    .map((_) => _.fontName)
    .filter((_) => _.family === selectedFontFamily)
    .map((_) => _.style)
  const bold = ['Bold', 'Semibold'].find((boldish) =>
    fontStyles.some((_) => _ === boldish),
  )!
  const italic = ['Italic'].find((italicish) =>
    fontStyles.some((_) => _ === italicish),
  )!
  const normal = ['Regular', 'Medium'].find((normalish) =>
    fontStyles.some((_) => _ === normalish),
  )!
  return { bold, italic, normal }
}
