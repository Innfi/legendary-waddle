import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Container, Typography, List, ListItem, TextField, IconButton, Button, ListItemButton, Stack, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { AddCircleOutline, ArrowUpward, ArrowDownward } from '@mui/icons-material';

import { workoutNames, type WorkoutRecord, type WorkoutRecordItem } from '../state/entity';
import { dateKeyAtom } from '../state/atom';
import { useGetRecord, usePostRecord } from './api';

function WorkoutPage() {
  const [dateKey] = useAtom(dateKeyAtom);
  const [customWorkoutName, setCustomWorkoutName] = useState('');

  const [record, setRecord] = useState<WorkoutRecord>({
    workoutId: 0,
    workoutName: null,
    workoutSet: 1,
    workoutReps: 0,
    weight: 0,
  });

  const { data: records } = useGetRecord(dateKey, record.workoutName);
  const mutation = usePostRecord(record.workoutName);

  useEffect(() => {
    if (records && records.length > 0) {
      const maxSet = Math.max(...records.map(r => r.workoutSet));
      setRecord({
        ...record,
        workoutSet: maxSet + 1,
      });
    }
  }, [records]);

  const handleChangeReps = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setRecord({ ...record, workoutReps: record.workoutReps+1 });
      return;
    }

    setRecord({ ...record, workoutReps: record.workoutReps <= 0 ? 0 : record.workoutReps -1 });
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
        <Stack direction="row" spacing={1} sx={{ marginTop: 2, marginBottom: 2 }}>
          <TextField
            label="Custom Workout Name"
            value={customWorkoutName}
            onChange={(e) => setCustomWorkoutName(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (customWorkoutName) {
                setRecord({ ...record, workoutName: customWorkoutName });
              }
            }}
          >
            Start
          </Button>
        </Stack>
        <List>
          {workoutNames.map((currentName: string, index: number) => (
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
          <Button onClick={() => setRecord({ ...record, workoutName: null, weight: 0, workoutReps: 0, workoutSet: 1 })}>Back to Workouts</Button>
        </Stack>
        <Stack direction="row" sx={{ marginBottom: '10px' }}>
          <Typography variant="h4" sx={{ marginLeft: '10px', marginRight: '10px'}}>{dateKey}</Typography>
          <Typography variant="h4">{record.workoutName}</Typography>
        </Stack>
        </Container>
        <Container sx={{ marginBottom: '10px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Stack direction="row" alignItems="center">
              <TextField name="sets" label="Set" value={record.workoutSet} disabled sx={{ marginRight: '10px' }} />
              <TextField name="reps" label="Reps" value={record.workoutReps}  sx={{ marginRight: '10px' }}/>
              <IconButton onClick={() => handleChangeReps('up')} size="small" sx={{ marginRight: '5px' }}>
                  <ArrowUpward />
              </IconButton>
              <IconButton onClick={() => handleChangeReps('down')} size="small" sx={{ marginRight: '10px' }}>
                  <ArrowDownward />
              </IconButton>
              <TextField name="weight" label="Weight" value={record.weight} sx={{ marginRight: '10px' }} 
                onChange={(e) => setRecord({ ...record, weight: Number(e.target.value) })} />
            <IconButton type="submit">
              <AddCircleOutline />
            </IconButton>
            </Stack>
          </form>
        </Container>
        <Container>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Set</TableCell>
                  <TableCell>Reps</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records?.map((record: WorkoutRecordItem, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{records.length-index}</TableCell>
                    <TableCell>{record.workoutReps}</TableCell>
                    <TableCell>{record.weight}</TableCell>
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
