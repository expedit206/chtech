<template>
  <div class="p-6 space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black" :style="{ color: 'var(--color-text-main)' }">
          Avis Plateforme
        </h1>
        <p class="text-sm opacity-60 mt-1" :style="{ color: 'var(--color-text-sub)' }">
          Gérez et consultez tous les avis des utilisateurs
        </p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        class="p-6 rounded-2xl border shadow-sm"
        :style="{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }"
      >
        <p class="text-xs opacity-60 mb-2" :style="{ color: 'var(--color-text-sub)' }">
          Total des avis
        </p>
        <p class="text-3xl font-black" :style="{ color: 'var(--color-primary)' }">
          {{ stats.total }}
        </p>
      </div>

      <div
        class="p-6 rounded-2xl border shadow-sm"
        :style="{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }"
      >
        <p class="text-xs opacity-60 mb-2" :style="{ color: 'var(--color-text-sub)' }">
          Note moyenne
        </p>
        <div class="flex items-center gap-2">
          <p class="text-3xl font-black" :style="{ color: 'var(--color-primary)' }">
            {{ stats.average_rating }}
          </p>
          <div class="flex gap-0.5">
            <Star
              v-for="i in 5"
              :key="i"
              :size="16"
              :class="
                i <= Math.round(stats.average_rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-[var(--color-border)]'
              "
            />
          </div>
        </div>
      </div>

      <div
        class="p-6 rounded-2xl border shadow-sm md:col-span-2"
        :style="{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }"
      >
        <p class="text-xs opacity-60 mb-3" :style="{ color: 'var(--color-text-sub)' }">
          Distribution des notes
        </p>
        <div class="space-y-2">
          <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center gap-2">
            <div class="flex gap-0.5">
              <Star v-for="i in 5" :key="i" :size="12" :class="i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--color-border)]'" />
            </div>
            <div class="h-1.5 flex-1 rounded-full bg-[var(--color-border)]/30 overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                :style="{
                  width: stats.total > 0 ? `${(stats.rating_breakdown[rating] / stats.total) * 100}%` : '0%',
                  backgroundColor: 'var(--color-primary)',
                }"
              />
            </div>
            <span class="text-xs font-bold w-6 text-right" :style="{ color: 'var(--color-text-sub)' }">
              {{ stats.rating_breakdown[rating] }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="flex gap-3 items-end flex-wrap">
      <div class="flex-1 min-w-[250px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom, email ou message..."
          class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
          :style="{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-main)',
            '--tw-ring-color': 'var(--color-primary)',
          }"
          @input="handleSearch"
        />
      </div>
      <button
        @click="fetchReviews"
        class="px-6 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90 active:scale-95"
        :style="{ backgroundColor: 'var(--color-primary)' }"
      >
        <Search :size="18" class="inline mr-2" />
        Rechercher
      </button>
    </div>

    <!-- Reviews Table -->
    <div
      class="rounded-2xl  overflow-hidden shadow-sm"
      :style="{
        // backgroundColor: 'var(--color-surface)',
        // borderColor: 'var(--color-border)',
      }"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="p-6">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="h-16 bg-[var(--color-bg)] rounded-lg animate-pulse" />
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="reviews.length === 0"
        class="p-12 text-center"
        :style="{ backgroundColor: 'var(--color-bg)' }"
      >
        <MessageCircle :size="48" class="mx-auto opacity-30 mb-4" :style="{ color: 'var(--color-text-sub)' }" />
        <p class="text-lg font-bold" :style="{ color: 'var(--color-text-main)' }">
          Aucun avis trouvé
        </p>
        <p class="text-sm opacity-60" :style="{ color: 'var(--color-text-sub)' }">
          Il n'y a pas encore d'avis pour cette plateforme.
        </p>
      </div>

      <!-- Reviews List -->
      <div v-else class="divide-y grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" >
        <div
          v-for="review in reviews"
          :key="review.id"
          class="p-6 bg-[var(--color-bg)] transition-colors "
        >
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex-1 min-w-0">
              <!-- User Info -->
              <div class="flex items-center gap-3 mb-2">
                <img
                  v-if="review.user?.photo"
                  :src="getPhotoUrl(review.user.photo)"
                  :alt="review.user.nom"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div v-else class="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                  {{ review.user?.nom?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <div class="min-w-0">
                  <p class="font-bold text-sm" :style="{ color: 'var(--color-text-main)' }">
                    {{ review.user?.nom || 'Utilisateur anonyme' }}
                  </p>
                  <p class="text-xs opacity-60 truncate" :style="{ color: 'var(--color-text-sub)' }">
                    {{ review.user?.email || 'Email non disponible' }}
                  </p>
                </div>  
              </div>

              <!-- Rating -->
              <div class="flex gap-0.5 mb-2">
                <Star
                  v-for="i in 5"
                  :key="i"
                  :size="16"
                  :class="
                    i <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-[var(--color-border)]'
                  "
                />
              </div>

              <!-- Message -->
              <p class="text-sm leading-relaxed mb-2" :style="{ color: 'var(--color-text-main)' }">
                "{{ review.message }}"
              </p>

              <!-- Date -->
              <p class="text-xs opacity-60" :style="{ color: 'var(--color-text-sub)' }">
                {{ formatDate(review.created_at) }}
              </p>
            </div>

            <!-- Actions -->
            <!-- <button
              @click="deleteReview(review.id)"
              class="px-4 py-2 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
              style="background-color: rgba(239, 68, 68, 0.2); color: rgb(239, 68, 68);"
            >
              <Trash2 :size="16" />
              <span class="hidden sm:inline">Supprimer</span>
            </button> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1 && !isLoading" class="flex justify-center gap-2 flex-wrap">
      <button
        v-if="pagination.current_page > 1"
        @click="goToPage(pagination.current_page - 1)"
        class="px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90 active:scale-95"
        :style="{
          backgroundColor: 'var(--color-primary)',
          color: 'white',
        }"
      >
        Précédent
      </button>

      <div class="flex items-center gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'w-10 h-10 rounded-lg font-bold text-sm transition-all active:scale-95',
            page === pagination.current_page
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-surface)] hover:opacity-80',
          ]"
          :style="page === pagination.current_page ? {} : { borderColor: 'var(--color-border)' }"
        >
          {{ page }}
        </button>
      </div>

      <button
        v-if="pagination.current_page < pagination.last_page"
        @click="goToPage(pagination.current_page + 1)"
        class="px-4 py-2 rounded-lg font-bold text-sm transition-all hover:opacity-90 active:scale-95"
        :style="{
          backgroundColor: 'var(--color-primary)',
          color: 'white',
        }"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Star, Trash2, MessageCircle, Search } from 'lucide-vue-next';
