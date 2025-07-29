import { useMutation, useQuery } from "@tanstack/react-query";

import type { WorkoutName, WorkoutRecord, WorkoutRecordItem } from "../state/entity";
import axiosClient from "../components/api/axios.client";
import { queryClient } from "../components/api/query.client";

export const useGetRecord = (workoutName: WorkoutName | null) => {
  return useQuery({
    queryKey: ['records', workoutName],
    queryFn: async () => {
      const res = await axiosClient.get<WorkoutRecordItem[]>(`/api/records?workout_id=${workoutName}`);

      console.log(`data: ${JSON.stringify(res.data)}`);
      return res.data;
    },
    enabled: !!workoutName,
  });
};

export const usePostRecord = (workoutId: string | null) => {
  return useMutation({
    mutationFn: (newRecord: WorkoutRecord) => {
      return axiosClient.post('/api/records', newRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records', workoutId] })
    },
  })
};