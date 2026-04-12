<template>
  <transition name="slide-fade">
    <div
      v-if="isSidebarOpen || !isMobile"
      class="border-r flex flex-col h-full transition-all duration-300 z-20"
      :class="isMobile ? 'fixed inset-0 w-full' : 'w-80 md:w-96'"
      :style="{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }"
    >
      <!-- Header -->
      <div
        class="p-4 border-b flex items-center justify-between sticky top-0 z-10"
        :style="{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }"
      >
        <div class="flex items-center gap-3">
          <router-link
            :to="{ name: 'Home' }"
            class="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-(--color-primary)/10 transition-all group"
            title="Retour à l'accueil"
          >
            <i
              class="fas fa-chevron-left text-sm group-hover:-translate-x-0.5 transition-transform"
              :style="{ color: 'var(--color-primary)' }"
            ></i>
          </router-link>
          <h2
            class="text-xl font-bold"
            :style="{ color: 'var(--color-text-main)' }"
          >
            Messages
          </h2>
        </div>

        <div class="flex items-center gap-2">
          <!-- Command Link -->
          <router-link
            :to="{ name: 'Orders' }"
            class="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-(--color-primary)/10 transition-all group relative mr-1"
            title="Mes Commandes"
          >
            <i
              class="fas fa-shopping-bag text-sm"
              :style="{ color: 'var(--color-primary)' }"
            ></i>
            <!-- Small indicator if needed in future -->
          </router-link>

          <button
            v-if="isMobile"
            @click="$emit('toggle-sidebar')"
            class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            :style="{
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text-sub)',
            }"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Conversation List -->
      <div 
        class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1"
        @scroll="handleScroll"
      >
        <!-- Skeleton Loading -->
        <div v-if="isLoading" class="space-y-2">
          <ConversationSkeleton v-for="i in 8" :key="i" />
        </div>

        <div
          v-else-if="conversations.length === 0"
          class="flex flex-col items-center justify-center h-48 text-gray-400"
        >
          <i class="far fa-comments text-4xl mb-2 opacity-50"></i>
          <p class="text-sm">Aucune conversation</p>
        </div>

        <!-- <div
          v-else
          v-for="conv in conversations"
          :key="conv.user_id"
          @click="$emit('select-conversation', conv.user_id)"
          class="group p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 relative overflow-hidden hover:bg-black/5 hover:bg-(--color-border)"
          :class="[
            activeConversationId == conv.user_id
              ? 'bg-[var(--color-primary)]/10'
              : 'hover:bg-opacity-5 hover:bg-black dark:hover:bg-white/5',
          ]"
        > -->

        <div
          v-else
          v-for="conv in conversations"
          :key="conv.user_id + '_' + conv.product_id"
          @click="$emit('select-conversation', conv.user_id, conv.product_id)"
          class="group p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 relative overflow-hidden"
          :class="[
            (activeConversationId == conv.user_id && activeProductId == conv.product_id)
              ? 'bg-(--color-primary)/10'
              : 'hover:bg-(--color-primary)/10',
          ]"
        >
          <!-- Active Indicator Strip -->
          <div
            v-if="activeConversationId == conv.user_id && activeProductId == conv.product_id"
            class="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[var(--color-primary)] rounded-r-full"
          ></div>

          <!-- Avatar -->
          <div
            class="relative flex-shrink-0"
            @click.stop="$emit('view-profile', conv.user_id)"
          >
            <!-- Image Produit ou User -->
            <div
              v-if="conv.product_image"
              class="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[var(--color-border)] relative"
            >
              <img
                :src="String(conv.product_image).startsWith('http') ? conv.product_image : CONFIG.STORAGE_URL + conv.product_image"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <div
              v-else
              class="w-12 h-12 rounded-full relative shrink-0 ring-2 ring-transparent transition-all group-hover:ring-[var(--color-primary)]"
            >
              <img
                :src="conv.user_photo?.startsWith('http') ? conv.user_photo : conv.user_photo ? CONFIG.STORAGE_URL + conv.user_photo : `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name || 'User')}&background=6366f1&color=fff&size=64`"
                class="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105"
              />
              <span
                v-if="conv.is_online"
                class="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
              ></span>
            </div>

            <!-- Order status dot indicator -->
            <span
              v-if="authStore.isAdmin && conv.order_status"
              class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-surface)]"
              :class="orderStatusDotClass(conv.order_status)"
              :title="orderStatusLabel(conv.order_status)"
            ></span>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-0.5">
              <h3
                class="font-semibold truncate pr-2"
                :class="{
                  'text-[var(--color-primary)]':
                    (activeConversationId == conv.user_id && activeProductId == conv.product_id),
                }"
                :style="{
                  color:
                    (activeConversationId != conv.user_id || activeProductId != conv.product_id)
                      ? 'var(--color-text-main)'
                      : '',
                }"
              >
                {{ conv.name }}
              </h3>
              <span
                class="text-[10px] font-medium whitespace-nowrap"
                :style="{ color: 'var(--color-text-sub)' }"
              >
                {{ formatTime(conv.updated_at) }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <div
                class="flex items-center gap-1.5 min-w-0 text-sm"
                :style="{ color: 'var(--color-text-sub)' }"
              >
                <!-- Icon based on type -->
                <i
                  v-if="conv.last_message_type === 'image'"
                  class="fas fa-camera text-sm"
                ></i>
                <i
                  v-else-if="conv.last_message_type === 'video'"
                  class="fas fa-video text-sm"
                ></i>
                <i
                  v-else-if="conv.last_message_type === 'audio'"
                  class="fas fa-microphone text-sm"
                ></i>

                <span
                  class="truncate block"
                  :class="{
                    'font-medium': conv.unread_count > 0,
                  }"
                  :style="{
                    color:
                      conv.unread_count > 0
                        ? 'var(--color-text-main)'
                        : 'var(--color-text-sub)',
                  }"
                >
                  {{
                    conv.last_message ||
                    (conv.last_message_type === "image"
                      ? "Photo"
                      : conv.last_message_type === "video"
                        ? "Vidéo"
                        : conv.last_message_type === "audio"
                          ? "Message vocal"
                          : "Message")
                  }}
                </span>
              </div>

              <!-- Unread Badge -->
              <div class="ml-2 flex-shrink-0 flex flex-col items-end gap-1">
                <div
                  v-if="conv.unread_count > 0"
                  class="bg-[var(--color-primary)] text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-sm"
                >
                  {{ conv.unread_count }}
                </div>
                <!-- Order status badge (admin only) -->
                <div
                  v-if="authStore.isAdmin && conv.order_status"
                  class="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                  :class="orderStatusBadgeClass(conv.order_status)"
                >
                  {{ orderStatusLabel(conv.order_status) }}
                </div>
                <!-- No order yet — needs attention badge -->
                <div
                  v-else-if="authStore.isAdmin && conv.product_id && !conv.order_status"
                  class="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border bg-orange-500/10 text-orange-600 border-orange-500/20"
                >
                  À valider
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading More Indicator -->
        <div v-if="isLoadingMore" class="flex justify-center p-4">
           <i class="fas fa-spinner fa-spin text-xl" :style="{ color: 'var(--color-primary)' }"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import ConversationSkeleton from "./ConversationSkeleton.vue";
