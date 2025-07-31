import { useMutation, useQuery } from "@tanstack/react-query";
import type { CredentialResponse } from "@react-oauth/google";
import type { NavigateFunction } from "react-router-dom";

import type { WorkoutName, WorkoutRecord, WorkoutRecordItem } from "../state/entity";
import axiosClient from "../components/api/axios.client";
import { queryClient } from "../components/api/query.client";
import type { AxiosResponse } from "axios";
import { setToken } from "../state/locals";

interface LoginResponse {
  access_token: string;
}

export const usePostLogin = (navigate: NavigateFunction) => {
  return useMutation({
    mutationFn: (credentialResponse: CredentialResponse) => {
      return axiosClient.post<LoginResponse>('/api/login', credentialResponse.credential);
    },
    onSuccess: (response: AxiosResponse<LoginResponse>) => {
      setToken(response.data.access_token);
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      // TODO: error handling
      console.log(error);
    },
  });
};

export const useGetRecord = (dateKey: string, workoutName: WorkoutName | null) => {
  return useQuery({
    queryKey: ['records', workoutName],
    queryFn: async () => {
      const res = await axiosClient.get<WorkoutRecordItem[]>(`/api/records?dateKey=${dateKey}&workout_id=${workoutName}`);

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