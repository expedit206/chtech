<template>
  <div class="w-full flex relative h-full overflow-hidden">
    <!-- Adjusted height for layout -->
    <Sidebar
      :conversations="messageStore.conversations"
      :is-sidebar-open="messageStore.isSidebarOpen"
      :is-mobile="messageStore.isMobile"
      :is-loading="isLoadingConversations"
      :is-loading-more="messageStore.isLoadingMoreConversations"
      :has-more="messageStore.hasMoreConversations"
      @select-conversation="handleSelectConversation"
      @toggle-sidebar="messageStore.toggleSidebar"
      @view-profile="viewProfile"
      @load-more="loadMoreConversations"
      :active-conversation-id="messageStore.selectedConversation?.user_id"
      :active-product-id="messageStore.selectedConversation?.product_id"
    />

    <div
      class="h-full w-full flex flex-col"
      :style="{ backgroundColor: 'var(--color-bg)' }"
    >
      <!-- Header -->
      <div
        class="flex border-b items-center px-4 flex-shrink-0 min-h-[60px]"
        :style="{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }"
      >
        <button
          v-if="
            !messageStore.isSidebarOpen &&
            messageStore.isMobile &&
            messageStore.selectedConversation
          "
          @click="messageStore.toggleSidebar"
          class="p-2 rounded-full hover:bg-gray-100 transition mr-2"
          :style="{ color: 'var(--color-text-main)' }"
        >
          <i class="fas fa-arrow-left text-xl"></i>
        </button>
        <div v-if="messageStore.selectedConversation" class="flex-1 flex justify-between items-center p-2 md:p-4 min-w-0">
          <div class="flex items-center gap-3 min-w-0 flex-1">
             <!-- Image Produit ou User -->
             <router-link
                v-if="messageStore.selectedConversation.product_slug"
                :to="{ name: 'DetailProduit', params: { slug: messageStore.selectedConversation.product_slug } }"
                class="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[var(--color-border)] relative group block"
             >
                <img
                  v-if="messageStore.selectedConversation.product_image"
                  :src="String(messageStore.selectedConversation.product_image).startsWith('http') ? messageStore.selectedConversation.product_image : CONFIG.STORAGE_URL + messageStore.selectedConversation.product_image"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-[var(--color-primary)] text-white text-lg font-bold">
                   {{ messageStore.selectedConversation.name?.charAt(0) }}
                </div>
                <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                   <i class="fas fa-external-link-alt text-white text-xs"></i>
                </div>
             </router-link>
             <div v-else class="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold shrink-0">
                {{ messageStore.selectedConversation.name?.charAt(0) }}
             </div>

             <!-- Noms -->
             <div class="flex flex-col min-w-0 pr-2">
                <component 
                  :is="messageStore.selectedConversation.product_slug ? 'router-link' : 'span'"
                  :to="messageStore.selectedConversation.product_slug ? { name: 'DetailProduit', params: { slug: messageStore.selectedConversation.product_slug } } : null"
                  class="text-lg font-bold truncate transition-colors hover:text-[var(--color-primary)]"
                  :style="{ color: 'var(--color-text-main)' }"
                >
                  {{ messageStore.selectedConversation.name }}
                </component>
                <!-- Info secondaire optionnelle si admin -->
                <span v-if="authStore.isAdmin && messageStore.selectedConversation.product_name" class="text-[10px] font-semibold opacity-60 truncate uppercase tracking-wider" :style="{ color: 'var(--color-text-sub)' }">
                  Conversation Produit
                </span>
             </div>
          </div>
        </div>
        <div v-else class="flex-1 flex items-center justify-center p-4 opacity-50">
           <p class="text-sm italic">{{ t("select_conversation_to_start") }}</p>
        </div>
      </div>

      <!-- Messages Content Area -->
      <div class="flex-1 min-h-0 relative flex flex-col">
        <Content
          v-if="messageStore.selectedConversation"
          :messages="messageStore.groupedMessages"
          :is-loading="messageStore.isLoading"
          :selected-conversation="messageStore.selectedConversation"
          :auth-store="authStore"
          @edit-message="handleEditMessage"
          @delete-message="handleDeleteMessage"
        />

        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center"
        >
          <div
            class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300"
          >
            <i class="fas fa-comments text-4xl"></i>
          </div>
          <p
            class="text-sm font-medium"
            :style="{ color: 'var(--color-text-sub)' }"
          >
            {{ t("select_conversation_to_start") }}
          </p>
        </div>

        <!-- Admin Order Action Bar (Bottom) -->
        <div 
          v-if="authStore.isAdmin && messageStore.selectedConversation?.product_id" 
          class="px-4 py-3 border-t flex flex-wrap items-center justify-between gap-3 transition-all animate-in slide-in-from-bottom-2 fade-in"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }"
        >
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm">
              <i class="fas fa-file-invoice"></i>
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] font-bold uppercase tracking-wider opacity-60" :style="{ color: 'var(--color-text-sub)' }">Gestion de commande</span>
              <span class="text-xs font-black truncate max-w-[150px] md:max-w-none" :style="{ color: 'var(--color-text-main)' }">{{ messageStore.selectedConversation.product_name }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 ml-auto">
            <template v-if="!messageStore.selectedConversation.order_status">
              <!-- Price Negotiation Input -->
              <div class="flex flex-col items-end gap-1 mr-2 px-3 border-r border-white/10">
                <span class="text-[9px] font-black opacity-50 uppercase tracking-tighter" :style="{ color: 'var(--color-text-sub)' }">Prix final négocié</span>
                <div class="relative flex items-center">
                   <input 
                    type="number" 
                    v-model="negotiatedPrice"
                    class="w-24 md:w-32 px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 border border-transparent focus:border-[var(--color-primary)] text-xs font-black outline-none transition-all text-right pr-6"
                    :style="{ color: 'var(--color-text-main)' }"
                  />
                  <span class="absolute right-2 text-[10px] font-bold opacity-40">CFA</span>
                </div>
              </div>

              <button
                @click="createAdminOrder"
                class="px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 transition-all shadow-md font-black text-xs ring-offset-2 hover:ring-2 hover:ring-[var(--color-primary)]/20 active:scale-95 flex items-center gap-2"
              >
                <span>VALIDER & CONFIRMER</span>
                <i class="fas fa-check-double"></i>
              </button>
            </template>
            <template v-else>
               <div 
                  class="flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-[10px] uppercase border"
                  :class="orderStatusBadgeClass(messageStore.selectedConversation.order_status)"
               >
                  <span class="w-2 h-2 rounded-full animate-pulse" :class="orderStatusDotClass(messageStore.selectedConversation.order_status)"></span>
                  <span>{{ orderStatusLabel(messageStore.selectedConversation.order_status) }}</span>
               </div>
               
               <div class="flex gap-2" v-if="['pending', 'shipped'].includes(messageStore.selectedConversation.order_status)">
                 <button 
                  @click="updateOrderStatus(messageStore.selectedConversation.order_status === 'pending' ? 'shipped' : 'delivered')"
                  class="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all font-bold text-[10px] flex items-center gap-2 shadow-sm active:scale-95"
                 >
                    <i class="fas" :class="messageStore.selectedConversation.order_status === 'pending' ? 'fa-truck' : 'fa-hand-holding-box'"></i>
                    <span class="uppercase tracking-widest">{{ messageStore.selectedConversation.order_status === 'pending' ? 'Expédier' : 'Livrer' }}</span>
                 </button>
                 
                 <button 
                  @click="updateOrderStatus('cancelled')"
                  class="p-2 w-9 h-9 flex items-center justify-center rounded-xl border-2 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                  title="Annuler"
                 >
                    <i class="fas fa-times"></i>
                 </button>
               </div>
            </template>
          </div>
        </div>

        <!-- Input -->
        <Input
          v-if="messageStore.selectedConversation"
          :new-message="messageStore.newMessage"
          :is-recording="messageStore.recordingState.isRecording"
          :product="messageStore.product"
          @send-message="handleSendMessage"
          @send-image="handleSendImage"
          @send-video="handleSendVideo"
          @start-recording="messageStore.startRecording"
          @stop-recording="messageStore.stopRecording"
          @emit-typing="messageStore.emitTyping"
          @update:newMessage="messageStore.newMessage = $event"
          @pause-recording="messageStore.toggleRecordingPause"
          @resume-recording="messageStore.toggleRecordingPause"
          @clear-product-tag="messageStore.clearProductTag"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessageStore } from "../stores/messages.js";
