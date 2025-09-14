import { useState } from 'react';
import { useGetSchedules } from './api';
import { Box, CircularProgress, Paper, Stack, Typography, List, ListItem, ListItemText, Badge } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { type Dayjs } from 'dayjs';

import Footer from './Footer';

interface ServerDayProps extends PickersDayProps {
  highlightedDays?: number[];
}

function ServerDay(props: ServerDayProps) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '✅' : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

function SchedulePage() {
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const fromDate = date?.startOf('month').format('YYYY-MM-DD') || '';
  const toDate = date?.endOf('month').format('YYYY-MM-DD') || '';

  const { data, isLoading, error } = useGetSchedules(fromDate, toDate);

  const highlightedDays = data?.map((schedule) => dayjs(schedule.plannedDate).date());

  const selectedSchedule = data?.find((schedule) => dayjs(schedule.plannedDate).isSame(date, 'day'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ flex: 1, pb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Workout Schedules
          </Typography>
          <Stack direction='column' spacing={2}>
            <Paper sx={{ p: 2, flex: '1 1 300px' }}>
              <DateCalendar
                value={date}
                onChange={(newDate) => setDate(newDate)}
                loading={isLoading}
                slots={{
                  day: ServerDay,
                }}
                slotProps={{
                  day: {
                  //   highlightedDays,
                  },
                }}
              />
            </Paper>
            <Paper sx={{ p: 2, flex: '1 1 300px' }}>
              <Typography variant="h6" gutterBottom>
                {date ? date.format('LL') : 'Select a date'}
              </Typography>
              {isLoading && <CircularProgress />}
              {error && <Typography color="error">Error fetching schedules</Typography>}
              {selectedSchedule ? (
                <List>
                  {selectedSchedule.details.map((detail, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={detail.workoutName}
                        secondary={`Sets: ${detail.sets}, Reps: ${detail.reps}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No workout scheduled for this day.</Typography>
              )}
            </Paper>
          </Stack>
        </Box>
      </LocalizationProvider>
      <Footer />
    </Box>
  );
}
export default SchedulePage;
