import axios from 'axios';
import { getEnvVars } from '../config/environment';
import { getToken } from '../utils/auth';

const { apiUrl } = getEnvVars();

const apiClient = axios.create({
  baseURL: apiUrl || 'http://localhost:8003',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);

export default apiClient;