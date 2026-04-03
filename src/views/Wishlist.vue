<template>
  <div class="p-6 space-y-6 animate-fade-in">
    <header
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text-main)]">
          Mes Favoris
        </h1>
        <p class="text-[var(--color-text-sub)]">
          Retrouvez les articles que vous avez aimés.
        </p>
      </div>
    </header>

    <!-- Skeleton grid -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <SkeletonWishlistCard v-for="i in 8" :key="i" />
    </div>

    <!-- Actual grid -->
    <div
      v-else-if="favorites.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in favorites"
        :key="product.id"
        :product="product"
        :show-views="false"
        :show-share="false"
        @click="goToProduct(product.slug || product.id)"
      />
    </div>
    <!-- Empty state -->
    <div
      v-else
      class="py-20 text-center border-2 border-dashed rounded-3xl space-y-6"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <div
        class="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
        :style="{ backgroundColor: 'var(--color-surface)' }"
      >
        <Heart
          class="text-4xl opacity-20"
          :size="48"
          :style="{ color: 'var(--color-text-sub)' }"
        />
      </div>
      <div>
        <h2
          class="text-2xl font-bold mb-2"
          :style="{ color: 'var(--color-text-main)' }"
        >
          Aucun favori pour l'instant
        </h2>
        <p
          class="opacity-60 max-w-sm mx-auto"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          Explorez nos produits et ajoutez vos coups de cœur ici !
        </p>
      </div>
      <router-link
        :to="{ name: 'Home' }"
        class="inline-block px-8 py-4 rounded-2xl font-bold text-white text-sm"
        :style="{ backgroundColor: 'var(--color-primary)' }"
      >
        Explorer les produits
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { CONFIG } from '../config/index.js';

import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useInteractionStore } from "../stores/interactions.js";
import ProductCard from "../components/ProductCard.vue";
import { Heart, Star } from "lucide-vue-next";
import SkeletonWishlistCard from "../components/skeletons/SkeletonWishlistCard.vue";
import { useSeo } from "../composables/useSeo.js";
useSeo({
  title: "Mes Favoris - SASAYEE",
  description: "Retrouvez les produits que vous avez aimés sur SASAYEE."
});

const interactionStore = useInteractionStore();
const router = useRouter();
const isLoading = ref(true);

const goToProduct = (slugOrId) => {
  router.push({ name: "DetailProduit", params: { slug: slugOrId } });
};

const favorites = computed(() => {
  return (interactionStore.favorites || []).map((p) => ({
    id: p.id,
    name: p.nom || p.name,
    price: `${Number(p.prix || p.price || 0).toLocaleString("fr-FR")} FCFA`,
    oldPrice: null,
    onSale: false,
    image: p.photos?.[0]
      ? p.photos[0].startsWith("http")
        ? p.photos[0]
        : `${CONFIG.API_BASE_URL}/storage/${p.photos[0]}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nom || "P")}&size=200&background=efefef`,
    category: p.category,
    is_promoted: p.is_promoted,
    slug: p.slug && !p.slug.endsWith(`-${p.id}`) ? `${p.slug}-${p.id}` : (p.slug || p.id),
  }));
});

onMounted(async () => {
  try {
    await interactionStore.fetchFavorites?.();
  } catch (err) {
    console.error("Erreur chargement favoris:", err);
  } finally {
    isLoading.value = false;
  }
});

const removeFavorite = async (productId) => {
  await interactionStore.toggleFavorite(productId);
  favorites.value = favorites.value.filter((p) => p.id !== productId);
};

</script>
