import { StrictMode } from 'react';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { queryClient } from './components/api/query.client.ts';
import './index.css';

const clientId = '970293656109-a5v1j2eu4k3o0ukm5g83et5knlibm31p.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
