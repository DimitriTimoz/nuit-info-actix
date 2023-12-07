import Axios from 'axios';

Axios.interceptors.request.use(
  (config) => {
    config.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
    return config;
  },
  (error) => Promise.reject(error)
);
