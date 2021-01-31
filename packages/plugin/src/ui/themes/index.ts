import { editor } from 'monaco-editor'
import { github } from './github'
import { monokai } from './monokai'

export type ThemeMap = { [name: string]: editor.IStandaloneThemeData }
export type ThemeName = keyof typeof themeMap | editor.BuiltinTheme

export const defaultThemeNames: editor.BuiltinTheme[] = [
  'vs',
  'vs-dark',
  'hc-black',
]

export const themeMap = defineThemeMap({
  Monokai: monokai,
  GitHub: github,
})

function defineThemeMap<T extends ThemeMap>(_: T): T {
  return _
}
