import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import AppTheme from './theme/AppTheme';
import { RenderRouter } from './router';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './components/notification/NotificationProvider';

function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
    <ErrorBoundary>
      <AppTheme>
        <CssBaseline enableColorScheme/>
        <NotificationProvider>
          <BrowserRouter>
            <RenderRouter />
          </BrowserRouter>
        </NotificationProvider>
      </AppTheme>
    </ErrorBoundary>
    </Suspense>
  );
};

export default App;
