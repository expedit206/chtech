<template>
  <div class="p-3 rounded-xl flex items-center gap-3 animate-pulse">
    <!-- Avatar Skeleton -->
    <div class="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>

    <!-- Content Skeleton -->
    <div class="flex-1 min-w-0 space-y-2">
      <div class="flex justify-between">
        <!-- Name -->
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <!-- Time -->
        <div class="h-3 bg-gray-200 rounded w-12"></div>
      </div>
      <!-- Last Message -->
      <div class="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
</template>
