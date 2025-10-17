import axios from 'axios';
import { resolveApiBase } from '../utils/resolveApiBase.js';

const apiClient = axios.create({
  baseURL: resolveApiBase(),
  withCredentials: false
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export default apiClient;
