import './index.css'
import 'react-figma-plugin-ds/figma-plugin-ds.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import Main from './components/Main.jsx'

createRoot(document.getElementById('root')!).render(<Main />)
