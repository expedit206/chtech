<template>
  <div class="h-28"></div>

  <!-- Categories -->
  <section>
    <div 
      class="w-full overflow-x-auto overflow-y-hidden border-b"
      :style="{ 
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)'
      }"
    >
      <div class="flex gap-4 p-4 min-w-max">
        <CategoryCard 
          v-for="category in categories" 
          :key="category.id"
          :icon="category.icon"
          :name="category.name"
          :active="category.active"
        />
      </div>
    </div>
  </section>

  <!-- Products -->
  <section class="max-w-7xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in products" 
        :key="product.id"
        :product="product"
        @click="goToProduct(product.id)"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CategoryCard from '../components/CategoryCard.vue'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()

const categories = ref([
  { id: 1, name: 'Processeurs', icon: 'fas fa-microchip', active: true },
  { id: 2, name: 'Laptops', icon: 'fas fa-laptop', active: false },
  { id: 3, name: 'GPU', icon: 'fas fa-cube', active: false },
  { id: 4, name: 'RAM', icon: 'fas fa-memory', active: false },
  { id: 5, name: 'SSD', icon: 'fas fa-hdd', active: false },
])

const products = ref([
  {
    id: 1,
    name: 'Intel Core i9-13900K',
    price: '$589.99',
    image: 'https://images.unsplash.com/photo-1591290619762-b5f0d4c9d1a8?q=80&w=400',
    rating: 4.8,
    reviews: 245,
  },
  {
    id: 2,
    name: 'AMD Ryzen 9 7950X',
    price: '$549.99',
    image: 'https://images.unsplash.com/photo-1591290619762-b5f0d4c9d1a8?q=80&w=400',
    rating: 4.9,
    reviews: 328,
  },
  {
    id: 3,
    name: 'NVIDIA RTX 4090',
    price: '$1,599.99',
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?q=80&w=400',
    rating: 4.7,
    reviews: 156,
  },
])

const goToProduct = (id) => {
  router.push(`/produit/${id}`)
}
</script>
