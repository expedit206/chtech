<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-[var(--color-text-main)] flex items-center gap-2">
          <Ticket class="text-[var(--color-primary)]" :size="28" />
          Gestion des Codes Promo & Commissions
        </h1>
        <p class="text-sm text-[var(--color-text-sub)] mt-1">
          Créez, attribuez et gérez les codes promotionnels et les commissions ambassadeurs.
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition flex items-center gap-2"
      >
        <Plus :size="18" />
        Nouveau Code Promo
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="relative w-full md:w-80">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-sub)] opacity-50" :size="18" />
        <input
          v-model="searchQuery"
          @input="fetchPromoCodes"
          type="text"
          placeholder="Rechercher un code, ambassadeur..."
          class="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-primary)] transition"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <select
          v-model="statusFilter"
          @change="fetchPromoCodes"
          class="px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm outline-none font-medium"
        >
          <option value="">Tous les statuts</option>
          <option value="true">Actifs</option>
          <option value="false">Inactifs</option>
        </select>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="p-12 text-center text-[var(--color-text-sub)]">
      <Loader2 class="animate-spin inline-block mb-2" :size="32" />
      <p class="text-sm font-medium">Chargement des codes promo...</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[var(--color-border)] bg-[var(--color-bg)] text-[11px] font-black uppercase tracking-wider text-[var(--color-text-sub)]">
              <th class="py-3.5 px-4">Code</th>
              <th class="py-3.5 px-4">Ambassadeur</th>
              <th class="py-3.5 px-4">Réduction Client</th>
              <th class="py-3.5 px-4">Commission</th>
              <th class="py-3.5 px-4">Utilisations</th>
              <th class="py-3.5 px-4">Statut</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)] text-sm">
            <tr v-if="promoCodes.length === 0">
              <td colspan="7" class="py-8 text-center text-[var(--color-text-sub)]">
                Aucun code promo trouvé.
              </td>
            </tr>
            <tr
              v-for="code in promoCodes"
              :key="code.id"
              class="hover:bg-[var(--color-bg)]/50 transition-colors"
            >
              <td class="py-3.5 px-4 font-black text-[var(--color-primary)]">
                <span class="px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 tracking-wide font-mono">
                  {{ code.code }}
                </span>
                <p v-if="code.description" class="text-xs font-normal text-[var(--color-text-sub)] mt-1">
                  {{ code.description }}
                </p>
              </td>

              <td class="py-3.5 px-4">
                <div v-if="code.owner" class="font-medium text-[var(--color-text-main)]">
                  {{ code.owner.nom }}
                  <span class="block text-xs opacity-60">{{ code.owner.email }}</span>
                </div>
                <span v-else class="text-xs opacity-40 italic">Aucun (Code Global)</span>
              </td>

              <td class="py-3.5 px-4 font-bold">
                <span v-if="code.discount_type === 'percentage'">
                  -{{ code.discount_value }}%
                  <span v-if="code.max_discount_amount" class="text-xs block font-normal opacity-60">
                    Plafond: {{ formatMoney(code.max_discount_amount) }}
                  </span>
                </span>
                <span v-else>
                  -{{ formatMoney(code.discount_value) }}
                </span>
                <span v-if="code.min_order_amount > 0" class="text-[10px] block text-[var(--color-text-sub)]">
                  Min: {{ formatMoney(code.min_order_amount) }}
                </span>
              </td>

              <td class="py-3.5 px-4 font-bold text-emerald-600">
                <span v-if="code.commission_type === 'percentage'">
                  {{ code.commission_value }}% du total
                </span>
                <span v-else>
                  {{ formatMoney(code.commission_value) }} / vente
                </span>
                <span class="text-xs block font-normal opacity-60">
                  Généré: {{ formatMoney(code.total_commissions_generated) }}
                </span>
              </td>

              <td class="py-3.5 px-4 font-medium">
                <span class="font-bold">{{ code.used_count }}</span>
                <span v-if="code.usage_limit" class="text-xs opacity-60"> / {{ code.usage_limit }}</span>
              </td>

              <td class="py-3.5 px-4">
                <button
                  @click="toggleStatus(code)"
                  class="px-3 py-1 rounded-full text-xs font-bold transition-all"
                  :class="code.is_active ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'"
                >
                  {{ code.is_active ? 'Actif' : 'Inactif' }}
                </button>
              </td>

              <td class="py-3.5 px-4 text-right space-x-2">
                <button
                  @click="openEditModal(code)"
                  class="p-2 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-sub)] hover:text-[var(--color-primary)] transition"
                >
                  <Edit2 :size="16" />
                </button>
                <button
                  @click="deleteCode(code)"
                  class="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-500 transition"
                >
                  <Trash2 :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form (Créer / Modifier) -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-[var(--color-surface)] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--color-border)] max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
          <h3 class="text-lg font-black text-[var(--color-text-main)]">
            {{ editingCode ? 'Modifier le Code Promo' : 'Créer un Nouveau Code Promo' }}
          </h3>
          <button @click="isModalOpen = false" class="p-1 rounded-lg text-[var(--color-text-sub)] hover:bg-[var(--color-bg)]">
            <X :size="20" />
          </button>
        </div>

        <form @submit.prevent="saveCode" class="space-y-4 text-sm">
          <div>
            <label class="block font-bold text-xs mb-1">Code Promo *</label>
            <input
              v-model="form.code"
              type="text"
              required
              placeholder="EX: SASAYEE2026"
              class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] uppercase font-mono font-bold outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label class="block font-bold text-xs mb-1">Description</label>
            <input
              v-model="form.description"
              type="text"
              placeholder="Ex: Code promo pour ambassadeur Jean"
              class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label class="block font-bold text-xs mb-1">Ambassadeur Propriétaire (Optionnel)</label>
            <select
              v-model="form.user_id"
              class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)]"
            >
              <option :value="null">-- Aucun (Code Global) --</option>
              <option v-for="user in usersList" :key="user.id" :value="user.id">
                {{ user.nom }} ({{ user.email }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-xs mb-1">Type de Réduction *</label>
              <select
                v-model="form.discount_type"
                class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] outline-none"
              >
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed_amount">Montant Fixe (FCFA)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-xs mb-1">Valeur Réduction *</label>
              <input
                v-model.number="form.discount_value"
                type="number"
                step="0.01"
                required
                class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-xs mb-1">Plafond Réduction (FCFA)</label>
              <input
                v-model.number="form.max_discount_amount"
                type="number"
                placeholder="Illimité"
                class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] outline-none"
              />
            </div>
            <div>
              <label class="block font-bold text-xs mb-1">Commande Min. (FCFA)</label>
              <input
                v-model.number="form.min_order_amount"
                type="number"
                placeholder="0"
                class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] outline-none"
              />
            </div>
          </div>

          <div class="border-t border-[var(--color-border)] pt-3">
            <h4 class="font-bold text-xs text-[var(--color-primary)] mb-2 uppercase">Commission Ambassadeur</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-xs mb-1">Type Commission</label>
                <select
                  v-model="form.commission_type"
                  class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] outline-none"
                >
                  <option value="percentage">Pourcentage (%)</option>
                  <option value="fixed_amount">Montant Fixe (FCFA)</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-xs mb-1">Valeur Commission</label>
                <input
                  v-model.number="form.commission_value"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] outline-none"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-xs mb-1">Quota Limite Utilisations</label>
              <input
                v-model.number="form.usage_limit"
                type="number"
                placeholder="Illimité"
                class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] outline-none"
              />
            </div>
            <div>
              <label class="block font-bold text-xs mb-1">Limite par Client</label>
              <input
                v-model.number="form.usage_per_user_limit"
                type="number"
                default="1"
                class="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] outline-none"
              />
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input
              v-model="form.is_active"
              type="checkbox"
              id="is_active_cb"
              class="w-4 h-4 rounded text-[var(--color-primary)]"
            />
            <label for="is_active_cb" class="font-bold text-xs">Code Promo Actif immédiatement</label>
          </div>

          <div class="flex justify-end gap-3 border-t border-[var(--color-border)] pt-4 mt-4">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 rounded-xl bg-[var(--color-bg)] font-bold text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-white font-bold text-xs shadow hover:opacity-90 disabled:opacity-50"
            >
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Ticket, Plus, Search, Loader2, Edit2, Trash2, X } from 'lucide-vue-next';
import apiClient from '../../api/index.js';
import { useAlertStore } from '../../stores/alert.js';

