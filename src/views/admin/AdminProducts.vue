<template>
  <div class="p-4 md:p-8 animate-fade-in">
    <div class="mb-6">
      <h1 class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">Produits</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">{{ total }} produits sur la plateforme</p>
    </div>

    <!-- Filters -->

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="flex-1 relative">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
          :style="{ color: 'var(--color-text-main)' }" />
        <input v-model="search" @input="debouncedFetch" placeholder="Rechercher un produit..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
      </div>
      <select v-model="categoryFilter" @change="fetchProducts()"
        class="px-4 py-2.5 rounded-xl border text-sm outline-none"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
        <option value="">Toutes catégories</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.nom }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border overflow-hidden"
      :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
      <div v-if="loading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-4 rounded-full animate-spin"
          style="border-color: var(--color-primary) transparent var(--color-primary) transparent" />
      </div>
      <div v-else-if="products.length === 0" class="flex flex-col items-center py-20 gap-3">
        <Package :size="48" class="opacity-10" :style="{ color: 'var(--color-text-main)' }" />
        <p class="font-bold opacity-40" :style="{ color: 'var(--color-text-sub)' }">Aucun produit trouvé</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b text-left text-xs font-black uppercase tracking-widest"
              :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-sub)' }">
              <th class="px-6 py-4">Produit</th>
              <th class="px-6 py-4 hidden md:table-cell">Vendeur</th>
              <th class="px-6 py-4 hidden sm:table-cell">Prix</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id" class="border-b group transition-colors hover:opacity-90"
              :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl overflow-hidden border flex-shrink-0"
                    :style="{ borderColor: 'var(--color-border)' }">
                    <img v-if="p.images?.[0]" :src="CONFIG.STORAGE_URL + p.images[0]"
                      class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center"
                      :style="{ backgroundColor: 'var(--color-bg)' }">
                      <Package :size="14" style="opacity: 0.3" />
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-sm truncate max-w-[160px]">{{ p.nom }}</p>
                    <p class="text-xs opacity-50">{{ p.category?.nom }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 hidden md:table-cell text-sm opacity-70">{{ p.user?.nom }}</td>
              <td class="px-6 py-4 hidden sm:table-cell text-sm font-bold"
                :style="{ color: 'var(--color-primary)' }">
                {{ Number(p.prix).toLocaleString() }} FCFA
              </td>
              <td class="px-6 py-4">
                <span class="text-[11px] font-black px-2.5 py-1 rounded-full"
                  :class="p.est_actif ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'">
                  {{ p.est_actif ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="toggleStatus(p)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors opacity-100 group-hover:opacity-100"
                    :class="p.est_actif ? 'hover:bg-amber-500/10 text-amber-400' : 'hover:bg-green-500/10 text-green-400'">
                    <component :is="p.est_actif ? EyeOff : Eye" :size="14" />
                  </button>
                  <button @click="deleteProduct(p)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10 text-red-400 opacity-100 group-hover:opacity-100">
                    <Trash2 :size="14" />
                  </button>
                </div>
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
          <button @click="fetchProducts(currentPage - 1)" :disabled="currentPage <= 1"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-30 transition"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">← Précédent</button>
          <button @click="fetchProducts(currentPage + 1)" :disabled="currentPage >= lastPage"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-30 transition"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">Suivant →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Search, Package, Trash2, Eye, EyeOff } from 'lucide-vue-next';

import apiClient from '../../api/index.js';
import { CONFIG } from '../../config/index.js';

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const search = ref('');
const categoryFilter = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);

let timer = null;
const debouncedFetch = () => { clearTimeout(timer); timer = setTimeout(() => fetchProducts(), 350); };

const fetchProducts = async (page = 1) => {
  loading.value = true;
  currentPage.value = page;
  try {
    const params = { page };
    if (search.value) params.search = search.value;
    if (categoryFilter.value) params.category_id = categoryFilter.value;
    const { data } = await apiClient.get('/admin/produits', { params });
    products.value = data.data;
    lastPage.value = data.last_page;
    total.value = data.total;
  } catch (e) { console.error(e); } finally { loading.value = false; }
};

const toggleStatus = async (p) => {
  try {
    await apiClient.patch(`/admin/produits/${p.id}/toggle-status`);
    p.est_actif = !p.est_actif;
  } catch (e) { console.error(e); }
};

const deleteProduct = async (p) => {
  if (!confirm(`Supprimer "${p.nom}" ? Cette action est irréversible.`)) return;
  try {
    await apiClient.delete(`/admin/produits/${p.id}`);
    products.value = products.value.filter(x => x.id !== p.id);
    total.value--;
  } catch (e) { console.error(e); }
};

onMounted(async () => {
  const { data } = await apiClient.get('/produits/categories');
  categories.value = data;
  fetchProducts();
});
</script>
