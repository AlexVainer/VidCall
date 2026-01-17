import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app'
import '@/shared/i18n/config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
