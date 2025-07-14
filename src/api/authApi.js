import apiClient from './apiClient';

export const authApi = {
  login: (mobile, password) => apiClient.post('/user/login', { mobile, password }),
  register: (userData) => apiClient.post('/user/register', userData),
  getUser: () => apiClient.get('/user'),
  logout: () => apiClient.post('/user/logout'),
};