const alertStore = useAlertStore();

const promoCodes = ref([]);
const usersList = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');

const isModalOpen = ref(false);
const editingCode = ref(null);

const form = ref({
  code: '',
  description: '',
  user_id: null,
  discount_type: 'percentage',
  discount_value: 10,
  max_discount_amount: null,
  min_order_amount: 0,
  commission_type: 'percentage',
  commission_value: 5,
  usage_limit: null,
  usage_per_user_limit: 1,
  is_active: true,
});

const formatMoney = (val) => `${Number(val || 0).toLocaleString('fr-FR')} FCFA`;

const fetchPromoCodes = async () => {
  isLoading.value = true;
  try {
    const res = await apiClient.get('/admin/promo-codes', {
      params: {
        search: searchQuery.value,
        is_active: statusFilter.value !== '' ? statusFilter.value : undefined
      }
    });
    promoCodes.value = res.data.data.data || res.data.data;
  } catch (err) {
    console.error("Erreur chargement codes promo:", err);
  } finally {
    isLoading.value = false;
  }
};

const fetchUsers = async () => {
  try {
    const res = await apiClient.get('/admin/users');
    usersList.value = res.data.data.data || res.data.data || [];
  } catch (err) {
    console.error("Erreur chargement utilisateurs:", err);
  }
};

