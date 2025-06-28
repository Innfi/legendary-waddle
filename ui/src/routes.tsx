import { createBrowserRouter } from 'react-router';

import BoxForClick from './BoxForClick';
import { SignIn } from './Signin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BoxForClick />
  },
  {
    path: '/users',
    element: <SignIn />
  }
]);
