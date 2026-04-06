<template>
  <div class="p-4 md:p-8 animate-fade-in">

    <div v-if="loading" class="flex justify-center py-24">
      <div class="w-10 h-10 border-4 rounded-full animate-spin"
        style="border-color: var(--color-primary) transparent var(--color-primary) transparent" />
    </div>

    <template v-else>
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">Tableau de bord</h1>
        <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">Vue d'ensemble de la plateforme</p>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="kpi in kpiCards" :key="kpi.label"
          class="rounded-2xl p-5 flex flex-col gap-3 border hover:shadow-lg transition-all group"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wide opacity-60"
              :style="{ color: 'var(--color-text-sub)' }">{{ kpi.label }}</span>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              :style="{ backgroundColor: kpi.color + '20', color: kpi.color }">
              <component :is="kpi.icon" :size="18" />
            </div>
          </div>
          <div class="text-3xl font-black" :style="{ color: 'var(--color-text-main)' }">
            {{ kpi.value?.toLocaleString() ?? '—' }}
          </div>
          <div class="text-xs font-medium opacity-60" :style="{ color: 'var(--color-text-sub)' }">
            {{ kpi.sub }}
          </div>
        </div>
      </div>

      <!-- Two columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Finance summary -->
        <div class="rounded-2xl border p-6"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <h2 class="text-base font-black mb-5 flex items-center gap-2" :style="{ color: 'var(--color-text-main)' }">
            <DollarSign :size="18" style="color: #22c55e" /> Finances
          </h2>
          <div class="space-y-4">
            <div v-for="f in financeRows" :key="f.label" class="flex items-center justify-between">
              <span class="text-sm" :style="{ color: 'var(--color-text-sub)' }">{{ f.label }}</span>
              <span class="text-sm font-black" :style="{ color: 'var(--color-text-main)' }">
                {{ Number(f.value).toLocaleString() }} FCFA
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="rounded-2xl border p-6"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <h2 class="text-base font-black mb-5 flex items-center gap-2" :style="{ color: 'var(--color-text-main)' }">
            <Zap :size="18" style="color: #f59e0b" /> Actions Rapides
          </h2>
          <div class="grid grid-cols-2 gap-3">
            <RouterLink v-for="a in quickActions" :key="a.name" :to="a.route"
              class="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:scale-105 active:scale-95 group"
              :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                :style="{ backgroundColor: a.color + '15', color: a.color }">
                <component :is="a.icon" :size="20" />
              </div>
              <span class="text-xs font-bold text-center" :style="{ color: 'var(--color-text-main)' }">
                {{ a.name }}
              </span>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Detail Stats -->
      <div class="rounded-2xl border p-6"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <h2 class="text-base font-black mb-5 flex items-center gap-2" :style="{ color: 'var(--color-text-main)' }">
          <Activity :size="18" style="color: #6366f1" /> Statistiques Détaillées
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="s in detailStats" :key="s.label"
            class="flex flex-col gap-1 p-4 rounded-xl" :style="{ backgroundColor: 'var(--color-bg)' }">
            <span class="text-xs uppercase font-black tracking-wide opacity-50"
              :style="{ color: 'var(--color-text-sub)' }">{{ s.label }}</span>
            <span class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">
              {{ s.value?.toLocaleString() ?? '—' }}
            </span>
            <div class="h-1.5 rounded-full mt-1 overflow-hidden" style="background: rgba(99,102,241,0.1)">
              <div class="h-full rounded-full transition-all duration-1000"
                :style="{ width: s.pct + '%', background: 'var(--color-primary)' }" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Users, Package, DollarSign, Store, Activity, Zap, Tag, Megaphone, Crown } from 'lucide-vue-next';
import apiClient from '../../api/index.js';

const loading = ref(true);
const stats = ref(null);
const finance = ref(null);

const kpiCards = computed(() => !stats.value ? [] : [
  { label: 'Utilisateurs', value: stats.value.users?.total, sub: `+${stats.value.users?.today ?? 0} aujourd'hui`, icon: Users, color: '#6366f1' },
  { label: 'Premium', value: stats.value.users?.premium, sub: 'Abonnés actifs', icon: Crown, color: '#f59e0b' },
  { label: 'Produits', value: stats.value.marketplace?.products_total, sub: 'En ligne', icon: Package, color: '#22c55e' },
  { label: 'Reventes en attente', value: stats.value.marketplace?.pending_reventes, sub: 'À traiter', icon: Store, color: '#ef4444' },
]);

const financeRows = computed(() => !finance.value ? [] : [
  { label: 'Volume total transactions', value: finance.value.total_volume ?? 0 },
  { label: 'Commissions plateforme', value: finance.value.total_commission ?? 0 },
  { label: 'Ventes directes', value: finance.value.platform_sales ?? 0 },
  { label: 'Volume marketplace', value: finance.value.marketplace_volume ?? 0 },
]);

const detailStats = computed(() => !stats.value ? [] : [
  { label: 'Total utilisateurs', value: stats.value.users?.total, pct: 100 },
  { label: 'Premium', value: stats.value.users?.premium, pct: stats.value.users?.total ? Math.round(stats.value.users.premium / stats.value.users.total * 100) : 0 },
  { label: 'Produits', value: stats.value.marketplace?.products_total, pct: 75 },
  { label: 'Jetons en circulation', value: stats.value.finance?.total_jetons, pct: 60 },
]);

const quickActions = [
  { name: 'Utilisateurs', route: { name: 'admin-users' }, icon: Users, color: '#6366f1' },
  { name: 'Produits', route: { name: 'admin-products' }, icon: Package, color: '#22c55e' },
  { name: 'Catégories', route: { name: 'admin-categories' }, icon: Tag, color: '#f59e0b' },
  { name: 'Broadcast', route: { name: 'admin-broadcast' }, icon: Megaphone, color: '#ef4444' },
];

onMounted(async () => {
  try {
    const [dashRes, finRes] = await Promise.all([
      apiClient.get('/admin/dashboard').catch(() => ({ data: {} })),
      apiClient.get('/admin/finance/stats').catch(() => ({ data: {} })),
    ]);
    stats.value = dashRes.data || {};
    finance.value = finRes.data || {};
  } catch (e) {
    console.error("Erreur Dashboard:", e);
  } finally {
    loading.value = false;
  }
});
</script>
