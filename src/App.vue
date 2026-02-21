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
import { onMounted } from "vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import CartSidebar from "./components/CartSidebar.vue";
import { useAuthStore } from "./stores/auth.js";
import { useInteractionStore } from "./stores/interactions.js";
import { useCartStore } from "./stores/cart.js";

const authStore = useAuthStore();
const interactionStore = useInteractionStore();
const cartStore = useCartStore();

onMounted(async () => {
  // Initialiser les stores au démarrage
  if (authStore.isAuthenticated) {
    // Charger les favoris et le panier si l'utilisateur est authentifié
    await interactionStore.loadUserFavorites();
    await cartStore.fetchCart();
  }
});
</script>
