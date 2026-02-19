
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBadgeStore = defineStore('badge', () => {
  const badgeCounts = ref({ messages: 0 });
  const fetchBadgeCounts = async () => {};
  const markAsRead = async () => {};
  const incrementLocalCount = () => { badgeCounts.value.messages++; };
  const decrementLocalCount = () => { if(badgeCounts.value.messages > 0) badgeCounts.value.messages--; };
  const syncWithBackend = async () => {};

  return {
      badgeCounts,
      fetchBadgeCounts,
      markAsRead,
      incrementLocalCount,
      decrementLocalCount,
      syncWithBackend
  };
});
