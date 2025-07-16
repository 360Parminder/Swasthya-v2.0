// src/api/endpoints.js

const BASE_URL = 'http://localhost:8003';

const endpoints = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    me: `${BASE_URL}/auth/me`,
    logout: `${BASE_URL}/auth/logout`,
    refresh: `${BASE_URL}/auth/refresh`,
  },
  user: {
    profile: `${BASE_URL}/user/profile`,
    updateProfile: `${BASE_URL}/user/profile`,
    changePassword: `${BASE_URL}/user/password`,
  },
  // Add more endpoints as your app grows
  posts: {
    getAll: `${BASE_URL}/posts`,
    create: `${BASE_URL}/posts`,
    getById: (id) => `${BASE_URL}/posts/${id}`,
    update: (id) => `${BASE_URL}/posts/${id}`,
    delete: (id) => `${BASE_URL}/posts/${id}`,
  },
  connections: {
    find: (userId) => `${BASE_URL}/connection/${userId}`,
    create: `${BASE_URL}/connections`,
    delete: (id) => `${BASE_URL}/connections/${id}`,
  },
};

export default endpoints;