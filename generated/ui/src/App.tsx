import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import WorkoutPage from './pages/WorkoutPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
      </Routes>
    </Router>
  );
};

export default App;
