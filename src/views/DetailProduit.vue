<template>
  <div class="h-8"></div>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <!-- Back button -->
    <RouterLink to="/" class="inline-flex items-center gap-2 mb-8 text-sm font-semibold" :style="{ color: 'var(--color-primary)' }">
      <i class="fas fa-arrow-left"></i> Retour aux produits
    </RouterLink>

    <!-- Product Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Images -->
      <div class="flex flex-col gap-4">
        <div 
          class="rounded-2xl overflow-hidden aspect-square"
          :style="{ backgroundColor: 'var(--color-surface)', border: `1px solid var(--color-border)` }"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Details -->
      <div class="flex flex-col gap-6">
        <div>
          <span
            class="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }"
          >
            En stock
          </span>
          <h1 class="text-3xl font-black mb-2" :style="{ color: 'var(--color-text-main)' }">
            {{ product.name }}
          </h1>
          <p class="text-xl font-bold" :style="{ color: 'var(--color-primary)' }">
            {{ product.price }}
          </p>
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <i class="fas fa-star text-yellow-400"></i>
            <span class="font-bold" :style="{ color: 'var(--color-text-main)' }">{{ product.rating }}</span>
            <span :style="{ color: 'var(--color-text-sub)' }">({{ product.reviews }} avis)</span>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h3 class="font-bold mb-2" :style="{ color: 'var(--color-text-main)' }">Description</h3>
          <p :style="{ color: 'var(--color-text-sub)' }" class="text-sm leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- Specifications -->
        <div>
          <h3 class="font-bold mb-3" :style="{ color: 'var(--color-text-main)' }">Caractéristiques</h3>
          <ul class="space-y-2 text-sm">
            <li 
              v-for="spec in product.specs" 
              :key="spec"
              class="flex items-center gap-2"
              :style="{ color: 'var(--color-text-sub)' }"
            >
              <i class="fas fa-check text-green-500"></i>
              {{ spec }}
            </li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            class="flex-1 py-3 rounded-lg font-bold transition-all active:scale-95"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }"
          >
            <i class="fas fa-shopping-cart mr-2"></i> Ajouter au panier
          </button>
          <button
            class="px-6 py-3 rounded-lg font-bold border transition-all active:scale-95"
            :style="{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
            }"
          >
            <i class="fas fa-heart"></i>
          </button>
        </div>

        <!-- Seller Info -->
        <div
          class="p-4 rounded-xl border"
          :style="{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
          }"
        >
          <div class="flex items-center gap-3 mb-3">
            <img 
              src="https://ui-avatars.com/api/?name=Seller&background=6366f1&color=fff"
              class="w-10 h-10 rounded-full"
            />
            <div>
              <p class="font-bold" :style="{ color: 'var(--color-text-main)' }">Tech Store</p>
              <p class="text-sm" :style="{ color: 'var(--color-text-sub)' }">Vendeur vérifiée ⭐ 4.9</p>
            </div>
          </div>
          <button class="w-full py-2 rounded-lg text-sm font-semibold" :style="{ color: 'var(--color-primary)' }">
            Contacter le vendeur
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const product = ref({
  id: 1,
  name: 'Intel Core i9-13900K',
  price: '$589.99',
  image: 'https://images.unsplash.com/photo-1591290619762-b5f0d4c9d1a8?q=80&w=800',
  rating: 4.8,
  reviews: 245,
  description: 'Le processeur Intel Core i9-13900K offre des performances exceptionnelles pour les applications exigeantes. Avec 24 cœurs et une fréquence jusqu\'à 5.8 GHz, il est idéal pour le gaming, le streaming et le travail professionnel.',
  specs: [
    '24 cores (8 P-cores + 16 E-cores)',
    'Fréquence jusqu\'à 5.8 GHz',
    'Cache jusqu\'à 36 MB',
    'TDP 253W',
    'Socket LGA1700',
  ]
})
</script>
