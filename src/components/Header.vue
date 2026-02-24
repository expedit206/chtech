<template>
  <header
    class="fixed top-0 z-50 w-full shadow-sm border-b"
    :style="{
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
    }"
  >
    <div class="flex items-center justify-between px-4 h-14 gap-4">
      <h1
        class="text-xl font-black tracking-tighter flex-shrink-0"
        :style="{
          color: 'var(--color-primary)',
          fontFamily: 'Open Sans, sans-serif',
        }"
      >
      <RouterLink to="/">
        chtech
      </RouterLink>
      </h1>

      <div class="hidden md:flex flex-1 max-w-xl relative group">
        <!-- <i
          class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
          :style="{ color: 'var(--color-text-sub)' }"
        ></i> -->
        <Search
          :style="{ color: 'var(--color-text-sub)' }"
          class="absolute left-3 top-1/2 -translate-y-1/2 transition-colors text-xs"
        />
        <input
          type="text"
          placeholder="Rechercher..."
          class="w-full pl-10 pr-4 py-2 rounded-full text-sm border-none outline-none focus:ring-2 transition-all"
          :style="{
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-main)',
            '--tw-ring-color': 'var(--color-primary)',
          }"
        />
      </div>

      <div class="flex items-center gap-3 md:gap-4">
        <button class="md:hidden" :style="{ color: 'var(--color-text-main)' }">
          <!-- <i class="fas fa-search text-lg"></i> -->
          <Search class="text-lg" />
        </button>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
          :style="{ color: 'var(--color-text-main)' }"
        >
          <!-- <i
            :class="theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"
            class="text-lg"
          ></i> -->
          <component
            :is="themeIcon"
            :size="20"
            :stroke-width="3"
            class="text-lg"
          />
        </button>

        <div
          @click="cart.isSidebarOpen = true"
          class="relative cursor-pointer group"
        >
          <!-- <i
            class="fas fa-shopping-cart text-lg transition-transform group-hover:scale-110"
            :style="{ color: 'var(--color-text-main)' }"
          ></i> -->
          <ShoppingCart
            :stroke-width="3"
            :style="{ color: 'var(--color-text-main)' }"
            class="text-lg transition-transform group-hover:scale-110"
          />
          <span
            v-if="cart.count > 0"
            class="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-[9px] font-bold animate-bounce-subtle"
            :style="{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-pure)',
              width: '16px',
              height: '16px',
              border: '2px solid var(--color-surface)',
            }"
          >
            {{ cart.count }}
          </span>
          <span class="tooltip-text">Panier</span>
        </div>

        <button
          class="w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90"
          :style="{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-pure)',
          }"
        >
          <!-- <i class="fas fa-plus text-sm"></i>
            -->
          <Plus :size="16" :stroke-width="3" class="text-sm" />
         
        </button>

        <div
          class="p-0.5 rounded-full border-2"
          :style="{ borderColor: 'var(--color-primary)' }"
        >
          <RouterLink to="/profile/settings">
            <img
              src="https://ui-avatars.com/api/?name=CH&background=6366f1&color=fff"
              class="w-7 h-7 rounded-full"
            />
          </RouterLink>
        </div>
      </div>
    </div>

    <div
      class="flex justify-center border-t h-12"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <nav class="flex h-full w-full max-w-2xl">
        <RouterLink
          to="/"
          class="group relative flex-1 flex items-center justify-center border-b-4 transition-colors"
          :style="isActive('/') ? activeStyle : inactiveStyle"
        >
          <!-- <i class="fas fa-home text-xl"></i> -->
          <!-- <House :stroke-width="1"  class="text-lg"/>
             -->
          <House :stroke-width="3" class="text-lg" />
          <span class="tooltip-text">Accueil</span>
        </RouterLink>

        <RouterLink
          to="/blogs"
          class="group relative flex-1 flex items-center justify-center border-b-4 transition-colors"
          :style="isActive('/blogs') ? activeStyle : inactiveStyle"
        >
          <!-- <i class="fas fa-newspaper text-xl"></i> -->
          <Newspaper :stroke-width="3" class="text-lg" />
          <span class="tooltip-text">Blogs</span>
        </RouterLink>

        <a
          href="#"
          class="group relative flex-1 flex items-center justify-center hover:bg-black/5 transition-colors"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          <div class="relative">
            <!-- <i class="fas fa-bell text-xl"></i> -->
            <Bell class="text-lg" :stroke-width="3" />
            <span class="nav-badge"></span>
          </div>
          <span class="tooltip-text">Notifications</span>
        </a>

        <RouterLink
          to="/messages"
          class="group relative flex-1 flex items-center justify-center border-b-4 transition-colors"
          :style="isActive('/messages') ? activeStyle : inactiveStyle"
        >
          <!-- <i class="fas fa-comments text-xl"></i> -->
          <MessageCircle class="text-lg" :stroke-width="3" />
          <span class="tooltip-text">Messages</span>
        </RouterLink>

        <RouterLink
          to="/profile"
          class="group relative flex-1 flex items-center justify-center hover:bg-black/5 transition-colors"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          <ChartLine class="text-lg" :stroke-width="3" />
          <span class="tooltip-text">Analyses</span>
        </RouterLink
        to="/analytics">
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useTheme } from "../composables/useTheme.js";
import { useCartStore } from "../stores/cart.js";
import { RouterLink } from "vue-router";
const cart = useCartStore();
import {
  Search,
  House,
  Newspaper,
  Bell,
  MessageCircle,
  ChartLine,
  ShoppingCart,
  Sun,
  Moon,
  Plus,
} from "lucide-vue-next";
// On imagine que 'theme' est une ref ou une prop
const props = defineProps(["theme"]);

// Utiliser une propriété calculée pour retourner le COMPOSANT, pas du texte
const themeIcon = computed(() => {
  return props.theme === "dark" ? Sun : Moon;
});

const route = useRoute();
const { theme, toggleTheme } = useTheme();
const isActive = (path) => route.path === path;

const activeStyle = {
  borderColor: "var(--color-primary)",
  color: "var(--color-primary)",
};
const inactiveStyle = {
  borderColor: "transparent",
  color: "var(--color-text-sub)",
};
</script>

<style scoped>
@keyframes bounce-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite;
}
</style>
