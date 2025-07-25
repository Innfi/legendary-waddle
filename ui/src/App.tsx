import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import WorkoutPage from './pages/WorkoutPage';
import DashboardPage from './pages/DashboardPage';
import RecordPage from './pages/RecordPage';
import AppTheme from './theme/AppTheme';
import { CssBaseline } from '@mui/material';
import { NotificationProvider } from './context/NotificationContext';

const App: React.FC = () => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme/>
      <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/records" element={<RecordPage />} />
        </Routes>
      </Router>
      </NotificationProvider>
    </AppTheme>
  );
};

export default App;
