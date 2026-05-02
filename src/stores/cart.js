import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CONFIG } from '../config/index.js';

const CART_STORAGE_KEY = 'sasayee_cart';

export const useCartStore = defineStore('cart', () => {
  // ---- State ----
  const items        = ref(loadFromStorage());
  const isDrawerOpen = ref(false);

  // ---- Persistence helpers ----
  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function persist() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value));
  }

  // ---- Getters ----
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.priceRaw * item.quantity, 0)
  );

  const isEmpty = computed(() => items.value.length === 0);

  function isInCart(productId) {
    return items.value.some(i => String(i.productId) === String(productId));
  }

  function getItem(productId) {
    return items.value.find(i => String(i.productId) === String(productId));
  }

  // ---- Actions ----

  /**
   * product = { id, nom, slug, prix, photos, user_id, user }  (format brut backend)
   * Appel depuis DetailProduit / ProductCard
   */
  function addItem(product, quantity = 1) {
    const existing = getItem(product.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.quantite || 99);
    } else {
      // Résoudre l'image
      let image = null;
      if (product.photos && product.photos.length > 0) {
        const p = product.photos[0];
        image = p.startsWith('http') ? p : `${CONFIG.STORAGE_URL}${p}`;
      }

      // Nettoyage du prix (si c'est une chaîne formattée "10 000 FCFA")
      let price = product.prix || product.price_raw || 0;
      if (typeof price === 'string') {
        // Enlève tout ce qui n'est pas un chiffre
        price = price.replace(/[^\d]/g, '');
      }
      const priceRaw = Number(price) || 0;

      items.value.push({
        productId: String(product.id),
        name:      product.nom  || product.name || 'Produit',
        slug:      product.slug || product.id,
        priceRaw:  priceRaw,
        quantity,
        image,
        vendorId:  product.user_id ? String(product.user_id) : null,
        maxStock:  product.quantite ?? 99,
      });
    }
    persist();
  }

  function removeItem(productId) {
    items.value = items.value.filter(i => String(i.productId) !== String(productId));
    persist();
  }

  function updateQuantity(productId, qty) {
    const item = getItem(productId);
    if (!item) return;
    const clamped = Math.max(1, Math.min(qty, item.maxStock));
    item.quantity = clamped;
    persist();
  }

  function clearCart() {
    items.value = [];
    localStorage.removeItem(CART_STORAGE_KEY);
  }

  /**
   * Format pour l'envoi au backend (POST /chat/{adminId})
   * Retourne le tableau simplifié attendu par la validation Laravel
   */
  function toPayload() {
    return items.value.map(i => ({
      productId: i.productId,
      name:      i.name,
      slug:      i.slug,
      priceRaw:  i.priceRaw,
      quantity:  i.quantity,
      image:     i.image,
      vendorId:  i.vendorId,
    }));
  }

  /**
   * Format simplifié pour la validation `cart_items.*.productId` Laravel
   */
  function toValidationPayload() {
    return items.value.map(i => ({
      productId: i.productId,
      quantity:  i.quantity,
    }));
  }

  return {
    items,
    isDrawerOpen,
    totalItems,
    totalPrice,
    isEmpty,
    isInCart,
    getItem,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toPayload,
    toValidationPayload,
  };
});
