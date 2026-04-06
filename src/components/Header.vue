<template>
  <header class="fixed top-0 z-50 w-full shadow-sm border-b transition-all duration-300 header-main" :class="{
    'header-offset': auth.isAuthenticated && !isSidebarCollapsed,
    'header-offset-collapsed': auth.isAuthenticated && isSidebarCollapsed,
  }" :style="{
    backgroundColor: 'var(--color-surface)',
    borderColor: 'var(--color-border)',
  }">
    <div class="flex flex-col">
      <div class="flex items-center justify-between px-4 h-16 md:h-18 gap-4">
        <div class="flex items-center gap-3">
          <!-- Mobile Sidebar Toggle -->
          <button v-if="auth.isAuthenticated" @click="emit('toggle-mobile-sidebar')"
            class="md:hidden p-2 -ml-2 rounded-lg hover:bg-black/5" :style="{ color: 'var(--color-text-main)' }">
            <Menu :size="20" />
          </button>

          <RouterLink :to="{ name: 'Home' }" @click="productStore.searchQuery = ''" class="flex items-center">
            <img :src="CONFIG.LOGO_URL" alt="SASAYEE Logo" class="h-12 md:h-14 w-auto object-contain transition-transform hover:scale-105" />
          </RouterLink>
        </div>

        <div class="hidden md:flex flex-1 max-w-xl relative group">
          <div
            class="w-full flex items-center gap-3 pl-10 pr-4 py-2 rounded-full cursor-pointer transition-all border border-transparent hover:border-[var(--color-primary)]/30"
            :style="{ backgroundColor: 'var(--color-bg)' }" @click="openSearchOverlay">
            <Search :size="14" :style="{ color: 'var(--color-text-sub)' }"
              class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
            <span class="text-sm opacity-50" :style="{ color: 'var(--color-text-main)' }">
              {{
                productStore.searchQuery || "Rechercher un produit, service..."
              }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 md:gap-4">
          <button class="md:hidden" @click="isMobileSearchOpen = !isMobileSearchOpen" :style="{
            color: isMobileSearchOpen
              ? 'var(--color-primary)'
              : 'var(--color-text-main)',
          }">
            <component :is="isMobileSearchOpen ? X : Search" class="text-lg" />
          </button>

          <!-- Panier -->
          <!-- <button
            class="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/5 animate-bounce-slow relative group">
            <ShoppingCart :size="20" :stroke-width="3" />
            <span class="tooltip-text">Panier</span>
          </button> -->
          <button @click="toggleTheme"
            class="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 relative group"
            :style="{ color: 'var(--color-text-main)' }">
            <component :is="themeIcon" :size="20" :stroke-width="3" class="text-lg" />
            <span class="tooltip-text">Thème</span>
          </button>

          <div @click="router.push({ name: 'Wishlist' })" class="relative cursor-pointer group">
            <Heart :stroke-width="3" :style="{ color: 'var(--color-text-main)' }"
              class="text-lg transition-transform group-hover:scale-110" />
            <span v-if="interactionStore.favorited.size > 0"
              class="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-[9px] font-bold animate-bounce-subtle"
              :style="{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-pure)',
                width: '16px',
                height: '16px',
                border: '2px solid var(--color-surface)',
              }">
              {{ interactionStore.favorited.size }}
            </span>
            <span class="tooltip-text">Favoris</span>
          </div>

          <router-link :to="{ name: 'my-products', query: { add: 'true' } }"
            class="w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }">
            <Plus :size="16" :stroke-width="3" class="text-sm" />
          </router-link>

          <div v-if="auth.isAuthenticated" class="relative" ref="userMenuRef">
            <div @click="toggleUserMenu"
              class="p-0.5 rounded-full border-2 cursor-pointer transition-transform active:scale-95 flex items-center justify-center shrink-0"
              :style="{
                borderColor: isUserMenuOpen
                  ? 'var(--color-primary)'
                  : 'transparent',
              }">
              <img :src="userPhotoUrl" class="w-7 h-7 rounded-full object-cover" />
            </div>

            <transition enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0">
              <div v-show="isUserMenuOpen"
                class="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border backdrop-blur-xl py-2 z-[100]" :style="{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }">
                <div class="px-4 py-3 border-b mb-1" :style="{ borderColor: 'var(--color-border)' }">
                  <p class="text-sm font-bold truncate" :style="{ color: 'var(--color-text-main)' }">
                    {{ auth.user?.nom }}
                  </p>
                  <p class="text-[11px] opacity-60 truncate" :style="{ color: 'var(--color-text-sub)' }">
                    {{ auth.user?.telephone || auth.user?.email }}
                  </p>
                </div>

                <router-link @click="isUserMenuOpen = false"
                  :to="{ name: 'PublicProfile', params: { id: auth.user?.id } }"
                  class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5 transition-colors"
                  :style="{ color: 'var(--color-text-main)' }">
                  <UserCircle class="w-5 h-5 opacity-70" />
                  <span>Voir mon profil</span>
                </router-link>

                <router-link @click="isUserMenuOpen = false" :to="{ name: 'my-orders' }"
                  class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5 transition-colors"
                  :style="{ color: 'var(--color-text-main)' }">
                  <ShoppingBag class="w-5 h-5 opacity-70" />
                  <span>Mes Commandes</span>
                </router-link>

                <button @click="auth.logout"
                  class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 border-t mt-1"
                  :style="{ borderColor: 'var(--color-border)' }">
                  <LogOut class="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </transition>
          </div>
          <router-link v-else :to="{ name: 'Login' }"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:opacity-90 active:scale-95" :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }">
            Connexion
          </router-link>
        </div>
      </div>

    </div>

    <!-- Mobile search bar toggleable -->
    <transition enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2 max-h-0" enter-to-class="opacity-100 translate-y-0 max-h-20"
      leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 max-h-20"
      leave-to-class="opacity-0 -translate-y-2 max-h-0">
      <div v-if="isMobileSearchOpen" class="md:hidden px-4 pb-3 border-b overflow-hidden" :style="{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }">
        <div class="flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer"
          :style="{ backgroundColor: 'var(--color-bg)' }" @click="openSearchOverlay">
          <Search :size="16" :style="{ color: 'var(--color-text-sub)' }" />
          <span class="text-xs opacity-50" :style="{ color: 'var(--color-text-main)' }">
            Rechercher sur SASAYEE...
          </span>
        </div>
      </div>
    </transition>

    <!-- Search Overlay -->
    <div v-if="showSearchOverlay" class="fixed inset-0 z-[100] flex flex-col animate-in fade-in duration-200" :class="{
      'header-offset': auth.isAuthenticated && !isSidebarCollapsed,
      'header-offset-collapsed': auth.isAuthenticated && isSidebarCollapsed,
    }" :style="{ backgroundColor: 'var(--color-surface)' }">
      <!-- Overlay Header -->
      <div class="h-16 flex items-center gap-4 px-4 border-b" :style="{ borderColor: 'var(--color-border)' }">
        <button @click="closeSearchOverlay" class="p-2 rounded-full hover:bg-[var(--color-bg)] transition-colors"
          :style="{ color: 'var(--color-text-main)' }">
          <ArrowLeft :size="24" />
        </button>

        <div class="flex-1 relative">
          <input ref="searchInput" v-model="productStore.searchQuery" type="text" placeholder="Que cherchez-vous ?"
            @keyup.enter="handleFinalSearch" class="w-full bg-transparent border-none outline-none text-lg"
            :style="{ color: 'var(--color-text-main)' }" />
          <button v-if="productStore.searchQuery" @click="productStore.searchQuery = ''"
            class="absolute right-0 top-1/2 -translate-y-1/2 p-1 opacity-50 hover:opacity-100"
            :style="{ color: 'var(--color-text-main)' }">
            <X :size="18" />
          </button>
        </div>

        <button @click="handleFinalSearch" :disabled="!productStore.searchQuery.trim()"
          class="p-2 rounded-full bg-[var(--color-primary)] text-white disabled:opacity-50 disabled:grayscale">
          <Send :size="20" />
        </button>
      </div>

      <!-- Overlay Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Live Results -->
        <div v-if="liveResults.length > 0" class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest opacity-50"
              :style="{ color: 'var(--color-text-main)' }">
              Suggestions de produits
            </h3>
            <span
              class="text-[10px] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full text-[var(--color-primary)] font-bold">
              {{ liveResults.length }} résultats
            </span>
          </div>

          <div class="space-y-1">
            <div v-for="item in liveResults" :key="item.id" @click="clickResult(item)"
              class="flex items-center gap-4 p-3 rounded-2xl cursor-pointer hover:bg-[var(--color-bg)] transition-all group">
              <div class="w-12 h-12 rounded-xl overflow-hidden border flex-shrink-0"
                :style="{ borderColor: 'var(--color-border)' }">
                <img v-if="item.result_type === 'product'" :src="item.image || '/placeholder.png'"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div v-else class="w-full h-full flex items-center justify-center bg-[var(--color-primary)]/10">
                  <Briefcase :size="20" :style="{ color: 'var(--color-primary)' }" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold truncate" :style="{ color: 'var(--color-text-main)' }">
                    {{ item.nom || item.titre || item.name }}
                  </h4>
                  <span class="text-[9px] uppercase font-black opacity-30">
                    {{ item.result_type === "product" ? "Produit" : "Service" }}
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-xs font-black" :style="{ color: 'var(--color-primary)' }">
                    {{ Number(item.prix).toLocaleString() }} FCFA
                  </span>
                  <span class="text-[10px] opacity-40 px-1.5 py-0.5 rounded bg-black/5"
                    :style="{ color: 'var(--color-text-sub)' }">
                    {{
                      item.category?.nom ||
                      (item.result_type === "product" ? "Produit" : "Service")
                    }}
                  </span>
                </div>
              </div>
              <ArrowRight :size="16"
                class="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                :style="{ color: 'var(--color-primary)' }" />
            </div>
          </div>
        </div>

        <!-- History & Popular Suggestions -->
        <div v-if="!productStore.searchQuery && searchHistory.length > 0" class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xs font-bold uppercase tracking-widest opacity-50"
              :style="{ color: 'var(--color-text-main)' }">
              Recherches récentes
            </h3>
            <button @click="clearHistory" class="text-[10px] font-bold text-red-500 hover:underline">
              Tout effacer
            </button>
          </div>

          <div class="flex flex-wrap gap-2">
            <button v-for="query in searchHistory" :key="query" @click="
              productStore.searchQuery = query;
            handleFinalSearch();
            " class="flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
              :style="{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
              }">
              <History :size="14" class="opacity-40" />
              <span class="text-sm">{{ query }}</span>
            </button>
          </div>
        </div>

        <!-- Empty Results -->
        <div v-if="
          productStore.searchQuery && !isSearching && liveResults.length === 0
        " class="p-12 text-center flex flex-col items-center">
          <Search :size="48" class="opacity-10 mb-4" :style="{ color: 'var(--color-text-main)' }" />
          <p class="text-[var(--color-text-sub)]">
            Aucune suggestion immédiate pour "{{ productStore.searchQuery }}"
          </p>
          <button @click="handleFinalSearch" class="mt-4 text-sm font-bold text-[var(--color-primary)] hover:underline">
            Lancer la recherche globale
          </button>
        </div>

        <!-- Loading state -->
        <div v-if="isSearching" class="p-12 flex justify-center">
          <div
            class="w-8 h-8 border-4 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin">
          </div>
        </div>
      </div>
    </div>

    <div v-if="!route.path.startsWith('/messages')"
      class="flex justify-center border-t h-14 transition-all duration-300 fixed bottom-0 left-0 w-full z-50 md:static md:w-auto md:h-14 md:border-t shadow-2xl md:shadow-none mb-0 pb-[safe-area-inset-bottom]"
      :style="{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }">
      <nav class="flex h-full w-full max-w-2xl">
        <RouterLink :to="{ name: 'Home' }" @click="productStore.searchQuery = ''"
          class="group relative flex-1 flex flex-col items-center justify-center border-b-4 transition-colors"
          :style="isActiveName('Home') ? activeStyle : inactiveStyle">
          <House :stroke-width="3" size="18" />
          <span class="text-[9px] font-black mt-1">Accueil</span>
        </RouterLink>

        <RouterLink :to="{ name: 'Blogs' }"
          class="group relative flex-1 flex flex-col items-center justify-center border-b-4 transition-colors"
          :style="isActiveName('Blogs') ? activeStyle : inactiveStyle">
          <Newspaper :stroke-width="3" size="18" />
          <span class="text-[9px] font-black mt-1">Blogs</span>
        </RouterLink>

        <a href="#"
          class="group relative flex-1 flex flex-col items-center justify-center hover:bg-black/5 transition-colors"
          :style="{ color: 'var(--color-text-sub)' }">
          <div class="relative">
            <Bell size="18" :stroke-width="3" />
            <span class="nav-badge"></span>
          </div>
          <span class="text-[9px] font-black mt-1">Alertes</span>
        </a>

        <RouterLink :to="{ name: 'messages' }"
          class="group relative flex-1 flex flex-col items-center justify-center border-b-4 transition-colors"
          :style="isActiveName('messages') ? activeStyle : inactiveStyle">
          <MessageCircle size="18" :stroke-width="3" />
          <span class="text-[9px] font-black mt-1">Messages</span>
        </RouterLink>

        <RouterLink :to="{ name: 'Dashboard' }"
          class="group relative flex-1 flex flex-col items-center justify-center border-b-4 transition-colors"
          :style="isActiveName('Dashboard') ? activeStyle : inactiveStyle">
          <LayoutDashboard size="18" :stroke-width="3" />
          <span class="text-[9px] font-black mt-1">Dashboard</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { CONFIG } from '../config/index.js';