import apiClient from '../../api/index.js';
import { useToast } from 'vue-toastification';
import { CONFIG } from '../../config/index.js';

const reviews = ref([]);
const stats = ref({
  total: 0,
  average_rating: 0,
  rating_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
});
const isLoading = ref(false);
const searchQuery = ref('');
const toast = useToast();

const pagination = ref({
  current_page: 1,
  per_page: 15,
  total: 0,
  last_page: 1,
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, pagination.value.current_page - Math.floor(maxVisible / 2));
  let end = Math.min(pagination.value.last_page, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const getPhotoUrl = (photo) => {
  if (!photo) return '';
  if (String(photo).startsWith('http')) return photo;
  return `${CONFIG.STORAGE_URL}${photo}`;
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fetchReviews = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await apiClient.get('/admin/platform-reviews', {
      params: {
        page,
        per_page: pagination.value.per_page,
        search: searchQuery.value,
      },
    });

    if (response.data.success) {
      reviews.value = response.data.data;
      stats.value = response.data.stats;
      pagination.value = response.data.pagination;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des avis:', error);
    toast.error('Erreur lors du chargement des avis');
  } finally {
    isLoading.value = false;
  }
};

const deleteReview = async (reviewId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

  try {
    await apiClient.delete(`/admin/platform-reviews/${reviewId}`);
    reviews.value = reviews.value.filter(r => r.id !== reviewId);
    stats.value.total--;
    toast.success('Avis supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    toast.error('Erreur lors de la suppression');
  }
};

const handleSearch = () => {
  pagination.value.current_page = 1;
  fetchReviews(1);
};

const goToPage = (page) => {
  fetchReviews(page);
};

onMounted(() => {
  fetchReviews();
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
