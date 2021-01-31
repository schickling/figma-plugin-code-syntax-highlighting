import type { Color, ExtractionResult } from '../ui/utils/monaco'

type FontStyles = {
  bold: string
  italic: string
  normal: string
}

async function createTextNode({
  result,
  fontFamily,
  fontStyles,
  fontSize,
}: {
  result: ExtractionResult
  fontFamily: string
  fontStyles: FontStyles
  fontSize: number
}): Promise<void> {
  console.log(result)

  const fontName: FontName = { family: fontFamily, style: fontStyles.normal }
  await figma.loadFontAsync(fontName)

  const nodes: SceneNode[] = []
  const text = figma.createText()
  text.fontSize = fontSize
  text.fontName = fontName
  text.characters = result.lines
    .map((line) => line.tokens.map((token) => token.text).join(''))
    .join('\n')

  let currentOffset = 0

  for (const line of result.lines) {
    for (const token of line.tokens) {
      const newOffset = currentOffset + token.text.length
      const foreground = tokenColorToPaint(token.tokenStyle.foreground)
      text.setRangeFills(currentOffset, newOffset, [foreground])
      // const background = tokenColorToPaint(token.tokenStyle.foreground)
      // text.setRangeFills(currentOffset, newOffset - 1, [foreground])
      const decoration: TextDecoration =
        token.tokenStyle.fontStyle === 'underline' ? 'UNDERLINE' : 'NONE'
      text.setRangeTextDecoration(currentOffset, newOffset, decoration)
      const fontName_: FontName = {
        family: fontFamily,
        style:
          token.tokenStyle.fontStyle === 'bold'
            ? fontStyles.bold
            : token.tokenStyle.fontStyle === 'italic'
            ? fontStyles.italic
            : fontStyles.normal,
      }
      text.setRangeFontName(currentOffset, newOffset, fontName_)
      currentOffset = newOffset
    }
    // NOTE account for linebreak
    currentOffset += 1
  }

  text.setRangeFontSize(0, currentOffset, 12)

  figma.currentPage.appendChild(text)
  nodes.push(text)

  figma.currentPage.selection = nodes
  figma.viewport.scrollAndZoomIntoView(nodes)
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

figma.showUI(__html__)
figma.ui.resize(660, 500)

function updateSelection() {
  if (
    figma.currentPage.selection &&
    figma.currentPage.selection.length === 1 &&
    figma.currentPage.selection[0].type === 'TEXT'
  ) {
    console.log(figma.currentPage.selection[0])

    figma.ui.postMessage({
      type: 'SELECTION_CHANGE',
      selection: figma.currentPage.selection[0].characters,
    })
  }
}

function getFontStyles(
  availableFonts: Font[],
  selectedFontFamily: string,
): FontStyles {
  const fontStyles = availableFonts
    .map((_) => _.fontName)
    .filter((_) => _.family === selectedFontFamily)
    .map((_) => _.style)
  const bold = ['bold', 'semibold'].find((boldish) =>
    fontStyles.some((_) => _ === boldish),
  )!
  const italic = ['italic'].find((italicish) =>
    fontStyles.some((_) => _ === italicish),
  )!
  const normal = ['Regular', 'Medium'].find((normalish) =>
    fontStyles.some((_) => _ === normalish),
  )!
  return { bold, italic, normal }
}

async function main() {
  updateSelection()

  const availableFonts = await figma.listAvailableFontsAsync()
  const monoFonts = availableFonts.filter((_) =>
    ['mono', 'code'].some((monoish) =>
      _.fontName.family.toLowerCase().includes(monoish),
    ),
  )
  figma.ui.postMessage({ type: 'AVAILABLE_FONTS', fonts: monoFonts })

  figma.on('selectionchange', updateSelection)

  figma.ui.onmessage = (msg) => {
    console.log({ msg })

    if (msg.type === 'CREATE_TEXT') {
      createTextNode({
        result: msg.result,
        fontFamily: msg.fontFamily,
        fontStyles: getFontStyles(monoFonts, msg.fontFamily),
        fontSize: msg.fontSize,
      })
    }
  }

  figma.listAvailableFontsAsync()
}

main().catch(console.error)
