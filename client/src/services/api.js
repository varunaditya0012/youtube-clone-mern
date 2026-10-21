import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear invalid token
      if (localStorage.getItem('token')) {
        console.warn('Authentication token expired or invalid');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const videoAPI = {
  getAll: (params) => api.get('/videos', { params }),
  getById: (id) => api.get(`/videos/${id}`),
  create: (formData) => api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createWithUrls: (data) => api.post('/videos', data),
  recordView: (id) => api.post(`/videos/${id}/view`),
  toggleLike: (id) => api.post(`/videos/${id}/like`),
  toggleDislike: (id) => api.post(`/videos/${id}/dislike`),
  recordShare: (id) => api.post(`/videos/${id}/share`),
  search: (params) => api.get('/videos/search', { params }),
  getSubscriptionsFeed: () => api.get('/videos/subscriptions'),
  getLiked: () => api.get('/videos/liked'),
  getHistory: () => api.get('/videos/history'),
  clearHistory: () => api.delete('/videos/history'),
  deleteVideo: (id) => api.delete(`/videos/${id}`)
};

export const commentAPI = {
  getByVideo: (videoId) => api.get(`/comments/${videoId}`),
  add: (videoId, text) => api.post(`/comments/${videoId}`, { text }),
  toggleLike: (commentId) => api.post(`/comments/like/${commentId}`),
  delete: (commentId) => api.delete(`/comments/${commentId}`)
};

export const userAPI = {
  getChannel: (usernameOrId) => api.get(`/users/channel/${usernameOrId}`),
  toggleSubscribe: (channelId) => api.post(`/users/subscribe/${channelId}`),
  getSubscriptions: () => api.get('/users/subscriptions/list')
};

export const recommendationAPI = {
  getRecommendations: (params) => api.get('/recommendations', { params })
};

export default api;
