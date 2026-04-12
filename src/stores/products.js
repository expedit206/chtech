import { CONFIG } from '../config/index.js';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../api/index.js';

export const useProductStore = defineStore('products', () => {
  const products = ref([]);
  const categories = ref([]);
  const searchQuery = ref('');
  const loading = ref(false);
  const loadingMore = ref(false);
  const hasMore = ref(true);
  const currentPage = ref(1);
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
      ...produit,
      slug: (produit.slug && !produit.slug.endsWith(`-${produit.id}`)) ? `${produit.slug}-${produit.id}` : (produit.slug || produit.id)
    }));
  });

  const lastFetched = ref(null);
  const categoriesLastFetched = ref(null);
  const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  function getImageUrl(photo) {
    if (typeof photo === 'string') {
      if (photo.startsWith('http')) return photo;
      return `${CONFIG.STORAGE_URL}${photo}`;
    }
    return '/placeholder.png';
  }

  async function fetchProducts(filters = {}, force = false, loadMore = false) {
    if (!loadMore) {
      if (!force && products.value.length > 0 && lastFetched.value && (Date.now() - lastFetched.value < CACHE_TIMEOUT) && Object.keys(filters).length === 0) {
        return;
      }
      currentPage.value = 1;
      hasMore.value = true;
    } else {
      if (!hasMore.value || loadingMore.value) return;
      currentPage.value++;
    }

    if (loadMore) loadingMore.value = true;
    else loading.value = true;

    error.value = null;
    try {
      const params = { 
        ...filters,
        page: currentPage.value,
        per_page: 15
      };

      if (searchQuery.value) {
        params.search = searchQuery.value;
      }

      const response = await apiClient.get('/marketplace/produits', {
        params
      });

      if (response.data.success) {
        const paginated = response.data.produits;
        const meta = response.data.meta;

        const newProducts = Array.isArray(paginated) ? paginated : (paginated?.data || []);

        if (loadMore) {
          const existingIds = products.value.map(p => p.id);
          const uniqueNewProducts = newProducts.filter(p => !existingIds.includes(p.id));
          products.value = [...products.value, ...uniqueNewProducts];
        } else {
          products.value = newProducts;
        }

        hasMore.value = meta ? meta.has_more_pages : (newProducts.length >= 15);

        if (!loadMore && Object.keys(filters).length === 0) {
          lastFetched.value = Date.now();
        }
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement';
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      loading.value = false;
      loadingMore.value = false;
    }
  }

  async function fetchCategories(force = false) {
    if (!force && categories.value.length > 0 && categoriesLastFetched.value) {
      return;
    }

    try {
      const response = await apiClient.get('/produits/categories');
      let rawData = [];
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        rawData = response.data.data;
      } else if (Array.isArray(response.data)) {
        rawData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        rawData = response.data.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        rawData = response.data.data;
      }

      categories.value = rawData;
      categoriesLastFetched.value = Date.now();
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  }

  async function getProductById(idOrSlug, refresh = false) {
    if (!refresh) {
      const localProduct = products.value.find(p => 
        String(p.id) === String(idOrSlug) || 
        p.slug === idOrSlug || 
        ((p.slug && p.slug + '-' + p.id === idOrSlug))
      );
      if (localProduct) return { produit: localProduct }; // Retourne au format objet attendu
    }

    try {
      const response = await apiClient.get(`/produits/${idOrSlug}`);
      // console.log(response.data.data);
      
      return response.data.data; // Retourne l'objet complet (produit, etc.)
    } catch (err) {
      console.error('Erreur lors du chargement du produit:', err);
      throw err;
    }
  }

  async function getSimilarProducts(productId) {
    try {
      const response = await apiClient.get(`/produits/${productId}/similar`);
      return response.data; 
    } catch (err) {
      console.error('Erreur lors du chargement des produits similaires:', err);
      return { data: [] };
    }
  }

  async function getShopProducts(productId) {
    try {
      const response = await apiClient.get(`/produits/${productId}/shop`);
      return response.data; 
    } catch (err) {
      console.error('Erreur lors du chargement des produits de la boutique:', err);
      return { data: [] };
    }
  }

  return {
    products,
    productsWithImages,
    categories,
    loading,
    loadingMore,
    hasMore,
    searchQuery,
    lastFetched,
    error,
    fetchProducts,
    fetchCategories,
    getProductById,
    getSimilarProducts,
    getShopProducts
  };
});
