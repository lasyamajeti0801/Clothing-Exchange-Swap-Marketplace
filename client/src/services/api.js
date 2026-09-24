import axios from 'axios';
import { MOCK_CLOTHES, MOCK_USERS } from './mockData.js';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
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

// Fallback helper for static environments (e.g., GitHub Pages)
const fallbackResponse = (data) => ({
  data: {
    success: true,
    data,
  },
});

// Auth endpoints with graceful offline/static demo fallback
export const authApi = {
  login: async (credentials) => {
    try {
      return await api.post('/auth/login', credentials);
    } catch (err) {
      const match = MOCK_USERS.find((u) => u.email === credentials.email) || MOCK_USERS[0];
      return fallbackResponse({ user: match, token: 'mock-demo-jwt-token' });
    }
  },
  register: async (data) => {
    try {
      return await api.post('/auth/register', data);
    } catch (err) {
      const newUser = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'USER',
        city: data.city || 'Hyderabad',
        state: data.state || 'Telangana',
        rating: 5.0,
        swapCount: 0,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      };
      return fallbackResponse({ user: newUser, token: 'mock-demo-jwt-token' });
    }
  },
  getMe: async () => {
    try {
      return await api.get('/auth/me');
    } catch (err) {
      return fallbackResponse({ user: MOCK_USERS[0] });
    }
  },
  updateProfile: async (data) => {
    try {
      return await api.put('/auth/profile', data);
    } catch (err) {
      return fallbackResponse({ user: { ...MOCK_USERS[0], ...data } });
    }
  },
  getUserProfile: async (id) => {
    try {
      return await api.get(`/auth/users/${id}`);
    } catch (err) {
      const user = MOCK_USERS.find((u) => u.id === id) || MOCK_USERS[0];
      const listings = MOCK_CLOTHES.filter((c) => c.ownerId === user.id);
      return fallbackResponse({
        profile: {
          ...user,
          listings,
          reviewsReceived: [
            {
              id: 'rev-1',
              rating: 5,
              comment: 'Smooth and pleasant swap handover! Item exactly as described.',
              reviewer: MOCK_USERS[1],
              createdAt: new Date().toISOString(),
            },
          ],
        },
      });
    }
  },
};

