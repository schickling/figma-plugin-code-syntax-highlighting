import { ExtractionResult } from './monaco'

export type RunArgs = {
  result: ExtractionResult
  fontFamily: string
  fontStyles: FontStyles
  fontSize: number
  overwriteText: boolean
  includeBackground: boolean
}

export type FontStyles = {
  bold: string
  italic: string
  normal: string
}
