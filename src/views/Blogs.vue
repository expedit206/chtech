<template>
  <div class="h-8"></div>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div 
      class="mb-12 border-l-4 pl-6"
      :style="{ borderColor: 'var(--color-primary)' }"
    >
      <h2 class="text-4xl font-black tracking-tighter uppercase" :style="{ color: 'var(--color-text-main)' }">
        Conseils & Actualités
      </h2>
      <p class="text-lg" :style="{ color: 'var(--color-text-sub)' }">
        Apprenez à mieux vendre et achetez en toute sécurité.
      </p>
    </div>

    <!-- Blog Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <BlogCard 
        v-for="blog in blogs" 
        :key="blog.id"
        :blog="blog"
      />
    </div>
  </main>

</template>

<script setup>
import { ref } from 'vue'
import BlogCard from '../components/BlogCard.vue'


const blogs = ref([
  {
    id: 1,
    title: '5 astuces infaillibles pour rendre vos annonces plus attractives',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800',
    category: 'Guide Vendeur',
    categoryType: 'primary',
    author: 'Admin Chtech',
    time: '1h',
    description: 'La qualité des photos et la précision de la description sont les clés pour vendre vos articles en moins de 24h...',
    likes: 85,
    comments: 12,
  },
  {
    id: 2,
    title: 'Comment identifier les arnaqueurs sur le marché en ligne',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800',
    category: 'Sécurité',
    categoryType: 'accent',
    author: 'Admin Chtech',
    time: '3h',
    description: 'Découvrez les signaux d\'alerte et les conseils d\'experts pour acheter en toute confiance...',
    likes: 156,
    comments: 23,
  },
  {
    id: 3,
    title: 'Les meilleures pratiques de négociation',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800',
    category: 'Conseil',
    categoryType: 'primary',
    author: 'Admin Chtech',
    time: '5h',
    description: 'Maîtrisez l\'art de la négociation pour obtenir les meilleurs prix...',
    likes: 234,
    comments: 45,
  },
])
</script>
