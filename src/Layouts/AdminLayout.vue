<template>
  <div class="flex min-h-screen" style="background: var(--color-bg)">
    <!-- Sidebar admin -->
    <Sidebar
      :collapsed="isSidebarCollapsed"
      :isMobileOpen="isMobileSidebarOpen"
      @toggle="isSidebarCollapsed = !isSidebarCollapsed"
      @close-mobile="isMobileSidebarOpen = false"
      @open-mobile="isMobileSidebarOpen = true"
    />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300"
      :class="isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'"
      style="min-height: 100vh;">

      <!-- Top bar -->
      <header class="sticky top-0 z-40 flex items-center gap-4 px-4 md:px-6 h-16 border-b shrink-0"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <!-- Mobile menu toggle -->
        <button @click="isMobileSidebarOpen = true" class="md:hidden p-2 rounded-xl transition-colors"
          :style="{ color: 'var(--color-text-sub)' }">
          <Menu :size="20" />
        </button>

        <!-- Page title via slot -->
        <div class="flex-1 min-w-0">
          <slot name="header">
            <h1 class="text-lg font-bold truncate" :style="{ color: 'var(--color-text-main)' }">
              Administration
            </h1>
          </slot>
        </div>

        <!-- Right: admin badge + user info -->
        <div class="flex items-center gap-4">
          <span class="hidden sm:inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full"
            style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2)">
            <Shield :size="12" />
            ADMIN
          </span>
          <div class="flex items-center gap-2 border-l pl-4" :style="{ borderColor: 'var(--color-border)' }">
            <div class="flex flex-col items-end hidden sm:flex">
              <span class="text-xs font-black truncate max-w-[120px]" :style="{ color: 'var(--color-text-main)' }">
                {{ auth.user?.nom }}
              </span>
              <span class="text-[10px] opacity-50 uppercase font-bold" :style="{ color: 'var(--color-text-sub)' }">Gestionnaire</span>
            </div>
            <img :src="userPhotoUrl" class="w-9 h-9 rounded-xl object-cover border-2 transition-transform hover:scale-105"
              :style="{ borderColor: 'var(--color-primary)' }" />
          </div>
        </div>
      </header>

      <!-- Page content: renders child route (AdminDashboard, AdminUsers, etc.) -->
      <main class="flex-1 p-4 md:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Menu, Shield } from 'lucide-vue-next';
import Sidebar from '../components/Dashboard/Sidebar.vue';
import { useAuthStore } from '../stores/auth.js';
import { CONFIG } from '../config/index.js';

const auth = useAuthStore();
const isSidebarCollapsed = ref(false);
const isMobileSidebarOpen = ref(false);

const userPhotoUrl = computed(() => {
  if (auth.user?.photo) {
    if (auth.user.photo.startsWith('http')) return auth.user.photo;
    return `${CONFIG.STORAGE_URL}${auth.user.photo}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.nom || 'A')}&background=6366f1&color=fff&size=64`;
});
</script>
