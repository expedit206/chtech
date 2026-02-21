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
    <main class="pt-28">
      <router-view />
      <Footer />
    </main>
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { onMounted } from "vue";
=======
import Footer from "./components/Footer.vue";
>>>>>>> 0cb2c08a712626ffc3cc5d8a4b49d57563470bb6
import Header from "./components/Header.vue";
import { useAuthStore } from "./stores/auth.js";
import { useInteractionStore } from "./stores/interactions.js";

const authStore = useAuthStore();
const interactionStore = useInteractionStore();

onMounted(async () => {
  // Initialiser les stores au démarrage
  if (authStore.isAuthenticated) {
    // Charger les favoris si l'utilisateur est authentifié
    await interactionStore.loadUserFavorites();
  }
});
</script>

