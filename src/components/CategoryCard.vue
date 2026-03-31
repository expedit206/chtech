<template>
  <div class="category-card group flex flex-col items-center justify-center" :class="{ active: active }">
    <div
      class="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
      :style="{
        backgroundColor: active
          ? 'var(--color-primary)'
          : 'var(--color-surface)',
        color: active ? 'var(--color-pure)' : 'var(--color-text-sub)',
        border: '1px solid var(--color-border)',
      }">
      <i :class="[icon, 'text-base md:text-lg']"></i>
    </div>
    <span class="text-[8px] md:text-[9px] font-black  tracking-widest mt-1.5" :style="{
      color: active ? 'var(--color-primary)' : 'var(--color-text-sub)',
    }">
      {{ name }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  name: String,
  active: {
    type: Boolean,
    default: false,
  },
});
</script>
