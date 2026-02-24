<template>
  <div class="flex min-h-[calc(100vh-112px)] bg-[var(--color-bg)]">
    <Sidebar />

    <!-- <div class="flex-1 p-4 md:p-8"> -->
        <main 
      :class="[
        'transition-all duration-300 p-4 md:p-8',
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      ]"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    <!-- </div>c est differens -->
        </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Dashboard/Sidebar.vue';
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
