import { useEffect, useMemo, useState } from 'react'

import { loadFont } from './font-loader'

export const knownMonoSystemFonts = ['Courier', 'Courier New']

export const knownMonoGoogleFonts = [
  'Roboto Mono',
  'Source Code Pro',
  'IBM Plex Mono',
  'Ubuntu Mono',
  'Space Mono',
  'PT Mono',
  'Fira Mono',
  'Fira Code',
  'JetBrains Mono',
]

export type Env = 'Figma' | 'Browser'

export type UseFontsReturn = { isLoading: true; fontResult: undefined } | { isLoading: false; fontResult: UseFontsData }

export type UseFontsData = {
  activeFont: string
  setActiveFont: (_: string) => void
  availableFonts: string[]
}

export const loadBrowserFonts = async (): Promise<string[]> => {
  await document.fonts.ready

  const availableSystemFonts = knownMonoSystemFonts.filter((_) => document.fonts.check(`12px ${_}`))

  const nonAvailableGoogleFonts = knownMonoGoogleFonts.filter((_) => !document.fonts.check(`12px ${_}`))
  await Promise.all(nonAvailableGoogleFonts.map(loadFont))

  return [...availableSystemFonts, ...knownMonoGoogleFonts].sort()
}

export const useFonts = ({
  resolveAvailableFonts,
}: {
  resolveAvailableFonts: () => Promise<string[]>
}): UseFontsReturn => {
  const storageKey = 'selected-font'
  const persistedVal = useMemo(() => localStorage.getItem(storageKey), [storageKey])

  const [isLoading, setIsLoading] = useState(true)
  const [activeFont, setActiveFont_] = useState<string | undefined>(persistedVal ?? undefined)

  const setActiveFont = (_: string) => {
    localStorage.setItem(storageKey, _)
    setActiveFont_(_)
  }

  const [availableFonts, setAvailableFonts] = useState<string[]>([])
  useEffect(() => {
    resolveAvailableFonts().then((availableFonts_) => {
      setAvailableFonts(availableFonts_)
      if (!activeFont || !availableFonts_.includes(activeFont)) {
        setActiveFont(availableFonts_[0])
      }

      setIsLoading(false)
    })
    /* eslint-disable-next-line */
  }, [])

  if (isLoading) {
    return { isLoading, fontResult: undefined }
  }

  return { isLoading, fontResult: { activeFont: activeFont!, setActiveFont, availableFonts } }
}
