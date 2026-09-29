import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Handles the page routing
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.tsx'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const audience = import.meta.env.VITE_AUTH0_AUDIENCE
const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI ?? 'http://localhost:5174'

if (!domain || !clientId || !audience) {
  throw new Error('Set VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, and VITE_AUTH0_AUDIENCE to run the app.')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        // Use the configured deployed origin in production so Auth0 callback URLs stay valid.
        redirect_uri: redirectUri,
        audience,
      }}
    >
      <BrowserRouter> {/* Wraps the whole frontend */}
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>,
)
