import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

const Iframe: FC = () => {
  const iframe = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    onmessage = (event) => {
      if (event.origin === 'https://www.figma.com') {
        iframe.current?.contentWindow?.postMessage(event.data, '*')
      } else {
        parent.postMessage(event.data, '*')
      }
      console.log('frame', { event })
    }
  })
  return <iframe src={`${process.env.APP_URL}?env=figma`} className="w-full h-full" ref={iframe} />
}

ReactDOM.render(<Iframe />, document.getElementById('iframe'))
