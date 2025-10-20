import { useState } from 'react';
import { Box, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

import type { Workout } from '../state/entity';
import { useGetWorkoutsByDateKeyRange } from './api';
import WorkoutHistoryPageUnit from './WorkoutHistoryPageUnit';
import Footer from './Footer';

function WorkoutHistoryPage() {
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, 'month').format('YYMMDD') );
  const [toDate, setToDate] = useState(dayjs().format('YYMMDD'));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // TODO: replace with useGetWorkoutsByDateKeyRange
  // const { data, isLoading, error } = useGetRecordsList(fromDate, toDate);
  const { data, isLoading, error } = useGetWorkoutsByDateKeyRange(fromDate, toDate);

  const handleToggle = (dateKey: string) => {
    setExpanded(prev => ({ ...prev, [dateKey]: !prev[dateKey] }));
  };

  const groupedByDate = data?.reduce((acc, item) => {
    const dateKey = item.dateKey; // Use dateKey from Workout instead of workoutDate
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, Workout[]>);

  // Sort the grouped data by date_key in descending order (most recent first)
  const sortedGroupedByDate = groupedByDate ? 
    Object.entries(groupedByDate)
      .sort(([dateKeyA], [dateKeyB]) => dateKeyB.localeCompare(dateKeyA))
      .reduce((acc, [dateKey, workouts]) => {
        acc[dateKey] = workouts;
        return acc;
      }, {} as Record<string, Workout[]>) 
    : null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Workout History
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </Stack>
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Error fetching history</Typography>}
      {sortedGroupedByDate && Object.entries(sortedGroupedByDate).map(([dateKey, workouts]) => {
        const firstWorkout = workouts[0];
        const workoutName = firstWorkout.name;
        const date = new Date(`20${dateKey.slice(0,2)}-${dateKey.slice(2,4)}-${dateKey.slice(4,6)}`).toLocaleDateString();
        
        return (
          <WorkoutHistoryPageUnit
            workoutId={firstWorkout.id}
            key={dateKey}
            date={date}
            workoutName={workoutName}
            elapsedTime="N/A"
            sets={[]} // You'll need to get this from records
            memo={firstWorkout.memo || ""}
            isExpanded={!!expanded[dateKey]}
            onClick={() => handleToggle(dateKey)}
          />
        );
      })}
      <Footer />
    </Box>
  );
}

export default WorkoutHistoryPage;
