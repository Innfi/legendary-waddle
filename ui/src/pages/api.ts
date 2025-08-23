import { useMutation, useQuery } from "@tanstack/react-query";

import type { WorkoutName, WorkoutRecord, WorkoutRecordItem } from "../state/entity";
import axiosClient from "../components/api/axios.client";
import { queryClient } from "../components/api/query.client";

export const useGetRecord = (dateKey: string, workoutName: WorkoutName | null) => {
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

export const usePostRecord = (workoutName: WorkoutName | null) => {
  return useMutation({
    mutationFn: (newRecord: WorkoutRecord) => {
      return axiosClient.post('/records', newRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records', workoutName] })
    },
  });
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  favoriteWorkouts: { name: string; icon: string }[];
  goal: string;
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