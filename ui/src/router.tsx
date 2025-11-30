import { useRoutes, type RouteObject } from 'react-router-dom';

import { PrivatePage } from './components/auth/private.page';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
// import WorkoutHistorySubmitPage from './pages/WorkoutHistorySubmit';
import WorkoutPage from './pages/WorkoutPage';
import WorkoutHistorySubmitPageV2 from './pages/WorkoutHistorySubmitV2';

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
        <WorkoutHistorySubmitPageV2 />
      </PrivatePage>
    ),
  },
];

export function RenderRouter() {
  return useRoutes(routes);
}
