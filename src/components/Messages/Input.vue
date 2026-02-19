<template>
  <div class="px-4 py-3 bg-white border-t border-gray-100">
    <div class="max-w-4xl mx-auto flex items-end gap-2 relative">
      <!-- Product Tag (Popup/Floating) -->
      <transition name="slide-up">
        <div
          v-if="product?.id"
          class="absolute -top-12 left-0 bg-white shadow-lg border border-gray-100 rounded-lg p-2 flex items-center gap-3 z-10 text-sm"
        >
          <div class="w-8 h-8 rounded bg-gray-100 overflow-hidden">
            <img
              v-if="product.photo_url"
              :src="product.photo_url"
              class="w-full h-full object-cover"
            />
            <i v-else class="fas fa-box text-gray-400 m-auto"></i>
          </div>
          <span class="font-medium text-gray-700 truncate max-w-[150px]">{{
            product?.nom
          }}</span>
          <button
            @click="$emit('clear-product-tag')"
            class="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>
      </transition>

      <!-- Preview Overlay -->
      <transition name="slide-up">
        <div
          v-if="pendingFile"
          class="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-xl border border-gray-100 p-3 z-20"
        >
          <div class="flex flex-col gap-3">
            <div
              class="relative w-full rounded-lg overflow-hidden bg-gray-100 max-h-60 flex items-center justify-center"
            >
              <img
                v-if="pendingFileType === 'image'"
                :src="previewUrl"
                class="max-w-full max-h-60 object-contain"
              />
              <video
                v-else-if="pendingFileType === 'video'"
                :src="previewUrl"
                controls
                class="max-w-full max-h-60"
              ></video>

              <button
                @click="cancelAttachment"
                class="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <input
                :value="newMessage"
                @input="$emit('update:newMessage', $event.target.value)"
                type="text"
                placeholder="Ajouter une légende..."
                @keydown.enter.prevent="sendAttachment"
                class="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              <button
                @click="sendAttachment"
                class="w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center hover:bg-green-800 shadow-sm"
              >
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Attachment Actions (Left side) -->
      <div
        v-if="!isRecording && !pendingFile"
        class="flex items-center gap-1 pb-2"
      >
        <button
          @click="triggerFileInput"
          class="w-9 h-9 rounded-full text-gray-400 hover:text-[var(--color-primary)] hover:bg-green-50 flex items-center justify-center transition-all"
          title="Envoyer une image"
        >
          <i class="far fa-image text-lg"></i>
        </button>
        <button
          @click="triggerVideoInput"
          class="w-9 h-9 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center transition-all"
          title="Envoyer une vidéo"
        >
          <i class="fas fa-video text-lg"></i>
        </button>

        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          class="hidden"
          @change="handleFileSelect"
        />
        <input
          type="file"
          ref="videoInput"
          accept="video/*"
          class="hidden"
          @change="handleVideoSelect"
        />
      </div>

      <!-- Main Input Area -->
      <div
        class="flex-1 bg-gray-100 rounded-[1.5rem] flex items-center min-h-[48px] px-2 transition-colors focus-within:bg-gray-50 focus-within:ring-1 focus-within:ring-gray-300 focus-within:shadow-sm"
      >
        <!-- Text Area -->
        <textarea
          v-if="!isRecording"
          :value="newMessage"
          @input="onInput"
          @keydown.enter.prevent="$emit('send-message')"
          rows="1"
          placeholder="Message..."
          class="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-gray-700 placeholder-gray-400 resize-none max-h-32 overflow-y-auto"
          ref="textAreaRef"
          style="min-height: 48px; box-shadow: none !important"
        ></textarea>

        <!-- Recording Interface -->
        <div v-else class="flex-1 flex items-center gap-3 px-2">
          <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span class="text-sm font-mono text-gray-500 min-w-[45px]">{{
            formatTime(recordingTime)
          }}</span>

          <!-- Sound Wave Visualizer -->
          <div
            class="flex-1 flex items-center gap-1 h-6 justify-center opacity-50"
          >
            <div
              v-for="n in 12"
              :key="n"
              class="w-1 bg-[var(--color-primary)] rounded-full transition-all duration-75"
              :style="{ height: getDynamicWaveHeight(n) }"
            ></div>
          </div>
        </div>

        <!-- Right Actions inside input -->
        <div class="flex items-center pr-1 gap-1">
          <template v-if="isRecording">
            <button
              @click="cancelRecording"
              class="w-8 h-8 rounded-full text-red-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
              title="Annuler"
            >
              <i class="fas fa-trash-alt text-sm"></i>
            </button>
            <button
              @click="stopAndSendRecording"
              class="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white hover:bg-green-800 flex items-center justify-center shadow-md transform hover:scale-105 transition-all"
              title="Envoyer"
            >
              <i class="fas fa-arrow-up"></i>
            </button>
          </template>

          <template v-else>
            <!-- Mic Button (Show only if no text) -->
            <button
              v-if="!newMessage.trim()"
              @click="startVoiceRecording"
              class="w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
              title="Message vocal"
            >
              <i class="fas fa-microphone text-lg"></i>
            </button>

            <!-- Send Button (Show if text exists) -->
            <button
              v-else
              @click="$emit('send-message')"
              class="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white hover:bg-green-800 flex items-center justify-center shadow-md transform hover:scale-105 transition-all"
              title="Envoyer"
            >
              <i class="fas fa-arrow-up"></i>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onUnmounted,
  nextTick,
  watch,
  defineProps,
  defineEmits,
} from "vue";

