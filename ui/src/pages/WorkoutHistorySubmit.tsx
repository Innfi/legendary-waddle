import React, { useState } from 'react';
import { useAtom } from 'jotai';

import dayjs, { type Dayjs } from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography,
  Divider
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { workoutSetCountersAtom } from '../state/atom';
import type { BulkWorkoutRecord } from '../state/entity';

import { useBulkCreateWorkouts } from './api';
import Footer from './Footer';

interface WorkoutUnit {
  id: string;
  name: string;
  records: (BulkWorkoutRecord & { id: string })[];
}

const WorkoutHistorySubmitPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [setCounters, setSetCounters] = useAtom(workoutSetCountersAtom);
  const [workouts, setWorkouts] = useState<WorkoutUnit[]>(() => {
    const initialId = crypto.randomUUID();
    setSetCounters({ [initialId]: 1 });
    return [
      {
        id: initialId,
        name: '',
        records: [{ id: crypto.randomUUID(), weight: 0, sets: 1, reps: 0 }]
      }
    ];
  });

  const bulkCreateMutation = useBulkCreateWorkouts();

  const addWorkout = () => {
    const newId = crypto.randomUUID();
    setSetCounters({ ...setCounters, [newId]: 1 });
    setWorkouts([
      ...workouts,
      {
        id: newId,
        name: '',
        records: [{ id: crypto.randomUUID(), weight: 0, sets: 1, reps: 0 }]
      }
    ]);
  };

  const deleteWorkout = (id: string) => {
    if (workouts.length === 1) return;
    setWorkouts(workouts.filter(w => w.id !== id));
    const newCounters = { ...setCounters };
    delete newCounters[id];
    setSetCounters(newCounters);
  };

  const addRecord = (workoutId: string) => {
    const currentSetNumber = (setCounters[workoutId] || 0) + 1;
    setSetCounters({ ...setCounters, [workoutId]: currentSetNumber });
    
    setWorkouts(workouts.map(w =>
      w.id === workoutId
        ? {
          ...w,
          records: [...w.records, { id: crypto.randomUUID(), weight: 0, sets: currentSetNumber, reps: 0 }]
        }
        : w
    ));
  };

  const deleteRecord = (workoutId: string, recordId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout && workout.records.length > 1) {
      const currentSetNumber = setCounters[workoutId] || 1;
      setSetCounters({ ...setCounters, [workoutId]: Math.max(1, currentSetNumber - 1) });
    }
    
    setWorkouts(workouts.map(w =>
      w.id === workoutId && w.records.length > 1
        ? { ...w, records: w.records.filter(r => r.id !== recordId) }
        : w
    ));
  };

  const updateWorkoutName = (id: string, name: string) => {
    setWorkouts(workouts.map(w =>
      w.id === id ? { ...w, name } : w
    ));
  };

  const updateRecord = (
    workoutId: string,
    recordId: string,
    field: keyof BulkWorkoutRecord,
    value: number
  ) => {
    setWorkouts(workouts.map(w =>
      w.id === workoutId
        ? {
          ...w,
          records: w.records.map(r =>
            r.id === recordId ? { ...r, [field]: value } : r
          )
        }
        : w
    ));
  };

  const handleSubmit = () => {
    const validWorkouts = workouts.filter(w => w.name && w.records.length > 0);

    if (validWorkouts.length === 0) {
      alert('Please add at least one workout with a name');
      return;
    }

    const payload = {
      dateKey: selectedDate.format('YYMMDD'),
      workouts: validWorkouts.map(w => ({
        name: w.name,
        memo: null,
        records: w.records.map(({ id: _id, ...record }) => record)
      }))
    };

    bulkCreateMutation.mutate(payload, {
      onSuccess: () => {
        alert('Workouts created successfully!');
        const newId = crypto.randomUUID();
        setSetCounters({ [newId]: 1 });
        setWorkouts([
          {
            id: newId,
            name: '',
            records: [{ id: crypto.randomUUID(), weight: 0, sets: 1, reps: 0 }]
          }
        ]);
      },
      onError: (error) => {
        alert(`Failed to create workouts: ${error.message}`);
      }
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1, p: 3, maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Submit Workout History
        </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Workout Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue || dayjs())}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </CardContent>
      </Card>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {workouts.map((workout, index) => (
          <Card key={workout.id}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h6">
                  Workout #{index + 1}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  color="error"
                  onClick={() => deleteWorkout(workout.id)}
                  disabled={workouts.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  label="Exercise Name"
                  value={workout.name}
                  onChange={(e) => updateWorkoutName(workout.id, e.target.value)}
                  fullWidth
                  required
                />

                <Divider sx={{ my: 2 }}>Sets</Divider>

                {workout.records.map((record, recordIndex) => (
                  <Card key={record.id} variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Set #{recordIndex + 1}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteRecord(workout.id, record.id)}
                        disabled={workout.records.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        type="number"
                        label="Sets"
                        value={record.sets}
                        onChange={(e) =>
                          updateRecord(workout.id, record.id, 'sets', parseInt(e.target.value) || 0)
                        }
                        inputProps={{ min: 1 }}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        type="number"
                        label="Reps"
                        value={record.reps}
                        onChange={(e) =>
                          updateRecord(workout.id, record.id, 'reps', parseInt(e.target.value) || 0)
                        }
                        inputProps={{ min: 0 }}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        type="number"
                        label="Weight (kg)"
                        value={record.weight}
                        onChange={(e) =>
                          updateRecord(workout.id, record.id, 'weight', parseFloat(e.target.value) || 0)
                        }
                        inputProps={{ min: 0, step: 0.5 }}
                        size="small"
                        fullWidth
                      />
                    </Stack>
                  </Card>
                ))}

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => addRecord(workout.id)}
                  sx={{ mt: 1 }}
                >
                  Add Set
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addWorkout}
          fullWidth
        >
          Add Another Workout
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={bulkCreateMutation.isPending}
          fullWidth
        >
          {bulkCreateMutation.isPending ? 'Submitting...' : 'Submit All Workouts'}
        </Button>
      </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default WorkoutHistorySubmitPage;
