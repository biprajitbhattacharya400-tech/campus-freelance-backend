import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if the 401 is NOT from the login endpoint itself
    if (error.response && error.response.status === 401) {
      if (error.config && !error.config.url.includes('/auth/login')) {
        removeToken();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getUserMe = () => api.get('/user/me');
export const getUserProfile = () => api.get('/user/profile');
export const updateUserProfile = (data) => api.put('/user/profile', data);
export const updateUserRole = (data) => api.put('/user/role', data);
export const uploadUserAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return api.post('/user/profile/avatar', formData);
};

// Tasks endpoints
export const getTasks = () => api.get('/tasks/');
export const createTask = (data) => api.post('/tasks/', data);
export const assignTask = (taskId, data) => api.put(`/tasks/assign/${taskId}`, data);
export const completeTask = (taskId) => api.put(`/tasks/complete/${taskId}`);

// Applications endpoints
export const applyForTask = (data) => api.post('/applications/', data);
export const getTaskApplications = (taskId) => api.get(`/applications/task/${taskId}`);

// Chat endpoints
export const sendMessage = (data) => api.post('/chat/', data);
export const getTaskMessages = (taskId) => api.get(`/chat/${taskId}`);

export default api;
