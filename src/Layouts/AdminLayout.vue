<template>
  <div class="flex min-h-screen" style="background: var(--color-bg)">
    <!-- Main Header -->
    <Header 
      :isSidebarCollapsed="isSidebarCollapsed" 
      @toggle-mobile-sidebar="isMobileSidebarOpen = true" 
    />

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

      <!-- Page content: renders child route (AdminDashboard, AdminUsers, etc.) -->
      <main class="flex-1 p-4 md:p-8 pt-16 md:pt-28">
        <!-- Admin Title Section (Optionnel / Déplacé ici pour rester sous le header) -->
      
        
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Header from '../components/Header.vue';
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
