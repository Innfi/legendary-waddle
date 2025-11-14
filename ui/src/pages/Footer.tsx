import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

function Footer() {
  return (
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
        </Stack>
      </Box>
  );
}
export default Footer;