import { defineStore } from 'pinia';
import apiClient from '../api/index';

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0
    }
  }),

  actions: {
    async fetchNotifications(page = 1) {
      this.loading = true;
      try {
        const { data } = await apiClient.get(`/notifications?page=${page}`);
        if (page === 1) {
          this.notifications = data.notifications.data;
        } else {
          this.notifications = [...this.notifications, ...data.notifications.data];
        }
        this.unreadCount = data.unread_count;
        this.pagination = {
          current_page: data.notifications.current_page,
          last_page: data.notifications.last_page,
          total: data.notifications.total
        };
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(notificationId) {
      try {
        await apiClient.put(`/notifications/${notificationId}/read`);
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read_at) {
          notification.read_at = new Date().toISOString();
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      } catch (error) {
        console.error('Erreur lors du marquage de la notification:', error);
      }
    },

    async markAllAsRead() {
      try {
        await apiClient.put('/notifications/mark-all-as-read');
        this.notifications.forEach(n => {
          if (!n.read_at) n.read_at = new Date().toISOString();
        });
        this.unreadCount = 0;
      } catch (error) {
        console.error('Erreur lors du marquage de toutes les notifications:', error);
      }
    },

    async deleteNotification(notificationId) {
      try {
        await apiClient.delete(`/notifications/${notificationId}`);
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        // On pourrait rafraîchir le compte si on ne sait pas si elle était lue
      } catch (error) {
        console.error('Erreur lors de la suppression de la notification:', error);
      }
    }
  }
});