import { useAuthStore } from "../stores/auth.js";
import { useToast } from "vue-toastification";
import { CONFIG } from "../config/index.js";
import useI18n from "../composables/useI18n.js";
import apiClient from "../api/index.js";

// Components
import Sidebar from "../components/Messages/Sidebar.vue";
import Content from "../components/Messages/Content.vue";
import Input from "../components/Messages/Input.vue";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const messageStore = useMessageStore();
const toast = useToast();

const isLoadingConversations = ref(false);
const negotiatedPrice = ref(0);

// Mapping French labels for order statuses
const ORDER_STATUS_FR = {
  pending:   'En attente',
  shipped:   'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

const ORDER_STATUS_BADGE = {
  pending:   'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  shipped:   'bg-blue-500/10 text-blue-600 border-blue-500/20',
  delivered: 'bg-green-500/10 text-green-600 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const ORDER_STATUS_DOT = {
  pending:   'bg-yellow-500',
  shipped:   'bg-blue-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const orderStatusLabel = (status) => ORDER_STATUS_FR[status] || status;
const orderStatusBadgeClass = (status) => ORDER_STATUS_BADGE[status] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
const orderStatusDotClass = (status) => ORDER_STATUS_DOT[status] || 'bg-gray-500';

// Initialize negotiated price when switching conversations
watch(
  () => messageStore.selectedConversation,
  (newVal) => {
    if (newVal?.product_price) {
      negotiatedPrice.value = newVal.product_price;
    }
  },
  { immediate: true }
);

// Handlers
const handleSelectConversation = (receiverId, productId) => {
  messageStore.selectConversation(receiverId, productId);
};

const loadMoreConversations = () => {
  messageStore.fetchConversations(false, false, true);
};

const handleSendMessage = () => {
  if (messageStore.newMessage.trim() === "") return;
  messageStore.sendMessage(messageStore.newMessage, "text");
};

const handleSendImage = (file, caption) => {
  messageStore.sendMessage(caption, "image", file);
};

const handleSendVideo = (file, caption) => {
  messageStore.sendMessage(caption, "video", file);
};

const handleEditMessage = ({ id, content }) => {
  messageStore.editMessage(id, content);
};

const handleDeleteMessage = (id) => {
  messageStore.deleteMessage(id);
};

const viewProfile = (userId) => {
  // Navigate to profile or do nothing
  console.log("View profile", userId);
};

const createAdminOrder = async () => {
  try {
     const response = await apiClient.post("/orders/admin-create", {
        user_id: messageStore.selectedConversation.user_id,
        product_id: messageStore.selectedConversation.product_id,
        quantity: 1, 
        agreed_price: negotiatedPrice.value,
     });
     
     if (response.data.success) {
       toast.success("Commande générée - Paiement validé.");
       // Mise à jour immédiate réactive sans attendre le rechargement global
       const order = response.data.order;
       messageStore.selectedConversation.order_status = 'pending';
       messageStore.selectedConversation.order_id = order.id;
       
       // Recharger en arrière-plan pour synchroniser la sidebar également
       await messageStore.fetchConversations(true, true);
     }
  } catch (err) {
     toast.error(err.response?.data?.message || "Erreur de validation");
  }
};

const updateOrderStatus = async (status) => {
   if (!messageStore.selectedConversation?.order_id) {
     toast.error("Identifiant de commande introuvable.");
     return;
   }
   
   try {
     const response = await apiClient.put(`/orders/${messageStore.selectedConversation.order_id}/status`, {
       status: status
     });
     
     if (response.data.success) {
       toast.success("Statut mis à jour sur : " + status);
       // Mettre à jour localement ou rafraichir
       messageStore.selectedConversation.order_status = status;
       await messageStore.fetchConversations(true, true);
     }
   } catch(err) {
      toast.error(err.response?.data?.message || "Erreur lors de la mise à jour");
   }
}

// Lifecycle
onMounted(() => {
  messageStore.initialize();

  if (messageStore.conversations.length === 0) {
    isLoadingConversations.value = true;
  }

  // Fetch concurrently
  const convPromise = messageStore.fetchConversations(true).then(() => {
    isLoadingConversations.value = false;
  }).catch((error) => {
    console.error(error);
    isLoadingConversations.value = false;
  });

  const msgPromise = route.params.receiverId 
    ? messageStore.fetchMessages(route.params.receiverId, true, route.query.productId).catch(console.error)
    : Promise.resolve();

  if (authStore.user?.id) {
    messageStore.subscribeToChannel();
  }
});

onUnmounted(() => {
  messageStore.cleanup();
});

// Watchers
watch(
  () => [route.params.receiverId, route.query.productId],
  async ([receiverId, productId]) => {
    if (receiverId) {
      await messageStore.fetchMessages(receiverId, true, productId);
    }
  },
);

watch(
  () => authStore.user?.id,
  (userId) => {
    if (userId) {
      messageStore.subscribeToChannel();
    }
  },
);
</script>

<style scoped>
@media (max-width: 768px) {
  .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
