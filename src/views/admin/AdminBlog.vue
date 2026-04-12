<template>
  <div class="p-4 md:p-8 animate-fade-in">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">Blog</h1>
        <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">{{ total }} articles au total</p>
      </div>
      <button @click="showForm = !showForm"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
        :style="{ backgroundColor: 'var(--color-primary)', color: 'white' }">
        <Plus :size="16" />
        <span class="hidden sm:inline">Nouvel article</span>
      </button>
    </div>


    <!-- Form panel (create/edit) -->
    <div v-if="showForm" class="rounded-2xl border p-6 mb-6 animate-in fade-in duration-200"
      :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
      <h2 class="font-black text-base mb-5" :style="{ color: 'var(--color-text-main)' }">
        {{ editingPost ? 'Modifier l\'article' : 'Créer un article' }}
      </h2>
      <form @submit.prevent="savePost" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Titre</label>
            <input v-model="postForm.title" required placeholder="Titre de l'article"
              class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
          </div>
          <div>
            <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Image de couverture</label>
            <input type="file" ref="imageUploader" accept="image/*" @change="onImageSelect" class="w-full mb-2 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:cursor-pointer pb-2" :style="{ color: 'var(--color-text-sub)' }" />
            
            <input v-model="postForm.image" placeholder="Ou coller une URL d'image..."
              class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
              
            <div v-if="imagePreview || postForm.image" class="mt-3 rounded-xl overflow-hidden h-32 border relative" :style="{ borderColor: 'var(--color-border)' }">
              <img :src="imagePreview || postForm.image" class="w-full h-full object-cover" />
              <button type="button" v-if="imagePreview" @click="clearFile" class="absolute top-2 right-2 bg-red-500 text-white rounded-lg p-1.5 opacity-80 hover:opacity-100">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Extrait</label>
          <input v-model="postForm.excerpt" placeholder="Courte description"
            class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
        </div>
        <div>
          <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Contenu</label>
          <textarea v-model="postForm.content" rows="6" placeholder="Contenu de l'article..."
            class="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
            :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
        </div>
        <div class="flex gap-3">
          <button type="submit" :disabled="saving"
            class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            :style="{ backgroundColor: 'var(--color-primary)', color: 'white' }">
            {{ saving ? 'Sauvegarde...' : editingPost ? 'Mettre à jour' : 'Créer' }}
          </button>
          <button type="button" @click="cancelForm"
            class="px-6 py-2.5 rounded-xl text-sm font-bold border transition"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-sub)' }">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Posts table -->
    <div class="rounded-2xl border overflow-hidden"
      :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
      <div v-if="loading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-4 rounded-full animate-spin"
          style="border-color: var(--color-primary) transparent var(--color-primary) transparent" />
      </div>
      <div v-else-if="posts.length === 0" class="flex flex-col items-center py-20 gap-3">
        <FileText :size="48" class="opacity-10" />
        <p class="font-bold opacity-40" :style="{ color: 'var(--color-text-sub)' }">Aucun article</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b text-left text-xs font-black uppercase tracking-widest"
              :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-sub)' }">
              <th class="px-6 py-4">Article</th>
              <th class="px-6 py-4 hidden md:table-cell">Auteur</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 hidden sm:table-cell">Date</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id" class="border-b group"
              :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl overflow-hidden border flex-shrink-0"
                    :style="{ borderColor: 'var(--color-border)' }">
                    <img v-if="post.image" :src="post.image" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center"
                      :style="{ backgroundColor: 'var(--color-bg)' }">
                      <FileText :size="14" class="opacity-30" />
                    </div>
                  </div>
                  <p class="font-bold text-sm truncate max-w-[200px]">{{ post.titre || post.title }}</p>
                </div>
              </td>
              <td class="px-6 py-4 hidden md:table-cell text-sm opacity-70">{{ post.author?.nom ?? '—' }}</td>
              <td class="px-6 py-4">
                <span class="text-[11px] font-black px-2.5 py-1 rounded-full"
                  :class="post.published_at || post.est_publie ? 'bg-green-500/15 text-green-400' : 'bg-amber-500/15 text-amber-400'">
                  {{ (post.published_at || post.est_publie) ? 'Publié' : 'Brouillon' }}
                </span>
              </td>
              <td class="px-6 py-4 hidden sm:table-cell text-sm opacity-50">
                {{ new Date(post.created_at).toLocaleDateString('fr-FR') }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="togglePublish(post)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition opacity-100 group-hover:opacity-100"
                    :class="(post.published_at || post.est_publie) ? 'hover:bg-amber-500/10 text-amber-400' : 'hover:bg-green-500/10 text-green-400'">
                    <component :is="(post.published_at || post.est_publie) ? EyeOff : Eye" :size="14" />
                  </button>
                  <button @click="editPost(post)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-indigo-500/10 text-indigo-400 opacity-100 group-hover:opacity-100">
                    <Pencil :size="14" />
                  </button>
                  <button @click="deletePost(post)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-red-500/10 text-red-400 opacity-100 group-hover:opacity-100">
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
          <button @click="fetchPosts(currentPage - 1)" :disabled="currentPage <= 1"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-30"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">← Précédent</button>
          <button @click="fetchPosts(currentPage + 1)" :disabled="currentPage >= lastPage"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-30"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">Suivant →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Plus, FileText, Trash2, Eye, EyeOff, Pencil } from 'lucide-vue-next';

