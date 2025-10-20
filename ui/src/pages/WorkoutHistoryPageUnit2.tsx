import React from 'react';
import { Box, CircularProgress, Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Divider } from '@mui/material';
import { useGetWorkoutDetail } from './api';

interface WorkoutHistoryPageUnit2Props {
  dateKey: string;
}

const WorkoutHistoryPageUnit2: React.FC<WorkoutHistoryPageUnit2Props> = ({ dateKey }) => {
  const { data: workoutDetails, isLoading, error } = useGetWorkoutDetail(dateKey);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Failed to load workout details.</Typography>
      </Box>
    );
  }

  if (!workoutDetails || workoutDetails.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>No workouts found for this date.</Typography>
      </Box>
    );
  }

  // Format date for display
  const formatDate = (dateKey: string) => {
    const year = `20${dateKey.slice(0, 2)}`;
    const month = dateKey.slice(2, 4);
    const day = dateKey.slice(4, 6);
    return new Date(`${year}-${month}-${day}`).toLocaleDateString();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Workout Details - {formatDate(dateKey)}
      </Typography>
      
      {workoutDetails.map((workout, index) => (
        <Card key={workout.workout_id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {workout.name}
            </Typography>
            
            {workout.records && workout.records.length > 0 ? (
              <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Set</TableCell>
                    <TableCell align="right">Reps</TableCell>
                    <TableCell align="right">Weight (kg)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workout.records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.workout_set}</TableCell>
                      <TableCell align="right">{record.workout_reps}</TableCell>
                      <TableCell align="right">{record.weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No records for this workout.
              </Typography>
            )}
            
            {workout.memo && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Memo:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {workout.memo}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default WorkoutHistoryPageUnit2;