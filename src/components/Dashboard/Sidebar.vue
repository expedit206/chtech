<template>
  <div>
    <div v-if="isMobileOpen" @click="emit('close-mobile')"
      class="fixed inset-0 bg-black/50 z-[65] md:hidden transition-opacity"></div>

    <aside :class="[
      'fixed top-0 left-0 h-screen z-[70] transition-all duration-300 ease-in-out border-r flex flex-col',
      'bg-[var(--color-surface)] border-[var(--color-border)]',
      // Desktop : On gère la largeur fixe
      collapsed ? 'md:w-20' : 'md:w-64',
      // Mobile : Translation complète
      isMobileOpen
        ? 'translate-x-0 w-64'
        : '-translate-x-full md:translate-x-0',
    ]">
      <div class="p-4 flex items-center justify-between border-b border-[var(--color-border)] min-h-[70px]">
        <RouterLink :to="{ name : 'Home' }" v-show="!collapsed || isMobileOpen" class="flex items-center overflow-hidden">
          <img :src="CONFIG.LOGO_URL" alt="Logo" class="h-10 w-auto object-contain" />
        </RouterLink>

        <button @click="emit('toggle')"
          class="hidden md:block p-2 rounded-lg hover:bg-[var(--color-primary)]/10 text-[var(--color-text-sub)]">
          <component :is="collapsed ? Indent : Outdent" class="transition-transform duration-200" :size="20" />
        </button>

        <button @click="emit('close-mobile')" class="md:hidden p-2 text-[var(--color-text-sub)]">
          <X class="text-xl" :size="24" />
        </button>
      </div>

      <nav class="flex-1 p-3 space-y-4 overflow-x-hidden">
        <div v-for="section in menuSections" :key="section.title" class="space-y-1">
          <div v-show="!collapsed || isMobileOpen"
            class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest opacity-40 mt-3 first:mt-0"
            :style="{ color: 'var(--color-text-sub)' }">
            {{ section.title }}
          </div>

          <RouterLink v-for="item in section.items" :key="item.name" :to="item.route" @click="emit('close-mobile')"
            class="flex items-center gap-4 p-3 rounded-xl transition-all group relative text-[var(--color-text-sub)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
            active-class="bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold shadow-sm">
            <!-- Icône -->
            <div class="w-6 flex justify-center items-center shrink-0">
              <component :is="item.icon" :size="20" class="transition-transform group-hover:scale-110" />
            </div>

            <!-- Texte normal si sidebar ouverte -->
            <span v-show="!collapsed || isMobileOpen" class="font-medium whitespace-nowrap transition-opacity">
              {{ item.name }}
            </span>

            <!-- Tooltip si sidebar réduite -->
            <span v-if="collapsed" class="tooltip-text absolute left-full top-1/2 -translate-y-1/2 ml-2">
              {{ item.name }}
            </span>
          </RouterLink>
        </div>
      </nav>

      <div class="p-3 border-t border-[var(--color-border)]">
        <button @click="auth.logout"
          class="flex items-center gap-4 p-3 w-full rounded-xl text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors">
          <div class="w-6 flex justify-center items-center shrink-0">
            <LogOut :size="20" class="text-[var(--color-accent)]" />
          </div>
          <span v-show="!collapsed || isMobileOpen" class="font-medium text-left">Déconnexion</span>
        </button>
      </div>
    </aside>

    <button @click="emit('open-mobile')" v-if="!isMobileOpen"
      class="md:hidden fixed top-1/2 -translate-y-1/2 left-0 w-7 h-20 bg-[var(--color-primary)] text-white rounded-r-xl shadow-lg z-30 flex items-center justify-center gap-1 px-1 transition-all w-9 active:scale-95 group animate-pulse-dashboard">
      <span class="text-[10px] font-semibold tracking-wide" style="writing-mode: vertical-rl; text-orientation: mixed">
        Tableau de bord
      </span>

      <ChevronRight class="transition-transform" :size="18" :stroke-width="3" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Indent,
  Outdent,
  X,
  CloudLightning,
  LayoutDashboard,
  Heart,
  Settings,
  Headphones,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Store,
  Star,
  Box,
  PackageCheck,
  MessageCircle,
  UserCircle,
  ShieldCheck,
  Users,
  Package,
  Tag,
  FileText,
  DollarSign,
  Megaphone,
} from "lucide-vue-next";
import { CONFIG } from "../../config/index.js";
import { useAuthStore } from "../../stores/auth.js";

const auth = useAuthStore();

const props = defineProps({
  collapsed: Boolean,
  isMobileOpen: Boolean,
});

const emit = defineEmits(["toggle", "close-mobile", "open-mobile"]);

const menuSections = computed(() => {
  const sections = [];

  if (!auth.isAdmin) {
    sections.push({
      title: "Navigation",
      items: [
        {
          name: "Tableau de bord",
          icon: LayoutDashboard,
          route: { name: "Dashboard" },
        },
        { name: "Messages", icon: MessageCircle, route: { name: "messages" } },
        {
          name: "Mes Demandes",
          icon: ShoppingBag,
          route: { name: "my-orders" },
        },
        { name: "Mes Favoris", icon: Star, route: { name: "Wishlist" } },
      ],
    });
  }

  if (auth.isAdmin) {
    sections.push({
      title: "Administration",
      items: [
        { name: "Tableau de bord", icon: ShieldCheck, route: { name: "admin-dashboard" } },
        { name: "Utilisateurs", icon: Users, route: { name: "admin-users" } },
        { name: "Vendeurs", icon: Store, route: { name: "admin-users", query: { role: 'vendeur' } } },
        { name: "Demandes Vendeurs", icon: PackageCheck, route: { name: "admin-seller-requests" } },
        { name: "Produits", icon: Package, route: { name: "admin-products" } },
        { name: "Catégories", icon: Tag, route: { name: "admin-categories" } },
        { name: "Blog", icon: FileText, route: { name: "admin-blog" } },
      ],
    });
  }

  if (auth.isVendeur) {
    sections.push({
      title: "Vendeur",
      items: [
        { name: "Mes Produits", icon: Box, route: { name: "my-products" } },
        {
          name: "Commandes Clients",
          icon: PackageCheck,
          route: { name: "vendeur-orders" },
        },
      ],
    });
  }

  sections.push({
    title: "Compte",
    items: [
      { name: "Profil Public", icon: UserCircle, route: { name: "PublicProfile", params: { id: auth.user?.id } } },
      { name: "Paramètres", icon: Settings, route: { name: "Settings" } },
      { name: "Aide & Support", icon: Headphones, route: { name: "Support" } },
    ],
  });

  return sections;
});
</script>

<style scoped>
@keyframes pulse-horizontal {

  0%,
  40%,
  100% {
    transform: translateY(-50%) translateX(0) scale(1);
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }

  10%,
  30% {
    transform: translateY(-50%) translateX(6px) scale(1.1);
    filter: drop-shadow(0 10px 15px var(--color-primary));
  }

  20% {
    transform: translateY(-50%) translateX(2px) scale(1.05);
  }
}

.animate-pulse-dashboard {
  animation: pulse-horizontal 2.5s ease-in-out infinite;
}

nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}

nav:hover::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  opacity: 0.3;
}

.tooltip-text {
  z-index: 1000;
}
</style>
