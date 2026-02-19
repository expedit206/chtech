<template>
  <div
    class="flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border cursor-pointer"
    :style="{
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
    }"
  >
    <!-- Image -->
    <div
      class="relative aspect-[4/3] overflow-hidden group border-b"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col">
      <!-- Name -->
      <h3 
        class="font-bold mb-2 line-clamp-2 text-sm"
        :style="{ color: 'var(--color-text-main)' }"
      >
        {{ product.name }}
      </h3>

      <!-- Rating & Reviews -->
      <div class="flex items-center gap-2 mb-3 text-xs">
        <div class="flex items-center gap-1">
          <i class="fas fa-star text-yellow-400"></i>
          <span class="font-bold" :style="{ color: 'var(--color-text-main)' }">{{ product.rating }}</span>
        </div>
        <span :style="{ color: 'var(--color-text-sub)' }">({{ product.reviews }})</span>
      </div>

      <!-- Price -->
      <p 
        class="font-bold mb-4 text-lg"
        :style="{ color: 'var(--color-primary)' }"
      >
        {{ product.price }}
      </p>

      <!-- Add to Cart Button -->
      <button
        class="w-full py-2 rounded-lg font-bold text-sm transition-all active:scale-95"
        :style="{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-pure)',
        }"
      >
        <i class="fas fa-shopping-cart mr-1"></i> Ajouter
      </button>
    </div>
  </div>
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
    }
  }
})
</script>
