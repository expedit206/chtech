<template>
  <!-- Dashboard skeleton while loading -->
  <SkeletonDashboard v-if="isLoading" />

  <div v-else class="p-6 space-y-8 animate-fade-in">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-[var(--color-text-main)]">
          Bonjour, <span class="text-[var(--color-primary)]">{{ authStore.user?.nom?.split(' ')[0] || 'vous' }}</span> 👋
        </h1>
        <p class="text-sm mt-1 text-[var(--color-text-sub)]">
          {{ authStore.isVendeur ? 'Gérez votre boutique depuis votre espace vendeur.' : 'Voici un aperçu de votre activité sur SASAYEE.' }}
        </p>
      </div>
      <div v-if="authStore.isVendeur" class="flex gap-1 p-1 rounded-xl border self-start"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <button @click="mode = 'seller'"
          class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          :style="mode === 'seller' ? { backgroundColor: 'var(--color-primary)', color: 'white' } : { color: 'var(--color-text-sub)' }">
          🏪 Boutique
        </button>
        <button @click="mode = 'buyer'"
          class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          :style="mode === 'buyer' ? { backgroundColor: 'var(--color-primary)', color: 'white' } : { color: 'var(--color-text-sub)' }">
          🛒 Acheteur
        </button>
      </div>
    </header>

    <!-- === SELLER VIEW === -->
    <template v-if="authStore.isVendeur && mode === 'seller'">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="kpi in sellerKpis" :key="kpi.label"
          class="rounded-2xl border p-5 flex flex-col gap-3 relative overflow-hidden group hover:scale-[1.02] transition-transform"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl"
            :style="{ backgroundColor: kpi.color }"></div>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center"
            :style="{ backgroundColor: kpi.color + '20', color: kpi.color }">
            <i :class="kpi.icon" class="text-base"></i>
          </div>
          <div>
            <p class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">{{ kpi.value }}</p>
            <p class="text-xs font-medium mt-0.5" :style="{ color: 'var(--color-text-sub)' }">{{ kpi.label }}</p>
          </div>
          <div v-if="kpi.badge" class="text-[10px] font-bold px-2 py-0.5 rounded-full w-fit"
            :style="{ backgroundColor: kpi.badgeColor + '20', color: kpi.badgeColor }">{{ kpi.badge }}</div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link :to="{ name: 'my-products', query: { add: 'true' } }"
          class="flex items-center gap-4 p-5 rounded-2xl font-bold text-sm hover:opacity-90 text-white"
          :style="{ backgroundColor: 'var(--color-primary)' }">
          <i class="fas fa-plus-circle text-xl"></i>
          <div><p>Ajouter un produit</p><p class="text-xs opacity-70 font-normal">Publier un nouveau produit</p></div>
        </router-link>
        <router-link :to="{ name: 'vendeur-orders' }"
          class="flex items-center gap-4 p-5 rounded-2xl border font-bold text-sm"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
          <i class="fas fa-box-open text-xl" :style="{ color: 'var(--color-primary)' }"></i>
          <div>
            <p>Commandes clients</p>
            <p class="text-xs font-normal" :style="{ color: 'var(--color-text-sub)' }">
              {{ sellerStats.pending_orders > 0 ? sellerStats.pending_orders + ' en attente' : 'Tout est traité ✓' }}
            </p>
          </div>
        </router-link>
        <router-link :to="{ name: 'seller-stats' }"
          class="flex items-center gap-4 p-5 rounded-2xl border font-bold text-sm"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
          <i class="fas fa-chart-bar text-xl" :style="{ color: 'var(--color-accent)' }"></i>
          <div>
            <p>Statistiques détaillées</p>
            <p class="text-xs font-normal" :style="{ color: 'var(--color-text-sub)' }">Voir l'analyse complète</p>
          </div>
        </router-link>
      </div>
    </template>
    <!-- === END SELLER VIEW === -->

    <!-- === BUYER VIEW === -->
    <template v-if="!authStore.isVendeur || mode === 'buyer'">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Last order -->
      <div
        class="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-[var(--color-text-main)]">
            Dernière commande
          </h3>
          <span class="text-xs font-mono text-[var(--color-text-sub)]"
            >#{{ lastOrder?.id || "---" }}</span
          >
        </div>

        <div v-if="lastOrder" class="flex items-center gap-4 mb-8">
          <div
            class="w-16 h-16 rounded-2xl border flex items-center justify-center overflow-hidden"
            :style="{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
            }"
          >
            <img :src="lastOrder.image" class="max-h-full object-contain" />
          </div>
          <div>
            <p class="font-semibold text-[var(--color-text-main)]">
              {{ lastOrder.name }}
            </p>
            <p
              class="text-sm font-medium"
              :style="{ color: 'var(--color-accent)' }"
            >
              Statut : {{ lastOrder.status }}
            </p>
          </div>
        </div>
        <div v-else class="flex items-center gap-4 mb-8">
          <div
            class="w-16 h-16 rounded-2xl border flex items-center justify-center"
            :style="{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
            }"
          >
            <i
              class="fa-solid fa-box text-[var(--color-text-sub)] text-2xl opacity-30"
            ></i>
          </div>
          <p class="font-semibold text-[var(--color-text-sub)]">
            Aucune commande récente
          </p>
        </div>

        <div class="relative pt-4">
          <div
            class="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-[var(--color-border)]"
          >
            <div
              :style="{ width: orderProgress + '%' }"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--color-accent)] transition-all duration-700"
            ></div>
          </div>
          <div
            class="flex justify-between text-[10px] md:text-xs font-medium text-[var(--color-text-sub)] uppercase tracking-wider"
          >
            <span
              :class="orderProgress >= 0 ? 'text-[var(--color-accent)]' : ''"
              >Confirmé</span
            >
            <span
              :class="orderProgress >= 33 ? 'text-[var(--color-accent)]' : ''"
              >Préparation</span
            >
            <span
              :class="orderProgress >= 66 ? 'text-[var(--color-accent)]' : ''"
              >Expédié</span
            >
            <span
              :class="orderProgress >= 100 ? 'text-[var(--color-accent)]' : ''"
              >Livré</span
            >
          </div>
        </div>
      </div>

      <!-- Loyalty card -->
      <div
        class="bg-[var(--color-primary)] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20"
      >
        <i
          class="fa-solid fa-crown absolute -right-4 -top-4 text-white/10 text-8xl rotate-12"
        ></i>
        <h3 class="text-white/80 font-medium mb-1">Votre Fidélité</h3>
        <p class="text-4xl font-black mb-4">
          {{ stats.points.toLocaleString() }}
          <span class="text-sm font-normal">pts</span>
        </p>
        <div class="bg-white/20 backdrop-blur-md rounded-xl p-3 inline-block">
          <p class="text-xs font-medium">
            Équivalent :
            <span class="font-bold"
              >{{ (stats.points / 100).toLocaleString() }} FCFA</span
            >
          </p>
        </div>
        <button
          class="w-full mt-6 py-2 bg-[var(--color-pure)] text-[var(--color-primary)] rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all"
        >
          Convertir mes points
        </button>
      </div>
    </div>
    </template>
    <!-- === END BUYER VIEW === -->

    <!-- Quick stats — always visible -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="stat in quickStats"
        :key="stat.label"
        class="rounded-2xl border p-4 flex flex-col gap-2"
        :style="{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }"
      >
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm"
          :style="{ backgroundColor: stat.color }"
        >
          <i :class="stat.icon"></i>
        </div>
        <p
          class="text-2xl font-black"
          :style="{ color: 'var(--color-text-main)' }"
        >
          {{ stat.value }}
        </p>
        <p
          class="text-xs font-medium"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          {{ stat.label }}
        </p>
      </div>
    </div>

    <!-- Recent favorites -->
    <section>
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-[var(--color-text-main)]">Favoris récents</h3>
        <router-link
          :to="{ name: 'Wishlist' }"
          class="text-[var(--color-primary)] text-sm font-semibold hover:underline"
          >Voir tout</router-link
        >
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="fav in recentFavorites"
          :key="fav.id"
          class="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center gap-4 hover:border-[var(--color-primary)] transition-all cursor-pointer group"
          @click="
            $router.push({ name: 'DetailProduit', params: { slug: fav.slug || fav.id } })
          "
        >
          <div
            class="w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 overflow-hidden"
            :style="{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
            }"
          >
            <img
              :src="fav.image"
              :alt="fav.name"
              class="max-h-full object-contain group-hover:scale-110 transition-transform"
            />
          </div>
          <div class="overflow-hidden">
            <p
              class="font-medium text-[var(--color-text-main)] truncate text-sm"
            >
              {{ fav.name }}
            </p>
            <p class="text-xs text-[var(--color-text-sub)]">{{ fav.price }}</p>
          </div>
          <i
            class="fa-solid fa-chevron-right ml-auto text-[var(--color-text-sub)] text-xs"
          ></i>
        </div>

        <div
          v-if="recentFavorites.length === 0"
          class="md:col-span-3 py-8 text-center text-sm opacity-50"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          Aucun favori récent.
          <router-link
            :to="{ name: 'Home' }"
            class="underline text-[var(--color-primary)]"
            >Explorer les produits</router-link
          >
        </div>
      </div>
    </section>
    </div>
