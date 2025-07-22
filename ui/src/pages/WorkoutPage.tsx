import React, { useState } from 'react';
import { Container, Typography, List, ListItem, TextField, Button } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const WorkoutPage: React.FC = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { data: workouts } = useQuery({
    queryKey: ['workouts'],
    queryFn: () =>
      axios.get('/api/records', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.data),
    enabled: !!token, // Only run query if token exists
  });

  const mutation = useMutation({
    mutationFn: (newRecord: any) =>
      axios.post('/api/records', newRecord, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });

  const [newRecord, setNewRecord] = useState({ workout_id: '', sets: '', reps: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecord({ ...newRecord, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      console.error('No token found, cannot submit record.');
      return;
    }
    const parsedRecord = {
      ...newRecord,
      workout_id: newRecord.workout_id,
      sets: parseInt(newRecord.sets, 10),
      reps: parseInt(newRecord.reps, 10),
    };
    mutation.mutate(parsedRecord);
  };

  return (
    <Container>
      <Typography variant="h4">Workouts</Typography>
      <List>
        {workouts?.map((workout: any) => (
          <ListItem key={workout.id}>{workout.name}</ListItem>
        ))}
      </List>
      <Typography variant="h4">Add Record</Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="workout_id" label="Workout ID" onChange={handleInputChange} />
        <TextField name="sets" label="Sets" onChange={handleInputChange} />
        <TextField name="reps" label="Reps" onChange={handleInputChange} />
        <Button type="submit">Add</Button>
      </form>
    </Container>
  );
};

export default WorkoutPage;
