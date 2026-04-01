<template>
  <div class="h-8"></div>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-12 border-l-4 pl-6" :style="{ borderColor: 'var(--color-primary)' }">
      <h2 class="text-4xl font-black tracking-tighter uppercase" :style="{ color: 'var(--color-text-main)' }">
        Conseils &amp; Actualités
      </h2>
      <p class="text-lg" :style="{ color: 'var(--color-text-sub)' }">
        Apprenez à mieux vendre et achetez en toute sécurité.
      </p>
    </div>

    <!-- Skeleton while loading -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <SkeletonBlogCard v-for="i in 8" :key="i" />
    </div>

    <!-- Blog grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <BlogCard v-for="blog in blogs" :key="blog.id" :blog="blog" />
    </div>

    <!-- Empty state -->
    <div v-if="!isLoading && blogs.length === 0" class="py-24 text-center">
      <i class="fas fa-newspaper text-5xl mb-4 opacity-20" :style="{ color: 'var(--color-text-sub)' }"></i>
      <p class="text-lg font-semibold" :style="{ color: 'var(--color-text-sub)' }">
        Aucun article disponible pour le moment.
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BlogCard from "../components/BlogCard.vue";
import SkeletonBlogCard from "../components/skeletons/SkeletonBlogCard.vue";
import apiClient from "../api/index.js";
import { useSeo } from "../composables/useSeo.js";

useSeo({
  title: "Blogs & Conseils - Sasaye",
  description: "Retrouvez tous nos conseils pour mieux vendre et acheter en toute sécurité sur Sasaye. Actualités, guides et astuces e-commerce au Cameroun."
});

const isLoading = ref(true);
const blogs = ref([]);

onMounted(async () => {
  try {
    const res = await apiClient.get("/blog/posts");
    // Map backend fields to what BlogCard expects
    blogs.value = (res.data.data || res.data || []).map((post) => ({
      id: post.id,
      title: post.title || post.titre,
      image: post.image
        ? post.image.startsWith("http")
          ? post.image
          : `http://localhost:8000/storage/${post.image}`
        : "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800",
      category: post.category || post.categorie || "Article",
      categoryType: "primary",
      author: post.author?.nom || post.auteur || "Admin Chtech",
      time: formatDate(post.created_at),
      description:
        post.excerpt ||
        post.description ||
        post.content?.substring(0, 120) + "..." ||
        "",
      likes: post.likes_count || post.likes || 0,
      comments: post.comments_count || post.comments || 0,
      slug: post.slug,
    }));
  } catch (err) {
    console.error("Erreur chargement articles:", err);
    // Fallback static articles if API fails
    blogs.value = [
      {
        id: 1,
        title: "5 astuces pour rendre vos annonces plus attractives",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800",
        category: "Guide Vendeur",
        categoryType: "primary",
        author: "Admin Chtech",
        time: "1h",
        description:
          "La qualité des photos et la précision de la description sont les clés pour vendre vos articles en moins de 24h...",
        likes: 85,
        comments: 12,
      },
      {
        id: 2,
        title: "Comment identifier les arnaqueurs sur le marché en ligne",
        image:
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800",
        category: "Sécurité",
        categoryType: "accent",
        author: "Admin Chtech",
        time: "3h",
        description:
          "Découvrez les signaux d'alerte et les conseils d'experts pour acheter en toute confiance...",
        likes: 156,
        comments: 23,
      },
      {
        id: 3,
        title: "Les meilleures pratiques de négociation",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800",
        category: "Conseil",
        categoryType: "primary",
        author: "Admin Chtech",
        time: "5h",
        description:
          "Maîtrisez l'art de la négociation pour obtenir les meilleurs prix...",
        likes: 234,
        comments: 45,
      },
    ];
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffH = Math.floor((now - d) / 3600000);
  if (diffH < 1) return "À l'instant";
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};
</script>
