<template>
  <!-- Admin routes: AdminLayout handles everything (sidebar, header, etc.) -->
  <router-view v-if="isAdminRoute" />

  <!-- Non-admin routes: standard layout -->
  <div v-else id="app" class="flex min-h-screen" :style="{
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text-main)',
  }">
    <!-- Sidebar for authenticated users -->
    <Sidebar v-if="authStore.isAuthenticated" :collapsed="isSidebarCollapsed" :isMobileOpen="isMobileSidebarOpen"
      @toggle="toggleSidebar" @open-mobile="isMobileSidebarOpen = true" @close-mobile="isMobileSidebarOpen = false" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0" :class="[
      authStore.isAuthenticated
        ? isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        : '',
      isMessagesPage ? 'h-screen overflow-hidden' : 'min-h-screen',
    ]">
      <Header :isSidebarCollapsed="isSidebarCollapsed" @toggle-mobile-sidebar="toggleMobileSidebar" />

      <main class="flex-1" :class="[
        isMessagesPage ? 'pt-14 overflow-hidden' : 'pt-14 md:pt-28 pb-20 md:pb-0'
      ]">
        <router-view />
      </main>

      <Footer v-if="!isMessagesPage" />
      <CustomAlertDialog />
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from "vue";
import { useRoute } from "vue-router";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import Sidebar from "./components/Dashboard/Sidebar.vue";
import CustomAlertDialog from "./components/CustomAlertDialog.vue";
import { useAuthStore } from "./stores/auth.js";
import { useInteractionStore } from "./stores/interactions.js";
import { useProductStore } from "./stores/products.js";
import { useSeo } from "./composables/useSeo.js";

const authStore = useAuthStore();
const interactionStore = useInteractionStore();
const route = useRoute();

// Global SEO
useSeo({
  title: "SASAYEE - Vendre et Acheter au Cameroun",
  description: "SASAYEE est la plateforme leader au Cameroun pour l'achat et la revente de produits et services. Sécurité, rapidité et fiabilité.",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SASAYEE",
    "url": "https://sasayee.com",
    "logo": "https://sasayee.com/logo-sasaye.jpeg",
    "sameAs": [
      "https://facebook.com/SASAYEE",
      "https://twitter.com/SASAYEE"
    ]
  }
});

const isSidebarCollapsed = ref(false);
const isMobileSidebarOpen = ref(false);

const isMessagesPage = computed(() => {
  return route.path.startsWith("/messages");
});

// isAdminRoute uses window.location for immediate value (no flash on load)
// then stays reactive with route changes
const isAdminRoute = ref(window.location.pathname.startsWith('/admin'));
watch(() => route.path, (path) => {
  isAdminRoute.value = path.startsWith('/admin');
}, { immediate: true });


const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
};

const productStore = useProductStore();

const loadUserData = async () => {
  // Toujours charger les catégories (cache géré par le store)
  productStore.fetchCategories();

  if (authStore.isAuthenticated) {
    await Promise.all([
      authStore.fetchUser(),
      interactionStore.fetchFavorites(),
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
    }
  },
);
</script>
