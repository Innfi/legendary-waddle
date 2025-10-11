import { useState } from 'react';
import { Box, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

import type { WorkoutRecordItem } from '../state/entity';
import { useGetRecordsList } from './api';
import WorkoutHistoryPageUnit from './WorkoutHistoryPageUnit';
import Footer from './Footer';

function WorkoutHistoryPage() {
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, 'month').format('YYMMDD') );
  const [toDate, setToDate] = useState(dayjs().format('YYMMDD'));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // TODO: replace with useGetWorkoutsByDateKeyRange
  const { data, isLoading, error } = useGetRecordsList(fromDate, toDate);

  const handleToggle = (dateKey: string) => {
    setExpanded(prev => ({ ...prev, [dateKey]: !prev[dateKey] }));
  };

  const groupedByDate = data?.reduce((acc, item) => {
    const date = item.workoutDate.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, WorkoutRecordItem[]>);

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
      {groupedByDate && Object.entries(groupedByDate).map(([dateKey, records]) => {
        const firstRecord = records[0];
        const workoutName = firstRecord.workoutName;
        const date = new Date(firstRecord.workoutDate).toLocaleDateString();
        const sets = records.map(r => ({ set: r.workoutSet, reps: r.workoutReps, weight: r.weight }));

        return (
          <WorkoutHistoryPageUnit
            key={dateKey}
            date={date}
            workoutName={workoutName}
            elapsedTime="N/A"
            sets={sets}
            memo="N/A"
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
