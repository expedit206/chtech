<template>
  <div>
    <!-- Categories strip (always shown, even loading) -->
    <section>
      <div class="w-full overflow-hidden border-b relative " :style="{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)',
      }">
        <!-- Overlay on edges for smooth exit/entry look -->
        <div
          class="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--color-bg)] to-transparent z-10 pointer-events-none">
        </div>
        <div
          class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--color-bg)] to-transparent z-10 pointer-events-none">
        </div>

        <!-- Skeleton categories -->
        <div v-if="isLoading" class="flex gap-4 px-4 py-4 overflow-hidden">
          <div v-for="i in 8" :key="i"
            class="flex-shrink-0 h-8 w-24 rounded-full bg-[var(--color-surface)] animate-pulse"></div>
        </div>

        <div v-else class="flex overflow-hidden">
          <div class="scroll-track flex items-center py-4">
            <!-- First set of categories -->
            <CategoryCard v-for="category in categories" :key="category.id" :icon="getCategoryIcon(category.name)"
              :name="category.name" :active="category.active" />
          </div>
        </div>
      </div>
    </section>

    <!-- Search Results Header -->
    <div v-if="productStore.searchQuery" class="px-12 pt-8 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-1 h-8 bg-[var(--color-primary)] rounded-full"></div>
        <h2 class="text-2xl font-black text-[var(--color-text-main)]">
          Résultats pour "{{ productStore.searchQuery }}"
        </h2>
      </div>
      <button @click="productStore.searchQuery = ''"
        class="text-sm font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
        <X :size="14" /> Effacer
      </button>
    </div>

    <!-- Product Grid 1 -->
    <div class="product-grid px-4 py-8 pt-2 ">
      <!-- Skeleton cards -->
      <SkeletonProductCard v-if="isLoading" v-for="i in 15" :key="`s1-${i}`" />

      <!-- Empty State -->
      <div v-if="!isLoading && productsPart1.length === 0"
        class="col-span-full py-20 text-center flex flex-col items-center justify-center bg-[var(--color-surface)] rounded-3xl border-2 border-dashed border-[var(--color-border)]">
        <div class="w-20 h-20 bg-[var(--color-border)] rounded-full flex items-center justify-center mb-4 opacity-50">
          <Search :size="40" class="text-[var(--color-text-sub)]" />
        </div>
        <h3 class="text-xl font-bold text-[var(--color-text-main)] mb-2">
          Aucun produit trouvé
        </h3>
        <p class="text-[var(--color-text-sub)] max-w-sm mx-auto">
          Nous n'avons trouvé aucun résultat correspondant à votre recherche.
          Essayez d'autres mots-clés.
        </p>
        <button @click="productStore.searchQuery = ''"
          class="mt-6 px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-[var(--color-primary)]/20">
          Voir tous les produits
        </button>
      </div>

      <ProductCard v-else v-for="product in productsPart1" :key="product.id" :product="product"
        @click="goToProduct(product.slug || product.id)" />
    </div>

    <!-- Infinite scroll indicator -->
    <div v-if="productStore.loadingMore" class="flex justify-center pb-12">
      <div class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl">
        <div class="w-5 h-5 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        <span class="text-sm font-bold text-[var(--color-text-main)]">Chargement des pépites...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "../stores/products.js";
import apiClient from "../api/index.js";
import CategoryCard from "../components/CategoryCard.vue";
import ProductCard from "../components/ProductCard.vue";
import SkeletonProductCard from "../components/skeletons/SkeletonProductCard.vue";
import { Star, Search, X } from "lucide-vue-next";
import { useSeo } from "../composables/useSeo.js";

const router = useRouter();
const productStore = useProductStore();

useSeo({
  title: "Vente et Achat au Cameroun - Marketplace SASAYEE",
  description: "Découvrez SASAYEE, la plateforme de référence pour l'achat et la revente de produits informatiques, mode et électroménager au Cameroun.",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SASAYEE",
    "url": "https://sasayee.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sasayee.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
});


const isLoading = computed(
  () => productStore.loading && productStore.products.length === 0,
);

const getCategoryIcon = (name) => {
  const n = name?.toLowerCase() || "";
  if (
    n.includes("informatique") ||
    n.includes("ordinateur") ||
    n.includes("laptop")
  )
    return "fas fa-laptop";
  if (n.includes("téléphone") || n.includes("mobile") || n.includes("phone"))
    return "fas fa-mobile-alt";
  if (n.includes("électro") || n.includes("electricite")) return "fas fa-plug";
  if (n.includes("vêtement") || n.includes("habit") || n.includes("mode"))
    return "fas fa-tshirt";
  if (n.includes("chaussure")) return "fas fa-shoe-prints";
  if (n.includes("cuisine") || n.includes("maison") || n.includes("home"))
    return "fas fa-home";
  if (n.includes("beauté") || n.includes("soin") || n.includes("santé"))
    return "fas fa-flask";
  if (n.includes("jeu") || n.includes("jouet") || n.includes("game"))
    return "fas fa-gamepad";
  if (n.includes("watch") || n.includes("montre") || n.includes("accessoire"))
    return "fas fa-clock";
  if (n.includes("tv") || n.includes("télévision") || n.includes("écran"))
    return "fas fa-tv";
  return "fas fa-box";
};

const categories = computed(() =>
  productStore.categories.map((cat) => ({
    id: cat.id,
    name: cat.nom,
    active: false,
  })),
);

const productsPart1 = computed(() => {
  return productStore.productsWithImages;
});

onMounted(() => {
  productStore.fetchProducts();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleScroll = () => {
  if (productStore.loading || productStore.loadingMore || !productStore.hasMore) return;

  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  
  if (scrollTop + clientHeight >= scrollHeight - 300) {
    productStore.fetchProducts({}, false, true);
  }
};

const goToProduct = (slugOrId) =>
  router.push({ name: "DetailProduit", params: { slug: slugOrId } });
</script>
