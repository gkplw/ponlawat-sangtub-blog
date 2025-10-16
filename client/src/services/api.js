import axios from "axios";
import jwtInterceptor from "../utils/jwtInterceptor";

// Initialize JWT interceptor
jwtInterceptor();

// Base API URL - resolves for both development and production
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? window.location.origin : "http://localhost:4000");

// Posts API
export const postsAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.category) queryParams.append("category", params.category);
    if (params.status) queryParams.append("status", params.status);
    
    const url = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return axios.get(`${API_BASE_URL}${url}`);
  },

  getById: async (id) => {
    return axios.get(`${API_BASE_URL}/posts/${id}`);
  },

  create: async (formData) => {
    return axios.post(`${API_BASE_URL}/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: async (id, formData) => {
    return axios.put(`${API_BASE_URL}/posts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: async (id) => {
    return axios.delete(`${API_BASE_URL}/posts/${id}`);
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return axios.get(`${API_BASE_URL}/categories`);
  },

  getById: async (id) => {
    return axios.get(`${API_BASE_URL}/categories/${id}`);
  },

  create: async (data) => {
    return axios.post(`${API_BASE_URL}/categories`, data);
  },

  update: async (id, data) => {
    return axios.put(`${API_BASE_URL}/categories/${id}`, data);
  },

  delete: async (id) => {
    return axios.delete(`${API_BASE_URL}/categories/${id}`);
  },
};

// Comments API
export const commentsAPI = {
  getByPostId: async (postId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    
    const url = `/comments/post/${postId}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return axios.get(`${API_BASE_URL}${url}`);
  },

  create: async (data) => {
    return axios.post(`${API_BASE_URL}/comments`, data);
  },

  update: async (id, data) => {
    return axios.put(`${API_BASE_URL}/comments/${id}`, data);
  },

  delete: async (id) => {
    return axios.delete(`${API_BASE_URL}/comments/${id}`);
  },
};

// Likes API
export const likesAPI = {
  toggle: async (postId) => {
    return axios.post(`${API_BASE_URL}/likes/toggle`, { post_id: postId });
  },

  checkUserLike: async (postId) => {
    return axios.get(`${API_BASE_URL}/likes/check/${postId}`);
  },

  getUserLikes: async () => {
    return axios.get(`${API_BASE_URL}/likes/user`);
  },
};

// Statuses API
export const statusesAPI = {
  getAll: async () => {
    return axios.get(`${API_BASE_URL}/statuses`);
  },

  getById: async (id) => {
    return axios.get(`${API_BASE_URL}/statuses/${id}`);
  },
};

// Auth API
export const authAPI = {
  register: async (data) => {
    return axios.post(`${API_BASE_URL}/auth/register`, data);
  },

  login: async (data) => {
    return axios.post(`${API_BASE_URL}/auth/login`, data);
  },

  loginAdmin: async (data) => {
    return axios.post(`${API_BASE_URL}/auth/login-admin`, data);
  },

  getUser: async () => {
    return axios.get(`${API_BASE_URL}/auth/user`);
  },

  updateProfile: async (data) => {
    return axios.put(`${API_BASE_URL}/auth/user/profile`, data);
  },

  getAdmin: async () => {
    return axios.get(`${API_BASE_URL}/auth/admin`);
  },

  logout: async () => {
    return axios.post(`${API_BASE_URL}/auth/logout`);
  },

  logoutAdmin: async () => {
    return axios.post(`${API_BASE_URL}/auth/logout-admin`);
  },

  resetPassword: async (data) => {
    return axios.put(`${API_BASE_URL}/auth/reset-password`, data);
  },

  resetPasswordAdmin: async (data) => {
    return axios.put(`${API_BASE_URL}/auth/reset-password-admin`, data);
  },
};

