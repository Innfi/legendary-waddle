import { useState } from 'react';
import { useGetRecordStats } from './api';
import { Box, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';

function WorkoutHistoryPage() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data, isLoading, error } = useGetRecordStats(fromDate, toDate);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Workout Statistics
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Stack>
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Error fetching stats</Typography>}
      {data && (
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography>Total Reps: {data.total_reps}</Typography>
            <Typography>Total Sets: {data.total_sets}</Typography>
            <Typography>Average Reps per Set: {data.avg_reps.toFixed(2)}</Typography>
            <Typography>Average Interval between Sets (seconds): {data.avg_interval_seconds.toFixed(2)}</Typography>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
export default WorkoutHistoryPage;