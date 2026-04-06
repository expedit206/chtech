<template>
  <div>
    <!-- Mobile overlay -->
    <div v-if="isMobileOpen" @click="emit('close-mobile')"
      class="fixed inset-0 bg-black/60 z-[65] md:hidden transition-opacity backdrop-blur-sm" />

    <aside :class="[
      'fixed top-0 left-0 h-screen z-[70] transition-all duration-300 ease-in-out flex flex-col',
      'border-r',
      collapsed ? 'md:w-20' : 'md:w-64',
      isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0',
    ]" :style="{ backgroundColor: 'var(--admin-sidebar-bg, #0f172a)', borderColor: 'rgba(255,255,255,0.06)' }">

      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 border-b min-h-[70px]"
        style="border-color: rgba(255,255,255,0.08)">
        <div v-show="!collapsed || isMobileOpen" class="flex items-center gap-3 overflow-hidden">
          <img :src="CONFIG.LOGO_URL" alt="SASAYEE" class="h-8 w-auto object-contain brightness-0 invert" />
          <div class="min-w-0">
            <span class="text-white font-black text-sm tracking-tight truncate block">SASAYEE</span>
            <span class="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
              style="background: rgba(239,68,68,0.2); color: #f87171;">Admin</span>
          </div>
        </div>
        <div v-show="collapsed && !isMobileOpen" class="w-full flex justify-center">
          <span class="text-[10px] font-black uppercase text-red-400 tracking-widest">ADM</span>
        </div>

        <button @click="emit('toggle')"
          class="hidden md:flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/5"
          style="color: rgba(255,255,255,0.4)">
          <component :is="collapsed ? PanelLeftOpen : PanelLeftClose" :size="18" />
        </button>
        <button @click="emit('close-mobile')" class="md:hidden p-1.5 rounded-lg" style="color: rgba(255,255,255,0.5)">
          <X :size="20" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden admin-nav">
        <template v-for="section in menuSections" :key="section.title">
          <!-- Section title -->
          <div v-show="!collapsed || isMobileOpen"
            class="px-3 pt-4 pb-1 text-[9px] font-black uppercase tracking-[0.15em] first:pt-1"
            style="color: rgba(255,255,255,0.25)">
            {{ section.title }}
          </div>
          <div v-show="collapsed && !isMobileOpen" class="py-2 flex justify-center">
            <div class="w-6 border-t" style="border-color: rgba(255,255,255,0.1)" />
          </div>

          <!-- Menu items -->
          <RouterLink v-for="item in section.items" :key="item.name" :to="item.route"
            @click="emit('close-mobile')"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
            :class="isActive(item.route) ? 'nav-item-active' : 'nav-item'">
            <div class="w-5 flex justify-center items-center shrink-0 transition-transform group-hover:scale-110">
              <component :is="item.icon" :size="18" />
            </div>
            <span v-show="!collapsed || isMobileOpen" class="text-sm font-medium whitespace-nowrap">
              {{ item.name }}
            </span>
            <!-- Badge -->
            <span v-if="item.badge && (!collapsed || isMobileOpen)"
              class="ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full bg-red-500 text-white min-w-[18px] text-center">
              {{ item.badge }}
            </span>
            <span v-if="item.badge && collapsed && !isMobileOpen"
              class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            <!-- Tooltip collapsed -->
            <div v-if="collapsed && !isMobileOpen"
              class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-90 group-hover:scale-100 z-50"
              style="background: #1e293b; color: white; box-shadow: 0 8px 32px rgba(0,0,0,0.4)">
              {{ item.name }}
            </div>
          </RouterLink>
        </template>
      </nav>

      <!-- Footer -->
      <div class="px-3 pb-4 pt-2 border-t" style="border-color: rgba(255,255,255,0.08)">
        <RouterLink :to="{ name: 'Home' }"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all nav-item mb-2">
          <div class="w-5 flex justify-center shrink-0">
            <ArrowLeft :size="18" />
          </div>
          <span v-show="!collapsed || isMobileOpen" class="text-sm font-medium whitespace-nowrap">
            Retour au site
          </span>
        </RouterLink>
        <button @click="auth.logout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all nav-item-danger">
          <div class="w-5 flex justify-center shrink-0">
            <LogOut :size="18" />
          </div>
          <span v-show="!collapsed || isMobileOpen" class="text-sm font-medium text-left whitespace-nowrap">
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  LayoutDashboard, Users, Package, Tag, FileText,
  DollarSign, Store, Megaphone, X, LogOut, ArrowLeft,
  PanelLeftOpen, PanelLeftClose,
} from 'lucide-vue-next';
import { CONFIG } from '../../config/index.js';
import { useAuthStore } from '../../stores/auth.js';

const auth = useAuthStore();
const route = useRoute();

defineProps({ collapsed: Boolean, isMobileOpen: Boolean });
const emit = defineEmits(['toggle', 'close-mobile', 'open-mobile']);

const isActive = (r) => {
  const resolved = typeof r === 'string' ? r : r?.name;
  return route.name === resolved;
};

const menuSections = computed(() => [
  {
    title: 'Vue Générale',
    items: [
      { name: 'Tableau de bord', icon: LayoutDashboard, route: { name: 'admin-dashboard' } },
    ],
  },
  {
    title: 'Utilisateurs',
    items: [
      { name: 'Utilisateurs', icon: Users, route: { name: 'admin-users' } },
      { name: 'Demandes Vendeurs', icon: Store, route: { name: 'admin-seller-requests' } },
    ],
  },
  {
    title: 'Contenu',
    items: [
      { name: 'Produits', icon: Package, route: { name: 'admin-products' } },
      { name: 'Catégories', icon: Tag, route: { name: 'admin-categories' } },
      { name: 'Blog', icon: FileText, route: { name: 'admin-blog' } },
    ],
  },
  {
    title: 'Système',
    items: [
      { name: 'Finances', icon: DollarSign, route: { name: 'admin-finance' } },
      { name: 'Broadcast', icon: Megaphone, route: { name: 'admin-broadcast' } },
    ],
  },
]);
</script>

<style scoped>
.admin-nav::-webkit-scrollbar { width: 3px; }
.admin-nav::-webkit-scrollbar-track { background: transparent; }
.admin-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

.nav-item {
  color: rgba(255, 255, 255, 0.5);
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
}
.nav-item-active {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  font-weight: 700;
}
.nav-item-active:hover {
  background: rgba(99, 102, 241, 0.3);
}
.nav-item-danger {
  color: rgba(248, 113, 113, 0.7);
}
.nav-item-danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}
</style>