import apiClient from '../../api/index.js';
import { useFlash } from '../../composables/useFlash';
const flash = useFlash();

const posts = ref([]);
const loading = ref(true);
const saving = ref(false);
const showForm = ref(false);
const editingPost = ref(null);
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);

const postForm = ref({ title: '', excerpt: '', content: '', image: '' });

const imagePreview = ref(null);
const fileInput = ref(null);
const imageUploader = ref(null);

const onImageSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  fileInput.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const clearFile = () => {
  fileInput.value = null;
  imagePreview.value = null;
  if (imageUploader.value) imageUploader.value.value = '';
};

const fetchPosts = async (page = 1) => {
  loading.value = true;
  currentPage.value = page;
  try {
    const { data: response } = await apiClient.get('/admin/blog/posts', { params: { page } });
    const paginator = response.data;
    posts.value = paginator?.data ?? [];
    lastPage.value = paginator?.last_page ?? 1;
    total.value = paginator?.total ?? posts.value.length;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const savePost = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append('title', postForm.value.title || '');
    fd.append('content', postForm.value.content || '');
    
    if (postForm.value.excerpt) {
      fd.append('excerpt', postForm.value.excerpt);
    }
    
    if (fileInput.value) {
      fd.append('image', fileInput.value);
    } else if (postForm.value.image && postForm.value.image.trim() !== '') {
      fd.append('image', postForm.value.image.trim());
    }
    
    if (editingPost.value) {
      fd.append('is_published', editingPost.value.is_published ? '1' : '0');
    }

    if (editingPost.value) {
      await apiClient.post(`/admin/blog/posts/${editingPost.value.id}`, fd);
      flash.success('Article mis à jour avec succès');
    } else {
      await apiClient.post('/admin/blog/posts', fd);
      flash.success('Article créé avec succès');
    }
    await fetchPosts(currentPage.value);
    cancelForm();
  } catch (e) {
    if (e.response?.data?.errors) {
      const errors = e.response.data.errors;
      const firstError = Object.values(errors)[0][0];
      flash.error(firstError);
      console.error('Validation errors:', errors);
    } else {
      flash.error(e.response?.data?.message || "Erreur lors de la sauvegarde");
      console.error(e);
    }
  } finally {
    saving.value = false;
  }
};

const editPost = (post) => {
  editingPost.value = post;
  postForm.value = { title: post.title || post.titre || '', excerpt: post.excerpt || post.extrait || '', content: post.content || post.contenu || '', image: post.image || '' };
  showForm.value = true;
  clearFile();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelForm = () => {
  showForm.value = false;
  editingPost.value = null;
  postForm.value = { title: '', excerpt: '', content: '', image: '' };
  clearFile();
};

const togglePublish = async (post) => {
  try {
    await apiClient.patch(`/admin/blog/posts/${post.id}/toggle-publish`);
    post.est_publie = !post.est_publie;
    post.published_at = post.est_publie ? new Date().toISOString() : null;
  } catch (e) { console.error(e); }
};

const deletePost = async (post) => {
  if (!confirm(`Supprimer "${post.titre || post.title}" ?`)) return;
  try {
    await apiClient.delete(`/admin/blog/posts/${post.id}`);
    posts.value = posts.value.filter(p => p.id !== post.id);
    total.value--;
  } catch (e) { console.error(e); }
};

onMounted(fetchPosts);
</script>
