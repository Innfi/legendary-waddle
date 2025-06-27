import Axios, { AxiosError, type AxiosInstance } from "axios";
import { createContext, useContext } from "react";
import { useQuery } from "react-query";


export const axiosInstance = Axios.create({
  baseURL: import.meta.env.API_URL,
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

export const useGetApi = (url: string) => {
  const instance = useAxios();
  const service = async () => {
    return await instance.get(url, {
      headers: {
        // TODO: tokens for oauth?
      }
    });
  };

  return useQuery('query-key', () => service())
};