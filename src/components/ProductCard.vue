<template>
  <RouterLink :to="{name: 'DetailProduit', params: {slug: product.slug || product.id}}"
    class="product-card group relative flex flex-col h-full shadow-sm border rounded-lg overflow-hidden transition-all duration-300"
    :style="{
      borderColor: 'var(--color-border)',
    }">
    <div class="aspect-square w-full overflow-hidden relative border-b h-[10rem]" :style="{
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
    }">
      <img :src="product?.image" :alt="product?.name"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy"
        @load="recordViewOnce" />

      <div class="absolute top-2 left-2 view-badge px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
        style="
          background-color: var(--color-bg);
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        ">
        <span class="text-[var(--color-text-main)]">
          {{ product.category?.nom || "Autre" }}</span>
      </div>

      <div v-if="showActions" class="absolute right-2 top-2 flex flex-col gap-3">
        <div v-for="item in filteredInteractions" :key="item.key" class="flex flex-col items-center">
          <button @click.stop="item.action" class="flex flex-col items-center transition-all active:scale-75">
            <component :is="item.icon" :size="16" stroke-width="3" :style="{
              color: item.active?.() ? '#ff4757' : '#ffffff',
              fill: item.active?.() ? '#ff4757' : 'none',
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))'
            }" />
            <span class="text-[9px] text-white font-black mt-0.5" style="text-shadow: 0 1px 3px rgba(0,0,0,0.8)">
              {{ formatNumber(item.count()) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Stock Indicator (if low) -->
      <div v-if="product.quantity && product.quantity < 3"
        class="absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
        Stock limité!
      </div>
    </div>

    <!-- Content -->

    <div class="p-2 py-2 flex flex-col flex-grow">
      <h3 class="text-xs md:text-xs line-clamp-1" style="color: var(--color-text-main)">
        {{ product.name }}
      </h3>

      <!-- Prix -->
      <div class="flex items-baseline gap-2">
        <div class="text-sm lg:text-md font-semibold" style="color: var(--color-text-main)">
          {{ product.price }}
        </div>
        <div v-if="product.old_price" class="text-[10px] lg:text-xs line-through opacity-50"
          style="color: var(--color-text-sub)">
          {{ product.old_price }}
        </div>
      </div>
      <!-- Actions -->
      <!-- <div class="mt-auto flex flex-col gap-2"> -->
      <div v-if="showFooter" class="flex flex-col gap-1 mt-auto overflow-hidden">
        <button
          class="w-full flex items-center justify-center gap-2 md:py-2 py-1 px-1 rounded-xl font-bold text-[11px] text-white transition active:scale-95 shadow-sm hover:opacity-90 h-8 mt-2"
           style="background: var(--color-primary)">
          <Eye :size="16" stroke-width="2.5" class="hidden xs:flex" />
          Voir plus
        </button>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useInteractionStore } from "../stores/interactions.js";
import { useAuthStore } from "../stores/auth.js";
import {
  Eye,
  Heart,
  Forward,
  ArrowRight,
} from "lucide-vue-next";
import { useAlert } from "../composables/useAlert.js";

const alert = useAlert();
const router = useRouter();
const route = useRoute();

const interactionStore = useInteractionStore();
const authStore = useAuthStore();
// localViews
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
  showActions: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },

  showHeart: {
    type: Boolean,
    default: true,
  },
  showViews: {
    type: Boolean,
    default: true,
  },
  showShare: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["click"]);
const viewRecorded = ref(false);


// Computed properties
const isFavorited = computed(() => {
  return interactionStore.isFavorited(props.product.id);
});

const displayViews = computed(() => {
  return localViews.value || props.product.views || 0;
});

const displayCounts = computed(() => {
  const storeCounts = interactionStore.getProductCounts(props.product.id);

  return {
    favorites:
      storeCounts.favorites_count ||
      props.product.favorites_count ||
      props.product.favoris_count ||
      localCounts.value.favorites ||
      0,
    shares:
      storeCounts.partages_count ||
      props.product.partages_count ||
      props.product.shares_count ||
      localCounts.value.shares ||
      0,
    contacts:
      storeCounts.contacts_count ||
      props.product.contacts_count ||
      props.product.contacts ||
      localCounts.value.contacts ||
      0,
    clics:
      storeCounts.clics_count ||
      props.product.clics_count ||
      props.product.views ||
      localViews.value ||
      0,
  };
});

// Methods
const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

const recordViewOnce = () => {
  if (!viewRecorded.value && props.product.id) {
    viewRecorded.value = true;
    interactionStore.recordView(props.product.id);
    localViews.value = parseInt((displayViews.value || 0) + 1);
  }
};

const handleToggleFavorite = async () => {
  try {
    if (!authStore.isAuthenticated) {
      alert.promptLogin(router, route.fullPath);
      return;
    }

    await interactionStore.toggleFavorite(props.product.id);
  } catch (err) {
    console.error("Erreur favori:", err);
  }
};

const handleShare = async () => {
  try {
    // Vérifier si l'API de partage native est disponible
      const productUrl = `${window.location.origin}/produit/${props.product.slug || props.product.id}`;
      if (navigator.share) {
        await navigator.share({
          title: props.product.name,
          text: `Découvrez: ${props.product.name}`,
          url: productUrl,
        });
        // L'enregistrement du partage se fera automatiquement
        await interactionStore.shareProduct(props.product.id);
      } else {
        // Fallback: copier l'URL et enregistrer
        await interactionStore.shareProduct(props.product.id);
        navigator.clipboard.writeText(productUrl);
        alert.success({
          title: "Lien copié",
          message: "Le lien du produit a été copié dans votre presse-papiers."
        });
      }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Erreur partage:", err);
    }
  }
};

const interactions = computed(() => [
  {
    key: "views",
    icon: Eye,
    count: () => displayCounts.value.clics,
    action: () => { },
  },
  {
    key: "likes",
    icon: Heart,
    count: () => displayCounts.value.favorites,
    action: handleToggleFavorite,
    active: () => isFavorited.value,
  },
  {
    key: "shares",
    icon: Forward,
    count: () => displayCounts.value.shares,
    action: handleShare,
  },
]);

const filteredInteractions = computed(() => {
  if (props.isAdminPromo) {
    return [interactions.value.find((i) => i.key === "views")];
  }
  return interactions.value.filter((i) => {
    if (i.key === "views") return props.showViews;
    if (i.key === "likes") return props.showHeart;
    if (i.key === "shares") return props.showShare;
    return true;
  });
});

onMounted(() => {
  // Pré-charger les comptes si l'utilisateur est authentifié
  if (authStore.isAuthenticated) {
    interactionStore.fetchProductCounts(props.product.id);
  }
});
</script>

<style scoped>
@keyframes pulse-subtle {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite ease-in-out;
}

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
