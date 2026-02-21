import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../api/index.js';

export const useProductStore = defineStore('products', () => {
  const products = ref([]);
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Produits avec images mappées
  const productsWithImages = computed(() => {
    return products.value.map(produit => ({
      id: produit.id,
      name: produit.nom,
      price: `${produit.prix}€` || 'N/A',
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

  function getImageUrl(photo) {
    if (typeof photo === 'string') {
      // Si c'est une URL complète, la retourner telle quelle
      if (photo.startsWith('http')) return photo;
      // Sinon, construire l'URL vers le backend
      return `http://localhost:8000/storage/${photo}`;
    }
    return '/placeholder.png';
  }

  async function fetchProducts(filters = {}) {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/marketplace/produits', {
        params: filters
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
      } else {
        products.value = [];
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement';
      console.error('Erreur lors du chargement des produits:', err);
      products.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories() {
    try {
      const response = await apiClient.get('/produits/categories');
      if (response.data.success && response.data.data) {
        categories.value = response.data.data;
      } else if (Array.isArray(response.data)) {
        categories.value = response.data;
      } else if (response.data.data) {
        categories.value = response.data.data;
      } else {
        categories.value = [];
      }
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      categories.value = [];
    }
  }

  async function getProductById(id) {
    try {
      const response = await apiClient.get(`/produits/${id}`);
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
    error,
    fetchProducts,
    fetchCategories,
    getProductById
  };
});
