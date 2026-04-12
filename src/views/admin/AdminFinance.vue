<template>
  <div class="p-4 md:p-8 animate-fade-in space-y-8">
    <div class="mb-2">
      <h1 class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">Finances</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">Tableau financier de la plateforme</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b" :style="{ borderColor: 'var(--color-border)' }">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="px-5 py-2.5 text-sm font-bold transition-all border-b-2 -mb-px"
        :class="activeTab === tab.id
          ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
          : 'border-transparent opacity-50 hover:opacity-80'"
        :style="{ color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-sub)' }">
        {{ tab.label }}
      </button>
    </div>

    <!-- ==================== TAB: COMMANDES ==================== -->
    <template v-if="activeTab === 'orders'">
      <!-- KPI Cards commandes -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-if="orderStatsLoading" v-for="i in 4" :key="i"
          class="h-28 rounded-2xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
        <div v-else v-for="kpi in orderKpiCards" :key="kpi.label"
          class="rounded-2xl p-5 border flex flex-col gap-3 group hover:shadow-lg transition-all cursor-default"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wide opacity-50"
              :style="{ color: 'var(--color-text-sub)' }">{{ kpi.label }}</span>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              :style="{ backgroundColor: kpi.color + '20', color: kpi.color }">
              <component :is="kpi.icon" :size="18" />
            </div>
          </div>
          <div class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">
            {{ kpi.valueStr }}
          </div>
          <p class="text-[10px] font-bold opacity-40" :style="{ color: 'var(--color-text-sub)' }">{{ kpi.sub }}</p>
        </div>
      </div>

      <!-- Charts: Bar + Doughnut -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Bar chart — Revenus + Commandes mensuel -->
        <div class="lg:col-span-2 rounded-2xl border p-6"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-black text-base flex items-center gap-2" :style="{ color: 'var(--color-text-main)' }">
              <BarChart2 :size="18" class="text-indigo-500" /> Revenus & Commandes (12 mois)
            </h2>
          </div>
          <div v-if="orderStatsLoading" class="h-[240px] rounded-xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
          <div v-else class="h-[240px]">
            <Bar :data="orderBarChartData" :options="barChartOptions" />
          </div>
        </div>

        <!-- Doughnut — Répartition statuts -->
        <div class="rounded-2xl border p-6"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <h2 class="font-black text-base mb-5 flex items-center gap-2" :style="{ color: 'var(--color-text-main)' }">
            <PieChart :size="18" class="text-amber-500" /> Statuts commandes
          </h2>
          <div v-if="orderStatsLoading" class="h-[240px] rounded-xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
          <div v-else-if="hasOrderDoughnutData" class="h-[240px] flex items-center justify-center">
            <Doughnut :data="orderDoughnutData" :options="doughnutOptions" />
          </div>
          <div v-else class="h-[240px] flex flex-col items-center justify-center gap-3 opacity-40">
            <ShoppingCart :size="40" />
            <p class="text-sm font-bold">Aucune commande</p>
          </div>
        </div>
      </div>

      <!-- Top Sellers + Top Products -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Vendeurs -->
        <div class="rounded-2xl border overflow-hidden"
          :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }">
          <div class="px-6 py-4 border-b flex items-center gap-2" :style="{ borderColor: 'var(--color-border)' }">
            <Award :size="18" class="text-amber-500" />
            <h2 class="font-black text-base" :style="{ color: 'var(--color-text-main)' }">Top Vendeurs</h2>
          </div>
          <div v-if="orderStatsLoading" class="p-6 space-y-3">
            <div v-for="i in 5" :key="i" class="h-12 rounded-xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
          </div>
          <div v-else-if="!orderStats.top_sellers?.length" class="p-10 text-center opacity-40">
            <Users :size="40" class="mx-auto mb-2" />
            <p class="text-sm font-bold">Aucune donnée</p>
          </div>
          <div v-else class="divide-y" :style="{ divideColor: 'var(--color-border)' }">
            <div v-for="(seller, idx) in orderStats.top_sellers" :key="seller.id"
              class="flex items-center gap-4 px-6 py-3">
              <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                :style="{ backgroundColor: rankColor(idx) + '20', color: rankColor(idx) }">{{ idx + 1 }}</span>
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                {{ (seller.nom || 'V')[0].toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm truncate" :style="{ color: 'var(--color-text-main)' }">{{ seller.nom }}</p>
                <p class="text-xs" :style="{ color: 'var(--color-text-sub)' }">{{ seller.orders }} commande(s)</p>
              </div>
              <p class="text-sm font-black flex-shrink-0" :style="{ color: 'var(--color-primary)' }">
                {{ Number(seller.revenue).toLocaleString('fr-FR') }} FCFA
              </p>
            </div>
          </div>
        </div>

        <!-- Top Produits -->
        <div class="rounded-2xl border overflow-hidden"
          :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }">
          <div class="px-6 py-4 border-b flex items-center gap-2" :style="{ borderColor: 'var(--color-border)' }">
            <Package :size="18" class="text-emerald-500" />
            <h2 class="font-black text-base" :style="{ color: 'var(--color-text-main)' }">Top Produits</h2>
          </div>
          <div v-if="orderStatsLoading" class="p-6 space-y-3">
            <div v-for="i in 5" :key="i" class="h-12 rounded-xl animate-pulse" :style="{ backgroundColor: 'var(--color-border)' }"></div>
          </div>
          <div v-else-if="!orderStats.top_products?.length" class="p-10 text-center opacity-40">
            <Package :size="40" class="mx-auto mb-2" />
            <p class="text-sm font-bold">Aucune donnée</p>
          </div>
          <div v-else class="divide-y" :style="{ divideColor: 'var(--color-border)' }">
            <div v-for="(product, idx) in orderStats.top_products" :key="product.id"
              class="flex items-center gap-4 px-6 py-3">
              <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                :style="{ backgroundColor: rankColor(idx) + '20', color: rankColor(idx) }">{{ idx + 1 }}</span>
              <img :src="productPhoto(product.photo)" class="w-9 h-9 rounded-xl object-cover border flex-shrink-0"
                :style="{ borderColor: 'var(--color-border)' }" />
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm truncate" :style="{ color: 'var(--color-text-main)' }">{{ product.nom }}</p>
                <p class="text-xs" :style="{ color: 'var(--color-text-sub)' }">{{ product.orders }} commande(s)</p>
              </div>
              <p class="text-sm font-black flex-shrink-0" :style="{ color: 'var(--color-primary)' }">
                {{ Number(product.revenue).toLocaleString('fr-FR') }} FCFA
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ==================== TAB: JETONS / TRANSACTIONS ==================== -->
    <template v-if="activeTab === 'jetons'">
      <!-- KPI Cards jetons -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <div v-for="kpi in jetonKpiCards" :key="kpi.label"
          class="rounded-2xl p-5 border flex flex-col gap-3 group hover:shadow-lg transition-all"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wide opacity-50"
              :style="{ color: 'var(--color-text-sub)' }">{{ kpi.label }}</span>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              :style="{ backgroundColor: kpi.color + '20', color: kpi.color }">
              <component :is="kpi.icon" :size="18" />
            </div>
          </div>
          <div class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">
            {{ Number(kpi.value ?? 0).toLocaleString() }}
            <span class="text-xs font-bold opacity-50 ml-1">FCFA</span>
          </div>
        </div>
      </div>

      <!-- Transactions table -->
      <div class="rounded-2xl border overflow-hidden"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <div class="px-6 py-5 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          :style="{ borderColor: 'var(--color-border)' }">
          <h2 class="font-black text-base" :style="{ color: 'var(--color-text-main)' }">Transactions Jetons</h2>
          <div class="flex gap-2 flex-wrap">
            <div class="relative">
              <Search :size="14" class="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
              <input v-model="search" @input="debouncedFetch" placeholder="Rechercher..."
                class="pl-8 pr-3 py-2 rounded-xl border text-xs outline-none w-40"
                :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
            </div>
            <select v-model="typeFilter" @change="fetchTransactions()"
              class="px-3 py-2 rounded-xl border text-xs outline-none"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
              <option value="">Tous types</option>
              <option value="platform">Plateforme</option>
              <option value="marketplace">Marketplace</option>
            </select>
            <select v-model="statusFilter" @change="fetchTransactions()"
              class="px-3 py-2 rounded-xl border text-xs outline-none"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
              <option value="">Tous statuts</option>
              <option value="confirmé">Confirmé</option>
              <option value="en_attente">En attente</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center py-16">
          <div class="w-8 h-8 border-4 rounded-full animate-spin"
            style="border-color: var(--color-primary) transparent var(--color-primary) transparent" />
        </div>
        <div v-else-if="transactions.length === 0" class="flex flex-col items-center py-20 gap-3">
          <DollarSign :size="48" class="opacity-10" />
          <p class="font-bold opacity-40" :style="{ color: 'var(--color-text-sub)' }">Aucune transaction</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b text-left text-xs font-black uppercase tracking-widest"
                :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-sub)' }">
                <th class="px-6 py-4">Référence</th>
                <th class="px-6 py-4 hidden md:table-cell">Acheteur</th>
                <th class="px-6 py-4 hidden md:table-cell">Vendeur</th>
                <th class="px-6 py-4">Montant</th>
                <th class="px-6 py-4 hidden sm:table-cell">Type</th>
                <th class="px-6 py-4">Statut</th>
                <th class="px-6 py-4 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in transactions" :key="tx.id" class="border-b"
                :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
                <td class="px-6 py-4 font-mono text-xs opacity-60">{{ tx.notchpay_reference?.slice(0, 12) ?? 'N/A' }}...</td>
                <td class="px-6 py-4 hidden md:table-cell text-sm">{{ tx.acheteur?.nom ?? '—' }}</td>
                <td class="px-6 py-4 hidden md:table-cell text-sm">{{ tx.vendeur?.nom ?? '—' }}</td>
                <td class="px-6 py-4 text-sm font-black" :style="{ color: 'var(--color-primary)' }">
                  {{ Number(tx.montant_total ?? 0).toLocaleString() }} FCFA
                </td>
                <td class="px-6 py-4 hidden sm:table-cell">
                  <span class="text-[10px] font-black px-2 py-1 rounded-full"
                    :class="tx.type === 'platform' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-teal-500/15 text-teal-400'">
                    {{ tx.type }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-[10px] font-black px-2 py-1 rounded-full"
                    :class="{
                      'bg-green-500/15 text-green-400': tx.statut === 'confirmé',
                      'bg-amber-500/15 text-amber-400': tx.statut === 'en_attente',
                      'bg-red-500/15 text-red-400': tx.statut === 'annulé',
                    }">{{ tx.statut }}</span>
                </td>
                <td class="px-6 py-4 hidden lg:table-cell text-xs opacity-50">
                  {{ new Date(tx.created_at).toLocaleDateString('fr-FR') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="lastPage > 1" class="flex items-center justify-between px-6 py-4 border-t"
          :style="{ borderColor: 'var(--color-border)' }">
          <span class="text-xs opacity-50" :style="{ color: 'var(--color-text-sub)' }">Page {{ currentPage }} / {{ lastPage }}</span>
          <div class="flex gap-2">
            <button @click="fetchTransactions(currentPage - 1)" :disabled="currentPage <= 1"
              class="px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-30"
              :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">← Précédent</button>
            <button @click="fetchTransactions(currentPage + 1)" :disabled="currentPage >= lastPage"
              class="px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-30"
              :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">Suivant →</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  DollarSign, TrendingUp, Layers, Search, ShoppingCart,
  BarChart2, PieChart, Award, Package, Users, CheckCircle,
} from 'lucide-vue-next';
import apiClient from '../../api/index.js';
import { CONFIG } from '../../config/index.js';
import { useTheme } from '../../composables/useTheme.js';

// Chart.js
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const { theme } = useTheme();

// ----- Tabs -----
const tabs = [
  { id: 'orders', label: '📦 Commandes Produits' },
  { id: 'jetons', label: '💰 Transactions Jetons' },
];
const activeTab = ref('orders');

// ----- Jeton Finance (existing) -----
const financeStats = ref(null);
const transactions = ref([]);
const loading = ref(true);
const search = ref('');
const typeFilter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const lastPage = ref(1);

const jetonKpiCards = computed(() => !financeStats.value ? [] : [
  { label: 'Volume total', value: financeStats.value.total_volume, icon: DollarSign, color: '#22c55e' },
  { label: 'Commissions', value: financeStats.value.total_commission, icon: TrendingUp, color: '#6366f1' },
  { label: 'Ventes plateforme', value: financeStats.value.platform_sales, icon: Layers, color: '#f59e0b' },
  { label: 'Volume marketplace', value: financeStats.value.marketplace_volume, icon: DollarSign, color: '#0ea5e9' },
]);

let timer = null;
const debouncedFetch = () => { clearTimeout(timer); timer = setTimeout(() => fetchTransactions(), 350); };

const fetchTransactions = async (page = 1) => {
  loading.value = true;
  currentPage.value = page;
  try {
    const params = { page };
    if (search.value) params.search = search.value;
    if (typeFilter.value) params.type = typeFilter.value;
    if (statusFilter.value) params.status = statusFilter.value;
    const { data } = await apiClient.get('/admin/finance/transactions', { params });
    transactions.value = data.data;
    lastPage.value = data.last_page;
  } catch (e) { console.error(e); } finally { loading.value = false; }
};

// ----- Order Finance (new) -----
const orderStats = ref({ chart: { labels: [], monthly_revenue: [], monthly_orders: [] }, status_breakdown: {}, top_sellers: [], top_products: [], kpis: {} });
const orderStatsLoading = ref(true);

const orderKpiCards = computed(() => [
  {
    label: 'Revenu livré',
    valueStr: `${Number(orderStats.value.kpis?.total_revenue || 0).toLocaleString('fr-FR')} FCFA`,
    icon: TrendingUp, color: '#10b981',
    sub: 'Commandes livrées',
  },
  {
    label: 'Revenu en cours',
    valueStr: `${Number(orderStats.value.kpis?.pending_revenue || 0).toLocaleString('fr-FR')} FCFA`,
    icon: ShoppingCart, color: '#f59e0b',
    sub: 'En attente + expédié',
  },
  {
    label: 'Commandes totales',
    valueStr: String(orderStats.value.kpis?.total_orders || 0),
    icon: Package, color: '#6366f1',
    sub: `${orderStats.value.kpis?.delivered_orders || 0} livrées`,
  },
  {
    label: 'Valeur moy. commande',
    valueStr: `${Number(orderStats.value.kpis?.avg_order_value || 0).toLocaleString('fr-FR')} FCFA`,
    icon: DollarSign, color: '#0ea5e9',
    sub: 'Toutes commandes',
  },
]);

// ----- Chart Options -----
const barChartOptions = computed(() => {
  const isDark = theme.value === 'dark';
  const textColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: textColor,
          font: { size: 10, weight: 'bold' },
          boxWidth: 10, boxHeight: 10, borderRadius: 4,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#cbd5e1' : '#475569',
        borderColor: 'rgba(99,102,241,0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (ctx) => ctx.datasetIndex === 0
            ? ` ${Number(ctx.parsed.y).toLocaleString('fr-FR')} FCFA`
            : ` ${ctx.parsed.y} commande(s)`,
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { size: 9, weight: 'bold' },
          callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        grid: { drawOnChartArea: false },
        ticks: { color: textColor, font: { size: 9, weight: 'bold' } },
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
  cutout: '68%',
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: theme.value === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
        font: { size: 10, weight: 'bold' },
        padding: 10,
        boxWidth: 10, boxHeight: 10, borderRadius: 4,
      },
    },
    tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}` } },
  },
}));

// ----- Chart Data -----
const orderBarChartData = computed(() => {
  const c = orderStats.value.chart;
  return {
    labels: (c.labels || []).map(l => {
        if (!l) return l;
        const [month, year] = l.split('/');
        const date = new Date(Number(year), Number(month) - 1, 1);
        return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Revenus (FCFA)',
        data: c.monthly_revenue || [],
        backgroundColor: 'rgba(99,102,241,0.75)',
        borderRadius: 6,
        barThickness: 16,
        yAxisID: 'y',
      },
      {
        label: 'Commandes',
        data: c.monthly_orders || [],
        backgroundColor: 'rgba(16,185,129,0.65)',
        borderRadius: 6,
        barThickness: 16,
        yAxisID: 'y1',
      },
    ],
  };
});

const hasOrderDoughnutData = computed(() => {
  const bd = orderStats.value.status_breakdown || {};
  return Object.values(bd).some(v => v > 0);
});

const orderDoughnutData = computed(() => {
  const bd = orderStats.value.status_breakdown || {};
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

// ----- Helpers -----
const productPhoto = (photo) => {
  if (!photo) return `https://ui-avatars.com/api/?name=P&background=efefef&size=64`;
  return photo.startsWith('http') ? photo : `${CONFIG.STORAGE_URL}${photo}`;
};

const rankColor = (idx) => ['#f59e0b', '#94a3b8', '#cd7c2f', '#6366f1', '#10b981'][idx] || '#6b7280';

// ----- Mount -----
onMounted(async () => {
  const [jetonRes, txRes, orderRes] = await Promise.allSettled([
    apiClient.get('/admin/finance/stats'),
    apiClient.get('/admin/finance/transactions', { params: { page: 1 } }),
    apiClient.get('/admin/finance/order-stats'),
  ]);

  if (jetonRes.status === 'fulfilled') financeStats.value = jetonRes.value.data;
  if (txRes.status === 'fulfilled') {
    transactions.value = txRes.value.data.data;
    lastPage.value = txRes.value.data.last_page;
    loading.value = false;
  } else {
    loading.value = false;
  }
  if (orderRes.status === 'fulfilled') {
    orderStats.value = orderRes.value.data.data || orderStats.value;
  }
  orderStatsLoading.value = false;
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
