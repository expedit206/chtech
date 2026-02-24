<template>
  <div>
    <!-- Categories strip (always shown, even loading) -->
    <section>
      <div
        class="w-full overflow-hidden border-b"
        :style="{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
        }"
      >
        <!-- Skeleton categories -->
        <div v-if="isLoading" class="flex gap-4 px-4 py-3 overflow-hidden">
          <div
            v-for="i in 8"
            :key="i"
            class="flex-shrink-0 h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
          ></div>
        </div>

        <div v-else class="scroll-track">
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

    <!-- Promo banner 1 -->
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
          <div
            class="flex items-center gap-1 bg-white px-3 py-2 rounded-xl shadow-inner"
          >
            <span
              class="text-sm font-black"
              style="color: var(--color-accent)"
              >{{ countdown }}</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Product Grid 1 -->
    <div class="product-grid px-4 py-8 pt-2 max-w-7xl mx-auto">
      <!-- Skeleton cards -->
      <SkeletonProductCard v-if="isLoading" v-for="i in 9" :key="`s1-${i}`" />
      <ProductCard
        v-else
        v-for="product in productsPart1"
        :key="product.id"
        :product="product"
        @click="goToProduct(product.id)"
      />
    </div>

    <!-- Promo banner 2 -->
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
          <div
            class="flex items-center gap-1 bg-white px-3 py-2 rounded-xl shadow-inner"
          >
            <span
              class="text-sm font-black"
              style="color: var(--color-accent)"
              >{{ countdown }}</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Product Grid 2 -->
    <div class="product-grid px-4 py-8 max-w-7xl mx-auto">
      <SkeletonProductCard v-if="isLoading" v-for="i in 6" :key="`s2-${i}`" />
      <ProductCard
        v-else
        v-for="product in productsPart2"
        :key="product.id"
        :product="product"
        @click="goToProduct(product.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "../stores/products.js";
import CategoryCard from "../components/CategoryCard.vue";
import ProductCard from "../components/ProductCard.vue";
import SkeletonProductCard from "../components/skeletons/SkeletonProductCard.vue";

const router = useRouter();
const productStore = useProductStore();
const isLoading = ref(true);

// Countdown (live timer)
const countdown = ref("");
let timerInterval = null;

const updateCountdown = () => {
  // Target: promo ends in 14j 12h 35m (static demo)
  const target = new Date();
  target.setDate(target.getDate() + 14);
  target.setHours(target.getHours() + 12, 35, 23);
  const diff = target - Date.now();
  if (diff <= 0) {
    countdown.value = "Terminé";
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  countdown.value = `${d}j ${h}h ${m}m ${s}s`;
};

const categories = computed(() =>
  productStore.categories.map((cat) => ({
    id: cat.id,
    name: cat.nom,
    icon: "fas fa-box",
    active: false,
  })),
);

const productsPart1 = computed(() =>
  productStore.productsWithImages.slice(0, 9),
);
const productsPart2 = computed(() =>
  productStore.productsWithImages.slice(9, 15),
);

onMounted(async () => {
  updateCountdown();
  timerInterval = setInterval(updateCountdown, 1000);
  try {
    await Promise.all([
      productStore.fetchCategories(),
      productStore.fetchProducts(),
    ]);
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => clearInterval(timerInterval));

const goToProduct = (id) => router.push(`/produit/${id}`);
</script>
