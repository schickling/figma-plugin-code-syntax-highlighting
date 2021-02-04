import type * as monaco from 'monaco-editor'
import Color from 'color'

export interface Colors {
  [key: string]: string
}
export interface ITokenEntry {
  name?: string
  scope: string[] | string
  settings: {
    foreground?: string
    background?: string
    fontStyle?: string
  }
}

// This is the structure of a vscode theme file.
export interface IThemeObject {
  name: string
  type?: string
  include?: string
  colors?: Colors

  settings?: ITokenEntry[] // Old style specification.
  tokenColors?: ITokenEntry[] // This is how it should be done now.
}

/**
 * Updates the theme used by all code editor instances.
 *
 * @param theme The theme name.
 * @param type The base type of the theme.
 * @param values The actual theme values.
 */
export function vscodeThemeToMonacoTheme({
  // themeName,
  type,
  values,
}: {
  // themeName: string
  type: 'light' | 'dark'
  values: IThemeObject
}): monaco.editor.IStandaloneThemeData {
  // Convert all color values to CSS hex form.
  const entries: { [key: string]: string } = {}
  for (const [key, value] of Object.entries(values.colors || {})) {
    entries[key] = colorToHex(value) || ''
  }

  const tokenRules: monaco.editor.ITokenThemeRule[] = []

  values.tokenColors ??= []
  values.tokenColors.forEach((value) => {
    const scopeValue = value.scope || []
    const scopes = Array.isArray(scopeValue)
      ? scopeValue
      : scopeValue.split(',')
    scopes.forEach((scope) => {
      tokenRules.push({
        token: scope,
        foreground: colorToHex(value.settings.foreground),
        background: colorToHex(value.settings.background),
        fontStyle: value.settings.fontStyle,
      })
    })
  })

  // const currentThemeId = themeName.replace(/[^a-zA-Z]+/g, '-')

  return {
    base: type === 'light' ? 'vs' : 'vs-dark',
    inherit: true,
    rules: tokenRules,
    colors: entries,
  }

  // editor.defineTheme(currentThemeId, {
  //   base: type === 'light' ? 'vs' : 'vs-dark',
  //   inherit: true,
  //   rules: tokenRules,
  //   colors: entries,
  // })

  // editor.setTheme(currentThemeId)
}

/**
 * Converts a color string or a color to a hex string.
 *
 * @param color The value to convert.
 *
 * @returns A hex string of the given color, including the alpha value.
 */
export const colorToHex = (
  color: string | Color | undefined,
): string | undefined => {
  if (!color) {
    return undefined
  }

  if (typeof color === 'string') {
    color = new Color(color)
  }

  // Hex color values have no alpha component, so we have to add that explicitly.
  if (color.alpha() < 1) {
    let alpha = Math.round(color.alpha() * 255).toString(16)
    if (alpha.length < 2) {
      alpha = '0' + alpha
    }

    return color.hex() + alpha
  } else {
    return color.hex()
  }
}
