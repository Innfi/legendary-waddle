import { useState } from 'react';
import { Container, Typography, List, ListItem, TextField, IconButton, Button, ListItemButton, Stack } from '@mui/material';
import { AddCircleOutline, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useGetRecord, usePostRecord } from './api';
import { type WorkoutName, workoutNames, type WorkoutRecord, type WorkoutRecordItem } from './entity';

interface WorkoutRecord2 {
  workoutName: WorkoutName | null;
  workoutSet: number;
  workoutReps: number;
}

function WorkoutPage() {
  const [record, setRecord] = useState<WorkoutRecord2>({
    workoutName: null,
    workoutSet: 1,
    workoutReps: 0
  });

  const { data: records } = useGetRecord(record.workoutName);
  const mutation = usePostRecord(record.workoutName);

  const handleChangeReps = (direction: 'up' | 'down') => {
    if (direction === 'down') {
      setRecord({ ...record, workoutReps: record.workoutReps <= 0 ? 0 : record.workoutReps -1 });
      return;
    }

    setRecord({ ...record, workoutReps: record.workoutReps+1 });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!record.workoutName) {
      // TODO: error handling
      return;
    }

    mutation.mutate(record as WorkoutRecord);

    setRecord({
      ...record,
      workoutSet: record.workoutSet+1,
    });
  };

  if (!record.workoutName) {
    return (
      <Container>
        <Typography variant="h4">Select a Workout</Typography>
        <List>
          {workoutNames.map((currentName: WorkoutName, index: number) => (
            <ListItemButton key={index} onClick={() => setRecord({
              ...record,
              workoutName: currentName,
            })}>
              <ListItem>{currentName}</ListItem>
            </ListItemButton>
          ))}
        </List>
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="column">
        <Button onClick={() => setRecord({ ...record, workoutName: null })}>Back to Workouts</Button>
        <Stack direction="row">
          <Typography variant="h4">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}</Typography>
          <Typography variant="h4">{record.workoutName}</Typography>
        </Stack>
        <Container>
          <Typography variant="h4">Add Sets</Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <TextField name="sets" label="Set" value={record.workoutSet} disabled />
            <Stack direction="row" alignItems="center">
                <TextField name="reps" label="Reps" value={record.workoutReps} />
                <Stack direction="column">
                    <IconButton onClick={() => handleChangeReps('up')} size="small">
                        <ArrowUpward />
                    </IconButton>
                    <IconButton onClick={() => handleChangeReps('down')} size="small">
                        <ArrowDownward />
                    </IconButton>
                </Stack>
            </Stack>
            <IconButton type="submit">
              <AddCircleOutline />
            </IconButton>
          </form>
        </Container>
        <Container>
          <Typography variant="h4">Records</Typography>
          <List>
            {records?.map((record: WorkoutRecordItem) => (
              <ListItem key={record.workoutName}>
                {`Set: ${record.workoutSet}, Reps: ${record.workoutReps}, Time: ${new Date(record.workoutDate).toLocaleTimeString('ko-KR')}`}
              </ListItem>
            ))}
          </List>
        </Container>
      </Stack>
    </Container>
  );
}

export default WorkoutPage;
