<template>
  <div>
    <div
      v-if="isMobileOpen"
      @click="isMobileOpen = false"
      class="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
    ></div>

    <!-- <aside
      :class="[
        'fixed md:sticky top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out border-r',
        'bg-[var(--color-surface)] border-[var(--color-border)] z-10000',
        // Logique Desktop (Width)
        isCollapsed ? 'md:w-20' : 'md:w-64',
        // Logique Mobile (Translation)
        isMobileOpen
          ? 'translate-x-0 w-64'
          : '-translate-x-full md:translate-x-0',
      ]"
    > -->

    <aside
      :class="[
        'fixed top-0 left-0 h-screen z-[70] transition-all duration-300 ease-in-out border-r',
        'bg-[var(--color-surface)] border-[var(--color-border)]',
        // Desktop : On gère la largeur fixe
        isCollapsed ? 'md:w-20' : 'md:w-64',
        // Mobile : Translation complète
        isMobileOpen
          ? 'translate-x-0 w-64'
          : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div
        class="p-4 flex items-center justify-between border-b border-[var(--color-border)] min-h-[70px]"
      >
        <div
          v-show="!isCollapsed || isMobileOpen"
          class="flex items-center gap-3 overflow-hidden"
        >
          <div
            class="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center shrink-0"
          >
            <i class="fa-solid fa-bolt text-white"></i>
          </div>
          <span class="font-bold text-[var(--color-text-main)] truncate"
            >CH-TECH</span
          >
        </div>

        <button
          @click="isCollapsed = !isCollapsed"
          class="hidden md:block p-2 rounded-lg hover:bg-[var(--color-primary)]/10 text-[var(--color-text-sub)]"
        >
          <i
            :class="[
              'fa-solid transition-transform',
              isCollapsed ? 'fa-indent' : 'fa-outdent',
            ]"
          ></i>
        </button>

        <button
          @click="isMobileOpen = false"
          class="md:hidden p-2 text-[var(--color-text-sub)]"
        >
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <nav class="flex-1 p-3 space-y-2 overflow-y-auto">
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.route"
          class="flex items-center gap-4 p-3 rounded-xl transition-all group relative text-[var(--color-text-sub)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
        >
          <div class="w-6 flex justify-center items-center shrink-0">
            <i :class="['fa-solid', item.icon, 'text-lg']"></i>
          </div>

          <span
            v-show="!isCollapsed || isMobileOpen"
            class="font-medium whitespace-nowrap transition-opacity"
          >
            {{ item.name }}
          </span>

          <span
            v-if="isCollapsed"
            class="hidden md:block absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-[var(--color-text-main)] text-[var(--color-pure)] px-2 py-1 rounded text-xs z-50"
          >
            {{ item.name }}
          </span>
        </RouterLink>
      </nav>

      <div class="p-3 border-t border-[var(--color-border)]">
        <button
          class="flex items-center gap-4 p-3 w-full rounded-xl text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
        >
          <div class="w-6 flex justify-center items-center shrink-0">
            <i class="fa-solid fa-right-from-bracket text-lg"></i>
          </div>
          <span
            v-show="!isCollapsed || isMobileOpen"
            class="font-medium text-left"
            >Déconnexion</span
          >
        </button>
      </div>
    </aside>

    <!-- <button
      @click="isMobileOpen = true"
      class="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[var(--color-primary)] text-white rounded-full shadow-lg z-30 flex items-center justify-center"
    >
      <i class="fa-solid fa-bars text-xl"></i>
    </button> -->
    <button
      @click="isMobileOpen = true"
      class="md:hidden fixed top-30 left-4 w-12 h-12 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)] rounded-xl shadow-md z-30 flex items-center justify-center transition-transform active:scale-95"
    >
      <i class="fa-solid fa-bars-staggered text-xl"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isCollapsed = ref(false); // État Desktop
const isMobileOpen = ref(false); // État Mobile

const menuItems = [
  { name: "Tableau de bord", icon: "fa-house", route: "/profile" },
  { name: "Mes Commandes", icon: "fa-box", route: "/profile/orders" },
  { name: "Mes Favoris", icon: "fa-heart", route: "/profile/wishlist" },
  { name: "Paramètres", icon: "fa-user-gear", route: "/profile/settings" },
  { name: "Aide & Support", icon: "fa-headset", route: "/profile/support" },
];
</script>
