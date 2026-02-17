<template>
  <article class="product-card group relative flex flex-col h-full shadow-sm">
    <div
      class="aspect-square w-full overflow-hidden relative bg-white border-b"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover"
      />

      <div
        class="absolute top-2 left-2 view-badge"
        style="
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
        "
      >
        <i class="fas fa-eye" style="color: var(--color-primary)"></i>
        <span>{{ product.views || "1,425" }}</span>
      </div>

      <button
        class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
      >
        <i
          class="fas fa-heart text-xs"
          style="color: var(--color-text-sub)"
        ></i>
      </button>
    </div>

    <div class="p-3 flex flex-col flex-grow">
      <span
        class="text-[9px] font-black uppercase tracking-widest mb-1"
        style="color: var(--color-primary)"
        >{{ product.category || "Accessoires" }}</span
      >

      <h3
        class="text-xs font-bold line-clamp-2 mb-2"
        style="color: var(--color-text-main)"
      >
        {{ product.name }}
      </h3>

      <div class="flex items-center gap-1 mb-3">
        <div class="flex text-[8px]" style="color: var(--color-rating)">
          <i
            class="fas fa-star"
            v-for="n in 5"
            :key="n"
            :class="{ 'text-gray-300': n > Math.round(product.rating) }"
          ></i>
        </div>
      </div>

      <div class="mt-auto flex items-center justify-between">
        <span
          class="text-sm font-black"
          style="color: var(--color-text-main)"
          >{{ product.price }}</span
        >

        <button
          class="btn-details flex items-center gap-1 p-1.5 rounded transition hover:bg-black/5 dark:hover:bg-white/5"
        >
          <span class="hidden sm:inline">VOIR</span>
          <i class="fas fa-arrow-right hidden sm:inline text-[10px]"></i>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
    properties: {
      id: Number,
      name: String,
      price: String,
      image: String,
      rating: Number,
      reviews: Number,
    },
  },
});
</script>
