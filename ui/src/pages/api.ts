import { useMutation, useQuery } from "@tanstack/react-query";

import type { WorkoutName, WorkoutRecord, WorkoutRecordItem } from "../state/entity";
import axiosClient from "../components/api/axios.client";
import { queryClient } from "../components/api/query.client";

export const useGetRecord = (dateKey: string, workoutName: WorkoutName | null) => {
  return useQuery({
    queryKey: ['records', workoutName],
    queryFn: async () => {
      const res = await axiosClient.get<WorkoutRecordItem[]>(`/api/records?date_key=${dateKey}&workout_name=${workoutName}`);

      console.log(`data: ${JSON.stringify(res.data)}`);
      return res.data;
    },
    enabled: !!workoutName,
  });
};

export const usePostRecord = (workoutName: WorkoutName | null) => {
  return useMutation({
    mutationFn: (newRecord: WorkoutRecord) => {
      return axiosClient.post('/api/records', newRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records', workoutName] })
    },
  });
};