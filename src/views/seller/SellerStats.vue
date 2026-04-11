<template>
  <div class="p-4 md:p-8 space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">
          📊 Statistiques de la Boutique
        </h1>
        <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">Données en temps réel de votre activité vendeur</p>
      </div>
      <div class="flex gap-2">
        <select v-model="period" class="px-4 py-2 rounded-xl border text-sm outline-none cursor-pointer"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
          <option value="all">Tout le temps</option>
          <option value="month">Ce mois</option>
          <option value="week">Cette semaine</option>
        </select>
      </div>
    </div>

    <!-- KPI Cards -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="h-28 rounded-2xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="kpi in kpis" :key="kpi.label"
        class="rounded-2xl border p-5 flex flex-col gap-3 relative overflow-hidden group hover:scale-[1.02] transition-transform"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <!-- BG glow -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl"
          :style="{ backgroundColor: kpi.color }"></div>

        <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
          :style="{ backgroundColor: kpi.color + '20', color: kpi.color }">
          <component :is="kpi.icon" :size="20" />
        </div>
        <div>
          <p class="text-2xl font-black tracking-tight" :style="{ color: 'var(--color-text-main)' }">
            {{ kpi.value }}
          </p>
          <p class="text-xs font-medium mt-0.5" :style="{ color: 'var(--color-text-sub)' }">{{ kpi.label }}</p>
        </div>
        <div v-if="kpi.badge" class="text-[10px] font-bold px-2 py-0.5 rounded-full w-fit"
          :style="{ backgroundColor: kpi.badgeColor + '20', color: kpi.badgeColor }">
          {{ kpi.badge }}
        </div>
      </div>
    </div>

    <!-- My Products section -->
    <div class="rounded-2xl border overflow-hidden" :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }">
      <div class="px-6 py-4 border-b flex items-center justify-between" :style="{ borderColor: 'var(--color-border)' }">
        <h2 class="font-black text-base" :style="{ color: 'var(--color-text-main)' }">Mes produits actifs</h2>
        <router-link :to="{ name: 'my-products' }"
          class="text-xs font-bold hover:underline" :style="{ color: 'var(--color-primary)' }">
          Gérer →
        </router-link>
      </div>

      <div v-if="productsLoading" class="p-6 space-y-3">
        <div v-for="i in 4" :key="i" class="h-14 rounded-xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
      </div>

      <div v-else-if="products.length === 0" class="p-10 text-center">
        <Package :size="40" class="mx-auto mb-3 opacity-20" :style="{ color: 'var(--color-text-sub)' }" />
        <p class="text-sm opacity-50" :style="{ color: 'var(--color-text-sub)' }">Aucun produit publié.</p>
        <router-link :to="{ name: 'my-products' }" class="mt-3 inline-block px-4 py-2 rounded-xl text-sm font-bold text-white"
          :style="{ backgroundColor: 'var(--color-primary)' }">
          Ajouter un produit
        </router-link>
      </div>

      <div v-else class="divide-y" :style="{ borderColor: 'var(--color-border)' }">
        <div v-for="p in products.slice(0, 8)" :key="p.id"
          class="flex items-center gap-4 px-6 py-3 hover:bg-opacity-50 transition-colors"
          :style="{ color: 'var(--color-text-main)' }">
          <img :src="productImage(p)" class="w-10 h-10 rounded-xl object-cover border"
            :style="{ borderColor: 'var(--color-border)' }" />
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm truncate">{{ p.nom }}</p>
            <p class="text-xs" :style="{ color: 'var(--color-text-sub)' }">
              Stock: {{ p.quantite }} · {{ Number(p.prix).toLocaleString('fr-FR') }} FCFA
            </p>
          </div>
          <span class="text-[10px] font-bold px-2 py-1 rounded-full"
            :style="{ backgroundColor: p.quantite > 0 ? '#10b98120' : '#ef444420', color: p.quantite > 0 ? '#10b981' : '#ef4444' }">
            {{ p.quantite > 0 ? 'En stock' : 'Rupture' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Recent orders from customers -->
    <div class="rounded-2xl border overflow-hidden" :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }">
      <div class="px-6 py-4 border-b flex items-center justify-between" :style="{ borderColor: 'var(--color-border)' }">
        <h2 class="font-black text-base" :style="{ color: 'var(--color-text-main)' }">Commandes récentes</h2>
        <router-link :to="{ name: 'vendeur-orders' }"
          class="text-xs font-bold hover:underline" :style="{ color: 'var(--color-primary)' }">
          Voir tout →
        </router-link>
      </div>

      <div v-if="ordersLoading" class="p-6 space-y-3">
        <div v-for="i in 4" :key="i" class="h-14 rounded-xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
      </div>

      <div v-else-if="recentOrders.length === 0" class="p-10 text-center">
        <ShoppingCart :size="40" class="mx-auto mb-3 opacity-20" :style="{ color: 'var(--color-text-sub)' }" />
        <p class="text-sm opacity-50" :style="{ color: 'var(--color-text-sub)' }">Aucune commande reçue.</p>
      </div>

      <div v-else class="divide-y" :style="{ borderColor: 'var(--color-border)' }">
        <div v-for="order in recentOrders.slice(0, 6)" :key="order.id"
          class="flex items-center gap-4 px-6 py-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            :style="{ backgroundColor: statusColor(order.order?.status) }">
            {{ (order.order?.user?.nom || 'U')[0].toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm truncate" :style="{ color: 'var(--color-text-main)' }">
              {{ order.produit?.nom || 'Produit' }}
            </p>
            <p class="text-xs" :style="{ color: 'var(--color-text-sub)' }">
              Par {{ order.order?.user?.nom || '—' }} · qté: {{ order.quantity }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold" :style="{ color: 'var(--color-text-main)' }">
              {{ Number(order.price * order.quantity).toLocaleString('fr-FR') }} FCFA
            </p>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :style="{ backgroundColor: statusColor(order.order?.status) + '20', color: statusColor(order.order?.status) }">
              {{ statusLabel(order.order?.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  TrendingUp, Package, ShoppingCart, Eye, Clock, CheckCircle
} from 'lucide-vue-next';
import apiClient from '../../api/index.js';
import { CONFIG } from '../../config/index.js';
import { useSeo } from '../../composables/useSeo.js';

useSeo({ title: 'Statistiques Boutique - SASAYEE', description: 'Vue détaillée de vos performances de vente sur SASAYEE.' });

const period = ref('all');
const loading = ref(true);
const productsLoading = ref(true);
const ordersLoading = ref(true);
const stats = ref({});
const products = ref([]);
const recentOrders = ref([]);

const kpis = computed(() => [
  {
    icon: TrendingUp,
    label: 'Chiffre d\'affaires (livré)',
    value: `${Number(stats.value.total_revenue || 0).toLocaleString('fr-FR')} FCFA`,
    color: '#10b981',
    badge: 'Confirmé',
    badgeColor: '#10b981',
  },
  {
    icon: ShoppingCart,
    label: 'Commandes reçues',
    value: stats.value.total_orders || 0,
    color: '#6366f1',
  },
  {
    icon: Clock,
    label: 'En attente / expedition',
    value: stats.value.pending_orders || 0,
    color: '#f59e0b',
    badge: stats.value.pending_orders > 0 ? 'Action requise' : null,
    badgeColor: '#f59e0b',
  },
  {
    icon: CheckCircle,
    label: 'Commandes livrées',
    value: stats.value.delivered_orders || 0,
    color: '#10b981',
  },
  {
    icon: Package,
    label: 'Produits actifs',
    value: stats.value.active_products || 0,
    color: '#8b5cf6',
  },
  {
    icon: Eye,
    label: 'Vues produits (total)',
    value: Number(stats.value.total_views || 0).toLocaleString('fr-FR'),
    color: '#ec4899',
  },
]);

const productImage = (p) => {
  if (!p.photos?.length) return `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nom)}&background=efefef&size=64`;
  const photo = p.photos[0];
  return photo.startsWith('http') ? photo : `${CONFIG.STORAGE_URL}${photo}`;
};

const statusColor = (status) => {
  const map = { pending: '#f59e0b', shipped: '#6366f1', delivered: '#10b981', cancelled: '#ef4444' };
  return map[status] || '#6b7280';
};

const statusLabel = (status) => {
  const map = { pending: 'En attente', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé' };
  return map[status] || status || '—';
};

onMounted(async () => {
  const [statsRes, productsRes, ordersRes] = await Promise.allSettled([
    apiClient.get('/orders/seller-stats'),
    apiClient.get('/user/mesProduits'),
    apiClient.get('/orders/seller'),
  ]);

  if (statsRes.status === 'fulfilled') {
    stats.value = statsRes.value.data.data || {};
  }
  loading.value = false;

  if (productsRes.status === 'fulfilled') {
    const d = productsRes.value.data;
    // Handle both { data: [...] } and { produits: [...] } or direct [...]
    products.value = d.data || d.produits || (Array.isArray(d) ? d : []);
  }
  productsLoading.value = false;

  if (ordersRes.status === 'fulfilled') {
    const d = ordersRes.value.data;
    recentOrders.value = d.data || (Array.isArray(d) ? d : []);
  }
  ordersLoading.value = false;
});
</script>