const props = defineProps({
  newMessage: String,
  isRecording: Boolean,
  product: Object,
});

const emit = defineEmits([
  "update:newMessage",
  "send-message",
  "send-image",
  "send-video",
  "start-recording",
  "stop-recording",
  "emit-typing",
  "clear-product-tag",
  "pause-recording",
  "resume-recording",
]);

// Refs
const recordingTime = ref(0);
const recordingTimer = ref(null);
const isPaused = ref(false);
const textAreaRef = ref(null);
const fileInput = ref(null);
const videoInput = ref(null);

// Preview Refs
const pendingFile = ref(null);
const pendingFileType = ref(null);
const previewUrl = ref("");

// Auto-resize textarea
watch(
  () => props.newMessage,
  () => {
    nextTick(() => {
      if (textAreaRef.value) {
        textAreaRef.value.style.height = "auto"; // Reset
        textAreaRef.value.style.height =
          Math.min(textAreaRef.value.scrollHeight, 128) + "px"; // Limit max height
      }
    });
  },
);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const triggerVideoInput = () => {
  videoInput.value?.click();
};

const handleFileSelect = (event) => {
  const input = event.target;
  if (input.files && input.files[0]) {
    pendingFile.value = input.files[0];
    pendingFileType.value = "image";
    previewUrl.value = URL.createObjectURL(input.files[0]);
    input.value = "";
  }
};

const handleVideoSelect = (event) => {
  const input = event.target;
  if (input.files && input.files[0]) {
    pendingFile.value = input.files[0];
    pendingFileType.value = "video";
    previewUrl.value = URL.createObjectURL(input.files[0]);
    input.value = "";
  }
};

const sendAttachment = () => {
  if (pendingFile.value && pendingFileType.value) {
    if (pendingFileType.value === "image") {
      emit("send-image", pendingFile.value, props.newMessage);
    } else {
      emit("send-video", pendingFile.value, props.newMessage);
    }
    cancelAttachment();
    emit("update:newMessage", ""); // Clear caption after send
  }
};

const cancelAttachment = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  pendingFile.value = null;
  pendingFileType.value = null;
  previewUrl.value = "";
};

// ... existing recording logic ...
const startVoiceRecording = () => {
  emit("start-recording");
  isPaused.value = false;
  recordingTime.value = 0;
  startTimer();
};

const stopAndSendRecording = () => {
  emit("stop-recording");
  stopTimer();
};

const cancelRecording = () => {
  emit("stop-recording");
  stopTimer();
};

const startTimer = () => {
  if (recordingTimer.value) clearInterval(recordingTimer.value);
  recordingTimer.value = window.setInterval(() => {
    recordingTime.value++;
  }, 1000);
};

const stopTimer = () => {
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const onInput = (event) => {
  const target = event.target;
  emit("update:newMessage", target.value);
  emit("emit-typing");
};

const getDynamicWaveHeight = (index) => {
  // Simulate wave animation
  if (props.isRecording) {
    return 4 + Math.random() * 16 + "px";
  }
  return "4px";
};

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
/* No custom CSS needed mostly, using Tailwind */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
