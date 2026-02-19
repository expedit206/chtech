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
        <h2
          class="text-xl font-bold"
          :style="{ color: 'var(--color-text-main)' }"
        >
          Messages
        </h2>
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

      <!-- Conversation List -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
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
          :key="conv.user_id"
          @click="$emit('select-conversation', conv.user_id)"
          class="group p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 relative overflow-hidden"
          :class="[
            activeConversationId == conv.user_id
              ? 'bg-(--color-primary)/10'
              : 'hover:bg-(--color-primary)/10',
          ]"
        >
          <!-- Active Indicator Strip -->
          <div
            v-if="activeConversationId == conv.user_id"
            class="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[var(--color-primary)] rounded-r-full"
          ></div>

          <!-- Avatar -->
          <div
            class="relative flex-shrink-0"
            @click.stop="$emit('view-profile', conv.user_id)"
          >
            <div
              class="w-12 h-12 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-gray-100 transition-all"
              :style="{ backgroundColor: 'var(--color-bg)' }"
            >
              <img
                v-if="conv.profile_photo"
                :src="
                  String(conv.profile_photo).startsWith('http')
                    ? conv.profile_photo
                    : storageUrl + conv.profile_photo
                "
                alt=""
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-[var(--color-primary)] text-white text-lg font-bold"
              >
                {{ conv.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <!-- Online status (mockup) -->
            <!-- <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> -->
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-0.5">
              <h3
                class="font-semibold truncate pr-2"
                :class="{
                  'text-[var(--color-primary)]':
                    activeConversationId == conv.user_id,
                }"
                :style="{
                  color:
                    activeConversationId != conv.user_id
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
              <div
                v-if="conv.unread_count > 0"
                class="ml-2 bg-[var(--color-primary)] text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-sm"
              >
                {{ conv.unread_count }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import ConversationSkeleton from "./ConversationSkeleton.vue";

const props = defineProps({
  conversations: Array,
  isSidebarOpen: Boolean,
  isMobile: Boolean,
  storageUrl: String,
  activeConversationId: [String, Number],
  isLoading: Boolean,
});

const emit = defineEmits([
  "select-conversation",
  "toggle-sidebar",
  "view-profile",
]);

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
