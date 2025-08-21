import { Avatar, Box, Card, CardContent, CircularProgress, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Footer from './Footer';
import { useGetProfile } from './api';

// Helper to map icon string to component (expand as needed)
const iconMap: Record<string, React.ReactNode> = {
  FitnessCenter: <FitnessCenterIcon />,
};

const ProfilePage: React.FC = () => {
  const { data: profile, isLoading, error } = useGetProfile();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Failed to load profile.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1, pb: 2 }}>
        <Box sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Avatar
            sx={{ width: 100, height: 100, margin: 'auto' }}
            src={profile.avatarUrl}
          />
          <Typography variant="h5" sx={{ mt: 2 }}>
            {profile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Card sx={{ mx: 2, my: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Favorite Workouts
            </Typography>
            <List>
              {profile.favoriteWorkouts.map((workout) => (
                <ListItem key={workout.name}>
                  <ListItemAvatar>
                    <Avatar>
                      {iconMap[workout.icon] || <FitnessCenterIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={workout.name} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mx: 2, my: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Goal of the Year
            </Typography>
            <Typography variant="body1">
              {profile.goal}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </Box>
  );
};

export default ProfilePage;
