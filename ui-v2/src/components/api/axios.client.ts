import Axios from 'axios';

import { getToken } from '../../state/locals';
import { logger } from '../../utils/logger';

logger.debug('Backend URL:', import.meta.env.VITE_BACKEND_URL);

const axiosClient = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
