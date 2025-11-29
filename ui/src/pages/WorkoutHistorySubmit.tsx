import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import dayjs, { type Dayjs } from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { lastWorkoutValuesAtom, workoutSetCountersAtom } from '../state/atom';
import type { BulkWorkoutRecord } from '../state/entity';

import { useBulkCreateWorkouts } from './api';
import Footer from './Footer';

interface WorkoutUnit {
  id: string;
  name: string;
  memo?: string | null;
  records: (BulkWorkoutRecord & { id: string })[];
}
const WorkoutHistorySubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [setCounters, setSetCounters] = useAtom(workoutSetCountersAtom);
  const [lastWorkoutValues, setLastWorkoutValues] = useAtom(lastWorkoutValuesAtom);

  const [workouts, setWorkouts] = useState<WorkoutUnit[]>(() => {
    const initialId = crypto.randomUUID();
    setSetCounters({ [initialId]: 1 });
    return [
      {
        id: initialId,
        name: '',
        memo: null,
        records: [{ id: crypto.randomUUID(), weight: 0, sets: 1, reps: 0 }],
      },
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
        memo: null,
        records: [{ id: crypto.randomUUID(), weight: 0, sets: 1, reps: 0 }],
      },
    ]);
  };

  const deleteWorkout = (id: string) => {
    if (workouts.length === 1) return;
    setWorkouts(workouts.filter((w) => w.id !== id));
    const newCounters = { ...setCounters };
    delete newCounters[id];
    setSetCounters(newCounters);
  };

  const addRecordV2 = (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (!workout) {
      console.log(`Workout with ID ${workoutId} not found`);
      return;
    }

    const currentSetNumber = (setCounters[workoutId] || 0) + 1;
    setSetCounters({ ...setCounters, [workoutId]: currentSetNumber });

    // Get last values for this workout name, or use defaults
    const lastValues =
      workout.name && lastWorkoutValues[workout.name]
        ? lastWorkoutValues[workout.name]
        : { sets: 1, reps: 0, weight: 0 };

    setWorkouts(
      workouts.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              records: [
                ...w.records,
                {
                  id: crypto.randomUUID(),
                  weight: lastValues.weight,
                  sets: currentSetNumber + 1,
                  reps: lastValues.reps,
                },
              ],
            }
          : w
      )
    );
  };

  const deleteRecord = (workoutId: string, recordId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (workout && workout.records.length > 1) {
      const currentSetNumber = setCounters[workoutId] || 1;
      setSetCounters({ ...setCounters, [workoutId]: Math.max(1, currentSetNumber - 1) });
    }

    setWorkouts(
      workouts.map((w) =>
        w.id === workoutId && w.records.length > 1
          ? { ...w, records: w.records.filter((r) => r.id !== recordId) }
          : w
      )
    );
  };

  const updateWorkoutName = (id: string, name: string) => {
    setWorkouts(workouts.map((w) => (w.id === id ? { ...w, name } : w)));
  };

  const updateWorkoutMemo = (id: string, memo: string | null) => {
    setWorkouts(workouts.map((w) => (w.id === id ? { ...w, memo } : w)));
  };

  const updateRecord = (
    workoutId: string,
    recordId: string,
    field: keyof BulkWorkoutRecord,
    value: number
  ) => {
    setWorkouts(
      workouts.map((w) => {
        if (w.id === workoutId) {
          const updatedRecords = w.records.map((r) =>
            r.id === recordId ? { ...r, [field]: value } : r
          );

          // Save last values to atom when workout has a name
          if (w.name) {
            const lastRecord = updatedRecords[updatedRecords.length - 1];
            setLastWorkoutValues({
              ...lastWorkoutValues,
              [w.name]: {
                sets: lastRecord.sets,
                reps: lastRecord.reps,
                weight: lastRecord.weight,
              },
            });
          }

          return { ...w, records: updatedRecords };
        }
        return w;
      })
    );
  };

  const handleSubmit = () => {
    const validWorkouts = workouts.filter((w) => w.name && w.records.length > 0);

    if (validWorkouts.length === 0) {
      alert('Please add at least one workout with a name');
      return;
    }

    const payload = {
      dateKey: selectedDate.format('YYMMDD'),
      workouts: validWorkouts.map((w) => ({
        name: w.name,
        memo: w.memo,
        records: w.records.map(({ id: _id, ...record }) => record),
      })),
    };
    bulkCreateMutation.mutate(payload, {
      onSuccess: () => {
        alert('Workouts created successfully!');
        navigate('/dashboard');
      },
      onError: (error) => {
        alert(`Failed to create workouts: ${error.message}`);
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-6 max-w-md mx-auto w-full">
        <Typography variant="h4" className="!mb-6 !font-bold">
          Submit Workout History
        </Typography>

        <Card className="!mb-6 shadow-sm">
          <CardContent className="!p-4">
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

        <div className="space-y-4 mb-6">
          {workouts.map((workout, index) => (
            <Card key={workout.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="!p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Typography variant="h6" className="!font-semibold">
                    Workout #{index + 1}
                  </Typography>
                  <div className="flex-1" />
                  <IconButton
                    color="error"
                    onClick={() => deleteWorkout(workout.id)}
                    disabled={workouts.length === 1}
                    className="hover:bg-red-50 transition-colors"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>

                <div className="space-y-4">
                  <TextField
                    label="Exercise Name"
                    value={workout.name}
                    onChange={(e) => updateWorkoutName(workout.id, e.target.value)}
                    fullWidth
                    required
                    className="!pb-[10px]"
                  />

                  <Divider className="!my-4" />

                  <Typography variant="h6" className="!font-semibold">
                    Memo
                  </Typography>
                  <TextField
                    value={workout.memo || ''}
                    onChange={(e) => updateWorkoutMemo(workout.id, e.target.value || null)}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Add notes about this workout..."
                  />

                  <Divider className="!my-4">Sets</Divider>

                  {workout.records.map((record, recordIndex) => (
                    <Card
                      key={record.id}
                      variant="outlined"
                      className="!p-4 !bg-gray-50 hover:!bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Typography variant="body2" color="text.secondary" className="!font-medium">
                          Set #{recordIndex + 1}
                        </Typography>
                        <div className="flex-1" />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteRecord(workout.id, record.id)}
                          disabled={workout.records.length === 1}
                          className="hover:bg-red-50 transition-colors"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                      <div className="flex gap-4">
                        <TextField
                          type="number"
                          label="Sets"
                          value={record.sets}
                          onChange={(e) =>
                            updateRecord(
                              workout.id,
                              record.id,
                              'sets',
                              parseInt(e.target.value) || 0
                            )
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
                            updateRecord(
                              workout.id,
                              record.id,
                              'reps',
                              parseInt(e.target.value) || 0
                            )
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
                            updateRecord(
                              workout.id,
                              record.id,
                              'weight',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          inputProps={{ min: 0, step: 0.5 }}
                          size="small"
                          fullWidth
                        />
                      </div>
                    </Card>
                  ))}

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addRecordV2(workout.id)}
                    className="!mt-2 hover:!bg-blue-50 transition-colors"
                  >
                    Add Set
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addWorkout}
            fullWidth
            className="hover:!bg-blue-50 transition-colors"
          >
            Add Another Workout
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={bulkCreateMutation.isPending}
            fullWidth
            className="hover:!shadow-lg transition-shadow"
          >
            {bulkCreateMutation.isPending ? 'Submitting...' : 'Submit All Workouts'}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WorkoutHistorySubmitPage;
