<template>
  <!-- Skeleton for Dashboard stats + last order + favorites -->
  <div class="p-6 space-y-8 animate-pulse">
    <!-- Header -->
    <div class="space-y-2">
      <div class="h-8 w-72 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-4 w-56 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>

    <!-- 2-col grid: last order card + loyalty card -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Last order block (2/3) -->
      <div
        class="lg:col-span-2 rounded-3xl border p-6 space-y-6"
        :style="{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }"
      >
        <div class="flex justify-between items-center">
          <div class="h-5 w-36 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 shrink-0"
          ></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 w-48 rounded bg-gray-300 dark:bg-gray-600"></div>
            <div class="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
        <!-- Progress bar -->
        <div class="space-y-2">
          <div
            class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"
          ></div>
          <div class="flex justify-between">
            <div class="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>

      <!-- Loyalty card (1/3) -->
      <div class="rounded-3xl bg-gray-200 dark:bg-gray-700 p-6 space-y-4">
        <div class="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
        <div class="h-10 w-36 rounded bg-gray-300 dark:bg-gray-600"></div>
        <div class="h-10 w-full rounded-xl bg-gray-300 dark:bg-gray-600"></div>
        <div class="h-11 w-full rounded-xl bg-gray-300 dark:bg-gray-600"></div>
      </div>
    </div>

    <!-- Favorites section -->
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <div class="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-2xl border p-4 flex items-center gap-4"
          :style="{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }"
        >
          <div
            class="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0"
          ></div>
          <div class="space-y-1.5 flex-1">
            <div class="h-3.5 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div
            class="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 shrink-0"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
