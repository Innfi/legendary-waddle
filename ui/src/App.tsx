import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import WorkoutPage from './pages/WorkoutPage';
import DashboardPage from './pages/DashboardPage';
import RecordPage from './pages/RecordPage';
import AppTheme from './theme/AppTheme';
import { CssBaseline } from '@mui/material';

const App: React.FC = () => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme/>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/records" element={<RecordPage />} />
        </Routes>
      </Router>
    </AppTheme>
  );
};

export default App;
