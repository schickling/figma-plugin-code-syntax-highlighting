// Based on https://forum.figma.com/t/write-to-clipboard-from-custom-plugin/11860/15

export const writeTextToClipboard = (str: string) => {
  const prevActive = document.activeElement as HTMLElement
  const textArea = document.createElement('textarea')

  textArea.value = str

  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'

  document.body.appendChild(textArea)

  textArea.focus()
  textArea.select()

  return new Promise((res, rej) => {
    document.execCommand('copy') ? res(void 0) : rej()
    textArea.remove()

    prevActive?.focus()
  })
}

export const readTextFromClipboard = () => {
  const textArea = document.createElement('textarea')

  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'

  document.body.appendChild(textArea)

  textArea.focus()
  textArea.select()

  return new Promise<string>((res, rej) => {
    document.execCommand('paste') ? res(textArea.value) : rej()
    textArea.remove()
  })
}
