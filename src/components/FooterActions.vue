<!-- <template>
  <div class="fixed bottom-6 right-6 flex flex-col gap-3 z-[60]">
    <button
      class="group relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:-translate-y-1 active:scale-90"
      :style="{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-main)',
      }"
    >

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
      class="group relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:-translate-y-1 active:scale-90"
      :style="{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-main)',
      }"
    >

      <MessageCircleMore
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
        Laisser un message
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
 
      <ArrowUp :stroke-width="3" class="text-lg" />
    </button>
  </div>
</template> -->

<template>
  <div class="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-[60]">
    <Transition name="fade-slide">
      <div
        v-if="isMenuOpen"
        class="mb-2 p-4 rounded-2xl shadow-2xl border w-72 bg-[var(--color-surface)] border-[var(--color-border)]"
      >
        <div class="flex justify-between items-center mb-3">
          <span
            class="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]"
            >Votre avis</span
          >
          <button
            @click="isMenuOpen = false"
            class="text-gray-400 hover:text-red-500"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="flex gap-1 mb-3">
          <Star
            v-for="i in 5"
            :key="i"
            :size="18"
            class="cursor-pointer transition-colors"
            :class="
              i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            "
            @click="rating = i"
          />
        </div>

        <textarea
          v-model="message"
          placeholder="Un petit mot..."
          class="w-full h-24 p-2 text-sm rounded-lg border bg-transparent focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-none border-[var(--color-border)] text-[var(--color-text-main)]"
        ></textarea>

        <button
          @click="submitComment"
          class="mt-2 w-full py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
        >
          <span>Envoyer</span>
          <Send :size="14" />
        </button>
      </div>
    </Transition>

    <button
      class="group relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:-translate-y-1 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-main)]"
    >
      <HelpCircle :size="20" :stroke-width="2.5" />
      <span
        class="absolute right-14 px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[var(--color-surface)] border border-[var(--color-border)]"
      >
        Besoin d'aide ?
      </span>
    </button>

    <button
      @click="isMenuOpen = !isMenuOpen"
      class="group relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:-translate-y-1 active:scale-90"
      :class="isMenuOpen ? 'rotate-90' : ''"
      :style="{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        color: isMenuOpen ? 'var(--color-primary)' : 'var(--color-text-main)',
      }"
    >
      <span v-if="!isMenuOpen" class="absolute -top-1 -right-1 flex h-3 w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
        ></span>
        <span
          class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
        ></span>
      </span>

      <MessageCircleMore v-if="!isMenuOpen" :stroke-width="2.5" :size="20" />
      <X v-else :size="20" />

      <span
        v-if="!isMenuOpen"
        class="absolute right-14 px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[var(--color-surface)] border border-[var(--color-border)]"
      >
        Laisser un message
      </span>
    </button>

    <button
      @click="scrollToTop"
      class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl transition-all hover:-translate-y-1 active:scale-90 bg-[var(--color-primary)] text-white"
    >
      <ArrowUp :stroke-width="3" :size="20" />
    </button>
  </div>
</template>

<style scoped>
/* Animation pour l'apparition du formulaire */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
<script setup>
import { ref } from "vue";
import {
  CircleQuestionMark,
  HelpCircle,
  ArrowUp,
  MessageCircleMore,
  Send,
  X,
  Star,
} from "lucide-vue-next";
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const isMenuOpen = ref(false);
const message = ref("");
const rating = ref(0);

const submitComment = () => {
  console.log("Message:", message.value, "Rating:", rating.value);
  // Logique d'envoi ici
  isMenuOpen.value = false;
  message.value = "";
  rating.value = 0;
};
</script>
