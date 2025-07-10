import { useMutation, useQuery } from "@tanstack/react-query";

import { useAxios } from "../facility/axios.base";
import type { WorkoutUnit } from "./entity";

export const usePostRecord = (token: string) => {
  const instance = useAxios();
  const url = import.meta.env.VITE_BACKEND_URL;

  return useMutation({
    mutationKey: ['post-record'], // FIXME: key by uuid
    mutationFn: async (payload: WorkoutUnit): Promise<number> => {
      const response = await instance.post(`${url}/record/${token}`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      return response.status;
    },
  });
};

export const useGetRecords = (token: string) => {
  const instance = useAxios();
  const url = import.meta.env.VITE_BACKEND_URL;

  return useQuery({
    queryKey: ['get-record'],
    queryFn: async (): Promise<WorkoutUnit[]> => {
      const response = await instance.get<WorkoutUnit[]>(`${url}/record/${token}`);

      return response.data;
    },
  });
};