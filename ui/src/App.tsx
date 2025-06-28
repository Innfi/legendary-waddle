import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router';

import AppTheme from './theme/AppTheme';
import { router } from './routes';

function App() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </AppTheme>
  );
}

export default App;