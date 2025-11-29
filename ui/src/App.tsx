import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { CssBaseline } from '@mui/material';

import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './components/notification/NotificationProvider';
import { RenderRouter } from './router';
import AppTheme from './theme/AppTheme';

function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ErrorBoundary>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <NotificationProvider>
            <BrowserRouter>
              <RenderRouter />
            </BrowserRouter>
          </NotificationProvider>
        </AppTheme>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