import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useTheme } from "../composables/useTheme.js";
import { useInteractionStore } from "../stores/interactions.js";
import { useProductStore } from "../stores/products.js";
import { useAuthStore } from "../stores/auth.js";
// import {  } from "lucide-vue-next";
import {
  Search,
  Store,
  House,
  Newspaper,
  Bell,
  MessageCircle,
  LayoutDashboard,
  ShoppingCart,
  Sun,
  Moon,
  Plus,
  UserCircle,
  LogOut,
  ShoppingBag,
  Star,
  PackageCheck,
  Menu,
  ArrowLeft,
  Heart,
  X,
  Send,
  History,
  ArrowRight,
  Briefcase,
} from "lucide-vue-next";
import apiClient from "../api/index.js";

const isMobileSearchOpen = ref(false);
const showSearchOverlay = ref(false);
const isSearching = ref(false);
const liveResults = ref([]);
const searchHistory = ref([]);
const searchInput = ref(null);

const interactionStore = useInteractionStore();
const auth = useAuthStore();
const productStore = useProductStore();
const route = useRoute();
const router = useRouter();
const { theme, toggleTheme } = useTheme();

const userPhotoUrl = computed(() => {
  if (auth.user?.photo) {
    if (auth.user.photo.startsWith('http')) return auth.user.photo;
    return `${CONFIG.API_BASE_URL}/storage/${auth.user.photo}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.nom || 'U')}&background=6366f1&color=fff&size=64`;
});

defineProps({
  isSidebarCollapsed: Boolean,
});

const emit = defineEmits(["toggle-mobile-sidebar"]);

const themeIcon = computed(() => {
  return theme.value === "dark" ? Sun : Moon;
});

const isActiveName = (name) => route.name === name;

const activeStyle = {
  borderColor: "var(--color-primary)",
  color: "var(--color-primary)",
};
const inactiveStyle = {
  borderColor: "transparent",
  color: "var(--color-text-sub)",
};

// Search logic
const openSearchOverlay = () => {
  showSearchOverlay.value = true;
  isMobileSearchOpen.value = false;
  loadHistory();
  setTimeout(() => {
    searchInput.value?.focus();
  }, 100);
};

const closeSearchOverlay = () => {
  showSearchOverlay.value = false;
};

const clickResult = (item) => {
  saveHistory(item.nom || item.name);
  closeSearchOverlay();
  router.push({ name: "DetailProduit", params: { slug: item.slug || item.id } });
};

const handleFinalSearch = () => {
  if (!productStore.searchQuery.trim()) return;
  saveHistory(productStore.searchQuery);
  closeSearchOverlay();
  if (route.name !== "Home") {
    router.push({ name: "Home" });
  }
  productStore.fetchProducts({}, true);
};

const saveHistory = (query) => {
  if (!query) return;
  let history = JSON.parse(
    localStorage.getItem("sasayee_search_history") || "[]",
  );
  history = history.filter((h) => h !== query);
  history.unshift(query);
  history = history.slice(0, 8);
  localStorage.setItem("sasayee_search_history", JSON.stringify(history));
  searchHistory.value = history;
};

const loadHistory = () => {
  searchHistory.value = JSON.parse(
    localStorage.getItem("sasayee_search_history") || "[]",
  );
};

const clearHistory = () => {
  localStorage.removeItem("sasayee_search_history");
  searchHistory.value = [];
};

let searchTimeout = null;
const performLiveSearch = async (query) => {
  if (!query || query.length < 2) {
    liveResults.value = [];
    return;
  }

  isSearching.value = true;
  try {
    const response = await apiClient.get("/marketplace/search", {
      params: { q: query, limit: 10 },
    });
    if (response.data.success && response.data.data) {
      const products = (response.data.data.products || []).map(p => ({
        ...p,
        slug: (p.slug && !p.slug.endsWith(`-${p.id}`)) ? `${p.slug}-${p.id}` : (p.slug || p.id)
      }));
      const services = response.data.data.services || [];
      liveResults.value = [...products, ...services].slice(0, 10);
    }
  } catch (error) {
    console.error("Erreur search live", error);
  } finally {
    isSearching.value = false;
  }
};

watch(
  () => productStore.searchQuery,
  (newQuery) => {
    if (searchTimeout) clearTimeout(searchTimeout);

    if (showSearchOverlay.value) {
      searchTimeout = setTimeout(() => {
        performLiveSearch(newQuery);
      }, 300);
    }
  },
);
const handleKeyDown = (e) => {
  if (e.key === "Escape" && showSearchOverlay.value) {
    closeSearchOverlay();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

// Dans ton <script setup>
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Fermer le menu si on clique ailleurs
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
@keyframes bounce-subtle {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-2px);
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite;
}

@media (min-width: 768px) {
  .header-offset {
    left: 256px !important;
    width: calc(100% - 256px) !important;
  }

  .header-offset-collapsed {
    left: 80px !important;
    width: calc(100% - 80px) !important;
  }
}

@keyframes bounceSlow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-slow {
  animation: bounceSlow 1.5s infinite;
}
</style>
