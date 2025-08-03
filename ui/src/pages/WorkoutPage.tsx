import { useState } from 'react';
import { Container, Typography, List, ListItem, TextField, IconButton, Button, ListItemButton, Stack, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { AddCircleOutline, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';

import { type WorkoutName, workoutNames, type WorkoutRecord, type WorkoutRecordItem } from '../state/entity';
import { dateKeyAtom } from '../state/atom';
import { useGetRecord, usePostRecord } from './api';

interface CurrentWorkout {
  workoutName: WorkoutName | null;
  workoutSet: number;
  workoutReps: number;
  dateKey: string;
}

function WorkoutPage() {
  const [dateKey] = useAtom(dateKeyAtom);

  const [record, setRecord] = useState<CurrentWorkout>({
    workoutName: null,
    workoutSet: 1,
    workoutReps: 0,
    dateKey,
  });

  const { data: records } = useGetRecord(dateKey, record.workoutName);
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
        <Container>
        <Stack direction="row">
          <Button component={Link} to="/dashboard">Go to Dashboard</Button>
          <Button onClick={() => setRecord({ ...record, workoutName: null })}>Back to Workouts</Button>
        </Stack>
        <Stack direction="row" sx={{ marginBottom: '10px' }}>
          <Typography variant="h4" sx={{ marginLeft: '10px', marginRight: '10px'}}>{dateKey}</Typography>
          <Typography variant="h4">{record.workoutName}</Typography>
        </Stack>
        </Container>
        <Container>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <TextField name="sets" label="Set" value={record.workoutSet} disabled />
            <Stack direction="row" alignItems="center">
                <TextField name="reps" label="Reps" value={record.workoutReps} />
                <Stack direction="row">
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
          <Typography variant="h4" sx={{ marginBottom: '10px' }}>Records</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Set</TableCell>
                  <TableCell>Reps</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records?.sort((a, b) => b.workoutSet - a.workoutSet).map((record: WorkoutRecordItem) => (
                  <TableRow key={record.workoutSet}>
                    <TableCell>{record.workoutSet}</TableCell>
                    <TableCell>{record.workoutReps}</TableCell>
                    <TableCell>{new Date(record.workoutDate).toLocaleTimeString('ko-KR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Stack>
    </Container>
  );
}

export default WorkoutPage;
