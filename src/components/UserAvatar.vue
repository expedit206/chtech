<template>
  <div
    class="flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-gray-200"
    :class="[sizeClasses, customClass]"
  >
    <img
      v-if="computedPhotoUrl"
      :src="computedPhotoUrl"
      :alt="user?.nom || 'Utilisateur'"
      class="w-full h-full object-cover"
      @error="handleImageError"
    />
    <UserCircle v-else class="w-full h-full text-gray-400 p-0.5" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { UserCircle } from 'lucide-vue-next';
import { CONFIG } from '../config/index.js';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
  size: {
    type: String,
    default: 'md', // xs, sm, md, lg, xl, 2xl
  },
  customClass: {
    type: String,
    default: '',
  }
});

const imageError = ref(false);

// Réinitialiser l'erreur si l'utilisateur change
watch(() => props.user?.photo, () => {
  imageError.value = false;
});

const computedPhotoUrl = computed(() => {
  if (imageError.value) return null;
  
  const photo = props.user?.photo;
  if (photo) {
    if (photo.startsWith("http")) return photo;
    return `${CONFIG.API_BASE_URL}/storage/${photo}`;
  }
  return null;
});

const handleImageError = () => {
  imageError.value = true;
};

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-7 h-7';
    case 'sm': return 'w-8 h-8';
    case 'md': return 'w-10 h-10';
    case 'lg': return 'w-16 h-16';
    case 'xl': return 'w-24 h-24';
    case '2xl': return 'w-32 h-32';
    default: return 'w-10 h-10';
  }
});
</script>
