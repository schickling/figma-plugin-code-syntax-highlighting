import React, { useState, useEffect } from 'react'
import { Prism } from '../components/Prism'
import { Sidebar } from '../components/Sidebar'
import { ThemeName } from '../themes'
import { editor } from 'monaco-editor'

const Main: React.FC = () => {
  const [themeName, setThemeName] = useState<ThemeName>('Monokai')
  const [code, setCode] = useState('const myVal = "Hello world"')
  const [language, setLanguage] = useState('javascript')
  const [lineNumbers, setLineNumbers] = useState(true)
  const [fontSize, setFontSize] = useState(13)
  const [monoFonts, setMonoFonts] = useState<Font[]>([
    { fontName: { family: 'monospace', style: 'Regular' } },
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
        setMonoFonts(event.data.pluginMessage.fonts)
      }
    }
  })

  return (
    <div className="flex w-full h-full">
      <Prism
        {...{ code, themeName, language, lineNumbers, setEditor, fontSize }}
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
          editor,
          monoFonts,
          code,
        }}
      />
    </div>
  )
}

export default Main
