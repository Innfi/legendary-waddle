import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { GoogleIcon } from '../components/CustomsIcons';
import { setToken } from '../state/locals';

function LandingPage() {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch('http://localhost:8000/api/login2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });
        if (!response.ok) {
          throw new Error('Login failed');
        }
        const data = await response.json();
        console.log('Login successful:', data);

        setToken(data.access_token);
        navigate('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
      }
    },
  });

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        // color: 'text.primary',
        backgroundImage:
          'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url("../../resource/landing.png")',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Your Ultimate Workout Companion
            </Typography>
            <Typography variant="h5" component="p" gutterBottom>
              Track your progress, stay motivated, and reach your fitness goals with our intuitive
              workout tracker.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/login"
              sx={{ mt: 4 }}
            >
              Get Started
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Sign in with Google
                </Typography>
                <Button variant="outlined" startIcon={<GoogleIcon />} onClick={() => login()}>
                  Sign in with Google
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;
