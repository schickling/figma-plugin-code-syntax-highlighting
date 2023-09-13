import type { ThemeData } from '@internal/plugin-shared'
import type { FC } from 'react'
import React, { useMemo } from 'react'
import type * as shiki from 'shikiji'

// import wasm from 'shiki/dist/onigasm.wasm?url'
import { readTextFromClipboard, writeTextToClipboard } from '../utils/clipboard'

// shiki.setOnigasmWASM(wasm)
// shiki.setCDN('./assets/shiki/')

export const Editor: FC<{
  code: string
  setCode: (_: string) => unknown
  highlighter: shiki.Highlighter
  themeData: ThemeData
  language: string
  theme: shiki.BuiltinTheme
  includeLineNumbers: boolean
  fontSize: number
  lineHeight: number
  fontFamily: string
  env: 'Figma' | 'Browser'
}> = ({
  code,
  setCode,
  themeData,
  language,
  theme,
  highlighter,
  includeLineNumbers,
  fontSize,
  lineHeight,
  fontFamily,
  env,
}) => {
  const highlightedText = useMemo(
    () => highlighter.codeToHtml(code, { lang: language, theme }),
    [code, highlighter, language, theme],
  )
  const lineCount = useMemo(() => code.split('\n').length, [code])
  // 20 for bottom padding
  const height = useMemo(() => lineCount * lineHeight + 20, [lineCount, lineHeight])
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  return (
    <div
      className="relative flex w-full h-full p-4 space-x-4 overflow-scroll cursor-text"
      style={{ backgroundColor: themeData.bg, fontSize, lineHeight: `${lineHeight}px`, fontFamily }}
      onClick={() => textareaRef.current !== document.activeElement && textareaRef.current?.focus()}
    >
      {includeLineNumbers && (
        <div style={{ color: themeData.fg }} className="text-right opacity-30">
          {Array.from({ length: lineCount }, (_v, i) => i + 1).map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>
      )}
      <div className="relative w-max">
        <textarea
          ref={textareaRef}
          style={{ caretColor: themeData.fg, height }}
          value={code}
          className="absolute w-full h-full text-transparent bg-transparent outline-none resize-none"
          onKeyDown={(e) => {
            if (env === 'Browser') return

            // NOTE it seems common keyboard shortcuts are not working in Figma, so we have to implement them ourselves
            if (e.metaKey && e.code === 'KeyA') {
              e.preventDefault()
              e.stopPropagation()
              textareaRef.current?.select()
            } else if (e.metaKey && e.code === 'KeyV') {
              e.preventDefault()
              e.stopPropagation()
              readTextFromClipboard().then((text) => setCode(text))
            } else if (e.metaKey && e.code === 'KeyC') {
              e.preventDefault()
              e.stopPropagation()
              const selectedText = e.currentTarget.value.substring(
                e.currentTarget.selectionStart,
                e.currentTarget.selectionEnd,
              )
              writeTextToClipboard(selectedText)
            }
          }}
          onChange={(e) => setCode(e.target.value)}
          autoCorrect="off"
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
        />
        <div className="w-max" style={{ height }} dangerouslySetInnerHTML={{ __html: highlightedText }} />
      </div>
    </div>
  )
}
