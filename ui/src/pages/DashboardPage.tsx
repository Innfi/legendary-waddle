import { Box, Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface WorkoutStat {
  workout_name: string;
  total_sets: number;
  total_reps: number;
}

interface DashboardData {
  workouts: WorkoutStat[];
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const result: DashboardData = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1, pb: 2 }}>
        <h1>Dashboard</h1>
        <Stack direction="column" sx={{ marginLeft: '20px' }}>
          {data && data.workouts.length > 0 ? (
            <ul>
              {data.workouts.map((workout, index) => (
                <li key={index}>
                  <strong>{workout.workout_name}</strong>: {workout.total_sets} sets, {workout.total_reps} reps
                </li>
              ))}
            </ul>
          ) : (
            <p>No workout data available for the last 7 days.</p>
          )}
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
