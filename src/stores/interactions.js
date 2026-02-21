import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../api/index.js';
import { useAuthStore } from './auth.js';

export const useInteractionStore = defineStore('interactions', () => {
  const authStore = useAuthStore();
  const favorited = ref(new Set()); // Set des IDs favorisés
  const productCounts = ref({}); // Compte des interactions par produit
  const loading = ref(false);

  // Computed: vérifier si un produit est en favori
  const isFavorited = (productId) => favorited.value.has(productId);

  // Computed: obtenir les comptes d'un produit
  const getProductCounts = (productId) => {
    return productCounts.value[productId] || {
      views: 0,
      favorites: 0,
      shares: 0,
      contacts: 0
    };
  };

  /**
   * Enregistrer une vue (public)
   */
  async function recordView(productId) {
    try {
      await apiClient.post('/public-record-view', {
        product_id: productId
      });
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la vue:', err);
    }
  }

  /**
   * Enregistrer une interaction (authentifiée)
   */
  async function recordInteraction(productId, interactionType, metadata = {}) {
    if (!authStore.isAuthenticated) {
      console.warn('L\'utilisateur n\'est pas authentifié');
      return;
    }

    try {
      const response = await apiClient.post('/interactions', {
        content_id: productId,
        content_type: 'produit',
        type: interactionType,
        metadata
      });

      // Mettre à jour les comptes si disponible
      if (response.data.data && response.data.data.counts) {
        productCounts.value[productId] = response.data.data.counts;
      }

      return response.data;
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'interaction:', err);
      throw err;
    }
  }

  /**
   * Ajouter/retirer un produit des favoris
   */
  async function toggleFavorite(productId) {
    if (!authStore.isAuthenticated) {
      console.warn('Vous devez vous connecter pour ajouter en favori');
      return false;
    }

    try {
      loading.value = true;
      const response = await apiClient.post(`/produits/${productId}/favorite`);

      if (response.data.success) {
        // Basculer l'état local
        if (favorited.value.has(productId)) {
          favorited.value.delete(productId);
        } else {
          favorited.value.add(productId);
        }

        // Mettre à jour les comptes si disponible
        if (response.data.data && response.data.data.counts) {
          productCounts.value[productId] = response.data.data.counts;
        }

        return response.data;
      }
    } catch (err) {
      console.error('Erreur lors du basculement du favori:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Partager un produit
   */
  async function shareProduct(productId, shareData = {}) {
    try {
      // Enregistrer le partage comme interaction
      const response = await recordInteraction(productId, 'partage', {
        ...shareData,
        shared_at: new Date().toISOString()
      });

      // Copier le lien dans le presse-papiers si l'API native le supporte
      const productUrl = `${window.location.origin}/produit/${productId}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(productUrl);
      }

      return response;
    } catch (err) {
      console.error('Erreur lors du partage:', err);
      throw err;
    }
  }

  /**
   * Enregistrer un clic
   */
  async function recordClick(productId) {
    try {
      if (authStore.isAuthenticated) {
        await recordInteraction(productId, 'clic');
      } else {
        // Enregistrement public du clic
        await recordView(productId);
      }
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du clic:', err);
    }
  }

  /**
   * Enregistrer un contact (message)
   */
  async function recordContact(productId) {
    if (!authStore.isAuthenticated) {
      console.warn('Vous devez vous connecter pour contacter');
      return false;
    }

    try {
      const response = await recordInteraction(productId, 'contact');
      return response;
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du contact:', err);
      throw err;
    }
  }

  /**
   * Récupérer les comptes d'un produit
   */
  async function fetchProductCounts(productId) {
    try {
      if (!authStore.isAuthenticated) return;

      const response = await apiClient.get(`/produits/${productId}/counts`);
      
      if (response.data.success) {
        productCounts.value[productId] = response.data.data;
      }

      return response.data;
    } catch (err) {
      console.error('Erreur lors de la récupération des comptes:', err);
    }
  }

  /**
   * Charger les favoris de l'utilisateur
   */
  async function loadUserFavorites() {
    if (!authStore.isAuthenticated) return;

    try {
      const response = await apiClient.get('/favorites');

      if (response.data.success && response.data.data.products) {
        // Remplir le Set des favoris
        response.data.data.products.forEach(product => {
          favorited.value.add(product.id);
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des favoris:', err);
    }
  }

  /**
   * Réinitialiser les interactions (déconnexion)
   */
  function reset() {
    favorited.value.clear();
    productCounts.value = {};
  }

  return {
    favorited,
    productCounts,
    loading,
    isFavorited,
    getProductCounts,
    recordView,
    recordInteraction,
    recordClick,
    recordContact,
    toggleFavorite,
    shareProduct,
    fetchProductCounts,
    loadUserFavorites,
    reset
  };
});
