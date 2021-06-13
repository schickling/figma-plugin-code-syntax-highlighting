import React, { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { isRunDoneMessage, isSelectionChangeMessage, RunMessage } from '@internal/plugin-shared'
import { editor } from 'monaco-editor'
import * as monaco from 'monaco-editor'
import { loadFont } from '../utils/font-loader'
import { Editor } from './Editor'
import { usePersistedState } from '../utils/hooks'
import { formatText } from '../utils/prettier'
import { Lang, Theme } from 'shiki'

const defaultCode = `\
// Select some text in Figma ...
// or paste your code snippet here
`

const Main: React.FC = () => {
  const [themeName, setThemeName] = usePersistedState<Theme>({ initialValue: 'github-dark', storageKey: 'theme' })
  const [code, setCode] = usePersistedState({ initialValue: defaultCode, storageKey: 'code' })
  const [language, setLanguage] = usePersistedState<Lang>({ initialValue: 'typescript', storageKey: 'lang' })
  const [lineNumbers, setLineNumbers] = usePersistedState({ initialValue: true, storageKey: 'line-numbers' })
  const [overwriteText, setOverwriteText] = useState(false)
  const [overwriteTextEnabled, setOverwriteTextEnabled] = useState(false)
  const [includeBackground, setIncludeBackground] = useState(false)
  const [fontFamily, setFontFamily] = useState('Courier')
  const [fontSize, setFontSize] = useState(13)
  const [monoFontFamilies, setMonoFontFamilies] = useState<string[]>(['Courier'])
  const [isLoading, setIsLoading] = useState(false)
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | undefined>(undefined)

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
    // const { extract } = await import('../../../plugin-shared/src/monaco')
    // const themeData = Object.entries(themeMap).find(([_]) => prepareThemeName(_) === themeName)![1]
    // const result = await extract({
    //   code,
    //   language,
    //   theme: { name: themeName, data: themeData },
    // })
    // const runMessage: RunMessage = {
    //   type: 'RUN',
    //   result,
    //   fontFamily,
    //   fontSize,
    //   overwriteText,
    //   includeBackground,
    // }
    // parent.postMessage({ pluginMessage: runMessage }, '*')
  }

  const runPrettier = () => setCode(formatText(code))

  return (
    <div className="flex w-full h-full">
      <Editor
        {...{ themeName, fontFamily, fontSize, lineNumbers, text: code, setText: setCode, lineHeight: fontSize * 1.5 }}
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
          runPrettier,
          execRun,
          isLoading,
        }}
      />
    </div>
  )
}

export default Main
