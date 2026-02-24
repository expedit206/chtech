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
      <button
        class="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl font-bold text-sm hover:bg-[var(--color-primary)]/20 transition-all"
      >
        <i class="fa-solid fa-cart-plus"></i> Tout ajouter au panier
      </button>
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
      <div
        v-for="product in favorites"
        :key="product.id"
        class="group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-4 transition-all hover:shadow-xl hover:-translate-y-1"
      >
        <div
          v-if="product.onSale"
          class="absolute top-4 left-4 z-10 bg-[var(--color-accent)] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse"
        >
          Promo
        </div>

        <button
          @click="removeFavorite(product.id)"
          class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-[var(--color-border)] text-[var(--color-text-sub)] rounded-full hover:text-red-500 hover:bg-white transition-all"
        >
          <i class="fa-solid fa-heart-crack"></i>
        </button>

        <div
          class="aspect-square bg-white rounded-2xl mb-4 p-4 flex items-center justify-center border border-[var(--color-border)]/50"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div class="space-y-2">
          <div class="flex items-center gap-1 text-yellow-400 text-xs">
            <i class="fa-solid fa-star" v-for="s in 5" :key="s"></i>
            <span class="text-[var(--color-text-sub)] ml-1"
              >({{ product.reviews || 0 }})</span
            >
          </div>
          <h4
            class="font-bold text-[var(--color-text-main)] leading-tight line-clamp-2 min-h-[3rem]"
          >
            {{ product.name }}
          </h4>
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-black text-[var(--color-text-main)]">{{
              product.price
            }}</span>
            <span
              v-if="product.oldPrice"
              class="text-sm text-[var(--color-text-sub)] line-through"
              >{{ product.oldPrice }}</span
            >
          </div>
        </div>

        <button
          @click="addToCart(product)"
          class="w-full mt-4 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all"
        >
          <i class="fa-solid fa-bag-shopping"></i>
          Ajouter au panier
        </button>
      </div>
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
        <i
          class="fas fa-heart text-4xl opacity-20"
          :style="{ color: 'var(--color-text-sub)' }"
        ></i>
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
        to="/"
        class="inline-block px-8 py-4 rounded-2xl font-bold text-white text-sm"
        :style="{ backgroundColor: 'var(--color-primary)' }"
      >
        Explorer les produits
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useInteractionStore } from "../stores/interactions.js";
import { useCartStore } from "../stores/cart.js";
import SkeletonWishlistCard from "../components/skeletons/SkeletonWishlistCard.vue";

const interactionStore = useInteractionStore();
const cartStore = useCartStore();
const isLoading = ref(true);
const favorites = ref([]);

onMounted(async () => {
  try {
    await interactionStore.fetchFavorites?.();
    favorites.value = (interactionStore.favorites || []).map((p) => ({
      id: p.id,
      name: p.nom || p.name,
      price: `${Number(p.prix || p.price || 0).toLocaleString("fr-FR")} FCFA`,
      oldPrice: null,
      onSale: false,
      image: p.photos?.[0]
        ? p.photos[0].startsWith("http")
          ? p.photos[0]
          : `http://localhost:8000/storage/${p.photos[0]}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nom || "P")}&size=200&background=efefef`,
      reviews: p.nombre_avis || 0,
    }));
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

const addToCart = async (product) => {
  await cartStore.addToCart(product);
};
</script>