</template>

<script setup>
import { CONFIG } from '../config/index.js';
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth.js";
import { useInteractionStore } from "../stores/interactions.js";
import SkeletonDashboard from "../components/skeletons/SkeletonDashboard.vue";
import apiClient from "../api/index.js";
import { useSeo } from "../composables/useSeo.js";

const authStore = useAuthStore();
const interactionStore = useInteractionStore();

useSeo({
  title: "Tableau de Bord - SASAYEE",
  description: "Gérez votre compte, vos commandes et vos favoris sur votre espace personnel SASAYEE."
});

// Seller/buyer mode toggle — sellers see seller view by default
const mode = ref(authStore.isVendeur ? 'seller' : 'buyer');

const isLoading = ref(true);
const lastOrder = ref(null);
const orderProgress = ref(0);
const stats = ref({ points: 0, orders: 0, products: 0, favorites: 0 });

// Seller stats
const sellerStats = ref({
  total_revenue: 0,
  total_orders: 0,
  pending_orders: 0,
  delivered_orders: 0,
  active_products: 0,
  total_views: 0,
});

const sellerKpis = computed(() => [
  {
    icon: 'fas fa-chart-line',
    label: "Chiffre d'affaires (livré)",
    value: `${Number(sellerStats.value.total_revenue || 0).toLocaleString('fr-FR')} FCFA`,
    color: '#10b981',
    badge: 'Confirmé',
    badgeColor: '#10b981',
  },
  {
    icon: 'fas fa-shopping-cart',
    label: 'Commandes reçues',
    value: sellerStats.value.total_orders || 0,
    color: '#6366f1',
  },
  {
    icon: 'fas fa-clock',
    label: 'En attente / expédition',
    value: sellerStats.value.pending_orders || 0,
    color: '#f59e0b',
    badge: sellerStats.value.pending_orders > 0 ? 'Action requise' : null,
    badgeColor: '#f59e0b',
  },
  {
    icon: 'fas fa-check-circle',
    label: 'Commandes livrées',
    value: sellerStats.value.delivered_orders || 0,
    color: '#10b981',
  },
  {
    icon: 'fas fa-box',
    label: 'Produits actifs',
    value: sellerStats.value.active_products || 0,
    color: '#8b5cf6',
  },
  {
    icon: 'fas fa-eye',
    label: 'Vues produits (total)',
    value: Number(sellerStats.value.total_views || 0).toLocaleString('fr-FR'),
    color: '#ec4899',
  },
]);

