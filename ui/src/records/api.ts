import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../facility/axios.base";


export const usePostRecord = <T>() => {
  const instance = useAxios();
  const url = import.meta.env.VITE_BACKEND_URL;

  return useMutation({
    mutationKey: ['post-record'], // FIXME: key by uuid
    mutationFn: async (payload: T): Promise<number> => {
      const response = await instance.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      return response.status;
    },
  });
};