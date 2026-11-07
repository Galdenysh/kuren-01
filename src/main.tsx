import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './ui/app/globals.css'
import App from './ui/app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
