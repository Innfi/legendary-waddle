import { Avatar, Box, Card, CardContent, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Footer from './Footer';

const favoriteWorkouts = [
  { name: 'Pullups', icon: <FitnessCenterIcon /> },
  { name: 'Kettlebell Swings', icon: <FitnessCenterIcon /> },
  { name: 'Squats', icon: <FitnessCenterIcon /> },
];

const ProfilePage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1, pb: 2 }}>
        <Box sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Avatar sx={{ width: 100, height: 100, margin: 'auto' }} />
          <Typography variant="h5" sx={{ mt: 2 }}>
            John Doe
          </Typography>
          <Typography variant="body2" color="text.secondary">
            john.doe@example.com
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Card sx={{ mx: 2, my: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Favorite Workouts
            </Typography>
            <List>
              {favoriteWorkouts.map((workout) => (
                <ListItem key={workout.name}>
                  <ListItemAvatar>
                    <Avatar>
                      {workout.icon}
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
              My goal for this year is to consistently workout 3 times a week and be able to do 20 consecutive pull-ups!
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </Box>
  );
};

export default ProfilePage;
