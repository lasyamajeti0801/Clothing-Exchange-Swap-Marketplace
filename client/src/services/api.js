import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rewear_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthenticated on a protected action, clear stored token
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        // Optional auto-logout on token expiration
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getUserProfile: (id) => api.get(`/auth/users/${id}`),
};

// Clothes endpoints
export const clothesApi = {
  getClothes: (params) => api.get('/clothes', { params }),
  getClothingById: (id) => api.get(`/clothes/${id}`),
  createClothing: (formData) =>
    api.post('/clothes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateClothing: (id, data) => api.put(`/clothes/${id}`, data),
  deleteClothing: (id) => api.delete(`/clothes/${id}`),
};

// Swaps endpoints
export const swapsApi = {
  createSwap: (data) => api.post('/swaps', data),
  getUserSwaps: (tab) => api.get('/swaps', { params: { tab } }),
  getSwapById: (id) => api.get(`/swaps/${id}`),
  updateStatus: (id, data) => api.put(`/swaps/${id}/status`, data),
  counterOffer: (id, data) => api.post(`/swaps/${id}/counter-offer`, data),
  markReady: (id) => api.post(`/swaps/${id}/ready`),
};

// Chat endpoints
export const chatApi = {
  getMessages: (swapId) => api.get(`/chat/${swapId}/messages`),
  sendMessage: (swapId, data) => api.post(`/chat/${swapId}/messages`, data),
};

// Saved / Wishlist endpoints
export const savedApi = {
  getSaved: () => api.get('/saved'),
  saveItem: (clothingId) => api.post(`/saved/${clothingId}`),
  removeSaved: (clothingId) => api.delete(`/saved/${clothingId}`),
};

// Notifications endpoints
export const notificationsApi = {
  getNotifications: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// Reviews endpoints
export const reviewsApi = {
  createReview: (data) => api.post('/reviews', data),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
};

// Reports endpoints
export const reportsApi = {
  createReport: (data) => api.post('/reports', data),
};

// Admin endpoints
export const adminApi = {
  getStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  getListings: (params) => api.get('/admin/listings', { params }),
  moderateListing: (id, data) => api.put(`/admin/listings/${id}/status`, data),
  resolveReport: (id, data) => api.put(`/admin/reports/${id}/resolve`, data),
};

// Valuation endpoints
export const valuationApi = {
  estimate: (data) => api.post('/valuation/estimate', data),
  compare: (data) => api.post('/valuation/compare', data),
};

export default api;
