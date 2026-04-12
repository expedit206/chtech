<template>
  <div class="max-w-6xl mx-auto px-4 py-12 pt-24">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1
          class="text-3xl font-black text-[var(--color-text-main)] tracking-tight"
        >
          Commandes Reçues
        </h1>
        <p class="text-[var(--color-text-sub)]">
          Gérez les ventes de vos produits et validez les livraisons
        </p>
      </div>
      <div class="flex gap-2">
        <div
          class="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-xl text-sm font-bold border border-[var(--color-primary)]/20"
        >
          {{ orders.length }} Commandes
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-[var(--color-primary)]" :size="48" />
    </div>

    <div
      v-else-if="orders.length === 0"
      class="text-center py-20 bg-[var(--color-surface)] rounded-3xl border-2 border-dashed border-[var(--color-border)]"
    >
      <PackageOpen
        class="mx-auto text-[var(--color-text-sub)] opacity-20 mb-4"
        :size="64"
      />
      <p class="text-xl font-bold text-[var(--color-text-sub)]">
        Aucune commande reçue pour le moment
      </p>
    </div>

    <div v-else class="grid gap-6">
      <div
        v-for="item in orders"
        :key="item.id"
        class="bg-[var(--color-surface)] rounded-3xl shadow-sm border border-[var(--color-border)] overflow-hidden"
      >
        <div class="p-6 md:p-8 flex flex-col md:flex-row gap-6">
          <div
            class="w-full md:w-32 h-32 rounded-2xl overflow-hidden shadow-inner bg-[var(--color-bg)]"
          >
            <img
              :src="
                item.produit?.photos?.[0] || 'https://via.placeholder.com/150'
              "
              class="w-full h-full object-cover"
            />
          </div>

          <div class="flex-grow space-y-4">
            <div
              class="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h3 class="text-xl font-black text-[var(--color-text-main)]">
                  {{ item.produit?.nom }}
                </h3>
                <p class="text-sm font-bold text-[var(--color-primary)]">
                  Quantité : {{ item.quantity }} • Total :
                  {{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :class="getStatusClass(item.order?.status)"
                >
                  Statut : {{ item.order?.status }}
                </span>
                <span
                  class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"
                >
                  Paiement : {{ item.order?.payment_status }}
                </span>
              </div>
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]"
            >
              <div class="space-y-1">
                <p
                  class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                  Acheteur
                </p>
                <div
                  class="flex items-center gap-2 text-sm font-bold text-[var(--color-text-main)]"
                >
                  <User :size="16" class="text-[var(--color-primary)]" />
                  {{ item.order?.user?.nom }}
                </div>
              </div>
              <div class="space-y-1">
                <p
                  class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                  Téléphone
                </p>
                <div
                  class="flex items-center gap-2 text-sm font-bold text-[var(--color-text-main)]"
                >
                  <Phone :size="16" class="text-[var(--color-primary)]" />
                  {{ item.order?.contact_phone }}
                </div>
              </div>
              <div class="md:col-span-2 space-y-1">
                <p
                  class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                  Adresse de livraison
                </p>
                <div
                  class="flex items-center gap-2 text-sm text-[var(--color-text-main)]"
                >
                  <MapPin :size="16" class="text-[var(--color-primary)]" />
                  {{ item.order?.delivery_address }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2 min-w-[180px]">
            <p
              class="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-1"
            >
              Actions rapides
            </p>

            <button
              v-if="item.order?.status === 'pending'"
              @click="updateStatus(item.order_id, 'shipped')"
              class="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              <Truck :size="14" /> Marquer Expédié
            </button>

            <button
              v-if="item.order?.status === 'shipped'"
              @click="updateStatus(item.order_id, 'delivered')"
              class="w-full py-2.5 bg-green-600 text-white rounded-xl font-bold text-xs hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <CheckCircle :size="14" /> Confirmer Livraison
            </button>

            <router-link
              :to="{
                name: 'messages',
                params: { receiverId: item.order?.user_id },
              }"
              class="w-full py-2.5 bg-[var(--color-surface)] text-[var(--color-text-main)] rounded-xl font-bold text-xs hover:bg-black/5 transition flex items-center justify-center gap-2 border border-[var(--color-border)]"
            >
              <MessageCircle :size="14" /> Contacter l'acheteur
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "../../api/index.js";
import { useFlash } from "../../composables/useFlash.js";
import {
  Loader2,
  PackageOpen,
  User,
  Phone,
  MapPin,
  Truck,
  CheckCircle,
  MessageCircle,
} from "lucide-vue-next";

const flash = useFlash();
const orders = ref([]);
const isLoading = ref(true);

const fetchOrders = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get("/orders/seller");
    orders.value = response.data.data;
  } catch (error) {
    flash.error("Erreur lors du chargement des commandes");
  } finally {
    isLoading.value = false;
  }
};

const updateStatus = async (orderId, status) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/status`, {
      status,
    });
    flash.success(response.data.message);
    fetchOrders(); // Refresh
  } catch (error) {
    flash.error("Erreur lors de la mise à jour");
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
  }).format(price);
};

const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-amber-500/20 text-amber-600 border border-amber-500/30";
    case "shipped":
      return "bg-blue-500/20 text-blue-600 border border-blue-500/30";
    case "delivered":
      return "bg-green-500/20 text-green-600 border border-green-500/30";
    case "cancelled":
      return "bg-red-500/20 text-red-600 border border-red-500/30";
    default:
      return "bg-[var(--color-border)] text-[var(--color-text-sub)]";
  }
};

onMounted(fetchOrders);
</script>
