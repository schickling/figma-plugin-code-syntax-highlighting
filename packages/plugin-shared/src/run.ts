import type * as shiki from 'shikiji'

import type { ThemeData } from './types'

export type RunArgs = {
  shikiTokens: shiki.ThemedToken[][]
  themeData: ThemeData
  fontFamily: string
  fontStyles: FontStyles
  fontSize: number
  overwriteExisting: boolean
  includeBackground: boolean
  includeLineNumbers: boolean
}

export type FontStyles = {
  bold: string
  italic: string
  normal: string
}
