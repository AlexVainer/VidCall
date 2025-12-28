import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/index.scss'
import { Router } from '@/app/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
