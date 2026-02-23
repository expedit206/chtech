<template>
  <div class="p-6 space-y-6 animate-fade-in">
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text-main)]">Mes Commandes</h1>
        <p class="text-[var(--color-text-sub)]">Suivez et gérez vos achats récents.</p>
      </div>
      <select class="bg-[var(--color-surface)] border border-[var(--color-border)] text-sm rounded-xl p-2 text-[var(--color-text-main)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none">
        <option>3 derniers mois</option>
        <option>Année 2025</option>
        <option>Toutes les commandes</option>
      </select>
    </header>

    <div class="space-y-4">
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="px-6 py-3 bg-[var(--color-border)]/20 flex flex-wrap justify-between items-center gap-4 border-b border-[var(--color-border)]">
          <div class="flex gap-6 text-xs font-medium text-[var(--color-text-sub)]">
            <p>COMMANDE PASSÉE LE <span class="block text-[var(--color-text-main)] mt-1">{{ order.date }}</span></p>
            <p>TOTAL <span class="block text-[var(--color-text-main)] mt-1">{{ order.total }} €</span></p>
            <p>N° DE COMMANDE <span class="block text-[var(--color-text-main)] mt-1">#{{ order.id }}</span></p>
          </div>
          <div class="flex items-center gap-2">
             <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', getStatusClass(order.status)]">
                {{ order.status }}
             </span>
          </div>
        </div>

        <div class="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-6 w-full">
            <div class="w-24 h-24 bg-white rounded-2xl border border-[var(--color-border)] p-2 flex items-center justify-center shrink-0">
              <img :src="order.productImage" :alt="order.productName" class="max-h-full object-contain">
            </div>
            
            <div class="space-y-1">
              <h4 class="font-bold text-[var(--color-text-main)] text-lg">{{ order.productName }}</h4>
              <p class="text-sm text-[var(--color-text-sub)] line-clamp-1">{{ order.description }}</p>
              <div class="flex items-center gap-4 mt-2">
                <button class="text-[var(--color-primary)] text-sm font-bold hover:underline">
                  <i class="fa-solid fa-file-invoice mr-2"></i>Facture
                </button>
                <button class="text-[var(--color-text-sub)] text-sm font-bold hover:underline">
                  <i class="fa-solid fa-truck-fast mr-2"></i>Suivi
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button class="px-6 py-3 rounded-xl border border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)]/5 transition-all whitespace-nowrap">
              Détails
            </button>
            <button class="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all whitespace-nowrap">
              <i class="fa-solid fa-rotate-left mr-2"></i>Recommander
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const orders = ref([
  {
    id: 'CH-9824',
    date: '14 Janvier 2026',
    total: '1,299.00',
    status: 'Livré',
    productName: 'iPhone 15 Pro Max',
    description: 'Titane Naturel, 256GB - État : Neuf',
    productImage: 'https://cdn-icons-png.flaticon.com/512/644/644458.png' // Remplacer par tes vraies images
  },
  {
    id: 'CH-8712',
    date: '28 Décembre 2025',
    total: '89.99',
    status: 'En cours',
    productName: 'Clavier Mécanique RGB',
    description: 'Switchs Red, Layout FR - Sans fil',
    productImage: 'https://cdn-icons-png.flaticon.com/512/802/802271.png'
  }
]);

const getStatusClass = (status) => {
  switch (status) {
    case 'Livré': return 'bg-green-100 text-green-600';
    case 'En cours': return 'bg-blue-100 text-blue-600';
    case 'Annulé': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};
</script>
