// NOTE import directly from source to avoid bundling of monaco-editor
// TOOD clean this up
import type { RunDoneMessage, SelectionChangeMessage } from '@internal/plugin-shared/src/event-messages'
import { isRunMessage } from '@internal/plugin-shared/src/event-messages'
import type { FontStyles } from '@internal/plugin-shared/src/run'
import { pick } from '@internal/plugin-shared/src/utils'

import { run } from './run'

figma.showUI(__html__)
figma.ui.resize(760, 500)

function updateSelection() {
  if (
    figma.currentPage.selection &&
    figma.currentPage.selection.length === 1 &&
    figma.currentPage.selection[0].type === 'TEXT'
  ) {
    const selection = figma.currentPage.selection[0]
    const message: SelectionChangeMessage = {
      type: 'SELECTION_CHANGE',
      isText: true,
      selection: {
        text: selection.characters,
        fontSize: selection.fontSize as number,
      },
    }
    figma.ui.postMessage(message)
  } else {
    const message: SelectionChangeMessage = {
      type: 'SELECTION_CHANGE',
      isText: false,
    }
    figma.ui.postMessage(message)
  }
}

async function main() {
  updateSelection()

  const availableFonts = await figma.listAvailableFontsAsync()

  const monoFontFamilies = unique(
    availableFonts
      .map((_) => _.fontName.family)
      .filter((_) => ['mono', 'code'].some((monoish) => _.toLowerCase().includes(monoish))),
  )
  figma.ui.postMessage({ type: 'AVAILABLE_FONTS', monoFontFamilies })

  figma.on('selectionchange', updateSelection)

  figma.ui.onmessage = async (msg) => {
    console.log({ msg })

    if (isRunMessage(msg)) {
      try {
        await run({
          ...pick(msg, [
            'fontFamily',
            'shikiTokens',
            'themeData',
            'fontSize',
            'overwriteExisting',
            'includeBackground',
            'includeLineNumbers',
          ]),
          fontStyles: getFontStyles(availableFonts, msg.fontFamily),
          selection: figma.currentPage.selection,
        })
        const runDoneMessage: RunDoneMessage = { type: 'RUN_DONE' }
        figma.ui.postMessage(runDoneMessage)
      } catch (e) {
        console.error(e)
      }
    }
  }

  figma.listAvailableFontsAsync()
}

main().catch(console.error)

function unique(_: string[]): string[] {
  return Array.from(new Set(_))
}

const getFontStyles = (availableFonts: Font[], selectedFontFamily: string): FontStyles => {
  const fontStyles = availableFonts
    .map((_) => _.fontName)
    .filter((_) => _.family === selectedFontFamily)
    .map((_) => _.style)
  const bold = ['Bold', 'Semibold'].find((boldish) => fontStyles.some((_) => _ === boldish))!
  const italic = ['Italic'].find((italicish) => fontStyles.some((_) => _ === italicish))!
  const normal = ['Regular', 'Medium'].find((normalish) => fontStyles.some((_) => _ === normalish))!
  return { bold, italic, normal }
}
