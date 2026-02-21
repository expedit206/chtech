import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('auth_token') || null);

  const isAuthenticated = computed(() => {
    return token.value && user.value && user.value.id;
  });

  const setUser = (userData) => {
    user.value = userData;
  };

  const setToken = (authToken) => {
    token.value = authToken;
    if (authToken) {
      localStorage.setItem('auth_token', authToken);
    } else {
      localStorage.removeItem('auth_token');
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
  };

  return { 
    user, 
    token, 
    isAuthenticated,
    setUser,
    setToken,
    logout
  };
});
