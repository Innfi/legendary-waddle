import { useMutation } from "@tanstack/react-query";
import type { NavigateFunction } from "react-router-dom";
import type { AxiosResponse } from "axios";

import { setToken } from "../../state/locals";
import axiosClient from "../api/axios.client";
import { useNotification } from "../notification/useNotification";

interface LoginResponse {
  access_token: string;
}

export const usePostLogin = (navigate: NavigateFunction) => {
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (accessToken: string) => {
      return axiosClient.post<LoginResponse>('/login', { access_token: accessToken });
    },
    onSuccess: (response: AxiosResponse<LoginResponse>) => {
      setToken(response.data.access_token);
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      showNotification(error.message, 'error');
    },
  });
};

