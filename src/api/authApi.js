import apiClient from './apiClient';

export const authApi = {
  login: (mobile, password, fcm_token) => apiClient.post('/user/login', { mobile, password, fcm_token }),
  register: (userData) => apiClient.post('/user/register', userData),
  googleAuth: (googleData) => apiClient.post('/user/google-auth', googleData),
  updateFcmToken: (fcm_token) => apiClient.post('/user/fcm-token', { fcm_token }),
  getUser: () => apiClient.get('/user'),
  logout: () => apiClient.post('/user/logout'),
};