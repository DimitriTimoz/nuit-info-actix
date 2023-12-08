import Axios from 'axios';

Axios.interceptors.request.use(
  (config) => {
    config.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
    if (localStorage.getItem('token')) {
      config.headers.token = localStorage.getItem('token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);
