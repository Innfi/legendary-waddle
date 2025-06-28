import { useMemo } from "react";

import { AxiosContext, axiosInstance } from "./axios.base";

export const AxiosProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const axiosValue = useMemo(() => {
    return axiosInstance;
  }, []);

  return (
  <AxiosContext.Provider value={axiosValue}>
    {children}
  </AxiosContext.Provider>
  );
};