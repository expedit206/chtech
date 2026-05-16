<template>
  <article
    class="flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border"
    :style="{
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
    }"
  >
    <!-- Image -->
    <router-link
      :to="{ name: 'ShowBlog', params: { slug: blog.slug } }"
      class="relative flex-shrink-0 aspect-[16/10] overflow-hidden group border-b block"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <img
        :src="blog.image"
        :alt="blog.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <span
        class="absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
        :style="{
          backgroundColor:
            blog.categoryType === 'primary'
              ? 'var(--color-primary)'
              : 'var(--color-accent)',
          color: 'var(--color-pure)',
        }"
      >
        {{ blog.category }}
      </span>
    </router-link>

    <!-- Content -->
    <div class="py-5  px-2 flex-1 flex flex-col">
   

      <!-- Title -->
      <router-link :to="{ name: 'ShowBlog', params: { slug: blog.slug || blog.id } }" class="mb-3 block">
        <h3
          class="text-md font-bold leading-snug line-clamp-2 hover:text-[var(--color-primary)] transition-colors"
          :style="{ color: 'var(--color-text-main)' }"
        >
          {{ blog.title }}
        </h3>
      </router-link>

      <!-- Description -->
      <p
        class="text-xs line-clamp-3 mb-4 flex-1"
        :style="{ color: 'var(--color-text-sub)' }"
      >
        {{ blog.description }}
      </p>

      <!-- Stats -->
      <div
        class="flex justify-between items-center pt-4 border-t"
        :style="{ borderColor: 'var(--color-border)' }"
      >
        <div class="flex items-center gap-1.5">
          <span
            class="w-4 h-4 rounded-full flex items-center justify-center p-1"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }"
          >
            <ThumbsUp :size="16" />
          </span>
          <span
            class="text-[10px] font-medium"
            :style="{ color: 'var(--color-text-sub)' }"
          >
            {{ blog.likes }}
          </span>
        </div>
        <div class="text-[10px]" :style="{ color: 'var(--color-text-sub)' }">
          {{ blog.comments }} commentaires
        </div>
      </div>
    </div>

  </article>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { ThumbsUp, Share, MessageCircle, Forward } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

defineProps({
  blog: {
    type: Object,
    required: true,
    properties: {
      id: Number,
      title: String,
      image: String,
      category: String,
      categoryType: String,
      author: String,
      time: String,
      description: String,
      likes: Number,
      comments: Number,
    },
  },
});

const handleInteraction = () => {
  if (!authStore.isAuthenticated) {
    router.push({ path: "/login", query: { redirect: route.fullPath } });
    return false;
  }
  return true;
};
</script>
