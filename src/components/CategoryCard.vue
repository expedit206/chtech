<template>
  <div class="category-card group flex flex-col items-center justify-center cursor-pointer" :class="{ active: active }">
    <div
      class="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 overflow-hidden border-2"
      :style="{
        backgroundColor: active
          ? 'var(--color-primary)'
          : 'var(--color-surface)',
        color: active ? 'var(--color-pure)' : 'var(--color-text-sub)',
        borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
      }">
      <img 
        v-if="image" 
        :src="image" 
        :alt="name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div v-else class="flex items-center justify-center w-full h-full">
         <span class="text-lg font-black opacity-30">{{ name?.charAt(0).toUpperCase() }}</span>
      </div>
    </div>
    <span class="text-[9px] md:text-[10px] font-black tracking-widest mt-2 uppercase text-center" :style="{
      color: active ? 'var(--color-primary)' : 'var(--color-text-sub)',
    }">
      {{ name }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  image: String,
  name: String,
  active: {
    type: Boolean,
    default: false,
  },
});
</script>
