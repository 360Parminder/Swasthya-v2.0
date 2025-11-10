import axios from 'axios';
import { getEnvVars } from '../config/environment';
import { getToken } from '../utils/auth';
import Toast from 'react-native-toast-message';

const { apiUrl } = getEnvVars();

const apiClient = axios.create({
  baseURL: 'https://api-swasthya.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
 const showToast = (type, message, subMessage = '') => {
    Toast.show({
      type,
      text1: message,
      text2: subMessage,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  };

apiClient.interceptors.request.use(
  async config => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    // console.log('API Error:', error.status);
    if (error.message === 'Network Error') {
      showToast('error', 'Network Error');
    }

    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  },
);

export default apiClient;
