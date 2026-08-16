import apiClient from './apiClient';

export const authApi = {
  login: (mobile, password) => apiClient.post('/user/login', { mobile, password }),
  register: (userData) => apiClient.post('/user/register', userData),
  googleAuth: (googleData) => apiClient.post('/user/google-auth', googleData),
  getUser: () => apiClient.get('/user'),
  logout: () => apiClient.post('/user/logout'),
};