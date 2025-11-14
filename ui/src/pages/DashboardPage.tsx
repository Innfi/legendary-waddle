import React from 'react';
import { Box, Stack } from '@mui/material';

import Footer from './Footer';

const DashboardPage: React.FC = () => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1, pb: 2 }}>
        <h1>Dashboard</h1>
        <Stack direction="column" sx={{ marginLeft: '20px' }} />
      </Box>
      <Footer />
    </Box>
  );
};

export default DashboardPage;
