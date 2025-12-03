import React from 'react';
import { useAtom } from 'jotai';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';

import { lastWorkoutValuesAtom, workoutSetCountersAtom, workoutsAtom } from '../../state/atom';

import WorkoutRecordInput from './WorkoutRecordInput';

interface WorkoutCardProps {
  workoutId: string;
  index: number;
  isOnlyWorkout: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workoutId, index, isOnlyWorkout }) => {
  const [workouts, setWorkouts] = useAtom(workoutsAtom);
  const [setCounters, setSetCounters] = useAtom(workoutSetCountersAtom);
  const [lastWorkoutValues, setLastWorkoutValues] = useAtom(lastWorkoutValuesAtom);

  const workout = workouts.find((w) => w.id === workoutId);

  if (!workout) return null;

  const updateName = (name: string) => {
    setWorkouts(workouts.map((w) => (w.id === workoutId ? { ...w, name } : w)));
  };

  const updateMemo = (memo: string | null) => {
    setWorkouts(workouts.map((w) => (w.id === workoutId ? { ...w, memo } : w)));
  };

  const deleteWorkout = () => {
    if (isOnlyWorkout) return;

    setWorkouts(workouts.filter((w) => w.id !== workoutId));
    const newCounters = { ...setCounters };
    delete newCounters[workoutId];
    setSetCounters(newCounters);
  };

  const addRecord = () => {
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
                  sets: currentSetNumber,
                  reps: lastValues.reps,
                },
              ],
            }
          : w
      )
    );

    // Save last values to atom when workout has a name
    if (workout.name) {
      setLastWorkoutValues({
        ...lastWorkoutValues,
        [workout.name]: lastValues,
      });
    }
  };

  return (
    <Card className="!mt-auto shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="!p-6">
        <div className="flex items-center !gap-4 mb-4">
          <Typography variant="h6" className="!font-semibold">
            Workout #{index + 1}
          </Typography>
          <div className="flex-1" />
          <IconButton
            color="error"
            onClick={deleteWorkout}
            disabled={isOnlyWorkout}
            className="hover:bg-red-50 transition-colors"
          >
            <DeleteIcon />
          </IconButton>
        </div>

        <div className="space-y-4">
          <TextField
            label="Exercise Name"
            value={workout.name}
            onChange={(e) => updateName(e.target.value)}
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
            onChange={(e) => updateMemo(e.target.value || null)}
            fullWidth
            multiline
            rows={2}
            placeholder="Add notes about this workout..."
          />

          <Divider className="!my-4">Sets</Divider>

          {workout.records.map((record, recordIndex) => (
            <WorkoutRecordInput
              key={record.id}
              workoutId={workoutId}
              recordId={record.id}
              recordIndex={recordIndex}
              isOnlyRecord={workout.records.length === 1}
            />
          ))}

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={addRecord}
            className="!mt-2 hover:!bg-blue-50 transition-colors"
          >
            Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
