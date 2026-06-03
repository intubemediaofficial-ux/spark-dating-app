import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to all requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  loginWithPhone: (phone) => api.post('/auth/login/phone', { phone }),
  loginWithFirebase: (data) => api.post('/auth/login/firebase', data),
  getMe: () => api.get('/auth/me'),
};

// Profile APIs
export const profileAPI = {
  update: (data) => api.put('/profile/update', data),
  uploadPhoto: (formData) => api.post('/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deletePhoto: (photoUrl) => api.delete('/profile/photo', { data: { photoUrl } }),
  getProfile: (userId) => api.get(`/profile/${userId}`),
};

// Swipe/Match APIs
export const swipeAPI = {
  getDiscovery: (page = 1) => api.get(`/swipe/discover?page=${page}`),
  swipe: (targetUserId, direction) => api.post('/swipe/swipe', { targetUserId, direction }),
  getMatches: () => api.get('/swipe/matches'),
};

// Chat APIs
export const chatAPI = {
  getMessages: (matchId, page = 1) => api.get(`/chat/${matchId}/messages?page=${page}`),
  sendMessage: (matchId, content) => api.post(`/chat/${matchId}/messages`, { content }),
};

// Safety APIs
export const safetyAPI = {
  report: (reportedId, reason, description) => api.post('/safety/report', { reportedId, reason, description }),
  block: (blockedId) => api.post('/safety/block', { blockedId }),
  unblock: (blockedId) => api.post('/safety/unblock', { blockedId }),
  getBlocked: () => api.get('/safety/blocked'),
};

export default api;
