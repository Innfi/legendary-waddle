import { createBrowserRouter } from 'react-router';

import { SignIn } from './Signin';
import BoxForClick from './BoxForClick';
import RecordPage from './Record';
import DashboardPage from './Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BoxForClick />
  },
  {
    path: '/users',
    element: <SignIn />
  },
  {
    path: '/records',
    element: <RecordPage />
  },
  {
    path: '/dashboard',
    element: <DashboardPage />
  },
]);
