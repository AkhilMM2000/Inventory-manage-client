import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'

console.log('Client app started')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
      <Toaster position="top-right" />
  </StrictMode>,
)
