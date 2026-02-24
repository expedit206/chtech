<template>
  <div
    id="app"
    class="min-h-screen"
    :style="{
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text-main)',
    }"
  >
    <Header />
    <CartSidebar />
    <main class="pt-28">
      <router-view />
      <Footer />
    </main>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import CartSidebar from "./components/CartSidebar.vue";
import { useAuthStore } from "./stores/auth.js";
import { useInteractionStore } from "./stores/interactions.js";
import { useCartStore } from "./stores/cart.js";

const authStore = useAuthStore();
const interactionStore = useInteractionStore();
const cartStore = useCartStore();

const loadUserData = async () => {
  if (authStore.isAuthenticated) {
    await Promise.all([
      interactionStore.loadUserFavorites(),
      cartStore.fetchCart(),
    ]);
  }
};

onMounted(() => {
  loadUserData();
});

// Watch for login/logout
watch(
  () => authStore.isAuthenticated,
  (val) => {
    if (val) {
      loadUserData();
    } else {
      interactionStore.reset();
      cartStore.clearLocal();
    }
  },
);
</script>
