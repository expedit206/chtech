<template>
  <div
    class="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl cursor-pointer transition-all"
    :class="[
      'hover:shadow-md hover:-translate-y-1',
      active ? 'shadow-md' : 'shadow-sm'
    ]"
    :style="{
      backgroundColor: active ? 'var(--color-primary)' : 'var(--color-surface)',
      color: active ? 'var(--color-pure)' : 'var(--color-text-main)',
      border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
    }"
  >
    <i :class="icon + ' text-xl'"></i>
    <span class="text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap">{{ name }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  name: String,
  active: {
    type: Boolean,
    default: false
  }
})
</script>
