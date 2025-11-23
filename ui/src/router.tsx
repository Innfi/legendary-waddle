import { useRoutes, type RouteObject } from 'react-router-dom';

import { PrivatePage } from './components/auth/private.page';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import WorkoutPage from './pages/WorkoutPage';
import WorkoutHistorySubmitPage from './pages/WorkoutHistorySubmit';

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
  {
    path: '/workout-history-submit',
    element: (
      <PrivatePage>
        <WorkoutHistorySubmitPage />
      </PrivatePage>
    ),
  }
];

export function RenderRouter() {
  return useRoutes(routes);
}
