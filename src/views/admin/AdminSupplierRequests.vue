<template>
  <div class="p-4 md:p-8 animate-fade-in">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">Demandes Vendeurs</h1>
        <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">
          {{ requests.filter(r => r.status === 'pending').length }} en attente
        </p>
      </div>
    </div>


    <!-- Status filter tabs -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <button v-for="f in filters" :key="f.value" @click="changeFilter(f.value)"
        class="px-4 py-2 rounded-xl text-sm font-bold transition-all"
        :style="statusFilter === f.value
          ? { backgroundColor: 'var(--color-primary)', color: 'white' }
          : { backgroundColor: 'var(--color-surface)', color: 'var(--color-text-sub)', border: '1px solid var(--color-border)' }">
        {{ f.label }}
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 rounded-full animate-spin"
        style="border-color: var(--color-primary) transparent var(--color-primary) transparent" />
    </div>

    <div v-else-if="requests.length === 0"
      class="rounded-2xl border flex flex-col items-center py-20 gap-3"
      :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
      <Store :size="48" class="opacity-10" :style="{ color: 'var(--color-text-main)' }" />
      <p class="font-bold opacity-40" :style="{ color: 'var(--color-text-sub)' }">Aucune demande</p>
    </div>

    <div v-else class="grid gap-4">
      <div v-for="req in requests" :key="req.id"
        class="rounded-2xl border overflow-hidden hover:shadow-md transition-all"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <div class="p-6 flex flex-col md:flex-row gap-5 items-start">
          <!-- Avatar placeholder -->
          <div class="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center"
            :style="{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }">
            <UserIcon :size="24" class="opacity-30" :style="{ color: 'var(--color-text-main)' }" />
          </div>

          <!-- Details -->
          <div class="flex-1 min-w-0 space-y-2">
            <div class="flex items-center gap-3 flex-wrap">
              <h3 class="text-base font-black" :style="{ color: 'var(--color-text-main)' }">{{ req.company_name }}</h3>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full uppercase"
                :class="{
                  'bg-amber-500/15 text-amber-400': req.status === 'pending',
                  'bg-green-500/15 text-green-400': req.status === 'approved',
                  'bg-red-500/15 text-red-400': req.status === 'rejected',
                }">{{ req.status }}</span>
            </div>
            <div class="flex flex-wrap gap-4 text-sm" :style="{ color: 'var(--color-text-sub)' }">
              <span class="flex items-center gap-1.5"><UserCircle :size="14" />{{ req.user?.nom }}</span>
              <span v-if="req.user?.email" class="flex items-center gap-1.5"><Mail :size="14" />{{ req.user?.email }}</span>
              <span class="flex items-center gap-1.5"><Calendar :size="14" />{{ new Date(req.created_at).toLocaleDateString('fr-FR') }}</span>
            </div>
            <p class="text-sm italic opacity-70 p-3 rounded-xl border"
              :style="{ color: 'var(--color-text-main)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }">
              "{{ req.description }}"
            </p>
          </div>

          <!-- Actions -->
          <div v-if="req.status === 'pending'" class="flex md:flex-col gap-2 w-full md:w-auto flex-shrink-0">
            <button @click="handleAction(req.id, 'approved')"
              class="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style="background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3)">
              <Check :size="16" /> Approuver
            </button>
            <button @click="handleAction(req.id, 'rejected')"
              class="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style="background: rgba(239,68,68,0.08); color: #f87171; border: 1px solid rgba(239,68,68,0.2)">
              <X :size="16" /> Rejeter
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div v-if="lastPage > 1" class="flex items-center justify-between px-6 py-4 mt-4 border-t"
        :style="{ borderColor: 'var(--color-border)' }">
        <span class="text-xs opacity-50" :style="{ color: 'var(--color-text-sub)' }">Page {{ currentPage }} / {{ lastPage }}</span>
        <div class="flex gap-2">
          <button @click="fetchRequests(currentPage - 1)" :disabled="currentPage <= 1"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-30"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">← Précédent</button>
          <button @click="fetchRequests(currentPage + 1)" :disabled="currentPage >= lastPage"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-30"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">Suivant →</button>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Store, User as UserIcon, UserCircle, Mail, Calendar, Check, X } from 'lucide-vue-next';

import apiClient from '../../api/index.js';

const requests = ref([]);
const isLoading = ref(true);
const statusFilter = ref('all');
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);

const filters = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvées' },
  { value: 'rejected', label: 'Rejetées' },
];

const changeFilter = (f) => {
  statusFilter.value = f;
  fetchRequests(1);
};

const fetchRequests = async (page = 1) => {
  isLoading.value = true;
  currentPage.value = page;
  try {
    const { data } = await apiClient.get('/admin/vendeur-requests', { params: { page, status: statusFilter.value } });
    if (data.data && data.data.data) {
        requests.value = data.data.data;
        lastPage.value = data.data.last_page;
        total.value = data.data.total;
    } else {
        requests.value = data.data || [];
    }
  } catch (e) { console.error(e); } finally { isLoading.value = false; }
};

const handleAction = async (id, status) => {
  try {
    await apiClient.put(`/admin/vendeur-requests/${id}`, { status });
    const req = requests.value.find(r => r.id === id);
    if (req) req.status = status;
  } catch (e) { console.error(e); }
};

onMounted(fetchRequests);
</script>
