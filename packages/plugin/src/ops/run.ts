import { Color, ExtractionResultLine } from '../shared/monaco'
import { RunArgs } from '../shared/run'

export async function run({
  result,
  fontFamily,
  fontStyles,
  fontSize,
  overwriteText,
  selection,
  includeBackground,
}: RunArgs & { selection: readonly SceneNode[] }): Promise<void> {
  console.log({ result, fontFamily, fontStyles, fontSize })

  const normalFontName: FontName = {
    family: fontFamily,
    style: fontStyles.normal,
  }

  await Promise.all([
    figma.loadFontAsync(normalFontName),
    figma.loadFontAsync({ family: fontFamily, style: fontStyles.bold }),
  ])

  const text = overwriteText ? (selection[0] as TextNode) : figma.createText()
  if (!overwriteText) {
    text.visible = false
    text.name = 'Code snippet'
  }
  text.fontName = normalFontName
  text.fontSize = fontSize
  text.lineHeight = {
    unit: 'PERCENT',
    value: 150,
  }
  text.characters = result.lines
    .map((line) => line.tokens.map((token) => token.text).join(''))
    .join('\n')
  // text.textAutoResize = 'HEIGHT'

  text.layoutGrow = 1

  let currentOffset = 0
  function styleLine(
    lines: Iterator<ExtractionResultLine, ExtractionResultLine>,
    resolve: Function,
  ) {
    const line = lines.next().value
    if (line) {
      for (const token of line.tokens) {
        const newOffset = currentOffset + token.text.length
        const foreground = tokenColorToPaint(token.tokenStyle.foreground)
        text.setRangeFills(currentOffset, newOffset, [foreground])
        // const background = tokenColorToPaint(token.tokenStyle.foreground)
        // text.setRangeFills(currentOffset, newOffset - 1, [foreground])
        const decoration: TextDecoration =
          token.tokenStyle.fontStyle === 'underline' ? 'UNDERLINE' : 'NONE'
        if (decoration !== 'NONE') {
          text.setRangeTextDecoration(currentOffset, newOffset, decoration)
        }
        const fontStyle =
          token.tokenStyle.fontStyle === 'bold'
            ? fontStyles.bold
            : token.tokenStyle.fontStyle === 'italic'
            ? fontStyles.italic
            : fontStyles.normal
        if (fontStyle !== fontStyles.normal) {
          text.setRangeFontName(currentOffset, newOffset, {
            family: fontFamily,
            style: fontStyle,
          })
        }
        currentOffset = newOffset
      }

      currentOffset += 1
      setTimeout(() => styleLine(lines, resolve), 1)
    } else {
      resolve()
    }
  }

  await new Promise((resolve) => styleLine(result.lines.values(), resolve))

  if (includeBackground) {
    applyBackground({
      backgroundColor: result.backgroundColor,
      textNode: text,
      reuse: overwriteText,
    })
  } else {
    if (!overwriteText) {
      text.visible = true
      figma.currentPage.appendChild(text)
      figma.currentPage.selection = [text]
      figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)
    }
  }
}

function applyBackground({
  backgroundColor,
  textNode,
  reuse,
}: {
  backgroundColor: Color
  textNode: TextNode
  reuse: boolean
}) {
  const hasExistingBackground =
    reuse &&
    textNode.parent?.getPluginData('background') === 'yes' &&
    textNode.parent.type === 'FRAME'

  const frame = hasExistingBackground
    ? (textNode.parent as FrameNode)
    : figma.createFrame()

  if (!hasExistingBackground) {
    frame.name = 'Code snippet wrapper'
  }

  frame.setPluginData('background', 'yes')

  const padding = 10
  frame.backgrounds = [tokenColorToPaint(backgroundColor)]
  frame.paddingTop = padding
  frame.paddingBottom = padding
  frame.paddingLeft = padding
  frame.paddingRight = padding
  frame.layoutMode = 'HORIZONTAL'
  frame.primaryAxisSizingMode = 'AUTO'
  frame.counterAxisSizingMode = 'AUTO'
  frame.resize(textNode.width + padding * 2, frame.height)

  if (!hasExistingBackground) {
    textNode.visible = true
    if (reuse) {
      const parent = textNode.parent!
      frame.appendChild(textNode)
      parent.appendChild(frame)
    } else {
      frame.appendChild(textNode)
      figma.currentPage.appendChild(frame)
      figma.currentPage.selection = [textNode]
      figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)
    }
  }
}

function tokenColorToPaint(color: Color): Paint {
  const normalize = (_: number) => _ / 255
  return {
    type: 'SOLID',
    color: {
      r: normalize(color.rgba.r),
      g: normalize(color.rgba.g),
      b: normalize(color.rgba.b),
    },
    opacity: color.rgba.a,
  }
}
