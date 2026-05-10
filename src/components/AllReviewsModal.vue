<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-[var(--color-surface)] rounded-2xl shadow-2xl max-w-2xl w-full border border-[var(--color-border)] animate-in fade-in zoom-in-90 duration-200 max-h-[90vh] flex flex-col"
        >
          <!-- Header -->
          <div
            class="px-6 py-4 border-b flex items-center justify-between shrink-0"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <div>
              <h2
                class="text-lg font-black"
                :style="{ color: 'var(--color-text-main)' }"
              >
                Tous les avis
              </h2>
              <p class="text-xs opacity-60 mt-1" :style="{ color: 'var(--color-text-sub)' }">
                {{ reviews.length }} avis des utilisateurs
              </p>
            </div>
            <button
              @click="closeModal"
              class="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
              :style="{ color: 'var(--color-text-sub)' }"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-4 overflow-y-auto custom-scrollbar flex-1">
            <div v-if="isLoading" class="space-y-4">
              <div v-for="i in 5" :key="i" class="p-4 bg-[var(--color-bg)] rounded-xl animate-pulse" />
            </div>

            <div v-else-if="reviews.length === 0" class="text-center py-12">
              <p :style="{ color: 'var(--color-text-sub)' }">
                Aucun avis pour le moment
              </p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="review in reviews"
                :key="review.id"
                class="p-4 rounded-xl border transition-all hover:border-[var(--color-primary)]/30"
                :style="{
                  backgroundColor: 'var(--color-bg)',
                  borderColor: 'var(--color-border)',
                }"
              >
                <!-- User and Rating -->
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3
                      class="font-bold text-sm"
                      :style="{ color: 'var(--color-text-main)' }"
                    >
                      {{ review.user?.nom || 'Utilisateur anonyme' }}
                    </h3>
                    <p class="text-[11px] opacity-60" :style="{ color: 'var(--color-text-sub)' }">
                      {{ formatDate(review.created_at) }}
                    </p>
                  </div>
                  <div class="flex gap-0.5">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      :size="14"
                      :class="
                        i <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-[var(--color-border)]'
                      "
                    />
                  </div>
                </div>

                <!-- Message -->
                <p
                  class="text-sm leading-relaxed"
                  :style="{ color: 'var(--color-text-main)' }"
                >
                  "{{ review.message }}"
                </p>

                <!-- Actions -->
                <div class="flex gap-2 mt-3 pt-3 border-t" :style="{ borderColor: 'var(--color-border)' }">
                  <button
                    @click="deleteReview(review.id)"
                    class="text-xs font-bold text-red-500 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Star, X } from 'lucide-vue-next';
import apiClient from '../api/index.js';
import { useToast } from 'vue-toastification';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const reviews = ref([]);
const isLoading = ref(false);
const toast = useToast();

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

const fetchReviews = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get('/reviews');
    reviews.value = response.data.data || response.data || [];
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
    await apiClient.delete(`/reviews/${reviewId}`);
    reviews.value = reviews.value.filter(r => r.id !== reviewId);
    toast.success('Avis supprimé');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    toast.error('Erreur lors de la suppression');
  }
};

const closeModal = () => {
  emit('close');
};

onMounted(() => {
  if (props.isOpen) {
    fetchReviews();
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
