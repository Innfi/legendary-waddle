import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import { NotificationProvider } from './components/NotificationContext';
import AppTheme from './theme/AppTheme';
import { RenderRouter } from './router';

function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
    <AppTheme>
      <CssBaseline enableColorScheme/>
      <NotificationProvider>
        <BrowserRouter>
          <RenderRouter />
        </BrowserRouter>
      </NotificationProvider>
    </AppTheme>
    </Suspense>
  );
};

export default App;