const statusProgressMap = {
  confirmé: 10,
  "en cours": 10,
  préparation: 33,
  expédié: 66,
  livré: 100,
  annulé: 0,
};

const getProgress = (status) => {
  const s = (status || "").toLowerCase();
  for (const [key, val] of Object.entries(statusProgressMap)) {
    if (s.includes(key)) return val;
  }
  return 10;
};

const quickStats = computed(() => [
  {
    icon: "fas fa-shopping-bag",
    label: "Commandes",
    value: stats.value.orders,
    color: "#6366f1",
  },
  {
    icon: "fas fa-heart",
    label: "Favoris",
    value: stats.value.favorites,
    color: "#ec4899",
  },
  {
    icon: "fas fa-tag",
    label: "Produits publiés",
    value: stats.value.products,
    color: "#10b981",
  },
  {
    icon: "fas fa-star",
    label: "Points fidélité",
    value: stats.value.points,
    color: "#f59e0b",
  },
]);

const recentFavorites = ref([]);

onMounted(async () => {
  try {
    const requests = [
      apiClient.get("/orders"),
      interactionStore.fetchFavorites?.() || Promise.resolve(),
    ];

    // Also load seller stats if seller
    if (authStore.isVendeur) {
      requests.push(apiClient.get("/orders/seller-stats"));
    }

    const results = await Promise.allSettled(requests);
    const [ordersRes, , sellerRes] = results;

    const ordersData =
      ordersRes.status === "fulfilled"
        ? ordersRes.value.data.data || ordersRes.value.data || []
        : [];

    if (ordersData.length > 0) {
      const last = ordersData[0];
      lastOrder.value = {
        id: last.id || last.reference || "N/A",
        name: last.product?.nom || last.items?.[0]?.name || "Produit",
        status: last.status || last.statut || "En cours",
        image: last.product?.photos?.[0]
          ? `${CONFIG.STORAGE_URL}${last.product.photos[0]}`
          : "https://cdn-icons-png.flaticon.com/512/644/644458.png",
      };
      orderProgress.value = getProgress(lastOrder.value.status);
    }

    const favList = interactionStore.favorites || [];
    recentFavorites.value = favList.slice(0, 3).map((p) => ({
      id: p.id,
      slug: (p.slug && !p.slug.endsWith(`-${p.id}`)) ? `${p.slug}-${p.id}` : (p.slug || p.id),
      name: p.nom || p.name || "Produit",
      price: `${Number(p.prix || 0).toLocaleString("fr-FR")} FCFA`,
      image: p.photos?.[0]
        ? p.photos[0].startsWith("http")
          ? p.photos[0]
          : `${CONFIG.STORAGE_URL}${p.photos[0]}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nom || "P")}&size=64&background=efefef`,
    }));

    stats.value = {
      orders: ordersData.length,
      favorites: favList.length,
      products: authStore.user?.produits_count || 0,
      points: authStore.user?.jetons || 0,
    };

    // Load seller stats
    if (authStore.isVendeur && sellerRes?.status === "fulfilled") {
      sellerStats.value = sellerRes.value.data.data || {};
    }
  } catch (err) {
    console.error("Dashboard error:", err);
  } finally {
    isLoading.value = false;
  }
});
</script>
