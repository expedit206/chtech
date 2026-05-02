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
            <!-- Items Thumbnails Carousel/Stack -->
            <div class="flex -space-x-4 max-w-[200px] overflow-hidden shrink-0">
               <div v-for="(item, idx) in order.items.slice(0, 3)" :key="idx" class="w-16 h-16 bg-[var(--color-bg)] rounded-2xl border-2 border-[var(--color-surface)] shadow-sm flex items-center justify-center shrink-0 overflow-hidden relative z-[1]">
                 <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
               </div>
               <div v-if="order.items.length > 3" class="w-16 h-16 bg-[var(--color-border)]/30 rounded-2xl border-2 border-[var(--color-surface)] shadow-sm flex items-center justify-center shrink-0 z-[0]">
                 <span class="text-[var(--color-text-sub)] text-xs font-bold">+{{ order.items.length - 3 }}</span>
               </div>
            </div>

            <div class="flex-1 min-w-0">
              <h4 class="font-black text-[var(--color-text-main)] text-lg line-clamp-1 tracking-tight">
                {{ order.items.length === 1 ? order.items[0].name : `${order.items.length} articles dans cette commande` }}
              </h4>
              <p class="text-sm text-[var(--color-text-sub)] line-clamp-1 mb-3 mt-1">
                <span v-if="order.payment_status === 'escrow'">Paiement sécurisé sur compte bloqué</span>
                <span v-else-if="order.payment_status === 'paid'">Payé et validé</span>
                <span v-else>Statut de paiement: {{ order.payment_status }}</span>
              </p>
              
              <div class="flex flex-wrap items-center gap-4">
                <button 
                  @click="downloadInvoice(order.rawId)"
                  :disabled="invoiceLoading === order.rawId"
                  class="flex items-center gap-2 text-[var(--color-text-sub)] hover:text-red-500 text-xs font-bold transition-colors disabled:opacity-50"
                >
                   <i v-if="invoiceLoading === order.rawId" class="fas fa-spinner fa-spin"></i>
                   <i v-else class="fas fa-file-pdf"></i>
                   Facture PDF
                </button>
                <button @click="openDetails(order)" class="flex items-center gap-2 text-[var(--color-primary)] hover:opacity-80 text-xs font-bold transition-colors">
                  <Eye :size="16" /> Voir les détails
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
          Aucun achat
        </h2>
        <p class="opacity-80 max-w-sm mx-auto text-sm text-[var(--color-text-sub)] leading-relaxed">
          Vos achats apparaîtront ici une fois que vos commandes seront validées avec le succès du paiement hors plateforme.
        </p>
      </div>
      
      <div class="flex justify-center gap-4 mt-8">
        <router-link :to="{ name: 'marketplace' }" class="inline-flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-white text-sm hover:scale-105 transition-all active:scale-95 shadow-lg shadow-[var(--color-primary)]/20" :style="{ backgroundColor: 'var(--color-primary)' }">
           Découvrir la marketplace
        </router-link>
      </div>
    </div>

    <!-- Order Details Modal Overlay -->
    <div v-if="selectedOrder" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeDetails"></div>
      
      <div class="relative bg-[var(--color-surface)] w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-gradient-to-r from-[var(--color-border)]/10 to-transparent">
          <div>
            <h3 class="text-xl font-black text-[var(--color-text-main)] flex items-center gap-3">
              Détails de la commande
              <span :class="['px-3 py-1 rounded-full text-[10px] uppercase tracking-widest', getStatusClass(selectedOrder.status)]">
                {{ formatStatus(selectedOrder.status) }}
              </span>
            </h3>
            <p class="text-sm text-[var(--color-text-sub)] mt-1">
              <span class="font-mono">#{{ selectedOrder.id }}</span> • {{ selectedOrder.date }}
            </p>
          </div>
          <button @click="closeDetails" class="p-2 rounded-full hover:bg-[var(--color-border)]/30 text-[var(--color-text-sub)] transition-colors">
            <X :size="20" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar space-y-8">
          
          <!-- Tracking Timeline -->
          <div class="bg-[var(--color-bg)] rounded-3xl p-6 border border-[var(--color-border)]">
            <h4 class="font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
              <Truck :size="18"/> Suivi d'expédition
            </h4>
            
            <div class="relative flex justify-between items-center z-10 w-full overflow-x-auto pb-4 custom-scrollbar px-2 sm:px-6">
              <!-- Background Line -->
              <div class="absolute top-[15px] left-10 right-10 h-1 bg-[var(--color-border)] -z-10"></div>
              <!-- Active Progress Line -->
              <div class="absolute top-[15px] left-10 h-1 bg-green-500 transition-all duration-700 ease-out -z-10" :style="{ width: getTimelineProgress(selectedOrder.status) }"></div>

              <div v-for="(step, index) in timelineSteps" :key="step.key" class="flex flex-col items-center gap-3 z-10 min-w-[90px]">
                <div :class="['w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500', isStepActive(selectedOrder.status, step.key) ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30 scale-110' : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-sub)]']">
                  <component :is="step.icon" :size="14" />
                </div>
                <div class="text-center">
                   <p :class="['text-xs font-bold transition-colors', isStepActive(selectedOrder.status, step.key) ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-sub)]']">{{ step.label }}</p>
                   <p class="text-[10px] text-[var(--color-text-sub)] mt-0.5 opacity-70">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Items List -->
          <div class="space-y-4">
            <h4 class="font-bold text-[var(--color-text-main)] flex items-center gap-2">
              <Package :size="18"/> {{ selectedOrder.items.length > 1 ? 'Articles' : 'Article' }} dans le colis
            </h4>
            <div class="space-y-3">
              <div v-for="(item, idx) in selectedOrder.items" :key="idx" class="bg-[var(--color-bg)] rounded-2xl p-4 border border-[var(--color-border)] flex items-center gap-4 hover:border-[var(--color-primary)]/30 transition-colors">
                <div class="w-16 h-16 rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm shrink-0 bg-[var(--color-surface)]">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="font-bold text-[var(--color-text-main)] text-sm line-clamp-1" :title="item.name">{{ item.name }}</h5>
                  <p class="text-xs text-[var(--color-text-sub)] mt-1">Qté: <span class="font-bold text-[var(--color-text-main)]">{{ item.quantity }}</span> × {{ formatMoney(item.price) }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="font-black text-[var(--color-text-main)] text-sm">{{ formatMoney(item.quantity * item.price) }}</p>
                  <router-link v-if="selectedOrder.status === 'delivered' && item.productId" :to="{ name: 'DetailProduit', params: { slug: item.productId } }" @click="closeDetails" class="inline-flex text-[10px] font-bold text-amber-500 hover:text-amber-600 transition-colors items-center gap-1 mt-2 bg-amber-500/10 px-2 py-1 rounded-lg">
                    <Star :size="10" /> Laisser un avis
                  </router-link>
                  <router-link v-else-if="item.productId" :to="{ name: 'DetailProduit', params: { slug: item.productId } }" @click="closeDetails" class="inline-flex text-[10px] font-bold text-[var(--color-primary)] hover:opacity-80 transition-colors items-center gap-1 mt-2">
                    Voir la fiche
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Address & Payment Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[var(--color-bg)] rounded-2xl p-5 border border-[var(--color-border)] flex flex-col h-full">
              <h4 class="font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2 text-sm">
                <MapPin :size="16"/> Adresse de Livraison
              </h4>
              <div v-if="selectedOrder.delivery_address || selectedOrder.contact_phone" class="space-y-3 text-sm text-[var(--color-text-sub)] flex-1">
                <p v-if="selectedOrder.delivery_address" class="flex items-start gap-3">
                  <MapPin :size="16" class="mt-0.5 shrink-0 text-[var(--color-text-main)]/50" /> 
                  <span class="leading-relaxed">{{ selectedOrder.delivery_address }}</span>
                </p>
                <p v-if="selectedOrder.contact_phone" class="flex items-center gap-3">
                  <Phone :size="16" class="shrink-0 text-[var(--color-text-main)]/50"/> 
                  <a :href="'tel:'+selectedOrder.contact_phone" class="font-bold hover:text-[var(--color-primary)] transition-colors">{{ selectedOrder.contact_phone }}</a>
                </p>
              </div>
              <div v-else class="text-sm text-[var(--color-text-sub)] opacity-70 italic flex-1 flex items-center justify-center p-4 bg-[var(--color-surface)] rounded-xl">
                Aucune adresse de livraison spécifique fournie (livraison standard).
              </div>
            </div>
            
            <div class="bg-[var(--color-bg)] rounded-2xl p-5 border border-[var(--color-border)] flex flex-col h-full">
              <h4 class="font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2 text-sm">
                <CreditCard :size="16"/> Détails du Paiement
              </h4>
              <div class="space-y-3 text-sm flex-1">
                 <div class="flex justify-between items-center text-[var(--color-text-sub)]">
                   <span>Sous-total articles</span>
                   <span class="font-medium text-[var(--color-text-main)]">{{ selectedOrder.total }}</span>
                 </div>
                 <div class="flex justify-between items-center text-[var(--color-text-sub)]">
                   <span>Frais de livraison</span>
                   <span class="text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">Inclus</span>
                 </div>
                 <div class="pt-4 border-t border-[var(--color-border)]/50 flex justify-between items-center mt-auto">
                   <span class="font-bold text-[var(--color-text-main)]">Total payé</span>
                   <span class="font-black text-lg text-[var(--color-primary)]">{{ selectedOrder.total }}</span>
                 </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] flex justify-end items-center gap-3 rounded-b-[2rem]">
          <button @click="closeDetails" class="px-6 py-2.5 rounded-xl font-bold text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-border)]/40 transition-colors">
            Fermer
          </button>
          <router-link :to="{ name: 'messages' }" @click="closeDetails" class="px-6 py-2.5 rounded-xl font-bold text-sm bg-[var(--color-primary)] text-white hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2">
            <MessageCircle :size="16" /> Contacter le Support
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Truck, Package, MessageCircle, X, MapPin, Phone, CreditCard, ChevronRight, Star, Eye, Clock, CheckCircle } from "lucide-vue-next";
import apiClient from "../../api/index.js";
import { CONFIG } from '../../config/index.js';