// Clothes endpoints with rich static data
export const clothesApi = {
  getClothes: async (params = {}) => {
    try {
      return await api.get('/clothes', { params });
    } catch (err) {
      let filtered = [...MOCK_CLOTHES];
      if (params.category && params.category !== 'All') {
        filtered = filtered.filter((i) => i.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.city && params.city !== 'All') {
        filtered = filtered.filter((i) => i.city.toLowerCase() === params.city.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.brand.toLowerCase().includes(q) ||
            i.category.toLowerCase().includes(q)
        );
      }
      return fallbackResponse({
        items: filtered,
        pagination: {
          total: filtered.length,
          page: params.page || 1,
          limit: params.limit || 12,
          totalPages: 1,
        },
      });
    }
  },
  getClothingById: async (id) => {
    try {
      return await api.get(`/clothes/${id}`);
    } catch (err) {
      const item = MOCK_CLOTHES.find((i) => i.id === id) || MOCK_CLOTHES[0];
      const recs = MOCK_CLOTHES.filter((i) => i.id !== item.id).slice(0, 4);
      return fallbackResponse({
        item,
        isSaved: false,
        recommendations: recs,
      });
    }
  },
  createClothing: async (formData) => {
    try {
      return await api.post('/clothes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      const newItem = {
        id: `item-${Date.now()}`,
        title: formData.get ? formData.get('title') : 'New Garment',
        brand: formData.get ? formData.get('brand') : 'Custom',
        category: formData.get ? formData.get('category') : 'Jackets',
        size: 'M',
        condition: 'LIKE_NEW',
        estimatedValue: 1500,
        images: [{ url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600' }],
        owner: MOCK_USERS[0],
      };
      return fallbackResponse({ item: newItem });
    }
  },
  updateClothing: (id, data) => api.put(`/clothes/${id}`, data),
  deleteClothing: (id) => api.delete(`/clothes/${id}`),
};

// Swaps endpoints
export const swapsApi = {
  createSwap: async (data) => {
    try {
      return await api.post('/swaps', data);
    } catch (err) {
      const newSwap = {
        id: `swap-${Date.now()}`,
        senderId: 'user-priya',
        receiverId: 'user-rahul',
        offeredItem: MOCK_CLOTHES[0],
        requestedItem: MOCK_CLOTHES[2],
        status: 'PENDING',
        message: data.message || 'Swap proposal submitted',
        exchangeMethod: data.exchangeMethod || 'LOCAL_MEETUP',
        sender: MOCK_USERS[0],
        receiver: MOCK_USERS[1],
        createdAt: new Date().toISOString(),
      };
      return fallbackResponse({ swap: newSwap });
    }
  },
  getUserSwaps: async (tab = 'all') => {
    try {
      return await api.get('/swaps', { params: { tab } });
    } catch (err) {
      const mockSwaps = [
        {
          id: 'swap-demo-1',
          senderId: 'user-rahul',
          receiverId: 'user-priya',
          offeredItem: MOCK_CLOTHES[2],
          requestedItem: MOCK_CLOTHES[0],
          status: 'NEGOTIATING',
          message: "Hey Priya! Would love to swap my H&M heavy hoodie for your Levi's denim trucker jacket.",
          exchangeMethod: 'LOCAL_MEETUP',
          sender: MOCK_USERS[1],
          receiver: MOCK_USERS[0],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'swap-demo-2',
          senderId: 'user-priya',
          receiverId: 'user-ananya',
          offeredItem: MOCK_CLOTHES[1],
          requestedItem: MOCK_CLOTHES[3],
          status: 'COMPLETED',
          message: 'Loved trading this Chanderi kurta for the Mangalagiri handloom saree!',
          exchangeMethod: 'LOCAL_MEETUP',
          sender: MOCK_USERS[0],
          receiver: MOCK_USERS[2],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      return fallbackResponse({ swaps: mockSwaps });
    }
  },
  getSwapById: async (id) => {
    try {
      return await api.get(`/swaps/${id}`);
    } catch (err) {
      const swap = {
        id,
        senderId: 'user-rahul',
        receiverId: 'user-priya',
        offeredItem: MOCK_CLOTHES[2],
        requestedItem: MOCK_CLOTHES[0],
        status: 'NEGOTIATING',
        message: "Hey Priya! Would love to swap my H&M heavy hoodie for your Levi's trucker jacket.",
        exchangeMethod: 'LOCAL_MEETUP',
        sender: MOCK_USERS[1],
        receiver: MOCK_USERS[0],
        messages: [
          {
            id: 'm1',
            senderId: 'user-rahul',
            sender: MOCK_USERS[1],
            content: "Hey Priya! Would love to swap my H&M heavy hoodie for your Levi's trucker jacket.",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'm2',
            senderId: 'user-priya',
            sender: MOCK_USERS[0],
            content: "Hi Rahul! Your hoodie looks super cozy and in great condition. Available to meet near Inorbit Mall this weekend?",
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
      };
      return fallbackResponse({
        swap,
        comparison: {
          offeredValue: 1350,
          requestedValue: 2400,
          difference: 1050,
          percentageDifference: 44,
          fairnessCategory: 'Moderate Difference',
        },
      });
    }
  },
  updateStatus: async (id, data) => {
    try {
      return await api.put(`/swaps/${id}/status`, data);
    } catch (err) {
      return fallbackResponse({ swap: { id, status: data.status } });
    }
  },
  counterOffer: async (id, data) => {
    try {
      return await api.post(`/swaps/${id}/counter-offer`, data);
    } catch (err) {
      return fallbackResponse({ swap: { id, status: 'NEGOTIATING' } });
    }
  },
  markReady: async (id) => {
    try {
      return await api.post(`/swaps/${id}/ready`);
    } catch (err) {
      return fallbackResponse({ isCompleted: true });
    }
  },
};

// Chat endpoints
export const chatApi = {
  getMessages: async (swapId) => {
    try {
      return await api.get(`/chat/${swapId}/messages`);
    } catch (err) {
      return fallbackResponse({
        messages: [
          {
            id: 'msg-1',
            senderId: 'user-rahul',
            sender: MOCK_USERS[1],
            content: "Hey Priya! Would love to swap my hoodie for your Levi's jacket.",
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }
  },
  sendMessage: async (swapId, data) => {
    try {
      return await api.post(`/chat/${swapId}/messages`, data);
    } catch (err) {
      return fallbackResponse({
        message: {
          id: `msg-${Date.now()}`,
          senderId: 'user-priya',
          sender: MOCK_USERS[0],
          content: data.content,
          createdAt: new Date().toISOString(),
        },
      });
    }
  },
};

// Saved / Wishlist endpoints
export const savedApi = {
  getSaved: async () => {
    try {
      return await api.get('/saved');
    } catch (err) {
      return fallbackResponse({ items: [MOCK_CLOTHES[1], MOCK_CLOTHES[3]] });
    }
  },
  saveItem: async (clothingId) => {
    try {
      return await api.post(`/saved/${clothingId}`);
    } catch (err) {
      return fallbackResponse({ saved: true });
    }
  },
  removeSaved: async (clothingId) => {
    try {
      return await api.delete(`/saved/${clothingId}`);
    } catch (err) {
      return fallbackResponse({ removed: true });
    }
  },
};

// Notifications endpoints
export const notificationsApi = {
  getNotifications: async () => {
    try {
      return await api.get('/notifications');
    } catch (err) {
      return fallbackResponse({
        notifications: [
          {
            id: 'n1',
            title: 'New Swap Proposal! 👕⇄👕',
            message: 'Rahul Verma wants to swap their hoodie for your denim jacket.',
            link: '/swaps?tab=incoming',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
        unreadCount: 1,
      });
    }
  },
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// Reviews endpoints
export const reviewsApi = {
  createReview: async (data) => {
    try {
      return await api.post('/reviews', data);
    } catch (err) {
      return fallbackResponse({ review: { id: `rev-${Date.now()}`, ...data } });
    }
  },
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
};

// Reports endpoints
export const reportsApi = {
  createReport: async (data) => {
    try {
      return await api.post('/reports', data);
    } catch (err) {
      return fallbackResponse({ report: { id: `rep-${Date.now()}` } });
    }
  },
};

// Admin endpoints
export const adminApi = {
  getStats: async () => {
    try {
      return await api.get('/admin/dashboard');
    } catch (err) {
      return fallbackResponse({
        stats: {
          totalUsers: 21,
          totalListings: 52,
          activeListings: 48,
          totalSwaps: 32,
          completedSwaps: 14,
          pendingSwaps: 8,
          openReports: 2,
          itemsReused: 28,
          estimatedWaterSavedLiters: 75600,
          estimatedCO2SavedKg: 70,
        },
        categoryStats: [
          { name: 'Jackets', count: 12 },
          { name: 'Kurtas', count: 9 },
          { name: 'Sarees', count: 7 },
          { name: 'Hoodies', count: 8 },
          { name: 'Jeans', count: 6 },
          { name: 'Dresses', count: 5 },
        ],
      });
    }
  },
  getUsers: async () => {
    try {
      return await api.get('/admin/users');
    } catch (err) {
      return fallbackResponse({ users: MOCK_USERS });
    }
  },
  toggleUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  getListings: async () => {
    try {
      return await api.get('/admin/listings');
    } catch (err) {
      return fallbackResponse({ listings: MOCK_CLOTHES });
    }
  },
  moderateListing: (id, data) => api.put(`/admin/listings/${id}/status`, data),
  resolveReport: (id, data) => api.put(`/admin/reports/${id}/resolve`, data),
};

// Valuation endpoints
export const valuationApi = {
  estimate: async (data) => {
    try {
      return await api.post('/valuation/estimate', data);
    } catch (err) {
      const baseValues = { Jackets: 2200, Kurtas: 1100, Sarees: 2500, Hoodies: 1400, Jeans: 1500 };
      const base = baseValues[data.category] || 1200;
      const estimatedValue = Math.round(base / 50) * 50;
      return fallbackResponse({
        estimatedValue,
        suggestedRange: {
          min: Math.round((estimatedValue * 0.88) / 50) * 50,
          max: Math.round((estimatedValue * 1.12) / 50) * 50,
        },
        disclaimer: 'This estimated swap value is an algorithmic recommendation to facilitate fair negotiations.',
      });
    }
  },
  compare: async (data) => {
    try {
      return await api.post('/valuation/compare', data);
    } catch (err) {
      const valA = data.offeredItem?.estimatedValue || 1200;
      const valB = data.requestedItem?.estimatedValue || 1400;
      const diff = Math.abs(valA - valB);
      return fallbackResponse({
        offeredValue: valA,
        requestedValue: valB,
        difference: diff,
        percentageDifference: Math.round((diff / Math.max(valA, valB)) * 100),
        fairnessCategory: 'Close Match',
      });
    }
  },
};

export default api;
