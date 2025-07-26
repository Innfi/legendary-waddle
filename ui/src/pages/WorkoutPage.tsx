import { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, TextField, IconButton, Button, ListItemButton, Stack } from '@mui/material';
import { AddCircleOutline, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { postRecord } from './api';
import { type WorkoutName, type WorkoutRecord, workoutNames } from './entity';

function WorkoutPage() {
  // const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<WorkoutName| null>(null);

  const { data: records } = useQuery({
    queryKey: ['records', selectedWorkoutId],
    queryFn: () =>
      axios.get(`/api/records?workout_id=${selectedWorkoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.data),
    enabled: !!token && !!selectedWorkoutId,
  });

  const mutation = postRecord(selectedWorkoutId);
  // const mutation = useMutation({
  //   mutationFn: (newRecord: any) =>
  //     axios.post('/api/records', newRecord, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['records', selectedWorkoutId] });
  //   },
  // });

  const [newRecord, setNewRecord] = useState({ reps: '' });
  const [nextSet, setNextSet] = useState(1);

  useEffect(() => {
    if (selectedWorkoutId && records) {
      const lastRecord = records
        .filter((r: any) => r.workout_id === selectedWorkoutId)
        .sort((a: any, b: any) => b.sets - a.sets)[0];
      setNextSet(lastRecord ? lastRecord.sets + 1 : 1);
    }
  }, [selectedWorkoutId, records]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecord({ ...newRecord, [event.target.name]: event.target.value });
  };

  const handleIncrement = () => {
    const currentReps = parseInt(newRecord.reps, 10) || 0;
    setNewRecord({ ...newRecord, reps: (currentReps + 1).toString() });
  };

  const handleDecrement = () => {
    const currentReps = parseInt(newRecord.reps, 10) || 0;
    if (currentReps > 0) {
        setNewRecord({ ...newRecord, reps: (currentReps - 1).toString() });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        handleIncrement();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        handleDecrement();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !selectedWorkoutId) {
      console.error('No token or workout selected, cannot submit record.');
      return;
    }
    const parsedRecord: Omit<WorkoutRecord, 'workoutSet'>= {
      workoutName: selectedWorkoutId,
      workoutReps: parseInt(newRecord.reps, 10),
      workoutDate: new Date()
    };
    mutation.mutate(parsedRecord);
    setNewRecord({ reps: '' });
  };

  if (!selectedWorkoutId) {
    return (
      <Container>
        <Typography variant="h4">Select a Workout</Typography>
        <List>
          {workoutNames.map((workout: WorkoutName, index: number) => (
            <ListItemButton key={index} onClick={() => setSelectedWorkoutId(workout)}>
              <ListItem sx={{ }}>{workout}</ListItem>
            </ListItemButton>
          ))}
        </List>
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="column">
        <Button onClick={() => setSelectedWorkoutId(null)}>Back to Workouts</Button>
        <Stack direction="row">
          <Typography variant="h4">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}</Typography>
          <Typography variant="h4">{selectedWorkoutId}</Typography>
        </Stack>
        <Container>
          <Typography variant="h4">Add Sets</Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <TextField name="sets" label="Set" value={nextSet} disabled />
            <Stack direction="row" alignItems="center">
                <TextField name="reps" label="Reps" value={newRecord.reps} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                <Stack direction="column">
                    <IconButton onClick={handleIncrement} size="small">
                        <ArrowUpward />
                    </IconButton>
                    <IconButton onClick={handleDecrement} size="small">
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
            {records?.map((record: any) => (
              <ListItem key={record.id}>
                {`Set: ${record.sets}, Reps: ${record.reps}, Time: ${new Date(record.timestamp).toLocaleTimeString('ko-KR')}`}
              </ListItem>
            ))}
          </List>
        </Container>
      </Stack>
    </Container>
  );
};

export default WorkoutPage;