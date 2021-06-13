import React, { FC, useEffect, useMemo, useState } from 'react'
import { useAsyncMemo } from '../utils/hooks'
import * as shiki from 'shiki'

// @ts-ignore
import wasm from 'shiki/dist/onigasm.wasm?url'

shiki.setOnigasmWASM(wasm)
shiki.setCDN('./assets/shiki/')

export const Editor: FC<{
  text: string
  setText: (_: string) => unknown
  lineNumbers: boolean
  themeName: string
  fontSize: number
  lineHeight: number
  fontFamily: string
}> = ({ text, setText, lineNumbers, themeName, fontSize, lineHeight, fontFamily }) => {
  const highlighter = useAsyncMemo(() => shiki.getHighlighter({ theme: themeName }), [themeName])
  const isLoading = useMemo(() => highlighter === undefined, [highlighter])

  const [highlightedText, setHighlightedText] = useState<string | undefined>(undefined)
  const colors = useMemo(
    () => ({ bg: highlighter?.getBackgroundColor(), fg: highlighter?.getForegroundColor() }),
    [highlighter],
  )

  useEffect(() => {
    setHighlightedText(highlighter?.codeToHtml(text, 'typescript'))
  }, [text, highlighter])

  const lineCount = useMemo(() => text.split('\n').length, [text])
  const height = useMemo(() => lineCount * lineHeight, [lineCount, lineHeight])

  return (
    <div
      className="relative flex w-full h-full p-4 space-x-4 overflow-x-hidden overflow-y-scroll"
      style={{ backgroundColor: colors.bg, fontSize, lineHeight: `${lineHeight}px`, fontFamily }}
    >
      {lineNumbers && (
        <div style={{ color: colors.fg }} className="text-right opacity-30">
          {Array.from({ length: lineCount }, (v, i) => i + 1).map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>
      )}
      <div>
        <textarea
          style={{ caretColor: colors.fg, height }}
          value={text}
          className={`absolute w-full h-full ${isLoading ? '' : 'text-transparent bg-transparent'}  outline-none`}
          onChange={(e) => setText(e.target.value)}
          autoCorrect="off"
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
        />
        <div style={{ height }} dangerouslySetInnerHTML={{ __html: highlightedText ?? '' }} />
      </div>
    </div>
  )
}
