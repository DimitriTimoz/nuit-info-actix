import Axios from 'axios';

Axios.interceptors.request.use(
  (config) => {
    config.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
    config.headers.Authorization = localStorage.getItem('token');
    return config;
  },
  (error) => Promise.reject(error)
);
