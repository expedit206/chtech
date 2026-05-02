<template>
  <div class="space-y-6 animate-fade-in pb-10 pt-5">
    <div class="flex flex-col sm:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-[var(--color-text-main)] tracking-tight">Gestion des Commandes</h1>
        <p class="text-sm text-[var(--color-text-sub)] mt-1">Gérez toutes les commandes de la plateforme.</p>
      </div>
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl shadow-sm">
        <p class="text-xs text-[var(--color-text-sub)] font-bold uppercase tracking-wider mb-1">Total Commandes</p>
        <p class="text-2xl font-black text-[var(--color-text-main)]">{{ stats.total }}</p>
      </div>
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl shadow-sm">
        <p class="text-xs text-[var(--color-text-sub)] font-bold uppercase tracking-wider mb-1">En Attente</p>
        <p class="text-2xl font-black text-amber-500">{{ stats.pending }}</p>
      </div>
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl shadow-sm">
        <p class="text-xs text-[var(--color-text-sub)] font-bold uppercase tracking-wider mb-1">En Route</p>
        <p class="text-2xl font-black text-blue-500">{{ stats.shipped }}</p>
      </div>
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl shadow-sm">
        <p class="text-xs text-[var(--color-text-sub)] font-bold uppercase tracking-wider mb-1">Livrées</p>
        <p class="text-2xl font-black text-green-500">{{ stats.delivered }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-[var(--color-bg)] border-b border-[var(--color-border)] text-[var(--color-text-sub)] text-xs uppercase tracking-wider">
              <th class="p-4 font-bold">Réf</th>
              <th class="p-4 font-bold">Client</th>
              <th class="p-4 font-bold">Date</th>
              <th class="p-4 font-bold text-right">Montant</th>
              <th class="p-4 font-bold text-center">Statut</th>
              <th class="p-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
             <tr v-if="isLoading" v-for="i in 5" :key="i" class="border-b border-[var(--color-border)]">
               <td colspan="6" class="p-4">
                 <div class="h-6 w-full bg-[var(--color-border)]/50 animate-pulse rounded"></div>
               </td>
             </tr>
             <tr v-else-if="orders.length === 0">
               <td colspan="6" class="p-8 text-center text-[var(--color-text-sub)] font-medium">Aucune commande trouvée.</td>
             </tr>
             <tr v-else v-for="order in orders" :key="order.id" class="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)]/50 transition-colors">
               <td class="p-4 text-sm font-mono font-bold text-[var(--color-text-main)]">#{{ formatId(order.id) }}</td>
               <td class="p-4">
                 <div class="flex items-center gap-3">
                   <img :src="getAvatar(order.user)" class="w-8 h-8 rounded-full border border-[var(--color-border)] object-cover" />
                   <div>
                     <p class="text-sm font-bold text-[var(--color-text-main)]">{{ order.user?.nom || 'Inconnu' }}</p>
                     <p class="text-[10px] text-[var(--color-text-sub)]">{{ order.user?.email }}</p>
                   </div>
                 </div>
               </td>
               <td class="p-4 text-sm text-[var(--color-text-sub)]">{{ formatDate(order.created_at) }}</td>
               <td class="p-4 text-sm font-black text-right text-[var(--color-primary)]">{{ formatMoney(order.total_amount) }}</td>
               <td class="p-4 text-center">
                 <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', getStatusClass(order.status)]">
                   {{ formatStatus(order.status) }}
                 </span>
               </td>
               <td class="p-4 text-center">
                 <button @click="openModal(order)" class="px-4 py-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors text-xs font-bold shadow-sm">
                   Gérer
                 </button>
               </td>
             </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Manage Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-[var(--color-surface)] w-full max-w-xl rounded-2xl shadow-xl flex flex-col p-6 animate-fade-in-up border border-[var(--color-border)]">
        
        <div class="flex justify-between items-center mb-6 border-b border-[var(--color-border)] pb-4">
          <div>
            <h3 class="text-lg font-black text-[var(--color-text-main)]">Commande #{{ formatId(selectedOrder.id) }}</h3>
            <p class="text-xs text-[var(--color-text-sub)] mt-1">Passée le {{ formatDate(selectedOrder.created_at) }}</p>
          </div>
          <button @click="closeModal" class="p-2 bg-[var(--color-bg)] rounded-full text-[var(--color-text-sub)] hover:text-[var(--color-text-main)] transition-colors"><X :size="20"/></button>
        </div>

        <div class="space-y-6 text-sm text-[var(--color-text-sub)] overflow-y-auto max-h-[70vh] custom-scrollbar pr-2">
           
           <div class="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] space-y-3">
             <div class="flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
               <img :src="getAvatar(selectedOrder.user)" class="w-10 h-10 rounded-full border border-[var(--color-border)]" />
               <div>
                  <p class="font-bold text-[var(--color-text-main)]">{{ selectedOrder.user?.nom }}</p>
                  <p class="text-xs">{{ selectedOrder.user?.email }}</p>
               </div>
             </div>
             
             <div class="grid grid-cols-2 gap-4">
                <div>
                    <span class="block text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Contact</span>
                    <span class="text-[var(--color-text-main)] font-medium">{{ selectedOrder.contact_phone || 'Non renseigné' }}</span>
                </div>
                <div>
                    <span class="block text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Montant Total</span>
                    <span class="text-[var(--color-primary)] font-black">{{ formatMoney(selectedOrder.total_amount) }}</span>
                </div>
             </div>
             <div>
                <span class="block text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Adresse de livraison</span>
                <span class="text-[var(--color-text-main)] font-medium">{{ selectedOrder.delivery_address || 'Non renseignée' }}</span>
             </div>
           </div>
           
           <div>
             <h4 class="font-bold text-[var(--color-text-main)] mb-3 text-base">État d'avancement & Actions</h4>
             <div class="flex flex-col gap-2">
               <button @click="updateStatus('pending')" :class="['p-4 rounded-xl border font-bold text-left flex justify-between items-center transition-all', selectedOrder.status === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-600' : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-sub)] hover:border-amber-500/30 hover:text-amber-600']">
                 <div>
                    Paiement Validé / En attente
                    <p class="text-xs font-normal opacity-70 mt-0.5">Le client a payé, la commande est créée mais pas encore expédiée.</p>
                 </div>
                 <CheckCircle v-if="selectedOrder.status === 'pending'" :size="20" class="shrink-0" />
               </button>

               <button @click="updateStatus('shipped')" :class="['p-4 rounded-xl border font-bold text-left flex justify-between items-center transition-all', selectedOrder.status === 'shipped' ? 'bg-blue-500/10 border-blue-500/30 text-blue-600' : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-sub)] hover:border-blue-500/30 hover:text-blue-600']">
                 <div>
                    En Route / Expédié
                    <p class="text-xs font-normal opacity-70 mt-0.5">Le colis a été remis au livreur.</p>
                 </div>
                 <CheckCircle v-if="selectedOrder.status === 'shipped'" :size="20" class="shrink-0" />
               </button>

               <button @click="updateStatus('delivered')" :class="['p-4 rounded-xl border font-bold text-left flex justify-between items-center transition-all', selectedOrder.status === 'delivered' ? 'bg-green-500/10 border-green-500/30 text-green-600' : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-sub)] hover:border-green-500/30 hover:text-green-600']">
                 <div>
                    Livré (Libérer les fonds)
                    <p class="text-xs font-normal opacity-70 mt-0.5">Le client a confirmé réception. Libère les fonds (Escrow) vers le vendeur.</p>
                 </div>
                 <CheckCircle v-if="selectedOrder.status === 'delivered'" :size="20" class="shrink-0" />
               </button>

               <button @click="updateStatus('cancelled')" :class="['p-4 rounded-xl border font-bold text-left flex justify-between items-center transition-all', selectedOrder.status === 'cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-600' : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-sub)] hover:border-red-500/30 hover:text-red-600']">
                 <div>
                    Annuler la commande
                    <p class="text-xs font-normal opacity-70 mt-0.5">Annule complètement cette commande.</p>
                 </div>
                 <CheckCircle v-if="selectedOrder.status === 'cancelled'" :size="20" class="shrink-0" />
               </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { Truck, Package, X, CheckCircle } from 'lucide-vue-next';
import apiClient from '../../api/index.js';
import { useAlertStore } from '../../stores/alert.js';
import { CONFIG } from '../../config/index.js';

const alertStore = useAlertStore();
const isLoading = ref(true);
const orders = ref([]);
const selectedOrder = ref(null);

const stats = computed(() => {
  return {
    total: orders.value.length,
    pending: orders.value.filter(o => o.status === 'pending').length,
    shipped: orders.value.filter(o => o.status === 'shipped').length,
    delivered: orders.value.filter(o => o.status === 'delivered').length,
  };
});

const loadOrders = async () => {
  try {
    isLoading.value = true;
    const res = await apiClient.get('/admin/orders');
    orders.value = res.data.data || [];
  } catch (err) {
    console.error("Erreur chargement commandes:", err);
  } finally {
    isLoading.value = false;
  }
};

// Handle Esc Key to close modal
const handleEscape = (e) => {
  if (e.key === 'Escape' && selectedOrder.value) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
  loadOrders();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});


