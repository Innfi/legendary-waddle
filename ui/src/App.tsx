import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './components/notification/NotificationProvider';
import { RenderRouter } from './router';
import AppTheme from './theme/AppTheme';
import { useDarkMode } from './theme/useDarkMode';

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
    <Suspense fallback={<div>loading...</div>}>
      <ErrorBoundary>
        <AppTheme>
          <AppContent />
        </AppTheme>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