const openCreateModal = () => {
  editingCode.value = null;
  form.value = {
    code: '',
    description: '',
    user_id: null,
    discount_type: 'percentage',
    discount_value: 10,
    max_discount_amount: null,
    min_order_amount: 0,
    commission_type: 'percentage',
    commission_value: 5,
    usage_limit: null,
    usage_per_user_limit: 1,
    is_active: true,
  };
  isModalOpen.value = true;
};

const openEditModal = (code) => {
  editingCode.value = code;
  form.value = {
    code: code.code,
    description: code.description,
    user_id: code.user_id,
    discount_type: code.discount_type,
    discount_value: code.discount_value,
    max_discount_amount: code.max_discount_amount,
    min_order_amount: code.min_order_amount,
    commission_type: code.commission_type,
    commission_value: code.commission_value,
    usage_limit: code.usage_limit,
    usage_per_user_limit: code.usage_per_user_limit,
    is_active: code.is_active,
  };
  isModalOpen.value = true;
};

const saveCode = async () => {
  isSaving.value = true;
  try {
    if (editingCode.value) {
      await apiClient.put(`/admin/promo-codes/${editingCode.value.id}`, form.value);
      alertStore.showAlert({ title: "Succès", message: "Code promo mis à jour.", type: "success" });
    } else {
      await apiClient.post('/admin/promo-codes', form.value);
      alertStore.showAlert({ title: "Succès", message: "Code promo créé.", type: "success" });
    }
    isModalOpen.value = false;
    fetchPromoCodes();
  } catch (err) {
    const msg = err.response?.data?.message || "Erreur lors de l'enregistrement.";
    alertStore.showAlert({ title: "Erreur", message: msg, type: "error" });
  } finally {
    isSaving.value = false;
  }
};

const toggleStatus = async (code) => {
  try {
    await apiClient.patch(`/admin/promo-codes/${code.id}/toggle`);
    code.is_active = !code.is_active;
  } catch (err) {
    console.error(err);
  }
};

const deleteCode = async (code) => {
  if (!confirm(`Voulez-vous vraiment supprimer le code ${code.code} ?`)) return;
  try {
    await apiClient.delete(`/admin/promo-codes/${code.id}`);
    fetchPromoCodes();
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchPromoCodes();
  fetchUsers();
});
</script>
