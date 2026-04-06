<template>
  <div class="p-4 md:p-8 animate-fade-in">
    <div class="mb-6">
      <h1 class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">Finances</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">Tableau financier de la plateforme</p>
    </div>


    <!-- KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="kpi in kpiCards" :key="kpi.label"
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
        <h2 class="font-black text-base" :style="{ color: 'var(--color-text-main)' }">Transactions</h2>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { DollarSign, TrendingUp, Layers, Search } from 'lucide-vue-next';

import apiClient from '../../api/index.js';

const financeStats = ref(null);
const transactions = ref([]);
const loading = ref(true);
const search = ref('');
const typeFilter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const lastPage = ref(1);

const kpiCards = computed(() => !financeStats.value ? [] : [
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

onMounted(async () => {
  try {
    const { data } = await apiClient.get('/admin/finance/stats');
    financeStats.value = data;
  } catch (e) { console.error(e); }
  fetchTransactions();
});
</script>
