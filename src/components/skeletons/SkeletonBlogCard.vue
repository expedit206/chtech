<template>
  <div
    class="flex flex-col gap-4 rounded-2xl overflow-hidden border animate-pulse p-4"
    :style="{
      borderColor: 'var(--color-border)',
      backgroundColor: 'var(--color-surface)',
    }"
  >
    <!-- Cover image -->
    <div
      class="aspect-[16/9] w-full rounded-xl bg-gray-200 dark:bg-gray-700"
    ></div>
    <!-- Category pill -->
    <div class="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    <!-- Title -->
    <div class="space-y-1.5">
      <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <!-- Description -->
    <div class="space-y-1">
      <div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <!-- Author + meta footer -->
    <div
      class="flex items-center gap-3 pt-2 border-t"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <div
        class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0"
      ></div>
      <div class="space-y-1 flex-1">
        <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div class="flex gap-3">
        <div class="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  </div>
</template>
