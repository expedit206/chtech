<template>
  <div
    class="relative flex flex-col rounded-2xl overflow-hidden border animate-pulse"
    :style="{
      borderColor: 'var(--color-border)',
      backgroundColor: 'var(--color-surface)',
    }"
  >
    <!-- Image area -->
    <div class="aspect-square w-full bg-gray-200 dark:bg-gray-700 relative">
      <!-- Shimmer badge top-left -->
      <div
        class="absolute top-3 left-3 h-5 w-14 rounded-full bg-gray-300 dark:bg-gray-600"
      ></div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col gap-3 flex-grow">
      <!-- Category + rating -->
      <div class="flex justify-between items-center">
        <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <!-- Title -->
      <div class="space-y-1.5">
        <div class="h-3.5 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-3.5 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <!-- Price + buttons -->
      <div
        class="mt-auto pt-3 border-t flex items-center justify-between gap-3"
        :style="{ borderColor: 'var(--color-border)' }"
      >
        <div class="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="flex gap-2">
          <div class="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-10 w-16 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  </div>
</template>
