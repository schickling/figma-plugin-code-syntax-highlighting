import { readTextFromClipboard, writeTextToClipboard } from './clipboard'

export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  env: 'Browser' | 'Figma',
  ref: React.RefObject<HTMLTextAreaElement | HTMLInputElement>,
) => {
  if (env === 'Browser' || ref.current === null) return

  // NOTE it seems common keyboard shortcuts are not working in Figma, so we have to implement them ourselves
  if (e.metaKey && e.code === 'KeyA') {
    e.preventDefault()
    e.stopPropagation()
    ref.current?.select()
  } else if (e.metaKey && e.code === 'KeyV') {
    e.preventDefault()
    e.stopPropagation()
    readTextFromClipboard().then((text) => (ref.current!.value = text))
  } else if (e.metaKey && e.code === 'KeyC') {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.selectionStart !== null && e.currentTarget.selectionEnd !== null) {
      const selectedText = e.currentTarget.value.substring(e.currentTarget.selectionStart, e.currentTarget.selectionEnd)
      writeTextToClipboard(selectedText)
    }
  }
}
