import { useMutation, useQuery } from "@tanstack/react-query";

import type { WorkoutName, WorkoutRecord } from "./entity";
import axiosClient from "../components/api/axios.client";
import { queryClient } from "../components/api/query.client";

export const useGetRecord = (workoutName: WorkoutName | null) => {
  return useQuery({
    queryKey: ['records', workoutName],
    queryFn: async () => {
      const res = await axiosClient.get(`/api/records?workout_id=${workoutName}`);
      return res.data;
    },
    enabled: !!workoutName,
  });
};

export const usePostRecord = (workoutId: string | null) => {
  return useMutation({
    mutationFn: (newRecord: Omit<WorkoutRecord, 'workoutSet'>) => {
      return axiosClient.post('/api/records', newRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records', workoutId] })
    },
  })
};