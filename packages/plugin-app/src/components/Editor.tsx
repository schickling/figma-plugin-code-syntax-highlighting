import type { ThemeData } from '@internal/plugin-shared'
import type { FC } from 'react'
import React, { useMemo } from 'react'
import * as shiki from 'shiki'
import wasm from 'shiki/dist/onigasm.wasm?url'

shiki.setOnigasmWASM(wasm)
shiki.setCDN('./assets/shiki/')

export const Editor: FC<{
  code: string
  setCode: (_: string) => unknown
  shikiTokens: shiki.IThemedToken[][]
  themeData: ThemeData
  includeLineNumbers: boolean
  fontSize: number
  lineHeight: number
  fontFamily: string
}> = ({ code, setCode, shikiTokens, themeData, includeLineNumbers, fontSize, lineHeight, fontFamily }) => {
  const highlightedText = useMemo(() => shiki.renderToHtml(shikiTokens, { ...themeData }), [shikiTokens, themeData])
  const lineCount = useMemo(() => code.split('\n').length, [code])
  // 20 for bottom padding
  const height = useMemo(() => lineCount * lineHeight + 20, [lineCount, lineHeight])

  return (
    <div
      className="relative flex w-full h-full p-4 space-x-4 overflow-scroll"
      style={{ backgroundColor: themeData.bg, fontSize, lineHeight: `${lineHeight}px`, fontFamily }}
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
          style={{ caretColor: themeData.fg, height }}
          value={code}
          className="absolute w-full h-full text-transparent bg-transparent outline-none resize-none"
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
