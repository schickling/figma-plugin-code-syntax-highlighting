export type ThemeData = {
  bg: ColorString
  fg: ColorString
}

/** Hex color string with a leading # (either 8 char incl. or 6 char excl. opacity value) */
export type ColorString = string

export type ColorRGBA = {
  r: number
  g: number
  b: number
  a: number
}
