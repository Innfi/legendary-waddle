import { useMutation } from "@tanstack/react-query";

import type { WorkoutRecord } from "./entity";
import axiosClient from "../components/api/axios.client";
import { queryClient } from "../components/api/query.client";

export const postRecord = (workoutId: string | null) => {
  return useMutation({
    mutationFn: (newRecord: Omit<WorkoutRecord, 'workoutSet'>) => {
      return axiosClient.post('/api/records', newRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records', workoutId] })
    },
  })
};