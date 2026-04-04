<template>
  <div class="w-full flex relative h-full overflow-hidden">
    <!-- Adjusted height for layout -->
    <Sidebar
      :conversations="messageStore.conversations"
      :is-sidebar-open="messageStore.isSidebarOpen"
      :is-mobile="messageStore.isMobile"
      :is-loading="isLoadingConversations"
      @select-conversation="handleSelectConversation"
      @toggle-sidebar="messageStore.toggleSidebar"
      @view-profile="viewProfile"
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
          <!-- Action boutons Admin -->
          <div v-if="authStore.isAdmin && messageStore.selectedConversation.product_id" class="flex gap-2 text-sm font-bold">
            <button
              v-if="!messageStore.selectedConversation.order_status"
              @click="createAdminOrder"
              class="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-all shadow-sm"
            >
              Générer la commande
            </button>
            <div v-else class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20">
               <i class="fas fa-check-circle"></i>
               <span>Commande active</span>
            </div>
          </div>
        </div>
        <div v-else class="flex-1 flex items-center justify-center p-4 opacity-50">
           <p class="text-sm italic">Sélectionnez une discussion</p>
        </div>
      </div>

      <!-- Messages Content -->
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

// Handlers
const handleSelectConversation = (receiverId, productId) => {
  messageStore.selectConversation(receiverId, productId);
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
     await apiClient.post("/orders/admin-create", {
        user_id: messageStore.selectedConversation.user_id,
        product_id: messageStore.selectedConversation.product_id,
        quantity: 1, // par defaut 1
     });
     toast.success("Commande générée - Paiement validé.");
     messageStore.selectedConversation.order_status = 'pending';
  } catch (err) {
     toast.error(err.response?.data?.message || "Erreur de validation");
  }
};

const updateOrderStatus = async (status) => {
   try {
     toast.success("Statut mis à jour sur : " + status);
     messageStore.selectedConversation.order_status = status;
   } catch(err) {
      toast.error("Erreur serveur");
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
