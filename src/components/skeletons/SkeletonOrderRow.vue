<template>
  <!-- Mimics the Orders.vue single order row -->
  <div
    class="animate-pulse rounded-3xl overflow-hidden border"
    :style="{
      borderColor: 'var(--color-border)',
      backgroundColor: 'var(--color-surface)',
    }"
  >
    <!-- Header row -->
    <div
      class="px-6 py-3 border-b flex flex-wrap justify-between items-center gap-4"
      :style="{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-border)/10',
      }"
    >
      <div class="flex gap-6">
        <div class="space-y-1.5">
          <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-4 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <div class="space-y-1.5">
          <div class="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-4 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <div class="space-y-1.5">
          <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-4 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
        </div>
      </div>
      <div class="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    </div>

    <!-- Body -->
    <div
      class="p-6 flex flex-col md:flex-row justify-between items-center gap-6"
    >
      <div class="flex items-center gap-6 w-full">
        <!-- Product image placeholder -->
        <div
          class="w-24 h-24 flex-shrink-0 rounded-2xl bg-gray-200 dark:bg-gray-700"
        ></div>
        <div class="space-y-2 flex-1">
          <div class="h-5 w-48 rounded bg-gray-300 dark:bg-gray-600"></div>
          <div class="h-3 w-64 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex gap-4 mt-2">
            <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3 w-full md:w-auto">
        <div class="h-11 w-32 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-11 w-32 rounded-xl bg-gray-300 dark:bg-gray-600"></div>
      </div>
    </div>
  </div>
</template>
