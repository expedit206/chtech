<template>
  <div>
    <!-- Wrapper div to avoid fragment issues if any -->
    <!-- Categories -->
    <section>
      <div
        class="w-full overflow-hidden border-b"
        :style="{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
        }"
      >
        <div class="scroll-track">
          <!-- Duplicating categories for infinite scroll effect as per index.html strategy -->
          <CategoryCard
            v-for="(category, index) in [
              ...categories,
              ...categories,
              ...categories,
              ...categories,
            ]"
            :key="index"
            :icon="category.icon"
            :name="category.name"
            :active="category.active"
          />
        </div>
      </div>
    </section>

    <!-- Promo Section 1 -->
    <section class="mx-auto max-w-7xl px-4 mb-4 mt-4">
      <div
        class="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl shadow-lg border"
        :style="{
          backgroundColor: 'var(--color-accent)',
          borderColor: 'var(--color-border)',
        }"
      >
        <div class="flex items-center gap-4">
          <h2
            class="text-lg md:text-xl font-black text-[var(--color-pure)] uppercase tracking-tighter"
          >
            Spéciale Promo !! | Stock Limité
          </h2>
          <button
            class="hidden md:block px-4 py-1.5 rounded-lg text-[10px] font-bold bg-white/20 text-white border border-white/30 hover:bg-white/30 transition"
          >
            VOIR PLUS...
          </button>
        </div>

        <div class="flex items-center gap-3 mt-4 md:mt-0">
          <span class="text-xs font-bold text-white/90 uppercase"
            >Fin dans :</span
          >
          <div class="flex items-center gap-2">
            <div
              class="flex items-center gap-1 bg-white px-3 py-2 rounded-xl shadow-inner"
            >
              <span
                class="text-sm font-black"
                style="color: var(--color-accent)"
                >14j</span
              >
              <span class="opacity-30">:</span>
              <span
                class="text-sm font-black"
                style="color: var(--color-accent)"
                >12h</span
              >
              <span class="opacity-30">:</span>
              <span
                class="text-sm font-black"
                style="color: var(--color-accent)"
                >35m</span
              >
              <span class="opacity-30">:</span>
              <span
                class="text-sm font-black"
                style="color: var(--color-accent)"
                >23s</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Grid 1 (9 items) -->
    <div class="product-grid px-4 py-8 pt-2 max-w-7xl mx-auto">
      <ProductCard
        v-for="product in productsPart1"
        :key="product.id"
        :product="product"
        @click="goToProduct(product.id)"
      />
    </div>

    <!-- Promo Section 2 -->
    <section class="mx-auto max-w-7xl px-4 mb-8 mt-4">
      <div
        class="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl shadow-lg border"
        :style="{
          backgroundColor: 'var(--color-accent)',
          borderColor: 'var(--color-border)',
        }"
      >
        <div class="flex items-center gap-4">
          <h2
            class="text-lg md:text-xl font-black text-[var(--color-pure)] uppercase tracking-tighter"
          >
            Spéciale Promo !! | Stock Limité
          </h2>
          <button
            class="hidden md:block px-4 py-1.5 rounded-lg text-[10px] font-bold bg-white/20 text-white border border-white/30 hover:bg-white/30 transition"
          >
            VOIR PLUS...
          </button>
        </div>

        <div class="flex items-center gap-3 mt-4 md:mt-0">
          <span class="text-xs font-bold text-white/90 uppercase"
            >Fin dans :</span
          >
          <div class="flex items-center gap-2">
            <div
              class="flex items-center gap-1 bg-white px-3 py-2 rounded-xl shadow-inner"
            >
              <span
                class="text-sm font-black"
                style="color: var(--color-accent)"
                >14j</span
              >
              <span class="opacity-30">:</span>
              <span
                class="text-sm font-black"
                style="color: var(--color-accent)"
                >12h</span
              >
              <span class="opacity-30">:</span>
              <span
                class="text-sm font-black"
                style="color: var(--color-accent)"
                >35m</span
              >
              <span class="opacity-30">:</span>
              <span
                class="text-sm font-black"
                style="color: var(--color-accent)"
                >23s</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Grid 2 (6 items) -->
    <div class="product-grid px-4 py-8 max-w-7xl mx-auto">
      <ProductCard
        v-for="product in productsPart2"
        :key="product.id"
        :product="product"
        @click="goToProduct(product.id)"
      />
    </div>
  </div>
  <!-- importation du foo -->

</template>

<script setup>
import { ref, onMounted, computed } from "vue";

import { useRouter } from "vue-router";
import { useProductStore } from "../stores/products.js";
import CategoryCard from "../components/CategoryCard.vue";
import ProductCard from "../components/ProductCard.vue";

const router = useRouter();
const productStore = useProductStore();

// Récupérer les catégories depuis le store
const categories = computed(() => {
  return productStore.categories.map(cat => ({
    id: cat.id,
    name: cat.nom,
    icon: "fas fa-box",
    active: false
  }));
});

// Charger les données au montage du composant
onMounted(async () => {
  await productStore.fetchCategories();
  await productStore.fetchProducts();
});

// Diviser les produits en deux parties pour les deux grilles
const productsPart1 = computed(() => {
  return productStore.productsWithImages.slice(0, 9);
});

const productsPart2 = computed(() => {
  return productStore.productsWithImages.slice(9, 15);
});

const goToProduct = (id) => {
  router.push(`/produit/${id}`);
};
</script>
