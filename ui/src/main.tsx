import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { QueryClientProvider } from '@tanstack/react-query';

import { AxiosProvider } from './facility/axios.provider';
import { queryClient } from './facility/react-query.client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AxiosProvider>
          <App />
        </AxiosProvider>
      </QueryClientProvider>
    </RecoilRoot>
  </StrictMode>,
);
