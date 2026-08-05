<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)]">
      <h1 class="text-2xl font-black text-[var(--color-text-main)] flex items-center gap-2">
        <DollarSign class="text-[var(--color-primary)]" :size="28" />
        Mes Codes Promo & Commissions Ambassadeur
      </h1>
      <p class="text-sm text-[var(--color-text-sub)] mt-1">
        Suivez les utilisations de vos codes promo et consultez vos gains en commission.
      </p>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div class="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)]">
          <p class="text-xs font-bold text-[var(--color-text-sub)] uppercase">Solde Disponible / Crédité</p>
          <p class="text-2xl font-black text-emerald-600 mt-1">{{ formatMoney(stats.credited_balance) }}</p>
        </div>
        <div class="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)]">
          <p class="text-xs font-bold text-[var(--color-text-sub)] uppercase">Commissions En Attente</p>
          <p class="text-2xl font-black text-amber-500 mt-1">{{ formatMoney(stats.pending_balance) }}</p>
        </div>
        <div class="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)]">
          <p class="text-xs font-bold text-[var(--color-text-sub)] uppercase">Total Cumulé Gagné</p>
          <p class="text-2xl font-black text-[var(--color-primary)] mt-1">{{ formatMoney(stats.total_earned) }}</p>
        </div>
      </div>
    </div>

    <!-- Mes Codes Promo Attribués -->
    <div class="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)]">
      <h2 class="text-lg font-black text-[var(--color-text-main)] mb-4 flex items-center gap-2">
        <Ticket :size="20" class="text-[var(--color-primary)]" />
        Mes Codes Promotionnels
      </h2>

      <div v-if="myCodes.length === 0" class="p-6 text-center text-sm text-[var(--color-text-sub)] bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
        Aucun code promo ne vous a été attribué pour le moment.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="code in myCodes"
          :key="code.id"
          class="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] space-y-2 relative overflow-hidden"
        >
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-mono font-black text-base rounded-lg tracking-wider">
              {{ code.code }}
            </span>
            <span class="text-xs px-2.5 py-1 rounded-full font-bold" :class="code.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'">
              {{ code.is_active ? 'Actif' : 'Inactif' }}
            </span>
          </div>

          <p v-if="code.description" class="text-xs text-[var(--color-text-sub)]">{{ code.description }}</p>

          <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[var(--color-border)]">
            <div>
              <span class="text-[var(--color-text-sub)] block">Réduction Client:</span>
              <span class="font-bold">
                {{ code.discount_type === 'percentage' ? `-${code.discount_value}%` : `-${formatMoney(code.discount_value)}` }}
              </span>
            </div>
            <div>
              <span class="text-[var(--color-text-sub)] block">Votre Commission:</span>
              <span class="font-bold text-emerald-600">
                {{ code.commission_type === 'percentage' ? `${code.commission_value}% par vente` : `${formatMoney(code.commission_value)} / vente` }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-[var(--color-text-sub)] pt-2 border-t border-[var(--color-border)]">
            <span>Utilisations: <strong>{{ code.used_count }}</strong></span>
            <span>Gains générés: <strong class="text-emerald-600">{{ formatMoney(code.total_commissions_earned) }}</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Historique des Commissions -->
    <div class="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)]">
      <h2 class="text-lg font-black text-[var(--color-text-main)] mb-4">Historique des Commissions</h2>

      <div v-if="isLoading" class="p-8 text-center text-sm text-[var(--color-text-sub)]">
        Chargement de l'historique...
      </div>

      <div v-else-if="commissionsList.length === 0" class="p-6 text-center text-sm text-[var(--color-text-sub)] bg-[var(--color-bg)] rounded-xl">
        Aucune transaction de commission enregistrée.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-[var(--color-border)] text-xs uppercase text-[var(--color-text-sub)]">
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4">Code Promo</th>
              <th class="py-3 px-4">Commande</th>
              <th class="py-3 px-4">Montant</th>
              <th class="py-3 px-4">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="comm in commissionsList" :key="comm.id">
              <td class="py-3 px-4 text-xs">{{ formatDate(comm.created_at) }}</td>
              <td class="py-3 px-4 font-mono font-bold text-[var(--color-primary)]">
                {{ comm.promo_code?.code || 'N/A' }}
              </td>
              <td class="py-3 px-4 text-xs font-mono">#{{ comm.order_id?.substring(0, 8) }}</td>
              <td class="py-3 px-4 font-black text-emerald-600">+{{ formatMoney(comm.amount) }}</td>
              <td class="py-3 px-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="{
                    'bg-emerald-500/10 text-emerald-600': comm.status === 'credited',
                    'bg-amber-500/10 text-amber-600': comm.status === 'pending',
                    'bg-red-500/10 text-red-500': comm.status === 'cancelled',
                  }"
                >
                  {{ comm.status === 'credited' ? 'Crédité' : (comm.status === 'pending' ? 'En attente' : 'Annulé') }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { DollarSign, Ticket } from 'lucide-vue-next';
import apiClient from '../../api/index.js';

const myCodes = ref([]);
const commissionsList = ref([]);
const stats = ref({
  total_earned: 0,
  credited_balance: 0,
  pending_balance: 0,
});
const isLoading = ref(true);

const formatMoney = (val) => `${Number(val || 0).toLocaleString('fr-FR')} FCFA`;
const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [codesRes, commsRes] = await Promise.all([
      apiClient.get('/user/promo-codes'),
      apiClient.get('/user/commissions'),
    ]);

    myCodes.value = codesRes.data.data || [];
    commissionsList.value = commsRes.data.data.data || commsRes.data.data || [];
    stats.value = commsRes.data.stats || stats.value;
  } catch (err) {
    console.error("Erreur chargement commissions:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);
</script>
