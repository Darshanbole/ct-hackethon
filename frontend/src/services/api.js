import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (userData) => {
    // For this demo, we'll auto-register with wallet connection
    const response = await api.post('/users/register', {
      wallet_address: userData.wallet_address || 'demo_wallet',
      username: userData.username,
      email: userData.email
    });
    const user = {
      id: response.data.user_id,
      email: userData.email,
      username: userData.username,
      wallet_address: userData.wallet_address || 'demo_wallet'
    };
    localStorage.setItem('user', JSON.stringify(user));
    return { user };
  },

  login: async (credentials) => {
    try {
      // Use the new authentication endpoint with your credentials
      const response = await api.post('/user/authenticate', {
        email: credentials.email,
        password: credentials.password,
        wallet_address: 'demo_wallet_' + Date.now()
      });
      
      if (response.data && response.data.success) {
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return { user };
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Network error - Please check if the backend is running');
      }
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};

// Posts API
export const postsAPI = {
  getPosts: async (page = 1, perPage = 10) => {
    const response = await api.get(`/posts?page=${page}&per_page=${perPage}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  interactWithPost: async (postId, interactionType) => {
    const response = await api.post(`/posts/${postId}/interact`, {
      type: interactionType
    });
    return response.data;
  }
};

// Social Media API
export const socialAPI = {
  getConnectedAccounts: async () => {
    const response = await api.get('/social/accounts');
    return response.data;
  },

  connectAccount: async (platform, accessToken, platformData = {}) => {
    const response = await api.post(`/social/connect/${platform}`, {
      access_token: accessToken,
      ...platformData
    });
    return response.data;
  },

  crossPost: async (content, platforms) => {
    const response = await api.post('/social/post', {
      content,
      platforms
    });
    return response.data;
  }
};

// User Profile API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;