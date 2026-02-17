<template>
  <article
    class="flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border"
    :style="{
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
    }"
  >
    <!-- Image -->
    <div
      class="relative aspect-[16/10] overflow-hidden group border-b"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <img
        :src="blog.image"
        :alt="blog.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <span
        class="absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
        :style="{
          backgroundColor: blog.categoryType === 'primary' ? 'var(--color-primary)' : 'var(--color-accent)',
          color: 'var(--color-pure)',
        }"
      >
        {{ blog.category }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-5 flex-1 flex flex-col">
      <!-- Author -->
      <div class="flex items-center gap-2 mb-3">
        <img
          src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"
          class="w-6 h-6 rounded-full"
        />
        <span class="text-[11px] font-bold" :style="{ color: 'var(--color-text-main)' }">
          {{ blog.author }}
        </span>
        <span class="text-[11px]" :style="{ color: 'var(--color-text-sub)' }">
          • {{ blog.time }}
        </span>
      </div>

      <!-- Title -->
      <h3
        class="text-md font-bold mb-3 leading-snug line-clamp-2"
        :style="{ color: 'var(--color-text-main)' }"
      >
        {{ blog.title }}
      </h3>

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
            class="w-4 h-4 rounded-full flex items-center justify-center text-[7px]"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }"
          >
            <i class="fas fa-thumbs-up"></i>
          </span>
          <span class="text-[10px] font-medium" :style="{ color: 'var(--color-text-sub)' }">
            {{ blog.likes }}
          </span>
        </div>
        <div class="text-[10px]" :style="{ color: 'var(--color-text-sub)' }">
          {{ blog.comments }} commentaires
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div
      class="grid grid-cols-3 border-t"
      :style="{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-bg)',
      }"
    >
      <button
        class="py-3 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:opacity-70 transition-opacity"
        :style="{ color: 'var(--color-text-sub)' }"
      >
        <i class="far fa-thumbs-up"></i> Like
      </button>
      <button
        class="py-3 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:opacity-70 transition-opacity border-x"
        :style="{
          color: 'var(--color-text-sub)',
          borderColor: 'var(--color-border)',
        }"
      >
        <i class="far fa-comment"></i> Note
      </button>
      <button
        class="py-3 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:opacity-70 transition-opacity"
        :style="{ color: 'var(--color-text-sub)' }"
      >
        <i class="fas fa-share"></i>
      </button>
    </div>
  </article>
</template>

<script setup>
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
    }
  }
})
</script>
