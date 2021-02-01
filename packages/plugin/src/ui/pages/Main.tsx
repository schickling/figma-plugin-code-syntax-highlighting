import React, { useState, useEffect } from 'react'
import { Prism } from '../components/Prism'
import { Sidebar } from '../components/Sidebar'
import { ThemeName } from '../themes'
import { editor } from 'monaco-editor'
import * as monaco from 'monaco-editor'

// NOTE this is needed to use the global monaco instance for both the extractor and the React wrapper
window.monaco = monaco

const Main: React.FC = () => {
  const [themeName, setThemeName] = useState<ThemeName>('Monokai')
  const [code, setCode] = useState('const myVal = "Hello world"')
  const [language, setLanguage] = useState('typescript')
  const [lineNumbers, setLineNumbers] = useState(true)
  const [fontFamily, setFontFamily] = useState('monospace')
  const [fontSize, setFontSize] = useState(13)
  const [monoFontFamilies, setMonoFontFamilies] = useState<string[]>([
    'monospace',
  ])
  const [editor, setEditor] = useState<
    editor.IStandaloneCodeEditor | undefined
  >(undefined)

  useEffect(() => {
    onmessage = (event) => {
      console.log({ event })
      if (!event.data.pluginMessage) {
        return
      }

      if (event.data.pluginMessage.type === 'SELECTION_CHANGE') {
        const textNode: string = event.data.pluginMessage.selection
        setCode(textNode)
      }

      if (event.data.pluginMessage.type === 'AVAILABLE_FONTS') {
        setMonoFontFamilies(event.data.pluginMessage.monoFontFamilies)
      }
    }
  })

  console.log({ editor })

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
          themeName,
          setThemeName,
          language,
          setLanguage,
          fontSize,
          setFontSize,
          fontFamily,
          setFontFamily,
          editor,
          monoFontFamilies,
          code,
        }}
      />
    </div>
  )
}

export default Main
