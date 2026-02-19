<template>
  <div class="w-full flex relative h-[calc(100vh-64px)] min-h-[500px]">
    <!-- Adjusted height for layout -->
    <Sidebar
      :conversations="messageStore.conversations"
      :is-sidebar-open="messageStore.isSidebarOpen"
      :is-mobile="messageStore.isMobile"
      :storage-url="messageStore.storageUrl"
      :is-loading="isLoadingConversations"
      @select-conversation="handleSelectConversation"
      @toggle-sidebar="messageStore.toggleSidebar"
      @view-profile="viewProfile"
      :active-conversation-id="messageStore.selectedConversation?.user_id"
    />

    <div class="bg-white h-full w-full flex flex-col">
      <!-- Header -->
      <div
        class="flex border-b items-center px-4 bg-white flex-shrink-0 min-h-[60px]"
      >
        <button
          v-if="
            !messageStore.isSidebarOpen &&
            messageStore.isMobile &&
            messageStore.selectedConversation
          "
          @click="messageStore.toggleSidebar"
          class="text-gray-800 p-2 rounded-full hover:bg-gray-100 transition mr-2"
        >
          <i class="fas fa-arrow-left text-xl"></i>
        </button>
        <h2
          v-if="messageStore.selectedConversation"
          class="text-xl font-semibold text-gray-800 p-4 flex items-center"
        >
          {{ messageStore.selectedConversation.name }}
        </h2>
      </div>

      <!-- Content -->
      <div
        class="bg-white shadow-md transition-all duration-300 flex flex-col flex-1 h-full overflow-hidden w-full relative"
      >
        <Content
          v-if="messageStore.selectedConversation"
          @edit-message="handleEditMessage"
          @delete-message="handleDeleteMessage"
          :messages="messageStore.groupedMessages"
          :is-loading="messageStore.isLoading"
          :typing-user="messageStore.typingState.isTyping"
          :selected-conversation="messageStore.selectedConversation"
          :auth-store="authStore"
        />

        <div v-else class="flex items-center justify-center h-full">
          <p class="text-gray-400 text-lg">
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
import useI18n from "../composables/useI18n.js";

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
const handleSelectConversation = (receiverId) => {
  messageStore.selectConversation(receiverId);
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

// Lifecycle
onMounted(async () => {
  messageStore.initialize();

  try {
    isLoadingConversations.value = true;
    await messageStore.fetchConversations();
  } catch (error) {
    console.error(error);
    // toast.error("Erreur lors de l'initialisation des messages");
  } finally {
    isLoadingConversations.value = false;
  }

  try {
    if (route.params.receiverId) {
      await messageStore.fetchMessages(route.params.receiverId);
    }

    if (authStore.user?.id) {
      messageStore.subscribeToChannel();
    }
  } catch (error) {
    console.error(error);
    // toast.error("Erreur lors de l'initialisation des messages");
  }
});

onUnmounted(() => {
  messageStore.cleanup();
});

// Watchers
watch(
  () => route.params.receiverId,
  async (receiverId) => {
    if (receiverId) {
      await messageStore.fetchMessages(receiverId);
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