const isLoading = ref(true);
const invoiceLoading = ref(null);
const orders = ref([]);
const selectedOrder = ref(null);

// Timeline statuses
const timelineSteps = [
  { key: 'pending', label: 'Validé', desc: 'Paiement sécurisé', icon: Clock },
  { key: 'shipped', label: 'Expédié', desc: 'Le colis est en route', icon: Truck },
  { key: 'delivered', label: 'Livré', desc: 'Commande réceptionnée', icon: CheckCircle }
];

const getTimelineProgress = (status) => {
  if (status === 'delivered') return '100%';
  if (status === 'shipped') return '50%';
  return '0%';
};

const isStepActive = (currentStatus, stepKey) => {
  if (currentStatus === 'delivered') return true; // All steps active
  if (currentStatus === 'shipped' && (stepKey === 'pending' || stepKey === 'shipped')) return true;
  if (currentStatus === 'pending' && stepKey === 'pending') return true;
  return false;
};

// Handle Esc Key to close modal
const handleEscape = (e) => {
  if (e.key === 'Escape' && selectedOrder.value) {
    closeDetails();
  }
};

onMounted(async () => {
  document.addEventListener('keydown', handleEscape);
  try {
    const res = await apiClient.get("/orders");
    const data = res.data.data || res.data || [];

    orders.value = data.map((o) => {
      // Map all items for the details modal
      const mappedItems = (o.items || []).map(item => {
        let img = "https://ih1.redbubble.net/image.604646193.3082/st,small,507x507-pad,600x600,f8f8f8.u11.jpg";
        if (item.produit && item.produit.photos && item.produit.photos[0]) {
           img = `${CONFIG.API_BASE_URL}/storage/${item.produit.photos[0]}`;
        }
        return {
          productId: item.produit?.id || item.produit_id,
          name: item.produit?.nom || item.name || "Produit Inconnu",
          image: img,
          quantity: item.quantity || 1,
          price: item.price || 0
        };
      });

      const rawVTotal = Number(o.total_amount || o.total || 0);

      return {
        rawId: o.id,
        id: o.id ? String(o.id).split('-')[0] : (o.reference || 'N/A'),
        date: new Date(o.created_at).toLocaleDateString("fr-FR", {
          day: "numeric", month: "long", year: "numeric",
        }),
        rawTotal: rawVTotal,
        total: formatMoney(rawVTotal),
        status: o.status === 'cancel' ? 'cancelled' : (o.status || "pending"),
        payment_status: o.payment_status || "inconnu",
        delivery_address: o.delivery_address,
        contact_phone: o.contact_phone,
        items: mappedItems,
      };
    });
  } catch (err) {
    console.error("Erreur chargement commandes:", err);
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});

const formatMoney = (amount) => {
  return `${Number(amount).toLocaleString("fr-FR")} FCFA`;
};

const openDetails = (order) => {
  selectedOrder.value = order;
  document.body.style.overflow = 'hidden'; // stop page scrolling
};

const closeDetails = () => {
  selectedOrder.value = null;
  document.body.style.overflow = '';
};

const downloadInvoice = async (orderId) => {
  if (invoiceLoading.value) return;
  invoiceLoading.value = orderId;
  try {
    const response = await apiClient.get(`/orders/${orderId}/facture`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `facture-sasayee-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Erreur téléchargement facture:", err);
  } finally {
    invoiceLoading.value = null;
  }
};

const getStatusClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("delivered") || s.includes("livr")) return "bg-green-500/10 text-green-600 border border-green-500/20";
  if (s.includes("shipped") || s.includes("transit")) return "bg-blue-500/10 text-blue-600 border border-blue-500/20";
  if (s.includes("cancel")) return "bg-red-500/10 text-red-600 border border-red-500/20";
  return "bg-amber-500/10 text-amber-600 border border-amber-500/20"; 
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
  animation: fadeIn 0.4s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-sub);
}
</style>
