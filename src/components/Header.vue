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
        <RouterLink to="/"> chtech </RouterLink>
      </h1>

      <div class="hidden md:flex flex-1 max-w-xl relative group">
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
          <Search class="text-lg" />
        </button>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
          :style="{ color: 'var(--color-text-main)' }"
        >
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
          <Plus :size="16" :stroke-width="3" class="text-sm" />
        </button>

        <div v-if="auth.isAuthenticated" class="group relative">
          <div
            class="p-0.5 rounded-full border-2 cursor-pointer transition-transform hover:scale-105"
            :style="{ borderColor: 'var(--color-primary)' }"
          >
            <img
              :src="
                auth.user?.avatar ||
                `https://ui-avatars.com/api/?name=${auth.user?.nom || 'U'}&background=6366f1&color=fff`
              "
              class="w-7 h-7 rounded-full object-cover"
            />
          </div>

          <div
            class="absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-[60]"
            :style="{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }"
          >
            <div
              class="px-4 py-2 border-b mb-1"
              :style="{ borderColor: 'var(--color-border)' }"
            >
              <p
                class="text-xs font-bold truncate"
                :style="{ color: 'var(--color-primary)' }"
              >
                {{ auth.user?.nom }}
              </p>
              <p
                class="text-[10px] opacity-60 truncate"
                :style="{ color: 'var(--color-text-sub)' }"
              >
                {{ auth.user?.telephone || auth.user?.email }}
              </p>
            </div>
            <router-link
              to="/profile"
              class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-black/5"
              :style="{ color: 'var(--color-text-main)' }"
            >
              <UserCircle class="w-4 h-4 opacity-70" />
              <span>Mon Profil</span>
            </router-link>
            <button
              @click="auth.logout"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
            >
              <LogOut class="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
        <router-link
          v-else
          to="/login"
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:opacity-90 active:scale-95"
          :style="{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-pure)',
          }"
        >
          Connexion
        </router-link>
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
          <House :stroke-width="3" class="text-lg" />
          <span class="tooltip-text">Accueil</span>
        </RouterLink>

        <RouterLink
          to="/blogs"
          class="group relative flex-1 flex items-center justify-center border-b-4 transition-colors"
          :style="isActive('/blogs') ? activeStyle : inactiveStyle"
        >
          <Newspaper :stroke-width="3" class="text-lg" />
          <span class="tooltip-text">Blogs</span>
        </RouterLink>

        <a
          href="#"
          class="group relative flex-1 flex items-center justify-center hover:bg-black/5 transition-colors"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          <div class="relative">
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
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useTheme } from "../composables/useTheme.js";
import { useCartStore } from "../stores/cart.js";
import { useAuthStore } from "../stores/auth.js";
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
  UserCircle,
  LogOut,
} from "lucide-vue-next";

const cart = useCartStore();
const auth = useAuthStore();
const route = useRoute();
const { theme, toggleTheme } = useTheme();

const themeIcon = computed(() => {
  return theme.value === "dark" ? Sun : Moon;
});

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
