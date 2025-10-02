import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import Footer from './Footer';
import { useGetProfile } from './api';

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
      <Footer />
    </Box>
  );
};

export default ProfilePage;
