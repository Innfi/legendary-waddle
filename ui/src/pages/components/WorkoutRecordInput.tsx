import React from 'react';
import { useAtom } from 'jotai';

import DeleteIcon from '@mui/icons-material/Delete';
import { Card, IconButton, TextField, Typography } from '@mui/material';

import { workoutsAtom } from '../../state/atom';
import type { BulkWorkoutRecord } from '../../state/entity';

interface WorkoutRecordInputProps {
  workoutId: string;
  recordId: string;
  recordIndex: number;
  isOnlyRecord: boolean;
}

const WorkoutRecordInput: React.FC<WorkoutRecordInputProps> = ({
  workoutId,
  recordId,
  recordIndex,
  isOnlyRecord,
}) => {
  const [workouts, setWorkouts] = useAtom(workoutsAtom);

  const workout = workouts.find((w) => w.id === workoutId);
  const record = workout?.records.find((r) => r.id === recordId);

  if (!workout || !record) return null;

  const updateRecord = (field: keyof BulkWorkoutRecord, value: number) => {
    setWorkouts(
      workouts.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              records: w.records.map((r) => (r.id === recordId ? { ...r, [field]: value } : r)),
            }
          : w
      )
    );
  };

  const deleteRecord = () => {
    if (isOnlyRecord) return;

    setWorkouts(
      workouts.map((w) =>
        w.id === workoutId ? { ...w, records: w.records.filter((r) => r.id !== recordId) } : w
      )
    );
  };

  return (
    <Card
      variant="outlined"
      className="!p-4 !bg-gray-50 dark:!bg-gray-800 hover:!bg-gray-100 dark:hover:!bg-gray-700 transition-colors"
    >
      <div className="flex items-center !gap-2 mb-2">
        <Typography variant="body2" color="text.secondary" className="!font-medium">
          Set #{recordIndex + 1}
        </Typography>
        <div className="flex-1" />
        <IconButton
          size="small"
          color="error"
          onClick={deleteRecord}
          disabled={isOnlyRecord}
          className="hover:bg-red-50 transition-colors"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="flex !gap-4">
        <TextField
          type="number"
          label="Reps"
          value={record.reps}
          onChange={(e) => updateRecord('reps', parseInt(e.target.value) || 0)}
          inputProps={{ min: 0 }}
          size="small"
          fullWidth
        />
        <TextField
          type="number"
          label="Weight (kg)"
          value={record.weight}
          onChange={(e) => updateRecord('weight', parseFloat(e.target.value) || 0)}
          inputProps={{ min: 0, step: 0.5 }}
          size="small"
          fullWidth
        />
      </div>
    </Card>
  );
};

export default WorkoutRecordInput;
