import React, { useState, useMemo } from 'react';

import dayjs, { type Dayjs } from 'dayjs';

import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';

import { logger } from '../utils/logger';

import { useGetWorkoutsByDateKeyRange, useGetWorkoutDetail } from './api';
import Footer from './Footer';

const DashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedDateKey, setSelectedDateKey] = useState<string>('');

  const fromDate = useMemo(() => dayjs().startOf('month').format('YYMMDD'), []);
  const toDate = useMemo(() => dayjs().format('YYMMDD'), []);

  // Fetch workouts for the current month to highlight calendar days
  const { data: workouts } = useGetWorkoutsByDateKeyRange(fromDate, toDate);
  
  const { data: workoutDetail, isLoading: isLoadingDetail, error: errorDetail } = 
    useGetWorkoutDetail(selectedDateKey);

  // Create a set of date keys that have workouts
  const workoutDates = useMemo(() => {
    if (!workouts) return new Set<string>();
    return new Set(workouts.map(w => w.dateKey));
  }, [workouts]);

  logger.debug('DashboardPage - Workout detail result:', {
    workoutDetail,
    isLoadingDetail,
    errorDetail,
    selectedDateKey
  });

  const handleDateClick = (date: Dayjs | null) => {
    if (!date) return;

    setSelectedDate(date);

    const dateKey = date.format('YYMMDD');
    setSelectedDateKey(dateKey);
    logger.debug('Selected dateKey:', dateKey);
  };

  const calculateAverages = (records: { workout_reps: number; weight: number }[]) => {
    if (!records || records.length === 0) {
      return { avgReps: 0, avgWeight: 0, totalSets: 0 };
    }

    const totalReps = records.reduce((sum, r) => sum + r.workout_reps, 0);
    const totalWeight = records.reduce((sum, r) => sum + r.weight, 0);

    return {
      avgReps: Math.round((totalReps / records.length) * 10) / 10,
      avgWeight: Math.round((totalWeight / records.length) * 10) / 10,
      totalSets: records.length
    };
  };

  // Custom day renderer to highlight workout days
  const ServerDay = (props: PickersDayProps) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const dateKey = day.format('YYMMDD');
    const hasWorkout = workoutDates.has(dateKey);

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={hasWorkout ? '●' : undefined}
        color="primary"
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1, pb: 2 }}>
        <Stack direction="row" spacing={3} sx={{ marginLeft: '20px', marginTop: '20px' }}>
          {/* Calendar Section */}
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar 
                value={selectedDate}
                onChange={handleDateClick}
                slots={{
                  day: ServerDay,
                }}
              />
            </LocalizationProvider>
          </Box>

          {/* Workout Details Section */}
          <Box sx={{ flex: 1, maxWidth: '600px' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {selectedDateKey 
                ? dayjs(selectedDateKey, 'YYMMDD').format('MMMM DD, YYYY')
                : 'Select a date to view workouts'
              }
            </Typography>

            {isLoadingDetail && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {errorDetail && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Error loading workout details
              </Alert>
            )}

            {!isLoadingDetail && !errorDetail && selectedDateKey && (
              <>
                {!workoutDetail || workoutDetail.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No workouts recorded for this date
                  </Alert>
                ) : (
                  <Stack spacing={2}>
                    {workoutDetail.map((workout) => {
                      const stats = calculateAverages(workout.records);
                      return (
                        <Card key={workout.workout_id} variant="outlined">
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
                                  Avg Reps
                                </Typography>
                                <Typography variant="h6">
                                  {stats.avgReps}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Avg Weight
                                </Typography>
                                <Typography variant="h6">
                                  {stats.avgWeight} kg
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
                                      <TableCell align="right">{record.workout_reps}</TableCell>
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
                    })}
                  </Stack>
                )}
              </>
            )}
          </Box>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default DashboardPage;
