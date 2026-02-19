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

import { ref } from "vue";
import { useRouter } from "vue-router";
import CategoryCard from "../components/CategoryCard.vue";
import ProductCard from "../components/ProductCard.vue";

// Importing images
import img1 from "../assets/image.png";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";
import img4 from "../assets/img4.jpeg";
import img5 from "../assets/img5.jpeg";
import img6 from "../assets/img6.jpeg";
import img7 from "../assets/img7.jpeg";

const router = useRouter();

const categories = ref([
  { id: 1, name: "Processeurs", icon: "fas fa-microchip", active: true },
  { id: 2, name: "Laptops", icon: "fas fa-laptop", active: false },
  { id: 3, name: "Processeurs", icon: "fas fa-microchip", active: false },
  { id: 4, name: "Laptops", icon: "fas fa-laptop", active: false },
  { id: 5, name: "Processeurs", icon: "fas fa-microchip", active: true },
]);

const productsPart1 = ref([
  {
    id: 1,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img1,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 2,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img2,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 3,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img3,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 4,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img4,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 5,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img5,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 6,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img6,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 7,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img7,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 8,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img6,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 9,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img6,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
]);

const productsPart2 = ref([
  {
    id: 10,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img5,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 11,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img6,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 12,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img1,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 13,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img1,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 14,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img1,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
  {
    id: 15,
    name: "Montre Minimaliste Edition Limitée",
    price: "89,00€",
    image: img1,
    rating: 5,
    views: "1,425",
    category: "Accessoires",
  },
]);

const goToProduct = (id) => {
  router.push(`/produit/${id}`);
};
</script>