const formatId = (id) => {
  return id ? String(id).split('-')[0] : 'N/A';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute:"2-digit" });
};

const formatMoney = (amount) => {
  return `${Number(amount || 0).toLocaleString("fr-FR")} FCFA`;
};

const getAvatar = (user) => {
    if (user?.photo) {
        if (user.photo.startsWith('http')) return user.photo;
        return `${CONFIG.STORAGE_URL}${user.photo}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nom || 'A')}&background=6366f1&color=fff`;
};

const getStatusClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("delivered")) return "bg-green-500/10 text-green-600 border border-green-500/20";
  if (s.includes("shipped")) return "bg-blue-500/10 text-blue-600 border border-blue-500/20";
  if (s.includes("cancel")) return "bg-red-500/10 text-red-600 border border-red-500/20";
  return "bg-amber-500/10 text-amber-600 border border-amber-500/20"; 
};

const formatStatus = (status) => {
  const map = {
    'pending': 'En attente',
    'shipped': 'En route',
    'delivered': 'Livré',
    'cancelled': 'Annulée'
  };
  return map[status] || status;
};

const openModal = (order) => {
  selectedOrder.value = { ...order };
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  selectedOrder.value = null;
  document.body.style.overflow = '';
};

const updateStatus = async (newStatus) => {
  if (!selectedOrder.value) return;
  try {
    await apiClient.put(`/orders/${selectedOrder.value.id}/status`, { status: newStatus });
    
    alertStore.showAlert({
        title: "Succès",
        message: "Statut mis à jour avec succès.",
        type: "success",
    });

    closeModal();
    loadOrders(); // Refresh table
  } catch (err) {
    console.error("Erreur mise à jour statut:", err);
    alertStore.showAlert({
        title: "Erreur",
        message: "Impossible de mettre à jour le statut. Veuillez réessayer.",
        type: "error",
    });
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
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
