import axios from 'axios';
import { clientStore } from './clientStore';

const api = axios.create({
  baseURL: '/api',
  timeout: 4000
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

export const authAPI = {
  register: async (data) => {
    try {
      return await api.post('/auth/register', data);
    } catch {
      return { data: clientStore.register(data) };
    }
  },
  login: async (data) => {
    try {
      return await api.post('/auth/login', data);
    } catch {
      return { data: clientStore.login(data.credential) };
    }
  },
  getMe: async () => {
    try {
      return await api.get('/auth/me');
    } catch {
      const u = clientStore.getCurrentUser();
      return { data: { success: !!u, user: u } };
    }
  },
  updateProfile: async (data) => {
    try {
      return await api.put('/auth/profile', data);
    } catch {
      const u = clientStore.getCurrentUser();
      if (u) {
        Object.assign(u, data);
        clientStore.setCurrentUser(u);
      }
      return { data: { success: true, user: u } };
    }
  }
};

export const videoAPI = {
  getAll: async (params = {}) => {
    try {
      return await api.get('/videos', { params });
    } catch {
      let videos = clientStore.getVideos();
      if (params.category && params.category !== 'All') {
        videos = videos.filter(v => v.category === params.category);
      }
      return { data: { success: true, count: videos.length, videos } };
    }
  },
  getById: async (id) => {
    try {
      return await api.get(`/videos/${id}`);
    } catch {
      const res = clientStore.getVideoById(id);
      return { data: { success: !!res, ...res } };
    }
  },
  create: async (formData) => {
    try {
      return await api.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch {
      // Extract form data fields
      const title = formData.get('title');
      const description = formData.get('description');
      const category = formData.get('category');
      const tags = formData.get('tags');
      const duration = formData.get('duration');
      const res = clientStore.createVideo({ title, description, category, tags, duration });
      return { data: res };
    }
  },
  createWithUrls: async (data) => {
    try {
      return await api.post('/videos', data);
    } catch {
      return { data: clientStore.createVideo(data) };
    }
  },
  recordView: async (id) => {
    try {
      return await api.post(`/videos/${id}/view`);
    } catch {
      clientStore.recordView(id);
      return { data: { success: true } };
    }
  },
  toggleLike: async (id) => {
    try {
      return await api.post(`/videos/${id}/like`);
    } catch {
      return { data: clientStore.toggleLike(id) };
    }
  },
  toggleDislike: async (id) => {
    try {
      return await api.post(`/videos/${id}/dislike`);
    } catch {
      return { data: clientStore.toggleDislike(id) };
    }
  },
  recordShare: async (id) => {
    try {
      return await api.post(`/videos/${id}/share`);
    } catch {
      return { data: { success: true } };
    }
  },
  search: async (params = {}) => {
    try {
      return await api.get('/videos/search', { params });
    } catch {
      const q = (params.q || '').toLowerCase();
      const all = clientStore.getVideos();
      const matched = all.filter(v => {
        return (v.title || '').toLowerCase().includes(q) ||
               (v.description || '').toLowerCase().includes(q) ||
               (v.channel?.name || '').toLowerCase().includes(q) ||
               (v.tags || []).some(t => t.toLowerCase().includes(q));
      });
      return { data: { success: true, count: matched.length, videos: matched } };
    }
  },
  getSubscriptionsFeed: async () => {
    try {
      return await api.get('/videos/subscriptions');
    } catch {
      const all = clientStore.getVideos();
      return { data: { success: true, count: all.length, videos: all } };
    }
  },
  getLiked: async () => {
    try {
      return await api.get('/videos/liked');
    } catch {
      const liked = JSON.parse(localStorage.getItem('yt_liked')) || [];
      return { data: { success: true, count: liked.length, videos: liked } };
    }
  },
  getHistory: async () => {
    try {
      return await api.get('/videos/history');
    } catch {
      const history = JSON.parse(localStorage.getItem('yt_history')) || [];
      return { data: { success: true, count: history.length, videos: history } };
    }
  },
  clearHistory: async () => {
    try {
      return await api.delete('/videos/history');
    } catch {
      localStorage.setItem('yt_history', JSON.stringify([]));
      return { data: { success: true } };
    }
  },
  deleteVideo: async (id) => {
    try {
      return await api.delete(`/videos/${id}`);
    } catch {
      const videos = clientStore.getVideos().filter(v => String(v._id) !== String(id));
      clientStore.saveVideos(videos);
      return { data: { success: true } };
    }
  }
};

export const commentAPI = {
  getByVideo: async (videoId) => {
    try {
      return await api.get(`/comments/${videoId}`);
    } catch {
      const comments = clientStore.getComments(videoId);
      return { data: { success: true, count: comments.length, comments } };
    }
  },
  add: async (videoId, text) => {
    try {
      return await api.post(`/comments/${videoId}`, { text });
    } catch {
      return { data: clientStore.addComment(videoId, text) };
    }
  },
  toggleLike: async (commentId) => {
    try {
      return await api.post(`/comments/like/${commentId}`);
    } catch {
      return { data: { success: true, isLiked: true } };
    }
  },
  delete: async (commentId) => {
    try {
      return await api.delete(`/comments/${commentId}`);
    } catch {
      return { data: { success: true } };
    }
  }
};

export const userAPI = {
  getChannel: async (usernameOrId) => {
    try {
      return await api.get(`/users/channel/${usernameOrId}`);
    } catch {
      const users = JSON.parse(localStorage.getItem('yt_users')) || [];
      const lower = (usernameOrId || '').toLowerCase();
      const channel = users.find(u => u.username?.toLowerCase() === lower || u._id === usernameOrId) || users[0];
      const videos = clientStore.getVideos().filter(v => v.channel?._id === channel._id || v.channel?.username === channel.username);
      return {
        data: {
          success: true,
          channel,
          videos,
          isSubscribed: false
        }
      };
    }
  },
  toggleSubscribe: async (channelId) => {
    try {
      return await api.post(`/users/subscribe/${channelId}`);
    } catch {
      return { data: clientStore.toggleSubscribe(channelId) };
    }
  },
  getSubscriptions: async () => {
    try {
      return await api.get('/users/subscriptions/list');
    } catch {
      const users = JSON.parse(localStorage.getItem('yt_users')) || [];
      return { data: { success: true, channels: users.slice(0, 3) } };
    }
  }
};

export const recommendationAPI = {
  getRecommendations: async (params = {}) => {
    try {
      return await api.get('/recommendations', { params });
    } catch {
      const recs = clientStore.getRecommendations(params.currentVideoId);
      return { data: { success: true, count: recs.length, videos: recs } };
    }
  }
};

export default api;
