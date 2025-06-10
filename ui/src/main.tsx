import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RecoilRoot } from 'recoil';
import { QueryClientProvider } from 'react-query';

import { queryClient } from './facility/react-query.client';
import { SignIn } from './Signin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RecoilRoot>
        <SignIn />
      </RecoilRoot>
    </QueryClientProvider>
  </StrictMode>,
);
