import './index.css'
import 'react-figma-plugin-ds/figma-plugin-ds.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import Main from './components/Main'

createRoot(document.getElementById('root')!).render(<Main />)