import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { AxiosProvider } from './facility/axios.provider';
import { queryClient } from './facility/react-query.client';
import App from './App';

const testClientId = import.meta.env.VITE_OAUTH_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={testClientId}>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AxiosProvider>
          <App />
        </AxiosProvider>
      </QueryClientProvider>
    </RecoilRoot>
    </GoogleOAuthProvider>
  </StrictMode>,
);
