import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useCartStore = defineStore("cart", () => {
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Backend sync
  async function fetchCart() {
    loading.value = true;
    try {
      const res = await axios.get("/api/cart");
      items.value = res.data.data || [];
      error.value = null;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function addToCart(product, quantity = 1) {
    try {
      await axios.post("/api/cart/add", {
        product_id: product.id,
        quantity,
      });
      await fetchCart();
    } catch (e) {
      error.value = e;
    }
  }

  async function removeFromCart(productId) {
    try {
      await axios.post("/api/cart/remove", {
        product_id: productId,
      });
      await fetchCart();
    } catch (e) {
      error.value = e;
    }
  }

  async function updateQuantity(productId, quantity) {
    try {
      await axios.post("/api/cart/update", {
        product_id: productId,
        quantity,
      });
      await fetchCart();
    } catch (e) {
      error.value = e;
    }
  }

  async function clearCart() {
    try {
      await axios.post("/api/cart/clear");
      await fetchCart();
    } catch (e) {
      error.value = e;
    }
  }

  // Totals
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  return {
    items,
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    count,
  };
});
