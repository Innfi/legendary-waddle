import { Box, Button, Stack } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import WorkoutHistoryPage from './WorkoutHistoryPage';

const DashboardPage: React.FC = () => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1, pb: 2 }}>
        <h1>Dashboard</h1>
        <Stack direction="column" sx={{ marginLeft: '20px' }}>
          <WorkoutHistoryPage />
        </Stack>
      </Box>
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          width: '100%',
          py: 2,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" justifyContent="space-around">
          <Button component={Link} to="/dashboard">
            Home
          </Button>
          <Button component={Link} to="/workouts">
            Workout
          </Button>
          <Button component={Link} to="/schedule">
            Schedule
          </Button>
          <Button component={Link} to="/profile">
            Profile
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default DashboardPage;
