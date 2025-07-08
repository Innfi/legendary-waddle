import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import type { WorkoutUnit } from './entity';
import { Card, RecordContainer } from './styled-component';
import { usePostRecord } from './api';

export default function RecordPage() {
  const [unit, setUnit] = useState<WorkoutUnit>({
    workoutName: 'temp',
    workoutSets: 1,
    workoutReps: 0
  });

  const [isChecked, setIsChecked] = useState(false);
  const { mutate, isSuccess } = usePostRecord<WorkoutUnit>();

  const increaseReps = () => {
    setUnit({
      ...unit,
      workoutReps: unit.workoutReps+1,
    });
  };
  const decreaseReps = () => {
    setUnit({
      ...unit,
      workoutReps: unit.workoutReps-1 < 0 ? 0 : unit.workoutReps-1,
    });
  };
  const onCompleteSet = () => {
    setIsChecked(!isChecked);
    mutate(unit);
  };

  useEffect(() => {
    if (!isSuccess) return;

    // TODO: reload?
  }, [isSuccess]);

  return (
    <RecordContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Stack direction="column">
          <Grid container spacing={2}>
          <Stack direction="row" sx={{flexGrow: 1}}>
            <Grid size={6}>
              <ButtonGroup orientation="horizontal" variant="contained">
                <Button onClick={() => increaseReps()} color="primary" aria-label="move up" sx={{ marginRight: '5px' }}>
                  <ArrowUpwardIcon />
                </Button>
                <Button onClick={() => decreaseReps()} color="secondary" aria-label="move down" sx={{ marginRight: '5px' }}>
                  <ArrowDownwardIcon />
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid size={6}>
              <Stack direction="row">
                <Typography component="h1" sx={{ marginLeft: "10px" }}>sets: {unit.workoutSets}</Typography>
                <Typography component="h1" sx={{ marginLeft: "10px" }}>reps: {unit.workoutReps}</Typography>
              </Stack>
            </Grid>
            <Grid size={6}>
              <FormGroup onClick={() => onCompleteSet()} sx={{ alignItems: "center" }}>
                <FormControlLabel control={<Checkbox />}  label="complete" />
              </FormGroup>
            </Grid>
          </Stack>
          </Grid>
          <Grid container spacing={2}>
            records
          </Grid>
        </Stack>
      </Card>
    </RecordContainer>
  );
}
