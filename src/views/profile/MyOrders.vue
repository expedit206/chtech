<template>
  <div class="p-6 space-y-6 animate-fade-in">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-[var(--color-text-main)] tracking-tight">
          Historique des Achats
        </h1>
        <p class="text-[var(--color-text-sub)] text-sm">
          Retrouvez vos achats validés avec l'Administrateur et suivez vos colis.
        </p>
      </div>
    </header>

    <!-- Skeleton -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-40 w-full bg-[var(--color-surface)] animate-pulse rounded-3xl border border-[var(--color-border)]"></div>
    </div>

    <!-- Real orders -->
    <div v-else-if="orders.length > 0" class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
        
        <div class="px-6 py-4 bg-gradient-to-r from-[var(--color-border)]/10 to-transparent flex flex-wrap justify-between items-center gap-4 border-b border-[var(--color-border)]">
          <div class="flex gap-8 text-xs font-semibold text-[var(--color-text-sub)]">
            <div class="space-y-1">
              <span class="uppercase tracking-widest opacity-50 block">Date</span>
              <span class="text-[var(--color-text-main)] font-bold text-sm">{{ order.date }}</span>
            </div>
            <div class="space-y-1">
              <span class="uppercase tracking-widest opacity-50 block">Total</span>
              <span class="text-[var(--color-primary)] font-black text-sm">{{ order.total }}</span>
            </div>
            <div class="space-y-1">
              <span class="uppercase tracking-widest opacity-50 block">N° Commande</span>
              <span class="text-[var(--color-text-main)] font-mono text-xs">#{{ order.id }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm', getStatusClass(order.status)]">
              {{ formatStatus(order.status) }}
            </span>
          </div>
        </div>

        <div class="p-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-6 w-full">
            <div class="w-24 h-24 bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-2 shadow-inner flex items-center justify-center shrink-0">
              <img :src="order.productImage" :alt="order.productName" class="max-h-full max-w-full object-contain" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-black text-[var(--color-text-main)] text-lg line-clamp-1 tracking-tight">
                {{ order.productName }}
              </h4>
              <p class="text-sm text-[var(--color-text-sub)] line-clamp-1 mb-3">
                Payé via Mobile Money et validé par CAHTECH.
              </p>
              
              <div class="flex flex-wrap items-center gap-4">
                <button class="flex items-center gap-2 text-[var(--color-text-sub)] hover:text-[var(--color-primary)] text-xs font-bold transition-colors">
                   Facture PDF
                </button>
                <button class="flex items-center gap-2 text-[var(--color-text-sub)] hover:text-blue-500 text-xs font-bold transition-colors">
                  <Truck :size="16" /> Suivre le colis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="py-24 text-center border-2 border-dashed rounded-[3rem] space-y-8 bg-gradient-to-b from-[var(--color-surface)] to-transparent" :style="{ borderColor: 'var(--color-border)' }">
      <div class="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
        <Package class="text-5xl" :size="48" />
      </div>
      <div class="space-y-4">
        <h2 class="text-2xl font-black tracking-tight text-[var(--color-text-main)]">
          Aucun achat validé
        </h2>
        <p class="opacity-80 max-w-sm mx-auto text-sm text-[var(--color-text-sub)] leading-relaxed">
          Vos achats apparaîtront ici une fois que l'Administrateur aura officiellement créé votre commande à la suite de votre interaction et validation du paiement dans le chat.
        </p>
      </div>
      
      <div class="flex justify-center gap-4 mt-8">
        <router-link :to="{ name: 'messages' }" class="inline-flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-white text-sm hover:scale-105 transition-all active:scale-95 shadow-lg shadow-[var(--color-primary)]/20" :style="{ backgroundColor: 'var(--color-primary)' }">
          <MessageCircle :size="16" /> Ouvrir la Messagerie
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CONFIG } from '../../config/index.js';

import { ref, onMounted } from "vue";
import apiClient from "../../api/index.js";
import { Truck, Package, MessageCircle } from "lucide-vue-next";

const isLoading = ref(true);
const orders = ref([]);

onMounted(async () => {
  try {
    const res = await apiClient.get("/orders");
    const data = res.data.data || res.data || [];

    orders.value = data.map((o) => {
      const firstItem = o.items && o.items[0] ? o.items[0] : null;
      let img = "https://cdn-icons-png.flaticon.com/512/644/644458.png";
      
      if (firstItem && firstItem.produit && firstItem.produit.photos && firstItem.produit.photos[0]) {
         img = `${CONFIG.API_BASE_URL}/storage/${firstItem.produit.photos[0]}`;
      }

      return {
        id: o.id?.split('-')[0] || o.reference,
        date: new Date(o.created_at).toLocaleDateString("fr-FR", {
          day: "numeric", month: "long", year: "numeric",
        }),
        total: `${Number(o.total_amount || o.total || 0).toLocaleString("fr-FR")} FCFA`,
        status: o.status || "pending",
        productName: firstItem?.produit?.nom || o.product?.nom || firstItem?.name || "Produit Inconnu",
        productImage: img,
      };
    });
  } catch (err) {
    console.error("Erreur chargement commandes:", err);
  } finally {
    isLoading.value = false;
  }
});

const getStatusClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("delivered") || s.includes("livr")) return "bg-green-500/10 text-green-600 border-green-500/20";
  if (s.includes("shipped") || s.includes("transit")) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (s.includes("cancel")) return "bg-red-500/10 text-red-600 border-red-500/20";
  return "bg-amber-500/10 text-amber-600 border-amber-500/20"; // pending
};

const formatStatus = (status) => {
  const map = {
    'pending': 'Paiement Validé',
    'shipped': 'En route',
    'delivered': 'Livré',
    'cancelled': 'Annulée'
  };
  return map[status] || status;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
