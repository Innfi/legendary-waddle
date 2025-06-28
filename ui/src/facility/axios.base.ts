import Axios, { AxiosError, type AxiosInstance } from "axios";
import { createContext, useContext } from "react";
import { useQuery } from '@tanstack/react-query';

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