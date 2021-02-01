import React, { FC, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

const Main: FC = () => {
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
  return (
    <iframe
      src="http://localhost:3000"
      className="w-full h-full"
      ref={iframe}
    />
  )
}

ReactDOM.render(<Main />, document.getElementById('iframe'))
