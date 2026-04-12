import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../api/index.js';
import { useAuthStore } from './auth.js';
import { useFlash } from '../composables/useFlash.js';

export const useInteractionStore = defineStore('interactions', () => {
  const authStore = useAuthStore();
  const flash = useFlash();
  const favorited = ref(new Set()); // Set des IDs favorisés
  const favorites = ref([]); // Liste complète des objets produits favoris
  const productCounts = ref({}); // Compte des interactions par produit
  const loading = ref(false);

  // Computed: vérifier si un produit est en favori
  const isFavorited = (productId) => favorited.value.has(productId);

  // Computed: obtenir les comptes d'un produit
  const getProductCounts = (productId) => {
    // 1. Chercher dans les comptes d'interactions chargés explicitement
    if (productCounts.value[productId]) {
      return productCounts.value[productId];
    }

    // 2. Tenter de récupérer les données depuis le product store s'il existe
    // (fallback sur les données injectées lors du fetch global des produits)
    // Note: On suppose que les produits sont chargés dans productsWithImages
    return {
      clics_count: 0,
      favorites_count: 0,
      partages_count: 0,
      contacts_count: 0,
    };
  };

  /**
   * Enregistrer une interaction (authentifiée)
   */
  async function recordInteraction(productId, interactionType, metadata = {}) {
    if (!authStore.isAuthenticated) {
      // Pas de flash d'erreur ici pour pas spammer (vues etc) -> dépend du type.
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
      flash.warning("Vous devez vous connecter pour ajouter en favori");
      return false;
    }

    // Sauvegarde de l'état précédent pour rollback en cas d'erreur
    const wasFavorited = favorited.value.has(productId);
    const previousCounts = { ...(productCounts.value[productId] || {
      clics_count: 0,
      favorites_count: 0,
      partages_count: 0,
      contacts_count: 0
    }) };

    // Mise à jour optimiste (IMMÉDIATE)
    if (wasFavorited) {
      favorited.value.delete(productId);
      // Supprimer aussi de la liste des objets si elle existe
      favorites.value = favorites.value.filter((p) => p.id !== productId);

      if (productCounts.value[productId]) {
        productCounts.value[productId].favorites_count = Math.max(
          0,
          (productCounts.value[productId].favorites_count || 0) - 1,
        );
      }
    } else {
      favorited.value.add(productId);
      if (!productCounts.value[productId]) {
        productCounts.value[productId] = { ...previousCounts };
      }
      productCounts.value[productId].favorites_count =
        (productCounts.value[productId].favorites_count || 0) + 1;
    }

    try {
      const response = await apiClient.post(`/produits/${productId}/favorite`);
      
      if (response.data.success) {
        if (response.data.data && response.data.data.counts) {
          productCounts.value[productId] = response.data.data.counts;
        }
        flash.success(wasFavorited ? "Retiré des favoris" : "Ajouté aux favoris");
        return response.data;
      } else {
        throw new Error("Action non confirmée");
      }
    } catch (err) {
      // ROLLBACK en cas d'échec
      flash.error("Impossible de modifier les favoris");
      if (wasFavorited) {
        favorited.value.add(productId);
      } else {
        favorited.value.delete(productId);
      }
      productCounts.value[productId] = previousCounts;
      throw err;
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
      const productUrl = `${window.location.origin}/produits/${productId}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(productUrl);
        flash.success("Lien copié dans le presse-papiers !");
      }

      return response;
    } catch (err) {
      flash.error("Erreur lors du partage");
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
      }
      // Pour les visiteurs non connectés, la vue totale est déjà comptabilisée lors de l'ouverture du produit.
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du clic:', err);
    }
  }

  /**
   * Enregistrer un contact (message)
   */
  async function recordContact(productId) {
    if (!authStore.isAuthenticated) {
      flash.warning("Vous devez vous connecter pour contacter le vendeur");
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

  const lastFetched = ref(null);
  const CACHE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  /**
   * Charger les favoris de l'utilisateur (liste complète d'objets)
   */
  async function fetchFavorites(force = false) {
    if (!authStore.isAuthenticated) return;
    
    // Si déjà chargé récemment, on ignore sauf si forcé
    if (!force && lastFetched.value && (Date.now() - lastFetched.value < CACHE_TIMEOUT)) {
      return;
    }

    loading.value = true;
    try {
      const response = await apiClient.get('/favorites');
      if (response.data.success && response.data.data.products) {
        favorites.value = response.data.data.products;
        // Mettre à jour aussi le Set des IDs
        favorited.value = new Set(favorites.value.map(p => p.id));
      } else if (response.data.data) {
        favorites.value = response.data.data;
        favorited.value = new Set(favorites.value.map(p => p.id));
      }
      lastFetched.value = Date.now();
    } catch (err) {
      console.error('Erreur lors du chargement des favoris:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Réinitialiser les interactions (déconnexion)
   */
  function reset() {
    favorited.value.clear();
    favorites.value = [];
    productCounts.value = {};
  }

  return {
    favorited,
    favorites,
    productCounts,
    loading,
    isFavorited,
    getProductCounts,
    recordInteraction,
    recordClick,
    recordContact,
    toggleFavorite,
    shareProduct,
    fetchProductCounts,
    fetchFavorites,
    reset
  };
});
