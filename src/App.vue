<template>
  <div
    id="app"
    class="min-h-screen"
    :style="{
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text-main)',
    }"
  >
    <Header />
    <main class="pt-28">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>
