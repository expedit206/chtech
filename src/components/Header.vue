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
        chtech
      </h1>

      <div class="hidden md:flex flex-1 max-w-xl relative group">
        <i
          class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
          :style="{ color: 'var(--color-text-sub)' }"
        ></i>
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
          <i class="fas fa-search text-lg"></i>
        </button>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
          :style="{ color: 'var(--color-text-main)' }"
        >
          <i
            :class="theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"
            class="text-lg"
          ></i>
        </button>

        <RouterLink to="/cart" class="relative cursor-pointer group">
          <i
            class="fas fa-shopping-cart text-lg"
            :style="{ color: 'var(--color-text-main)' }"
          ></i>
          <span
            class="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-[9px] font-bold"
            :style="{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-pure)',
              width: '16px',
              height: '16px',
              border: '2px solid var(--color-surface)',
            }"
          >
            {{ cartCount }}
          </span>
          <span class="tooltip-text">Panier</span>
        </RouterLink>

        <button
          class="w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90"
          :style="{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-pure)',
          }"
        >
          <i class="fas fa-plus text-sm"></i>
        </button>

        <div
          class="p-0.5 rounded-full border-2"
          :style="{ borderColor: 'var(--color-primary)' }"
        >
          <img
            src="https://ui-avatars.com/api/?name=CH&background=6366f1&color=fff"
            class="w-7 h-7 rounded-full"
          />
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
          <i class="fas fa-home text-xl"></i>
          <span class="tooltip-text">Accueil</span>
        </RouterLink>

        <RouterLink
          to="/blogs"
          class="group relative flex-1 flex items-center justify-center border-b-4 transition-colors"
          :style="isActive('/blogs') ? activeStyle : inactiveStyle"
        >
          <i class="fas fa-newspaper text-xl"></i>
          <span class="tooltip-text">Blogs</span>
        </RouterLink>

        <a
          href="#"
          class="group relative flex-1 flex items-center justify-center hover:bg-black/5 transition-colors"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          <div class="relative">
            <i class="fas fa-bell text-xl"></i>
            <span class="nav-badge"></span>
          </div>
          <span class="tooltip-text">Notifications</span>
        </a>

        <RouterLink
          to="/messages"
       class="group relative flex-1 flex items-center justify-center border-b-4 transition-colors"
          :style="isActive('/messages') ? activeStyle : inactiveStyle"
        >
          <i class="fas fa-comments text-xl"></i>
          <span class="tooltip-text">Messages</span>
        </RouterLink>

        <a

          class="group relative flex-1 flex items-center justify-center hover:bg-black/5 transition-colors"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          <i class="fas fa-chart-line text-xl"></i>
          <span class="tooltip-text">Analyses</span>
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useTheme } from "../composables/useTheme.js";
import { useCartStore } from '../stores/cart.js';
const cart = useCartStore();
const cartCount = cart.count;

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
