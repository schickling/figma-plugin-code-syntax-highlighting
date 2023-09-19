import type { ThemeData } from '@internal/plugin-shared'
import type { FC } from 'react'
import React, { useMemo } from 'react'
import type * as shiki from 'shikiji'

import { env } from '../utils/env.js'
import { handleKeyDown } from '../utils/keydown.js'

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
          onKeyDown={(e) => handleKeyDown(e, env, textareaRef)}
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
