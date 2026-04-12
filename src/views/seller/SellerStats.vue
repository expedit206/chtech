<template>
  <div class="p-4 md:p-8 space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">
          Résumé Financier
        </h1>
        <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">Performances et revenus de votre boutique</p>
      </div>
    </div>

    <!-- KPI Cards -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="h-28 rounded-2xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="kpi in kpis" :key="kpi.label"
        class="rounded-2xl border p-5 flex flex-col gap-3 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-default"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl"
          :style="{ backgroundColor: kpi.color }"></div>

        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            :style="{ backgroundColor: kpi.color + '20', color: kpi.color }">
            <component :is="kpi.icon" :size="20" />
          </div>
          <span v-if="kpi.badge" class="text-[10px] font-bold px-2 py-0.5 rounded-full"
            :style="{ backgroundColor: kpi.badgeColor + '20', color: kpi.badgeColor }">
            {{ kpi.badge }}
          </span>
        </div>
        <div>
          <p class="text-xl font-black tracking-tight" :style="{ color: 'var(--color-text-main)' }">{{ kpi.value }}</p>
          <p class="text-xs font-medium mt-0.5" :style="{ color: 'var(--color-text-sub)' }">{{ kpi.label }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Line chart — CA mensuel -->
      <div class="lg:col-span-2 rounded-2xl border p-6"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-black text-base flex items-center gap-2" :style="{ color: 'var(--color-text-main)' }">
            <TrendingUp :size="18" class="text-emerald-500" /> Chiffre d'affaires mensuel
          </h2>
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500">12 derniers mois</span>
        </div>
        <div v-if="financeLoading" class="h-[220px] rounded-xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
        <div v-else class="h-[220px]">
          <Line :data="revenueChartData" :options="lineChartOptions" />
        </div>
      </div>

      <!-- Doughnut — Répartition statuts -->
      <div class="rounded-2xl border p-6"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <h2 class="font-black text-base mb-5 flex items-center gap-2" :style="{ color: 'var(--color-text-main)' }">
          <PieChart :size="18" class="text-indigo-500" /> Statuts commandes
        </h2>
        <div v-if="financeLoading" class="h-[220px] rounded-xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
        <div v-else-if="hasDoughnutData" class="h-[220px] flex items-center justify-center">
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
        <div v-else class="h-[220px] flex flex-col items-center justify-center gap-3 opacity-40">
          <ShoppingCart :size="40" />
          <p class="text-sm font-bold">Aucune commande</p>
        </div>
      </div>
    </div>

    <!-- Top Products table -->
    <div class="rounded-2xl border overflow-hidden"
      :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }">
      <div class="px-6 py-4 border-b flex items-center justify-between"
        :style="{ borderColor: 'var(--color-border)' }">
        <h2 class="font-black text-base flex items-center gap-2" :style="{ color: 'var(--color-text-main)' }">
          <Award :size="18" class="text-amber-500" /> Top Produits par Revenus
        </h2>
      </div>

      <div v-if="financeLoading" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="h-14 rounded-xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
      </div>
      <div v-else-if="finance.top_products?.length === 0" class="p-10 text-center">
        <Package :size="40" class="mx-auto mb-3 opacity-20" :style="{ color: 'var(--color-text-sub)' }" />
        <p class="text-sm opacity-50" :style="{ color: 'var(--color-text-sub)' }">Aucune vente enregistrée.</p>
      </div>
      <div v-else class="divide-y" :style="{ divideColor: 'var(--color-border)' }">
        <div v-for="(product, idx) in finance.top_products" :key="product.id"
          class="flex items-center gap-4 px-6 py-4 hover:bg-opacity-50 transition-colors"
          :style="{ color: 'var(--color-text-main)' }">
          <!-- Rank -->
          <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            :style="{ backgroundColor: rankColor(idx) + '20', color: rankColor(idx) }">
            {{ idx + 1 }}
          </span>
          <!-- Photo -->
          <img :src="productPhoto(product.photo)" class="w-10 h-10 rounded-xl object-cover border flex-shrink-0"
            :style="{ borderColor: 'var(--color-border)' }" />
          <!-- Nom + orders -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm truncate">{{ product.nom }}</p>
            <p class="text-xs" :style="{ color: 'var(--color-text-sub)' }">{{ product.orders }} commande(s)</p>
          </div>
          <!-- Revenue -->
          <p class="text-sm font-black flex-shrink-0" :style="{ color: 'var(--color-primary)' }">
            {{ Number(product.revenue).toLocaleString('fr-FR') }} FCFA
          </p>
          <!-- Bar -->
          <div class="hidden md:block w-24 h-1.5 rounded-full overflow-hidden flex-shrink-0"
            style="background: rgba(99,102,241,0.1)">
            <div class="h-full rounded-full transition-all duration-700"
              :style="{ width: revenueBarPct(product.revenue, finance.top_products) + '%', background: 'var(--color-primary)' }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent orders from customers -->
    <div class="rounded-2xl border overflow-hidden"
      :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }">
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
  TrendingUp, ShoppingCart, Package, Award, PieChart
} from 'lucide-vue-next';
import apiClient from '../../api/index.js';
import { CONFIG } from '../../config/index.js';
import { useSeo } from '../../composables/useSeo.js';
import { useTheme } from '../../composables/useTheme.js';

