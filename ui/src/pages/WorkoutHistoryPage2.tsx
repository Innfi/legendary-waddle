import { useState } from 'react';
import { Box, CircularProgress, Paper, Stack, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';

import type { WorkoutRecordItem } from '../state/entity';
import { useGetRecordsList } from './api';

function WorkoutHistoryPage2() {
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, 'month').format('YYMMDD') );
  const [toDate, setToDate] = useState(dayjs().format('YYMMDD'));

  console.log(`fromDate: ${fromDate}, toDate: ${toDate}`);

  const { data, isLoading, error } = useGetRecordsList(fromDate, toDate);

  const groupedData = data?.reduce((acc, item) => {
    if (!acc[item.workoutName]) {
      acc[item.workoutName] = [];
    }
    acc[item.workoutName].push(item);
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
      {error && <Typography color="error">Error fetching history</Typography>}
      {groupedData && Object.entries(groupedData).map(([workoutName, records]) => (
        <Box key={workoutName} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {workoutName}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Set</TableCell>
                  <TableCell>Reps</TableCell>
                  <TableCell>Weight</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.workoutDate.toString()}>
                    <TableCell>{new Date(record.workoutDate).toLocaleDateString()}</TableCell>
                    <TableCell>{record.workoutSet}</TableCell>
                    <TableCell>{record.workoutReps}</TableCell>
                    <TableCell>{record.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
}

export default WorkoutHistoryPage2;
