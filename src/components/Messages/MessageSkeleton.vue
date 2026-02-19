<template>
  <div class="flex flex-col space-y-4 p-4 w-full">
    <!-- Received Message Skeleton -->
    <div class="flex justify-start w-full animate-pulse">
      <div
        class="bg-gray-200 rounded-2xl rounded-tl-none px-4 py-3 min-w-[150px] max-w-[70%] h-16"
      ></div>
    </div>

    <!-- Sent Message Skeleton -->
    <div class="flex justify-end w-full animate-pulse">
      <div
        class="bg-gray-200 rounded-2xl rounded-tr-none px-4 py-3 min-w-[150px] max-w-[70%] h-12"
      ></div>
    </div>

    <!-- Received Message Skeleton (Longer) -->
    <div class="flex justify-start w-full animate-pulse">
      <div
        class="bg-gray-200 rounded-2xl rounded-tl-none px-4 py-3 min-w-[200px] max-w-[70%] h-24"
      ></div>
    </div>

    <!-- Sent Message Skeleton -->
    <div class="flex justify-end w-full animate-pulse">
      <div
        class="bg-gray-200 rounded-2xl rounded-tr-none px-4 py-3 min-w-[100px] max-w-[70%] h-10"
      ></div>
    </div>
  </div>
</template>
