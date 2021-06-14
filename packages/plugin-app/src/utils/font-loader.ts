const loadedFonts: string[] = []

export const loadFont = async (fontFamily: string): Promise<void> => {
  if (!loadedFonts.includes(fontFamily)) {
    loadedFonts.push(fontFamily)
    const styleEl = document.createElement('style')
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      fontFamily,
    )}:ital,wght@0,400;0,700;1,400&display=swap`
    const content = await fetch(url).then((_) => _.text())
    styleEl.innerHTML = content
    document.head.appendChild(styleEl)

    await document.fonts.load(`13px "${fontFamily}"`)
  }
}
