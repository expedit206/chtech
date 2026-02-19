
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    id: 1, 
    nom: 'Test User',
    parrain_id: null,
  });

  return { user };
});
