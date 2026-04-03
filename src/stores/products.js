import { CONFIG } from '../config/index.js';
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

  async function fetchProducts(filters = {}, force = false) {
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

  async function getProductById(idOrSlug) {
    const localProduct = products.value.find(p => 
      String(p.id) === String(idOrSlug) || 
      p.slug === idOrSlug || 
      ((p.slug && p.slug + '-' + p.id === idOrSlug))
    );
    if (localProduct) return localProduct;

    try {
      const response = await apiClient.get(`/produits/${idOrSlug}`);
      return response.data.data.produit;
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
