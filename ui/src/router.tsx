import { useRoutes, type RouteObject } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import { PrivatePage } from "./components/auth/private.page";
import DashboardPage from "./pages/DashboardPage";
import WorkoutPage from "./pages/WorkoutPage";
import SchedulePage from "./pages/SchedulePage";
import ProfilePage from "./pages/ProfilePage";

import WorkoutHistoryPage from "./pages/WorkoutHistoryPage";
import WorkoutHistoryPage2 from "./pages/WorkoutHistoryPage2";

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
    path: '/schedule',
    element: (
      <PrivatePage>
        <SchedulePage />
      </PrivatePage>
    ),
  },
  {
    path: '/profile',
    element: (
      <PrivatePage>
        <ProfilePage />
      </PrivatePage>
    ),
  },
  {
    path: '/history',
    element: (
      <PrivatePage>
        <WorkoutHistoryPage />
      </PrivatePage>
    ),
  },
  {
    path: '/history2',
    element: (
      <PrivatePage>
        <WorkoutHistoryPage2 />
      </PrivatePage>
    ),
  }
];

export function RenderRouter() {
  return useRoutes(routes);
}
