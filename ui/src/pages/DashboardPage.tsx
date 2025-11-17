import React, { useState, useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';

import { logger } from '../utils/logger';
import Footer from './Footer';
import { useGetWorkoutsByDateKeyRange, useGetWorkoutDetail } from './api';

const DashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedDateKey, setSelectedDateKey] = useState<string>('');

  const fromDate = useMemo(() => dayjs().startOf('month').format('YYMMDD'), []);
  const toDate = useMemo(() => dayjs().format('YYMMDD'), []);

  logger.debug('DashboardPage - Date range:', { fromDate, toDate });

  const { data: workouts, isLoading, error } = useGetWorkoutsByDateKeyRange(fromDate, toDate);

  logger.debug('DashboardPage - Query result:', { 
    workouts, 
    isLoading, 
    error,
    workoutsCount: workouts?.length 
  });

  const { data: workoutDetail, isLoading: isLoadingDetail, error: errorDetail } = useGetWorkoutDetail(selectedDateKey);

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1, pb: 2 }}>
        <Stack direction="column" sx={{ marginLeft: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            {isLoading && <div>Loading workouts...</div>}
            {error && <div>Error loading workouts</div>}
            {workouts && <div>Found {workouts.length} workouts</div>}
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar 
              value={selectedDate}
              onChange={handleDateClick}
            />
          </LocalizationProvider>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default DashboardPage;
