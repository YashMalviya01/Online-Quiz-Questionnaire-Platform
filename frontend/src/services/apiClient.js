import axios from 'axios';
import { resolveApiBase } from '../utils/resolveApiBase.js';

const apiClient = axios.create({
  baseURL: resolveApiBase(),
  withCredentials: false
});

// Add request interceptor to always include token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qp_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('qp_token', token);
  } else {
    delete apiClient.defaults.headers.common.Authorization;
    localStorage.removeItem('qp_token');
  }
};

export default apiClient;
