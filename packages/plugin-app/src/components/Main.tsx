import React, { useState, useEffect } from 'react'
import { Prism } from './Prism'
import { Sidebar } from './Sidebar'
import {
  themeMap,
  ThemeName,
  isRunDoneMessage,
  isSelectionChangeMessage,
  RunMessage,
} from '@internal/plugin-shared'
import { editor } from 'monaco-editor'
import * as monaco from 'monaco-editor'
import { loadFont } from '../utils/font-loader'
import { prepareThemeName } from '../utils/monaco'

// NOTE this is needed to use the global monaco instance for both the extractor and the React wrapper
window.monaco = monaco

const Main: React.FC = () => {
  const [themeName, setThemeName] = useState<ThemeName>('Monokai')
  const [code, setCode] = useState(
    '// Select some text in Figma ...\n// or paste your code snippet here',
  )
  const [language, setLanguage] = useState('typescript')
  const [lineNumbers, setLineNumbers] = useState(true)
  const [overwriteText, setOverwriteText] = useState(false)
  const [overwriteTextEnabled, setOverwriteTextEnabled] = useState(false)
  const [includeBackground, setIncludeBackground] = useState(false)
  const [fontFamily, setFontFamily] = useState('Courier')
  const [fontSize, setFontSize] = useState(13)
  const [monoFontFamilies, setMonoFontFamilies] = useState<string[]>([
    'Courier',
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [editor, setEditor] = useState<
    editor.IStandaloneCodeEditor | undefined
  >(undefined)

  useEffect(() => {
    onmessage = (event) => {
      console.log({ event })
      if (!event.data.pluginMessage) {
        return
      }

      const msg = event.data.pluginMessage

      if (isSelectionChangeMessage(msg)) {
        if (msg.isText) {
          setCode(msg.selection!)
        }
        setOverwriteTextEnabled(msg.isText)
      } else if (isRunDoneMessage(msg)) {
        setIsLoading(false)
      } else if (event.data.pluginMessage.type === 'AVAILABLE_FONTS') {
        setMonoFontFamilies(event.data.pluginMessage.monoFontFamilies)
      }
    }
  })

  const asyncSetFontFamily = async (fontFamily: string) => {
    await loadFont(fontFamily)
    setFontFamily(fontFamily)
  }

  const execRun = async () => {
    setIsLoading(true)
    // TODO move up
    const { extract } = await import('../../../plugin-shared/src/monaco')
    const themeData = Object.entries(themeMap).find(
      ([_]) => prepareThemeName(_) === themeName,
    )![1]
    const result = await extract({
      code,
      language,
      theme: { name: themeName, data: themeData },
    })
    const runMessage: RunMessage = {
      type: 'RUN',
      result,
      fontFamily,
      fontSize,
      overwriteText,
      includeBackground,
    }
    parent.postMessage({ pluginMessage: runMessage }, '*')
  }

  return (
    <div className="flex w-full h-full">
      <Prism
        {...{
          code,
          setCode,
          themeName,
          language,
          lineNumbers,
          setEditor,
          fontSize,
          fontFamily,
        }}
      />
      <Sidebar
        {...{
          lineNumbers,
          setLineNumbers,
          includeBackground,
          setIncludeBackground,
          overwriteText,
          setOverwriteText,
          overwriteTextEnabled,
          themeName,
          setThemeName,
          language,
          setLanguage,
          fontSize,
          setFontSize,
          fontFamily,
          setFontFamily: asyncSetFontFamily,
          editor,
          monoFontFamilies,
          execRun,
          isLoading,
        }}
      />
    </div>
  )
}

export default Main
