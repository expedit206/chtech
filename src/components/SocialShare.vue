<template>
  <div class="flex items-center gap-3">
    <span class="text-xs font-bold opacity-60 uppercase tracking-widest" :style="{ color: 'var(--color-text-sub)' }">Partager :</span>
    <div class="flex items-center gap-2">
      <!-- WhatsApp -->
      <a 
        :href="whatsappUrl" 
        target="_blank" 
        class="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-white bg-[#25D366] shadow-sm"
        title="Partager sur WhatsApp"
      >
        <i class="fab fa-whatsapp"></i>
      </a>
      
      <!-- Facebook -->
      <a 
        :href="facebookUrl" 
        target="_blank" 
        class="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-white bg-[#1877F2] shadow-sm"
        title="Partager sur Facebook"
      >
        <i class="fab fa-facebook-f text-xs"></i>
      </a>

      <!-- Copier le lien -->
      <button 
        @click="copyLink"
        class="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 border"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }"
        title="Copier le lien"
      >
        <i class="fas fa-link text-xs"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
  title: String,
  url: String,
  description: String
});

const toast = useToast();

const currentUrl = computed(() => props.url || window.location.href);

const whatsappUrl = computed(() => {
  const text = encodeURIComponent(`Regarde ce produit sur SASAYEE : ${props.title}\n${currentUrl.value}`);
  return `https://wa.me/?text=${text}`;
});

const facebookUrl = computed(() => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`;
});

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    toast.success("Lien copié dans le presse-papier !");
  } catch (err) {
    toast.error("Impossible de copier le lien.");
  }
};
</script>
