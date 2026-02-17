<template>
  <div class="category-card" :class="{ active: active }">
    <i :class="[icon, 'text-xl']"></i>
    <span class="text-[10px] font-bold uppercase tracking-tighter">{{
      name
    }}</span>
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
