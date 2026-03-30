<template>
  <div
    class="relative flex flex-col h-full shadow-sm border rounded-lg overflow-hidden animate-pulse"
    :style="{
      borderColor: 'var(--color-border)',
      backgroundColor: 'var(--color-surface)',
    }"
  >
    <!-- Image area matching ProductCard -->
    <div
      class="aspect-square w-full relative border-b h-[10rem] bg-gray-200 dark:bg-gray-800"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <!-- Category Badge Shimmer -->
      <div
        class="absolute top-2 left-2 h-5 w-16 rounded-full bg-gray-300 dark:bg-gray-700"
      ></div>

      <!-- Interaction icons shimmer -->
      <div class="absolute right-2 top-1 flex flex-col items-center gap-3 mt-1">
        <div class="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div class="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div class="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>
    </div>

    <!-- Content matching ProductCard padding and structure -->
    <div class="p-2 py-2 flex flex-col flex-grow gap-2">
      <!-- Title Shimmer -->
      <div class="h-3 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>

      <!-- Price Shimmer -->
      <div class="h-4 w-1/3 rounded bg-gray-300 dark:bg-gray-700 mt-0.5"></div>

      <!-- Button Shimmer -->
      <div class="mt-1">
        <div
          class="w-full h-8 md:h-9 rounded bg-gray-300 dark:bg-gray-700"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