import { useAuthStore } from "../../stores/auth";
import { CONFIG } from "../../config/index.js";

const authStore = useAuthStore();

const props = defineProps({
  conversations: Array,
  isSidebarOpen: Boolean,
  isMobile: Boolean,
  activeConversationId: [String, Number],
  activeProductId: [String, Number],
  isLoading: Boolean,
  isLoadingMore: Boolean,
  hasMore: Boolean,
});

const emit = defineEmits([
  "select-conversation",
  "toggle-sidebar",
  "view-profile",
  "load-more"
]);

const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  if (scrollTop + clientHeight >= scrollHeight - 50 && !props.isLoadingMore && props.hasMore) {
    emit("load-more");
  }
};

// Status translation helpers
const STATUS_FR = { pending: 'En attente', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé' };
const STATUS_BADGE = {
  pending:   'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  shipped:   'bg-blue-500/10 text-blue-600 border-blue-500/20',
  delivered: 'bg-green-500/10 text-green-600 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};
const STATUS_DOT = {
  pending:   'bg-yellow-500',
  shipped:   'bg-blue-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};
const orderStatusLabel     = (s) => STATUS_FR[s] || s;
const orderStatusBadgeClass = (s) => STATUS_BADGE[s] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
const orderStatusDotClass   = (s) => STATUS_DOT[s] || 'bg-gray-400';

const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();

  // If today, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // If this week, show day name
  const diffDays = Math.ceil(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }

  // Else show date
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #f1f1f1;
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
}
</style>
