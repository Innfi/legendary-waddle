import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, TextField, IconButton, Button, ListItemButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const WorkoutPage: React.FC = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  const { data: workouts } = useQuery({
    queryKey: ['workouts'],
    queryFn: () =>
      axios.get('/api/workouts', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.data),
    enabled: !!token,
  });

  const { data: records } = useQuery({
    queryKey: ['records', selectedWorkoutId],
    queryFn: () =>
      axios.get(`/api/records?workout_id=${selectedWorkoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.data),
    enabled: !!token && !!selectedWorkoutId,
  });

  const mutation = useMutation({
    mutationFn: (newRecord: any) =>
      axios.post('/api/records', newRecord, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records', selectedWorkoutId] });
    },
  });

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !selectedWorkoutId) {
      console.error('No token or workout selected, cannot submit record.');
      return;
    }
    const parsedRecord = {
      workout_id: selectedWorkoutId,
      reps: parseInt(newRecord.reps, 10),
    };
    mutation.mutate(parsedRecord);
    setNewRecord({ reps: '' });
  };

  if (!selectedWorkoutId) {
    return (
      <Container>
        <Typography variant="h4">Select a Workout</Typography>
        <List>
          {workouts?.map((workout: any) => (
            <ListItemButton key={workout.id} onClick={() => setSelectedWorkoutId(workout.id)}>
              <ListItem sx={{ }}>{workout.name}</ListItem>
            </ListItemButton>
          ))}
        </List>
      </Container>
    );
  }

  return (
    <Container>
      <Button onClick={() => setSelectedWorkoutId(null)}>Back to Workouts</Button>
      <Typography variant="h4">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}</Typography>
      <Typography variant="h4">Workout: {workouts?.find((w:any) => w.id === selectedWorkoutId)?.name}</Typography>
      
      <Typography variant="h4">Add Record</Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <TextField name="sets" label="Set" value={nextSet} disabled />
        <TextField name="reps" label="Reps" value={newRecord.reps} onChange={handleInputChange} />
        <IconButton type="submit">
          <AddCircleOutline />
        </IconButton>
      </form>

      <Typography variant="h4">Previous Records</Typography>
      <List>
        {records?.map((record: any) => (
          <ListItem key={record.id}>
            {`Set: ${record.sets}, Reps: ${record.reps}, Time: ${new Date(record.timestamp).toLocaleTimeString()}`}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default WorkoutPage;