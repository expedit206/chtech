import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../api/index.js';

export const useProductStore = defineStore('products', () => {
  const products = ref([]);
  const categories = ref([]);
  const searchQuery = ref('');
  const loading = ref(false);
  const error = ref(null);

  // Produits avec images mappées
  const productsWithImages = computed(() => {
    return products.value.map(produit => ({
      id: produit.id,
      name: produit.nom,
      price: produit.prix ? `${Number(produit.prix).toLocaleString('fr-FR')} FCFA` : 'N/A',
      old_price: produit.ancien_prix ? `${Number(produit.ancien_prix).toLocaleString('fr-FR')} FCFA` : null,
      image: produit.photos && produit.photos.length > 0 ? getImageUrl(produit.photos[0]) : '/placeholder.png',
      rating: produit.note_moyenne || 5,
      views: produit.vues_count || produit.views_count || '0',
      category: produit.category?.nom || 'Autre',
      description: produit.description,
      user: produit.user,
      quantity: produit.quantite,
      reviews: produit.nombre_avis,
      ...produit
    }));
  });

  const lastFetched = ref(null);
  const categoriesLastFetched = ref(null);
  const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  function getImageUrl(photo) {
    if (typeof photo === 'string') {
      if (photo.startsWith('http')) return photo;
      return `http://localhost:8000/storage/${photo}`;
    }
    return '/placeholder.png';
  }

  async function fetchProducts(filters = {}, force = false) {
    // Si on a déjà des produits et qu'on ne force pas le refresh, on vérifie le cache
    if (!force && products.value.length > 0 && lastFetched.value && (Date.now() - lastFetched.value < CACHE_TIMEOUT) && Object.keys(filters).length === 0) {
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const params = { ...filters };
      if (searchQuery.value) {
        params.search = searchQuery.value;
      }

      const response = await apiClient.get('/marketplace/produits', {
        params
      });
      
      if (response.data.success) {
        const paginated = response.data.produits;
        if (paginated && paginated.data) {
          products.value = paginated.data;
        } else if (Array.isArray(paginated)) {
          products.value = paginated;
        } else {
          products.value = [];
        }
        
        // Mettre à jour le timestamp si c'est un fetch global
        if (Object.keys(filters).length === 0) {
          lastFetched.value = Date.now();
        }
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement';
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories(force = false) {
    if (!force && categories.value.length > 0 && categoriesLastFetched.value) {
      return;
    }

    try {
      const response = await apiClient.get('/produits/categories');
      let data = [];
      
      if (response.data.success && response.data.data) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data.data) {
        data = response.data.data;
      }

      categories.value = data;
      categoriesLastFetched.value = Date.now();
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  }

  async function getProductById(id) {
    // 1. Chercher dans le cache local du store
    const localProduct = products.value.find(p => p.id === id);
    if (localProduct) {
      return localProduct;
    }

    // 2. Sinon, faire l'appel API
    try {
      const response = await apiClient.get(`/produits/${id}`);
      const product = response.data.data.produit;
      
      // Optionnel : l'ajouter au cache local s'il n'y est pas
      if (product && !products.value.some(p => p.id === product.id)) {
        // On ne l'ajoute que s'il est complet, pour éviter de polluer la liste principale
        // mais pour l'instant on se contente de le retourner
      }
      
      return product;
    } catch (err) {
      console.error('Erreur lors du chargement du produit:', err);
      throw err;
    }
  }

  return {
    products,
    productsWithImages,
    categories,
    loading,
    searchQuery,
    lastFetched,
    error,
    fetchProducts,
    fetchCategories,
    getProductById
  };
});
