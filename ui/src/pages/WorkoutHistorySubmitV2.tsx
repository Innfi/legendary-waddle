import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { selectedDateAtom, workoutSetCountersAtom, workoutsAtom } from '../state/atom';

import { useBulkCreateWorkouts } from './api';
import WorkoutCard from './components/WorkoutCard';
import Footer from './Footer';

const WorkoutHistorySubmitPageV2: React.FC = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useAtom(workoutsAtom);
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [setCounters, setSetCounters] = useAtom(workoutSetCountersAtom);

  const bulkCreateMutation = useBulkCreateWorkouts();

  // Initialize with one workout on mount
  useEffect(() => {
    const initialId = crypto.randomUUID();
    setSetCounters({ [initialId]: 1 });
    setWorkouts([
      {
        id: initialId,
        name: '',
        memo: null,
        records: [{ id: crypto.randomUUID(), weight: 0, sets: 1, reps: 0 }],
      },
    ]);

    // Cleanup on unmount
    return () => {
      setWorkouts([]);
      setSetCounters({});
    };
  }, [setWorkouts, setSetCounters]);

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

  // flex flex-col min-h-screen dark:bg-gray-900
  // flex-1 p-6 max-w-md mx-auto w-full

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-6">
        <Typography variant="h4" className="!font-bold">
          Submit Workout History V2
        </Typography>

        <Card className="shadow-sm">
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

        <div className="space-y-4 !mt-4">
          {workouts.map((workout, index) => (
            <WorkoutCard
              key={workout.id}
              workoutId={workout.id}
              index={index}
              isOnlyWorkout={workouts.length === 1}
            />
          ))}
        </div>

        <div className="flex !gap-4">
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

export default WorkoutHistorySubmitPageV2;
