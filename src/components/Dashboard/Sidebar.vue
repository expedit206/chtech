<template>
  <div>
    <div
      v-if="isMobileOpen"
      @click="isMobileOpen = false"
      class="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
    ></div>

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
            <!-- <i class="fa-solid fa-bolt text-white"></i> -->
            <CloudLightning :size="16" :stroke-width="3" class="text-white" />
          </div>
          <span class="font-bold text-[var(--color-text-main)] truncate"
            >CH-TECH</span
          >
        </div>

        <button
          @click="isCollapsed = !isCollapsed"
          class="hidden md:block p-2 rounded-lg hover:bg-[var(--color-primary)]/10 text-[var(--color-text-sub)]"
        >
          <!-- <i
            :class="[
              'fa-solid transition-transform',
              isCollapsed ? 'fa-indent' : 'fa-outdent',
            ]"
          ></i> -->
          <component
            :is="isCollapsed ? Indent : Outdent"
            class="transition-transform duration-200"
            :size="20"
          />
        </button>

        <button
          @click="isMobileOpen = false"
          class="md:hidden p-2 text-[var(--color-text-sub)]"
        >
          <X class="text-xl" :size="24" />
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
            <!-- <i :class="['fa-solid', item.icon, 'text-lg']"></i>
           -->

            <component
              :is="item.icon"
              :size="20"
              class="transition-transform group-hover:scale-110"
            />
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
            <!-- <i class="fa-solid fa-right-from-bracket text-lg"></i> -->
            <LogOut :size="20" class="text-[var(--color-accent)]" />
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
      class="md:hidden fixed top-30 left-4 w-12 h-12 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)] rounded-xl shadow-md z-30 flex items-center justify-center transition-transform active:scale-95"
    >
      <AlignLeft class="text-xl" :size="24" />
    </button> -->

    <button
      @click="isMobileOpen = true"
      v-if="!isMobileOpen"
      class="md:hidden fixed top-1/2 -translate-y-1/2 left-0 w-6 h-16 bg-[var(--color-primary)] text-white rounded-r-xl shadow-lg z-30 flex items-center justify-center transition-all hover:w-8 active:scale-95 group"
    >
      <ChevronRight
        class="transition-transform group-hover:translate-x-0.5"
        :size="20"
        :stroke-width="3"
      />
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Indent,
  Outdent,
  X,
  AlignLeft,
  CloudLightning,
  LayoutDashboard,
  Package,
  Heart,
  Settings,
  Headphones,
  LogOut,
  ChevronRight,
} from "lucide-vue-next";
const isCollapsed = ref(false); // État Desktop
const isMobileOpen = ref(false); // État Mobile

const menuItems = [
  { name: "Tableau de bord", icon: LayoutDashboard, route: "/profile" },
  { name: "Mes Commandes", icon: Package, route: "/profile/orders" },
  { name: "Mes Favoris", icon: Heart, route: "/profile/wishlist" },
  { name: "Paramètres", icon: Settings, route: "/profile/settings" },
  { name: "Aide & Support", icon: Headphones, route: "/profile/support" },
];
</script>
