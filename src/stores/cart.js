import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import axios from "axios";

export const useCartStore = defineStore("cart", () => {
  const items = ref(JSON.parse(localStorage.getItem("cart_items")) || []);
  const loading = ref(false);
  const error = ref(null);
  const isSidebarOpen = ref(false);

  // Sync with localStorage
  watch(
    items,
    (newItems) => {
      localStorage.setItem("cart_items", JSON.stringify(newItems));
    },
    { deep: true },
  );

  // Backend sync
  async function fetchCart() {
    loading.value = true;
    try {
      const res = await axios.get("/api/cart");
      if (res.data.success) {
        items.value = res.data.data || [];
      }
      error.value = null;
    } catch (e) {
      error.value = e;
      console.error("Failed to fetch cart:", e);
    } finally {
      loading.value = false;
    }
  }

  async function addToCart(product, quantity = 1) {
    try {
      loading.value = true;
      // Optimistic update for guest users or immediate feedback
      const existingItem = items.value.find((i) => i.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        items.value.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          category: product.category?.nom,
        });
      }

      // Sync with backend if logged in
      await axios.post("/api/cart/add", {
        product_id: product.id,
        quantity,
      });

      // Auto-open sidebar to show feedback
      isSidebarOpen.value = true;

      await fetchCart();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function removeFromCart(productId) {
    try {
      items.value = items.value.filter((i) => i.id !== productId);
      await axios.post("/api/cart/remove", {
        product_id: productId,
      });
      await fetchCart();
    } catch (e) {
      error.value = e;
    }
  }

  async function updateQuantity(productId, quantity) {
    if (quantity < 1) return removeFromCart(productId);

    try {
      const item = items.value.find((i) => i.id === productId);
      if (item) item.quantity = quantity;

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
      items.value = [];
      await axios.post("/api/cart/clear");
      await fetchCart();
    } catch (e) {
      error.value = e;
    }
  }

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
  }

  // Totals
  const total = computed(() =>
    items.value.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity,
      0,
    ),
  );

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  return {
    items,
    loading,
    error,
    isSidebarOpen,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleSidebar,
    total,
    count,
  };
});
