<template>
  <!-- Mimics a Wishlist / Favoris card -->
  <div
    class="relative animate-pulse rounded-3xl p-4 border"
    :style="{
      borderColor: 'var(--color-border)',
      backgroundColor: 'var(--color-surface)',
    }"
  >
    <!-- Image area -->
    <div
      class="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-700 mb-4"
    ></div>
    <!-- Stars -->
    <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
    <!-- Name -->
    <div class="space-y-1.5 mb-3">
      <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <!-- Price -->
    <div class="h-6 w-24 rounded bg-gray-300 dark:bg-gray-600 mb-4"></div>
    <!-- Button -->
    <div class="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
  </div>
</template>
