import Axios, { AxiosError, type AxiosInstance } from "axios";
import { createContext, useContext } from "react";
import { useMutation, useQuery } from '@tanstack/react-query';

export const axiosInstance = Axios.create({
  // baseURL: import.meta.env.API_URL,
  baseURL: 'http://localhost:8787',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});

const axiosErrorHandler = (error: AxiosError<unknown>) => {
  // TODO: authentication error

  return Promise.reject(error);
};

axiosInstance.interceptors.response.use((response) => {
  return response;
}, axiosErrorHandler);

export const AxiosContext = createContext<AxiosInstance>(
  new Proxy(axiosInstance, {
    apply: () => {
      throw new Error('TODO');
    },
    get: () => {
      throw new Error('TODO');
    },
  })
);

export const useAxios = () => {
  return useContext(AxiosContext);
};

interface TestInterface {
  id: number;
  name: string;
}

export const useGetApi = (url: string) => {
  const instance = useAxios();

  return useQuery({
    queryKey: ['get-dummy'],
    queryFn: async (): Promise<TestInterface[]> => {
      const response = await instance.get<TestInterface[]>(url);

      return response.data;
    },
  });
};

export const usePostApi = <T>(url: string) => {
  const instance = useAxios();

  return useMutation({
    mutationKey: ['post-dummy'],
    mutationFn: async (payload: T): Promise<number> => {
      const response = await instance.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      return response.status;
    },
  });
};

export const usePatchApi = <T>(url: string) => {
  const instance = useAxios();

  return useMutation({
    mutationKey: ['patch-dummy'],
    mutationFn: async (payload: T): Promise<number> => {
      const response = await instance.patch(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      return response.status;
    },
  });
};

export const useDeleteApi = (url: string) => {
  const instance = useAxios();

  return useMutation({
    mutationKey: ['delete-dummy'],
    mutationFn: async (): Promise<number> => {
      const response = await instance.delete(url);

      return response.status;
    },
  });
};
