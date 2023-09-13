import type { RunMessage } from '@internal/plugin-shared'
import { isRunDoneMessage, isSelectionChangeMessage } from '@internal/plugin-shared'
import React, { useEffect, useMemo, useState } from 'react'
import { Icon } from 'react-figma-plugin-ds'
import type { BuiltinLanguage, BuiltinTheme } from 'shikiji'
import * as shiki from 'shikiji'

import { makeExposedPromise } from '../utils'
import type { Env } from '../utils/fonts'
import { loadBrowserFonts, useFonts } from '../utils/fonts'
import { useAsyncMemo, usePersistedState } from '../utils/hooks'
import { Editor } from './Editor'
import { Sidebar } from './Sidebar'

const defaultCode = `\
// Select some text in Figma ...
// or paste your code snippet here
`

const env: Env = new URLSearchParams(location.search).get('env') === 'figma' ? 'Figma' : 'Browser'
console.log(`Detected plugin env: ${env}`)

const Main: React.FC = () => {
  const availableFigmaFonts = useMemo(() => makeExposedPromise<string[]>(), [])
  const fontRes = useFonts({
    resolveAvailableFonts: () => (env === 'Figma' ? availableFigmaFonts.promise : loadBrowserFonts()),
  })

  const [themeName, setThemeName] = usePersistedState<BuiltinTheme>({
    initialValue: 'github-dark',
    storageKey: 'theme',
  })
  const [code, setCode] = usePersistedState({ initialValue: defaultCode, storageKey: 'code' })
  const [language, setLanguage] = usePersistedState<BuiltinLanguage>({ initialValue: 'typescript', storageKey: 'lang' })
  const [includeLineNumbers, setIncludeLineNumbers] = usePersistedState({
    initialValue: false,
    storageKey: 'line-numbers',
  })
  const [overwriteExisting, setOverwriteExisting] = usePersistedState({
    initialValue: false,
    storageKey: 'overwrite-text',
  })
  const [overwriteExistingEnabled, setOverwriteExistingEnabled] = useState(false)
  const [includeBackground, setIncludeBackground] = usePersistedState({
    initialValue: true,
    storageKey: 'include-background',
  })
  const [fontSize, setFontSize] = usePersistedState({ initialValue: 13, storageKey: 'font-size' })

  const highlighter = useAsyncMemo(
    () => shiki.getHighlighter({ themes: [themeName], langs: [language] }),
    [themeName, language],
  )
  const isHighlighterLoading = useMemo(() => highlighter === undefined, [highlighter])
  const shikiTokens = useMemo(() => highlighter?.codeToThemedTokens(code, {}), [highlighter, code])
  const [isFigmaLoading, setIsFigmaLoading] = useState(false)

  const themeData = useMemo(() => {
    const theme = highlighter?.getTheme(themeName)
    return theme ? { bg: theme.bg, fg: theme.fg } : undefined
  }, [highlighter, themeName])

  useEffect(() => {
    onmessage = (event) => {
      console.log({ event })
      if (!event.data.pluginMessage) {
        return
      }

      const msg = event.data.pluginMessage

      if (isSelectionChangeMessage(msg)) {
        if (msg.isText) {
          setCode(msg.selection!.text)
          setFontSize(msg.selection!.fontSize)
        }
        setOverwriteExistingEnabled(msg.isText)
      } else if (isRunDoneMessage(msg)) {
        setIsFigmaLoading(false)
      } else if (event.data.pluginMessage.type === 'AVAILABLE_FONTS') {
        availableFigmaFonts.resolve(event.data.pluginMessage.monoFontFamilies)
      }
    }

    parent.postMessage({ pluginMessage: { type: 'INIT' } }, '*')
  }, [setCode, setFontSize, availableFigmaFonts])

  const execRun = async () => {
    setIsFigmaLoading(true)

    const runMessage: RunMessage = {
      type: 'RUN',
      shikiTokens: shikiTokens!,
      themeData: themeData!,
      fontFamily: fontRes.fontResult!.activeFont,
      fontSize,
      overwriteExisting: overwriteExisting && overwriteExistingEnabled,
      includeBackground,
      includeLineNumbers: includeBackground && includeLineNumbers,
    }
    parent.postMessage({ pluginMessage: runMessage }, '*')
  }

  const runPrettier = async () => {
    // NOTE we're lazy-loading prettier in order to speed up the initial load time
    const { formatText } = await import('../utils/prettier')
    const formattedCode = await formatText(code, language)
    setCode(formattedCode)
  }

  if (fontRes.isLoading || isHighlighterLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex items-center space-x-1 text-sm text-gray-700">
          <div className="transform scale-75">
            <Icon className="animate-spin fix-icon" name="spinner" />
          </div>
          <div>Loading ...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full h-full">
      <Editor
        {...{
          themeName,
          fontFamily: fontRes.fontResult.activeFont,
          fontSize,
          themeData: themeData!,
          theme: themeName,
          highlighter: highlighter!,
          includeLineNumbers: includeLineNumbers,
          language,
          code: code,
          setCode: setCode,
          lineHeight: fontSize * 1.5,
          env,
        }}
      />
      <Sidebar
        {...{
          lineNumbers: includeLineNumbers,
          setLineNumbers: setIncludeLineNumbers,
          includeBackground,
          setIncludeBackground,
          overwriteExisting,
          setOverwriteExisting,
          overwriteExistingEnabled,
          themeName,
          setThemeName,
          language,
          setLanguage,
          fontSize,
          setFontSize,
          fontFamily: fontRes.fontResult.activeFont,
          setFontFamily: fontRes.fontResult.setActiveFont,
          monoFontFamilies: fontRes.fontResult.availableFonts,
          runPrettier,
          execRun,
          isFigmaLoading,
        }}
      />
    </div>
  )
}

export default Main
