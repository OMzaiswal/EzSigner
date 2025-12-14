import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SignatureProvider } from './context/SignatureContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SignatureProvider>
      <App />
    </SignatureProvider>
  </StrictMode>,
)
