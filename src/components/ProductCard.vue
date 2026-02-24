<template>
  <article
    class="product-card group relative flex flex-col h-full shadow-sm border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
    :style="{
      borderColor: 'var(--color-border)',
      backgroundColor: 'var(--color-surface)',
    }"
  >
    <!-- Image Container -->
    <div
      class="aspect-square w-full overflow-hidden relative bg-white border-b"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <img
        :src="product?.image"
        :alt="product?.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        @load="recordViewOnce"
      />

      <!-- Overlay Dark Gradient (inspired by Shorts) -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>

      <!-- Interaction Vertical Stack (Right Side - Minimalist Style) -->
      <div
        class="absolute right-2 bottom-6 flex flex-col gap-3 z-10 transition-all duration-300 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
      >
        <!-- Views -->
        <div class="flex flex-col items-center">
          <Eye
            class="w-5 h-5 text-white drop-shadow-lg transition-transform hover:scale-110"
          />
          <span class="text-[10px] font-black text-white drop-shadow-md mt-0.5">
            {{ formatNumber(displayViews) }}
          </span>
        </div>

        <!-- Favorite Action -->
        <div class="flex flex-col items-center">
          <button
            @click.stop="handleToggleFavorite"
            class="flex flex-col items-center transition-transform hover:scale-110 active:scale-90"
          >
            <Heart
              class="w-5 h-5 text-white drop-shadow-lg transition-all"
              :class="{ 'fill-red-500 text-red-500': isFavorited }"
            />
          </button>
          <span class="text-[10px] font-black text-white drop-shadow-md mt-0.5">
            {{ formatNumber(displayCounts.favorites) }}
          </span>
        </div>

        <!-- Share Action -->
        <div class="flex flex-col items-center">
          <button
            @click.stop="handleShare"
            class="transition-transform hover:scale-110 active:scale-90"
          >
            <Forward class="w-5 h-5 text-white drop-shadow-lg" />
          </button>
          <span class="text-[10px] font-black text-white drop-shadow-md mt-0.5">
            {{ formatNumber(displayCounts.shares) }}
          </span>
        </div>
      </div>

      <!-- Stock Indicator (Bottom Right) -->
      <div
        v-if="product.quantity && product.quantity < 5"
        class="absolute bottom-3 left-3 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter bg-red-500 text-white shadow-lg animate-bounce-subtle"
      >
        Dépêchez-vous ! Plus que {{ product.quantity }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-grow">
      <div class="flex justify-between items-start mb-2">
        <span
          class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
          :style="{
            backgroundColor:
              'var(--color-primary-low, rgba(99, 102, 241, 0.1))',
            color: 'var(--color-primary)',
          }"
        >
          {{ product.category?.nom || "Luxe & Tech" }}
        </span>
        <div
          class="flex items-center gap-1 text-[10px] font-bold"
          :style="{ color: 'var(--color-rating)' }"
        >
          <Star class="w-3 h-3 fill-current" />
          <span>{{ product.rating || 5.0 }}</span>
        </div>
      </div>

      <h3
        class="text-sm font-bold line-clamp-2 mb-3 cursor-pointer transition-colors hover:text-[var(--color-primary)]"
        :style="{ color: 'var(--color-text-main)' }"
        @click="$emit('click')"
      >
        {{ product.name }}
      </h3>

      <div
        class="mt-auto pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-3"
      >
        <div class="flex flex-col">
          <span
            class="text-[10px] uppercase font-bold opacity-50 tracking-tighter"
            >Prix total</span
          >
          <span
            class="text-lg font-black leading-none"
            :style="{ color: 'var(--color-text-main)' }"
          >
            {{ product.price }}
          </span>
        </div>

        <div class="flex gap-2">
          <button
            @click.stop="handleAddToCart"
            class="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
            title="Ajouter au panier"
          >
            <ShoppingCart :size="20" stroke-width="2.5" />
          </button>

          <button
            @click.stop="$emit('click')"
            class="h-10 px-4 rounded-xl bg-[var(--color-text-main)] text-white text-xs font-bold flex items-center gap-2 transition-all hover:bg-opacity-90 active:scale-95"
          >
            VOIR
            <ArrowRight :size="14" stroke-width="3" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useInteractionStore } from "../stores/interactions.js";
import { useAuthStore } from "../stores/auth.js";
import { useCartStore } from "../stores/cart.js";
import { useRouter, useRoute } from "vue-router";
import {
  Eye,
  Heart,
  Forward,
  ArrowRight,
  ShoppingCart,
  MessageCircle,
  Star,
} from "lucide-vue-next";

const interactionStore = useInteractionStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const route = useRoute();

const localViews = ref(null);
const localCounts = ref({
  favorites: null,
  shares: null,
  contacts: null,
});

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const viewRecorded = ref(false);

const handleAddToCart = async () => {
  try {
    await cartStore.addToCart(props.product);
  } catch (e) {
    console.error("Erreur lors de l’ajout au panier", e);
  }
};

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
    contacts: counts.contacts_count || localCounts.value.contacts || 0,
  };
});

const formatNumber = (num) => {
  if (!num) return "0";
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
  if (!authStore.isAuthenticated) {
    router.push({ path: "/login", query: { redirect: route.fullPath } });
    return;
  }
  await interactionStore.toggleFavorite(props.product.id);
};

const handleContact = () => {
  if (!authStore.isAuthenticated) {
    router.push({ path: "/login", query: { redirect: route.fullPath } });
    return;
  }
  if (props.product.user?.id) {
    router.push({
      name: "messages",
      params: { receiverId: props.product.user.id },
    });
  }
};

const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: props.product.name,
        text: `Découvrez: ${props.product.name}`,
        url: `${window.location.origin}/produit/${props.product.id}`,
      });
      await interactionStore.shareProduct(props.product.id);
    } else {
      await interactionStore.shareProduct(props.product.id);
      alert("Lien copié! 📋");
    }
  } catch (err) {
    if (err.name !== "AbortError") console.error("Erreur partage:", err);
  }
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    interactionStore.fetchProductCounts(props.product.id);
  }
});
</script>

<style scoped>
.product-card {
  perspective: 1000px;
}

.view-badge {
  z-index: 5;
}

@keyframes bounce-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite ease-in-out;
}

/* Custom Tooltip style for interactions could be added here if needed */
</style>
