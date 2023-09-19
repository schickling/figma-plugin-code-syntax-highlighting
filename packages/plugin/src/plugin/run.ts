import type { ColorRGBA, ColorString, RunArgs } from '@internal/plugin-shared'
import type * as shiki from 'shikiji'

export const enum FontStyle {
  NotSet = -1,
  None = 0,
  Italic = 1,
  Bold = 2,
  Underline = 4,
}

const bgPadding = 10

export const run = async ({
  shikiTokens,
  themeData,
  fontFamily,
  fontStyles,
  fontSize,
  overwriteExisting,
  selection,
  includeBackground,
  includeLineNumbers,
}: RunArgs & { selection: readonly SceneNode[] }): Promise<void> => {
  // console.log({ shikiTokens, themeData, fontFamily, fontStyles, fontSize, overwriteExisting })

  const normalFontName: FontName = {
    family: fontFamily,
    style: fontStyles.normal,
  }

  await Promise.all([
    figma.loadFontAsync(normalFontName),
    ...(fontStyles.bold ? [figma.loadFontAsync({ family: fontFamily, style: fontStyles.bold })] : []),
    ...(fontStyles.italic ? [figma.loadFontAsync({ family: fontFamily, style: fontStyles.italic })] : []),
  ])

  const lineHeight: LineHeight = {
    unit: 'PERCENT',
    value: 150,
  }

  const textNode = overwriteExisting ? (selection[0] as TextNode) : figma.createText()

  if (!overwriteExisting) {
    textNode.visible = false
    textNode.name = 'Code snippet'
  }
  textNode.fontName = normalFontName
  textNode.fontSize = fontSize
  textNode.lineHeight = lineHeight
  textNode.characters = shikiTokens.map((line) => line.map((token) => token.content).join('')).join('\n')

  // textNode.layoutGrow = 1

  let currentCharOffset = 0
  const styleLine = (lines: Iterator<shiki.ThemedToken[], shiki.ThemedToken[]>, resolve: Function) => {
    const line = lines.next()

    if (line.done) {
      resolve()
      return
    }

    for (const token of line.value) {
      const newOffset = currentCharOffset + token.content.length
      const foreground = colorStringToPaint(token.color!)
      textNode.setRangeFills(currentCharOffset, newOffset, [foreground])
      const tokenFontStyle = token.fontStyle as FontStyle | undefined
      const decoration: TextDecoration = tokenFontStyle === FontStyle.Underline ? 'UNDERLINE' : 'NONE'
      if (decoration !== 'NONE') {
        textNode.setRangeTextDecoration(currentCharOffset, newOffset, decoration)
      }
      const fontStyle =
        tokenFontStyle === FontStyle.Bold
          ? fontStyles.bold
          : tokenFontStyle === FontStyle.Italic
          ? fontStyles.italic
          : fontStyles.normal
      if (fontStyle !== fontStyles.normal) {
        textNode.setRangeFontName(currentCharOffset, newOffset, {
          family: fontFamily,
          style: fontStyle,
        })
      }
      currentCharOffset = newOffset
    }

    currentCharOffset += 1
    setTimeout(() => styleLine(lines, resolve), 1)
  }

  await new Promise((resolve) => styleLine(shikiTokens.values(), resolve))

  if (includeBackground) {
    applyBackground({
      backgroundColor: themeData.bg,
      textNode,
      overwriteExisting,
    })
  } else {
    if (!overwriteExisting) {
      textNode.visible = true
      figma.currentPage.appendChild(textNode)
    }
  }

  applyLineNumbers({
    includeLineNumbers,
    lineNumbers: shikiTokens.length,
    overwriteExisting,
    textNode,
    textProps: { fontName: normalFontName, fontSize, lineHeight, color: themeData.fg },
  })

  textNode.visible = true

  if (!overwriteExisting) {
    textNode.textAutoResize = 'WIDTH_AND_HEIGHT'
  }

  // select new node
  if (!overwriteExisting) {
    figma.currentPage.selection = [textNode]
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)
  }
}

