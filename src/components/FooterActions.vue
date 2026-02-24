<template>
  <div class="fixed bottom-6 right-6 flex flex-col gap-3 z-[60]">
    <button
      class="group relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:-translate-y-1 active:scale-90"
      :style="{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-main)',
      }"
    >
      <!-- <i class="fas fa-question text-lg"></i> <CircleQuestionMark :size="16" :stroke-width="3" />-->
      <CircleQuestionMark
        :stroke-width="3"
        class="text-lg"
        :style="{ color: 'var(--color-text-main)' }"
      />
      <span
        class="absolute right-14 px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm"
        :style="{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }"
      >
        Besoin d'aide ?
      </span>
    </button>

    <button
      @click="scrollToTop"
      class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl transition-all hover:-translate-y-1 active:scale-90"
      :style="{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-pure)',
      }"
    >
      <!-- <i class="fas fa-arrow-up text-lg"></i> -->
      <ArrowUp :stroke-width="3" class="text-lg" />
    </button>
  </div>
</template>

<script setup>
import { CircleQuestionMark, ArrowUp } from "lucide-vue-next";
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>
