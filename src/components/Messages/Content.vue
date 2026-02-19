<template>
  <div class="h-full flex flex-col bg-slate-50 relative overflow-hidden">
    <div
      class="flex-1 overflow-y-auto p-4 space-y-6 z-0"
      ref="messagesContainer"
      style="scroll-behavior: smooth"
    >
      <div v-if="isLoading" class="flex flex-col space-y-4 py-4">
        <MessageSkeleton v-for="i in 3" :key="i" />
      </div>

      <div v-for="group in messages" :key="group.date" class="space-y-4">
        <!-- Date Separator -->
        <div class="flex justify-center sticky top-0 z-10 py-2">
          <span
            class="bg-white/80 backdrop-blur-sm text-gray-500 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm border border-gray-100 uppercase tracking-wide"
          >
            {{ group.date }}
          </span>
        </div>

        <!-- Individual Message -->
        <div
          v-for="message in group.messages"
          :key="message.id"
          class="group flex w-full mb-1"
          :class="
            message.sender_id === authStore.user.id
              ? 'justify-end'
              : 'justify-start'
          "
        >
          <div
            class="relative max-w-[85%] sm:max-w-[70%] flex flex-col"
            :class="
              message.sender_id === authStore.user.id
                ? 'items-end'
                : 'items-start'
            "
          >
            <div
              class="relative shadow-sm break-words overflow-hidden transition-all"
              :class="[
                message.type === 'text' ||
                message.type === 'audio' ||
                (message.attachment_url && message.content)
                  ? message.sender_id === authStore.user.id
                    ? 'bg-[var(--color-primary)] text-white rounded-2xl rounded-tr-none px-4 py-3'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3'
                  : 'rounded-2xl p-0 bg-transparent shadow-none',
              ]"
            >
              <!-- Product Link -->
              <router-link
                v-if="message.product?.id"
                :to="{
                  name: 'DetailProduit',
                  params: { id: message.product.id },
                }"
                class="flex items-center gap-2 mb-2 bg-black/10 p-2 rounded-lg hover:bg-black/20 transition text-sm font-medium"
                :class="
                  message.sender_id === authStore.user.id
                    ? 'text-white'
                    : 'text-blue-600'
                "
              >
                <i class="fas fa-tag"></i>
                Produit: {{ message.product.nom }}
              </router-link>

              <!-- IMAGE -->
              <div
                v-if="message.type === 'image'"
                class="overflow-hidden cursor-pointer mb-1"
                :class="message.content ? 'rounded-lg mb-2' : 'rounded-2xl'"
                @click="viewImage(message.attachment_url || message.content)"
              >
                <img
                  :src="message.attachment_url || message.content"
                  class="max-w-full h-auto max-h-80 object-cover min-w-[200px]"
                  loading="lazy"
                />
              </div>

              <!-- VIDEO -->
              <video
                v-if="message.type === 'video'"
                controls
                class="max-w-sm max-h-80 bg-black mb-1"
                :class="message.content ? 'rounded-lg mb-2' : 'rounded-2xl'"
                preload="metadata"
              >
                <source
                  :src="message.attachment_url || message.content"
                  type="video/mp4"
                />
                Votre navigateur ne supporte pas la vidéo.
              </video>

              <!-- AUDIO -->
              <audio
                v-if="message.type === 'audio'"
                controls
                class="max-w-[240px]"
                :class="
                  message.sender_id === authStore.user.id
                    ? 'opacity-90 grayscale contrast-200'
                    : ''
                "
              >
                <source
                  :src="message.attachment_url || message.content"
                  type="audio/webm"
                />
                Audio error
              </audio>

              <!-- TEXT (Caption or Main Message) -->
              <p
                v-if="
                  message.type === 'text' ||
                  (message.attachment_url && message.content)
                "
                class="whitespace-pre-wrap text-[15px] leading-relaxed block"
              >
                {{ message.content }}
              </p>
            </div>

            <!-- Timestamp & Status -->
            <div
              class="flex items-center gap-1 mt-1 px-1 select-none opacity-60 text-[10px] font-medium"
              :class="[
                message.sender_id === authStore.user.id
                  ? 'justify-end text-gray-500'
                  : 'justify-start text-gray-400',
              ]"
            >
              <span>{{
                new Date(message.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}</span>
              <span v-if="message.sender_id === authStore.user.id">
                <i
                  v-if="message.is_read"
                  class="fas fa-check-double text-blue-500"
                ></i>
                <i v-else class="fas fa-check"></i>
              </span>
            </div>

            <!-- Dropdown Menu -->
            <button
              v-if="message.sender_id === authStore.user.id"
              @click.stop="toggleMenu(message.id)"
              class="absolute top-0 -left-8 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-ellipsis-v text-sm"></i>
            </button>

            <!-- Menu Popup -->
            <transition name="fade">
              <div
                v-if="openMenuId === message.id"
                class="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden text-sm animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  @click="editMessage(message)"
                  v-if="message.type === 'text'"
                  class="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                >
                  <i class="fas fa-pen text-sm w-4"></i> {{ t("edit") }}
                </button>
                <button
                  @click="deleteMessage(message.id)"
                  class="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-red-50 text-red-600"
                >
                  <i class="fas fa-trash text-sm w-4"></i> {{ t("delete") }}
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div
        v-if="typingUser"
        class="flex items-end gap-2 text-gray-400 text-sm ml-2 animate-bounce"
      >
        <div
          class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <i class="fas fa-ellipsis-h text-gray-400"></i>
        </div>
        <span>En train d'écrire...</span>
      </div>

      <!-- Bottom spacer -->
      <div class="h-4"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, defineProps, defineEmits } from "vue";
import { useToast } from "vue-toastification";
import apiClient from "../../api/index.js";
import useI18n from "../../composables/useI18n.js";
import MessageSkeleton from "./MessageSkeleton.vue";

const { t } = useI18n();

const props = defineProps({
  messages: Array,
  isLoading: Boolean,
  typingUser: Boolean,
  selectedConversation: Object,
  authStore: Object,
});

const openMenuId = ref(null);
const messagesContainer = ref(null);
const toast = useToast();
const emit = defineEmits(["mounted", "edit-message", "delete-message"]);

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

document.addEventListener("click", () => (openMenuId.value = null));

// Auto-scroll logic
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(
  () => props.messages,
  () => {
    scrollToBottom();
  },
  { deep: true },
);

onMounted(() => {
  scrollToBottom();
});

const editMessage = (message) => {
  if (message.isTemporary) {
    toast.error("Message en cours d'envoi");
    return;
  }
  const newContent = prompt("Modifier le message :", message.content);
  if (newContent && newContent.trim() !== message.content) {
    apiClient
      .put(`/chat/message/${message.id}`, { content: newContent.trim() })
      .then(() => {
        emit("edit-message", { id: message.id, content: newContent.trim() });
      })
      .catch(() => toast.error("Échec de la modification du message"));
  }
};

const deleteMessage = (messageId) => {
  const message = props.messages
    .flatMap((g) => g.messages)
    .find((m) => m.id === messageId);
  if (message?.isTemporary) {
    toast.error("Message en cours d’envoi");
    return;
  }

  if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
    apiClient
      .delete(`/chat/message/${messageId}`)
      .then(() => emit("delete-message", messageId))
      .catch(() => toast.error("Échec de la suppression du message"));
  }
};

const viewImage = (url) => {
  window.open(url, "_blank");
};
</script>

<style scoped>
/* Scrollbar styling for Webkit */
div::-webkit-scrollbar {
  width: 6px;
}
div::-webkit-scrollbar-track {
  background: transparent;
}
div::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
div::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.8);
}
</style>
