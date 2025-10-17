import { useMutation, useQuery } from "@tanstack/react-query";

import axiosClient from "../components/api/axios.client";
import { queryClient } from "../components/api/query.client";
import type { Schedule, UserProfile, Workout, WorkoutRecord, WorkoutRecordItem } from "../state/entity";

export const useGetRecord = (dateKey: string, workoutName: string | null) => {
  return useQuery({
    queryKey: ['records', workoutName],
    queryFn: async () => {
      const res = await axiosClient.get<WorkoutRecordItem[]>(`/records?date_key=${dateKey}&workout_name=${workoutName}`);

      console.log(`data: ${JSON.stringify(res.data)}`);
      return res.data;
    },
    enabled: !!workoutName,
  });
};

export const usePostRecord = (workoutName: string | null) => {
  return useMutation({
    mutationFn: (newRecord: WorkoutRecord) => {
      return axiosClient.post('/records', newRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records', workoutName] })
    },
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await axiosClient.get<UserProfile>('/profile');
      return res.data;
    },
  });
};

export const useGetSchedules = (from_date?: string, to_date?: string) => {
  return useQuery({
    queryKey: ['schedules', from_date, to_date],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from_date) params.append('from_date', from_date);
      if (to_date) params.append('to_date', to_date);
      const res = await axiosClient.get<Schedule[]>(`/schedules?${params.toString()}`);
      return res.data;
    },
  });
};

export const useGetRecordsList = (from_date?: string, to_date?: string) => {
  return useQuery({
    queryKey: ['records-list', from_date, to_date],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from_date) params.append('from_date', from_date);
      if (to_date) params.append('to_date', to_date);
      const res = await axiosClient.get<WorkoutRecordItem[]>(`/records/list?${params.toString()}`);
      return res.data;
    },
  });
};

export const useGetWorkoutsByDateKeyRange = (from_date: string, to_date: string) => {
  return useQuery({
    queryKey: ['workouts-by-date-range', from_date, to_date],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from_date) params.append('from_date', from_date);
      if (to_date) params.append('to_date', to_date);

      const res = await axiosClient.get<Workout[]>(`/workouts?${params.toString()}`);
      return res.data;
    },
  });
};

export const useUpdateWorkoutMemo = () => {
  return useMutation({
    mutationFn: async ({ workoutId, memo }: { workoutId: number; memo: string }) => {
      const res = await axiosClient.patch(`/workout/${workoutId}`, { memo });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['workout-detail'] });
      queryClient.invalidateQueries({ queryKey: ['workouts-by-date-range'] });
    },
  });
};
