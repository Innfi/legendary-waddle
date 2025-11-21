import React, { useState, useMemo } from 'react';

import dayjs, { type Dayjs } from 'dayjs';

import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Badge
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';

import { useGetWorkoutsByDateKeyRange, useGetWorkoutDetail } from './api';
import Footer from './Footer';
import WorkoutDetailCard from './WorkoutDetailCard';

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

  const handleDateClick = (date: Dayjs | null) => {
    if (!date) return;

    setSelectedDate(date);

    const dateKey = date.format('YYMMDD');
    setSelectedDateKey(dateKey);
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
                    {workoutDetail.map((workout) => (
                      <WorkoutDetailCard key={workout.workout_id} workout={workout} />
                    ))}
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
