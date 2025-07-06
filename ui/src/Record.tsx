import { useState } from 'react';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface WorkoutUnit {
  workoutName: string;
  workoutSets: number;
  workoutReps: number;
}

// copied from signin component, which was copied from the tutorial :(
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const RecordContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function RecordPage() {
  const [reps, setReps] = useState<number>(0);
  const [unit, setUnit] = useState<WorkoutUnit>({
    workoutName: 'temp',
    workoutSets: 1,
    workoutReps: 0
  });

  return (
    <RecordContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Grid container spacing={2}>
        <Stack direction="row">
          <Grid size={8}>
            <ButtonGroup orientation="horizontal" variant="contained">
              <Button onClick={() => setReps(reps+1)} color="primary" aria-label="move up" sx={{ marginRight: '5px' }}>
                <ArrowUpwardIcon />
              </Button>
              <Button onClick={() => setReps(reps-1)} color="secondary" aria-label="move down" sx={{ marginRight: '5px' }}>
                <ArrowDownwardIcon />
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid size={4}>
            <Typography component="h1">reps: {reps}</Typography>
          </Grid>
          <Grid size={4}>
            <FormGroup>
              <FormControlLabel control={<Checkbox />}  label="complete" />
            </FormGroup>
          </Grid>
        </Stack>
        </Grid>
      </Card>
    </RecordContainer>
  );
}
