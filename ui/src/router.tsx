import { useRoutes, type RouteObject } from 'react-router-dom';

import { PrivatePage } from './components/auth/private.page';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutPage from './pages/WorkoutPage';

const routes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
  {
    path: '/dashboard',
    element: (
      <PrivatePage>
        <DashboardPage />
      </PrivatePage>
    ),
  },
  {
    path: '/workouts',
    element: (
      <PrivatePage>
        <WorkoutPage />
      </PrivatePage>
    ),
  },
];

export function RenderRouter() {
  return useRoutes(routes);
}
