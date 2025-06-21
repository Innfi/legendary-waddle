import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SignIn } from './Signin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SignIn />
  </StrictMode>,
);
