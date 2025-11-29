import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

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
        <Button component={Link} to="/workout-history-submit">
          Submit Workouts
        </Button>
      </Stack>
    </Box>
  );
}
export default Footer;
