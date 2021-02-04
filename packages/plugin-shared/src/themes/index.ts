import type { editor } from 'monaco-editor'
import {
  vs,
  vs_dark,
  hc_black,
} from 'monaco-editor/esm/vs/editor/standalone/common/themes'
import { vscodeThemeToMonacoTheme } from './vsc-converter'
import { DarkPlus } from './vsc/dark_plus'
import { monacoThemeMap } from './monaco-themes'

export type ThemeMap = { [name: string]: editor.IStandaloneThemeData }
export type ThemeName = keyof typeof themeMap

export const themeMap = defineThemeMap({
  ...monacoThemeMap,
  'High Contrast Black': hc_black,
  'VSCode Light': vs,
  'VSCode Dark': vs_dark,
  'VSCode Dark Plus': vscodeThemeToMonacoTheme({
    type: 'dark',
    values: DarkPlus,
  }),
})

function defineThemeMap<T extends ThemeMap>(_: T): T {
  return _
}
