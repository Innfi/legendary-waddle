import React from 'react';

import {
  Card,
  CardContent,
  Paper,
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
    <Card variant="outlined" className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="!p-6">
        <Typography variant="h6" className="!mb-4 !font-bold">
          {workout.name}
        </Typography>
        
        <div className="flex gap-6 mb-4">
          <div className="flex flex-col">
            <Typography variant="body2" color="text.secondary" className="!mb-1">
              Total Sets
            </Typography>
            <Typography variant="h6" className="!font-semibold">
              {stats.totalSets}
            </Typography>
          </div>
          
          <div className="flex flex-col">
            <Typography variant="body2" color="text.secondary" className="!mb-1">
              Max Reps
            </Typography>
            <Typography variant="h6" className="!font-semibold">
              {stats.maxReps}
            </Typography>
          </div>
          
          <div className="flex flex-col">
            <Typography variant="body2" color="text.secondary" className="!mb-1">
              Weight Range
            </Typography>
            <Typography variant="h6" className="!font-semibold">
              {stats.minWeight} - {stats.maxWeight} kg
            </Typography>
          </div>
        </div>

        <TableContainer component={Paper} variant="outlined" className="rounded-lg">
          <Table size="small">
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="!font-semibold">Set</TableCell>
                <TableCell align="right" className="!font-semibold">Reps</TableCell>
                <TableCell align="right" className="!font-semibold">Weight (kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workout.records.map((record, index) => (
                <TableRow key={record.id} className="hover:bg-gray-50 transition-colors">
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
            className="!mt-4 !italic"
          >
            Note: {workout.memo}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutDetailCard;
