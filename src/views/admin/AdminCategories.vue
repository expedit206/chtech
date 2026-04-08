<template>
  <div class="p-4 md:p-8 animate-fade-in">
    <div class="mb-6">
      <h1 class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">Catégories</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">Gérer les catégories de produits</p>
    </div>


    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button v-for="tab in ['Produits', 'Services']" :key="tab" @click="activeTab = tab"
        class="px-5 py-2 rounded-xl text-sm font-bold transition-all"
        :style="activeTab === tab
          ? { backgroundColor: 'var(--color-primary)', color: 'white' }
          : { backgroundColor: 'var(--color-surface)', color: 'var(--color-text-sub)', border: '1px solid var(--color-border)' }">
        {{ tab }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Form -->
      <div class="lg:col-span-1">
        <div class="rounded-2xl border p-6 sticky top-24"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <h2 class="font-black text-base mb-5" :style="{ color: 'var(--color-text-main)' }">
            {{ editingCategory ? 'Modifier' : 'Nouvelle catégorie' }}
          </h2>
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Nom</label>
              <input v-model="form.nom" required placeholder="Nom de la catégorie"
                class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition"
                :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
            </div>
            <div>
              <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Image (optionnel)</label>
              <input type="file" @change="onFileChange" accept="image/*"
                class="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:cursor-pointer"
                :style="{ color: 'var(--color-text-sub)' }" style="file-background: var(--color-primary)" />
              <div v-if="previewUrl || editingCategory?.image" class="mt-3 rounded-xl overflow-hidden h-24 border"
                :style="{ borderColor: 'var(--color-border)' }">
                <img :src="previewUrl || editingCategory?.image" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="flex gap-2 pt-2">
              <button type="submit" :disabled="saving"
                class="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                :style="{ backgroundColor: 'var(--color-primary)', color: 'white' }">
                {{ saving ? 'Sauvegarde...' : editingCategory ? 'Mettre à jour' : 'Créer' }}
              </button>
              <button v-if="editingCategory" type="button" @click="resetForm"
                class="px-4 py-2.5 rounded-xl text-sm font-bold border transition"
                :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-sub)' }">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Category list -->
      <div class="lg:col-span-2">
        <div v-if="loading" class="flex justify-center py-16">
          <div class="w-8 h-8 border-4 rounded-full animate-spin"
            style="border-color: var(--color-primary) transparent var(--color-primary) transparent" />
        </div>
        <div v-else-if="currentList.length === 0" class="rounded-2xl border flex flex-col items-center py-20 gap-3"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <Tag :size="48" class="opacity-10" />
          <p class="font-bold opacity-40" :style="{ color: 'var(--color-text-sub)' }">Aucune catégorie</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div v-for="cat in currentList" :key="cat.id"
            class="rounded-2xl border overflow-hidden group hover:shadow-md transition-all"
            :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
            <div class="h-28 bg-gradient-to-br overflow-hidden"
              :style="{ backgroundColor: 'var(--color-bg)' }">
              <img v-if="cat.image" :src="cat.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div v-else class="w-full h-full flex items-center justify-center opacity-20">
                <Tag :size="32" :style="{ color: 'var(--color-text-main)' }" />
              </div>
            </div>
            <div class="p-3">
              <p class="font-bold text-sm truncate" :style="{ color: 'var(--color-text-main)' }">{{ cat.nom }}</p>
              <div class="flex gap-2 mt-2">
                <button @click="editCategory(cat)"
                  class="flex-1 text-[11px] font-bold py-1.5 rounded-lg transition"
                  :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)' }">
                  Modifier
                </button>
                <button @click="deleteCategory(cat)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center transition hover:bg-red-500/10 text-red-400">
                  <Trash2 :size="13" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Tag, Trash2 } from 'lucide-vue-next';

import apiClient from '../../api/index.js';

const allCategories = ref({ products: [], services: [] });
const loading = ref(true);
const saving = ref(false);
const activeTab = ref('Produits');
const editingCategory = ref(null);
const form = ref({ nom: '' });
const fileInput = ref(null);
const previewUrl = ref(null);

const currentList = computed(() =>
  activeTab.value === 'Produits' ? allCategories.value.products : allCategories.value.services
);

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  fileInput.value = file;
  previewUrl.value = URL.createObjectURL(file);
};

const saveCategory = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append('nom', form.value.nom);
    fd.append('type', activeTab.value === 'Produits' ? 'product' : 'service');
    if (fileInput.value) fd.append('image', fileInput.value);

    if (editingCategory.value) {
      fd.append('_method', 'PUT');
      await apiClient.post(`/admin/categories/${editingCategory.value.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      await apiClient.post('/admin/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    await fetchCategories();
    resetForm();
  } catch (e) { console.error(e); } finally { saving.value = false; }
};

const editCategory = (cat) => {
  editingCategory.value = cat;
  form.value.nom = cat.nom;
  previewUrl.value = null;
  fileInput.value = null;
};

const resetForm = () => {
  editingCategory.value = null;
  form.value = { nom: '' };
  previewUrl.value = null;
  fileInput.value = null;
};

const deleteCategory = async (cat) => {
  if (!confirm(`Supprimer "${cat.nom}" ?`)) return;
  try {
    const type = activeTab.value === 'Produits' ? 'product' : 'service';
    await apiClient.delete(`/admin/categories/${cat.id}?type=${type}`);
    await fetchCategories();
  } catch (e) { console.error(e); }
};

const fetchCategories = async () => {
  loading.value = true;
  try {
    const { data } = await apiClient.get('/admin/categories');
    allCategories.value = data;
  } catch (e) { console.error(e); } finally { loading.value = false; }
};

onMounted(fetchCategories);
</script>
