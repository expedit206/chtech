<template>
  <article class="product-card group relative flex flex-col h-full shadow-sm border rounded-lg overflow-hidden transition hover:shadow-md" :style="{ borderColor: 'var(--color-border)' }">
    <!-- Image Container -->
    <div
      class="aspect-square w-full overflow-hidden relative bg-white border-b"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <img
        :src="product?.image"
        :alt="product?.name"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        @load="recordViewOnce"
      />

      <!-- Views Badge -->
      <div
        class="absolute top-2 left-2 view-badge px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
        style="background-color: rgba(255, 255, 255, 0.9); backdrop-filter: blur(4px);"
      >
        <i class="fas fa-eye" style="color: var(--color-primary)"></i>
        <span>{{ formatNumber(displayViews) }}</span>
      </div>

      <!-- Action Buttons -->
      <div class="absolute top-2 right-2 flex flex-col gap-2">
        <!-- Favorite Button with Count -->
        <div class="flex items-center gap-1">
          <button
            class="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition"
            @click.stop="handleToggleFavorite"
            :title="isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          >
            <i
              class="fas fa-heart text-sm transition-all"
              :class="{ 'text-red-500 scale-110': isFavorited }"
              :style="{ color: !isFavorited ? 'var(--color-text-sub)' : 'red' }"
            ></i>
          </button>
          <span class="text-[8px]" style="color: var(--color-text-sub)">{{ formatNumber(displayCounts.favorites) }}</span>
        </div>
        <!-- Share Button with Count -->
        <div class="flex items-center gap-1">
          <button
            class="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition"
            @click.stop="handleShare"
            title="Partager"
          >
            <i class="fas fa-share-alt text-xs" style="color: var(--color-text-sub)"></i>
          </button>
          <span class="text-[8px]" style="color: var(--color-text-sub)">{{ formatNumber(displayCounts.shares) }}</span>
        </div>
      </div>

      <!-- Stock Indicator (if low) -->
      <div v-if="product.quantity && product.quantity < 3" class="absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
        Stock limité!
      </div>
    </div>

    <!-- Content -->
    <div class="p-3 flex flex-col flex-grow">
      <span
        class="text-[9px] font-black uppercase tracking-widest mb-1"
        style="color: var(--color-primary)"
      >
        {{ product.category?.nom || "Autre" }}
      </span>

      <h3
        class="text-xs font-bold line-clamp-2 mb-2 cursor-pointer hover:opacity-70"
        style="color: var(--color-text-main)"
        @click="$emit('click')"
      >
        {{ product.name }}
      </h3>

      <!-- Rating -->
      <div class="flex items-center gap-2 mb-3">
        <div class="flex text-[8px]" style="color: var(--color-rating)">
          <i
            class="fas fa-star"
            v-for="n in 5"
            :key="n"
            :class="{ 'text-gray-300': n > Math.round(product.rating) }"
          ></i>
        </div>
        <span class="text-[8px]" style="color: var(--color-text-sub)">
          ({{ product.reviews || 0 }})
        </span>
      </div>

      <!-- Interactions Stats -->
      <!-- ...existing code... -->
      <!-- Price & Button -->
       
      <div class="mt-auto flex items-center justify-between gap-2">
       <span class="text-sm font-black" style="color: var(--color-text-main)">
          {{ product.price }}
        </span>

        <button
          class="btn-details flex items-center gap-1 px-2 py-1.5 rounded text-xs font-bold transition hover:bg-black/10 dark:hover:bg-white/10"
          :style="{ color: 'var(--color-primary)' }" @click.stop="$emit('click')">
          <span class="text-white">VOIR</span>
          <i class="fas fa-arrow-right text-[9px]"></i>
        </button>

        <button
          class="btn-cart flex items-center gap-1 px-2 py-1.5 rounded text-xs font-bold transition bg-green-500 hover:bg-green-600 text-white"
          @click.stop="handleAddToCart">
          <i class="fas fa-shopping-cart"></i>
          <span>Ajouter au panier</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useInteractionStore } from '../stores/interactions.js';
import { useAuthStore } from '../stores/auth.js';
import { useCartStore } from '../stores/cart.js';

const interactionStore = useInteractionStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
// localViews
const localViews = ref(null); 
const localCounts = ref({
  favorites: null,
  shares: null,
  contacts: null
});
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});
const viewRecorded = ref(false);

// Ajouter au panier
const handleAddToCart = () => {
  cartStore.addToCart(props.product);
  alert('Produit ajouté au panier !');
};
      
// Computed properties
const isFavorited = computed(() => {
  return interactionStore.isFavorited(props.product.id);
});

const displayViews = computed(() => {
  return localViews.value || props.product.views || 0;
});

const displayCounts = computed(() => {
  const counts = interactionStore.getProductCounts(props.product.id);
  return {
    favorites: counts.favoris_count || localCounts.value.favorites || 0,
    shares: counts.partages_count || localCounts.value.shares || 0,
    contacts: counts.contacts_count || localCounts.value.contacts || 0
  };
});

// Methods
const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

const recordViewOnce = () => {
  if (!viewRecorded.value && props.product.id) {
    viewRecorded.value = true;
    interactionStore.recordView(props.product.id);
    localViews.value = (displayViews.value || 0) + 1;
  }
};

const handleToggleFavorite = async () => {
  try {
    if (!authStore.isAuthenticated) {
      alert('Veuillez vous connecter pour ajouter en favori');
      // TODO: Rediriger vers la page de connexion
      return;
    }

    await interactionStore.toggleFavorite(props.product.id);
  } catch (err) {
    console.error('Erreur favori:', err);
  }
};

const handleShare = async () => {
  try {
    // Vérifier si l'API de partage native est disponible
    if (navigator.share) {
      await navigator.share({
        title: props.product.name,
        text: `Découvrez: ${props.product.name}`,
        url: `${window.location.origin}/produit/${props.product.id}`
      });
      // L'enregistrement du partage se fera automatiquement
      await interactionStore.shareProduct(props.product.id);
    } else {
      // Fallback: copier l'URL et enregistrer
      await interactionStore.shareProduct(props.product.id);
      alert('Lien copié! 📋');
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Erreur partage:', err);
    }
  }
};

onMounted(() => {
  // Pré-charger les comptes si l'utilisateur est authentifié
  if (authStore.isAuthenticated) {
    interactionStore.fetchProductCounts(props.product.id);
  }
});
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-2px);
}

.view-badge {
  animation: slideInDown 0.3s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
