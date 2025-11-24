import React from 'react';

import {
  Box,
  Card,
  CardContent,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import type { WorkoutWithRecords } from '../state/entity';

import { calculateAverages } from './functions/calculate-averages';

interface WorkoutDetailCardProps {
  workout: WorkoutWithRecords;
}

const WorkoutDetailCard: React.FC<WorkoutDetailCardProps> = ({ workout }) => {

  const stats = calculateAverages(workout.records);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {workout.name}
        </Typography>
        
        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Sets
            </Typography>
            <Typography variant="h6">
              {stats.totalSets}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Max Reps
            </Typography>
            <Typography variant="h6">
              {stats.maxReps}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Weight Range
            </Typography>
            <Typography variant="h6">
              {stats.minWeight} - {stats.maxWeight} kg
            </Typography>
          </Box>
        </Stack>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Set</TableCell>
                <TableCell align="right">Reps</TableCell>
                <TableCell align="right">Weight (kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workout.records.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="right">{record.workoutReps}</TableCell>
                  <TableCell align="right">{record.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {workout.memo && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 2, fontStyle: 'italic' }}
          >
            Note: {workout.memo}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutDetailCard;