const applyBackground = ({
  backgroundColor,
  textNode,
  overwriteExisting,
}: {
  backgroundColor: ColorString
  textNode: TextNode
  overwriteExisting: boolean
}): void => {
  const getOrMakeBgFrame = (): FrameNode => {
    if (overwriteExisting) {
      const hasExistingBackground =
        textNode.parent?.getPluginData('background') === 'yes' && textNode.parent.type === 'FRAME'

      if (hasExistingBackground) {
        return textNode.parent as FrameNode
      } else {
        const parent = textNode.parent!
        const newFrame = figma.createFrame()
        newFrame.appendChild(textNode)
        parent.appendChild(newFrame)
        return newFrame
      }
    } else {
      const newFrame = figma.createFrame()

      newFrame.appendChild(textNode)
      figma.currentPage.appendChild(newFrame)

      return newFrame
    }
  }

  const bgFrame = getOrMakeBgFrame()

  bgFrame.name = 'Code snippet wrapper'
  bgFrame.setPluginData('background', 'yes')

  bgFrame.backgrounds = [colorStringToPaint(backgroundColor)]
  bgFrame.paddingTop = bgPadding
  bgFrame.paddingBottom = bgPadding
  bgFrame.paddingLeft = bgPadding
  bgFrame.paddingRight = bgPadding
  bgFrame.layoutMode = 'HORIZONTAL'
  bgFrame.primaryAxisSizingMode = 'AUTO'
  bgFrame.counterAxisSizingMode = 'AUTO'
  bgFrame.itemSpacing = 16
}

const applyLineNumbers = ({
  textNode,
  lineNumbers,
  includeLineNumbers,
  overwriteExisting,
  textProps,
}: {
  textNode: TextNode
  lineNumbers: number
  includeLineNumbers: boolean
  overwriteExisting: boolean
  textProps: { fontName: FontName; fontSize: number; lineHeight: LineHeight; color: ColorString }
}): void => {
  const getOrMakeLineNumbersNode = (): TextNode => {
    if (overwriteExisting) {
      const parentFrame = textNode.parent!
      const existingLineNumbersFrame = parentFrame.findChild(
        (_) => _.getPluginData('line-numbers') === 'yes' && _.type === 'TEXT',
      )

      if (existingLineNumbersFrame) {
        return existingLineNumbersFrame as TextNode
      } else {
        const newNode = figma.createText()
        parentFrame.insertChild(0, newNode)
        return newNode
      }
    } else {
      const newNode = figma.createText()

      textNode.parent!.insertChild(0, newNode)

      return newNode
    }
  }

  const lineNumbersNode = getOrMakeLineNumbersNode()

  if (!includeLineNumbers) {
    lineNumbersNode.remove()
    return
  }

  lineNumbersNode.name = 'Code line numbers'
  lineNumbersNode.setPluginData('line-numbers', 'yes')

  lineNumbersNode.fontName = textProps.fontName
  lineNumbersNode.fontSize = textProps.fontSize
  lineNumbersNode.lineHeight = textProps.lineHeight
  lineNumbersNode.textAlignHorizontal = 'RIGHT'

  lineNumbersNode.fills = [colorStringToPaint(textProps.color, 0.3)]

  lineNumbersNode.characters = Array.from({ length: lineNumbers }, (_v, i) => i + 1).join('\n')
}

const colorStringToPaint = (color: ColorString, opacity?: number): Paint => {
  const normalize = (_: number) => _ / 255
  const rgba = parseColorString(color)
  return {
    type: 'SOLID',
    color: {
      r: normalize(rgba.r),
      g: normalize(rgba.g),
      b: normalize(rgba.b),
    },
    opacity: opacity ?? normalize(rgba.a),
  }
}

const parseColorString = (str: ColorString): ColorRGBA => {
  if (!str.startsWith('#')) {
    throw new Error(`Color hex value didn't start with '#': ${str}`)
  }

  str = str.slice(1)

  // double hex code if it's 3 char
  if (str.length === 3) {
    str = str
      .split('')
      .map((char) => char + char)
      .join('')
  }

  const r = parseInt(str.slice(0, 2), 16)
  const g = parseInt(str.slice(2, 4), 16)
  const b = parseInt(str.slice(4, 6), 16)
  const a = parseInt(str.slice(6, 8), 16)

  if (Number.isNaN(a)) {
    return { r, g, b, a: 255 }
  } else {
    return { r, g, b, a }
  }
}
