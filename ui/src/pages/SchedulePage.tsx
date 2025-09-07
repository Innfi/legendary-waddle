import { useState } from 'react';
import { useGetSchedules } from './api';
import { Box, CircularProgress, Paper, Stack, TextField, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

function SchedulePage() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data, isLoading, error } = useGetSchedules(fromDate, toDate);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Workout Schedules
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
      {error && <Typography color="error">Error fetching schedules</Typography>}
      {data && (
        <Paper sx={{ p: 2 }}>
          <List>
            {data.map((schedule) => (
              <>
                <ListItem key={schedule.id}>
                  <ListItemText
                    primary={`Scheduled for: ${new Date(schedule.plannedDate).toLocaleDateString()}`}
                    secondary={
                      <List>
                        {schedule.details.map((detail, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={detail.workoutName}
                              secondary={`Sets: ${detail.sets}, Reps: ${detail.reps}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    }
                  />
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
export default SchedulePage;