// Chart.js
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  LineElement, PointElement,
  CategoryScale, LinearScale,
  ArcElement, Filler,
} from 'chart.js';
import { Line, Doughnut } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Filler);

useSeo({ title: 'Résumé Financier - SASAYEE', description: 'Vue détaillée de vos revenus et performances de vente sur SASAYEE.' });

const { theme } = useTheme();
const loading = ref(true);
const financeLoading = ref(true);
const ordersLoading = ref(true);

const stats = ref({});
const finance = ref({ chart: { labels: [], monthly_revenue: [] }, top_products: [], status_breakdown: {}, kpis: {} });
const recentOrders = ref([]);

// ---- KPI Cards ----
const kpis = computed(() => [
  {
    icon: TrendingUp,
    label: 'Revenu confirmé (livré)',
    value: `${Number(finance.value.kpis?.total_revenue || stats.value.total_revenue || 0).toLocaleString('fr-FR')} FCFA`,
    color: '#10b981',
    badge: 'Confirmé',
    badgeColor: '#10b981',
  },
  {
    icon: ShoppingCart,
    label: 'Revenu en attente',
    value: `${Number(finance.value.kpis?.pending_revenue || 0).toLocaleString('fr-FR')} FCFA`,
    color: '#f59e0b',
    badge: finance.value.kpis?.pending_revenue > 0 ? 'En cours' : null,
    badgeColor: '#f59e0b',
  },
  {
    icon: Package,
    label: 'Total commandes',
    value: finance.value.kpis?.total_orders || stats.value.total_orders || 0,
    color: '#6366f1',
  },
  {
    icon: TrendingUp,
    label: 'Valeur moy. commande',
    value: `${Number(finance.value.kpis?.avg_order_value || 0).toLocaleString('fr-FR')} FCFA`,
    color: '#ec4899',
  },
]);

// ---- Chart Options ----
const lineChartOptions = computed(() => {
  const isDark = theme.value === 'dark';
  const textColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#cbd5e1' : '#475569',
        borderColor: 'rgba(16,185,129,0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (ctx) => ` ${Number(ctx.parsed.y).toLocaleString('fr-FR')} FCFA`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { size: 10, weight: 'bold' },
          callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 9, weight: 'bold' } },
      },
    },
  };
});

const doughnutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: theme.value === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
        font: { size: 10, weight: 'bold' },
        padding: 10,
        boxWidth: 10,
        boxHeight: 10,
        borderRadius: 4,
      },
    },
    tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}` } },
  },
}));

// ---- Chart Data ----
const revenueChartData = computed(() => {
  const chart = finance.value.chart;
  return {
    labels: (chart.labels || []).map(formatMonthLabel),
    datasets: [{
      label: 'Revenus',
      data: chart.monthly_revenue || [],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.08)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }],
  };
});

const hasDoughnutData = computed(() => {
  const bd = finance.value.status_breakdown || {};
  return Object.values(bd).some(v => v > 0);
});

const doughnutData = computed(() => {
  const bd = finance.value.status_breakdown || {};
  return {
    labels: ['Livré', 'En attente', 'Expédié', 'Annulé'],
    datasets: [{
      data: [bd.delivered || 0, bd.pending || 0, bd.shipped || 0, bd.cancelled || 0],
      backgroundColor: ['#10b981', '#f59e0b', '#6366f1', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };
});

// ---- Helpers ----
const productPhoto = (photo) => {
  if (!photo) return `https://ui-avatars.com/api/?name=P&background=efefef&size=64`;
  return photo.startsWith('http') ? photo : `${CONFIG.STORAGE_URL}${photo}`;
};

const formatMonthLabel = (label) => {
  if (!label) return label;
  const [month, year] = label.split('/');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
};

const revenueBarPct = (revenue, products) => {
  const max = Math.max(...products.map(p => p.revenue));
  return max > 0 ? Math.round((revenue / max) * 100) : 0;
};

const rankColor = (idx) => ['#f59e0b', '#94a3b8', '#cd7c2f', '#6366f1', '#10b981'][idx] || '#6b7280';

const statusColor = (status) => {
  const map = { pending: '#f59e0b', shipped: '#6366f1', delivered: '#10b981', cancelled: '#ef4444' };
  return map[status] || '#6b7280';
};

const statusLabel = (status) => {
  const map = { pending: 'En attente', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé' };
  return map[status] || status || '—';
};

onMounted(async () => {
  const [statsRes, financeRes, ordersRes] = await Promise.allSettled([
    apiClient.get('/orders/seller-stats'),
    apiClient.get('/orders/seller-finance'),
    apiClient.get('/orders/seller'),
  ]);

  if (statsRes.status === 'fulfilled') {
    stats.value = statsRes.value.data.data || {};
  }
  loading.value = false;

  if (financeRes.status === 'fulfilled') {
    finance.value = financeRes.value.data.data || finance.value;
  }
  financeLoading.value = false;

  if (ordersRes.status === 'fulfilled') {
    const d = ordersRes.value.data;
    recentOrders.value = d.data || (Array.isArray(d) ? d : []);
  }
  ordersLoading.value = false;
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
