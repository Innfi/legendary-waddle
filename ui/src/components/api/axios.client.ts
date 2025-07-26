import Axios from "axios";
import { getToken } from "../../state/locals";

const axiosClient = Axios.create({
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  },
  responseType: 'json',
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosClient;
