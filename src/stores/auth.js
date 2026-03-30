import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../api/index.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('auth_user')) || null);
  const token = ref(localStorage.getItem('auth_token') || null);

  const isAuthenticated = computed(() => {
    return !!token.value;
  });

  const isAdmin = computed(() => user.value?.role === 'admin');
  const isVendeur = computed(() => user.value?.role === 'vendeur');
  const isNormalUser = computed(() => user.value?.role === 'user');

  const setUser = (userData) => {
    user.value = userData;
    if (userData) {
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('auth_user');
    }
  };

  const setToken = (authToken) => {
    token.value = authToken;
    if (authToken) {
      localStorage.setItem('auth_token', authToken);
    } else {
      localStorage.removeItem('auth_token');
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      user.value = null;
      token.value = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  return { 
    user, 
    token, 
    isAuthenticated,
    isAdmin,
    isVendeur,
    isNormalUser,
    setUser,
    setToken,
    login,
    register,
    logout
  };
});
