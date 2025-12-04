import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './components/notification/NotificationProvider';
import { RenderRouter } from './router';
import AppTheme from './theme/AppTheme';
import { useDarkMode } from './theme/useDarkMode';
import { GlobalStyles, StyledEngineProvider } from '@mui/material';

function AppContent() {
  // Sync MUI dark mode with Tailwind
  useDarkMode();

  return (
    <NotificationProvider>
      <BrowserRouter>
        <RenderRouter />
      </BrowserRouter>
    </NotificationProvider>
  );
}

function App() {
  return (
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <Suspense fallback={<div>loading...</div>}>
        <ErrorBoundary>
          <AppTheme>
            <AppContent />
          </AppTheme>
        </ErrorBoundary>
      </Suspense>
    </StyledEngineProvider>
  );
}

export default App;
