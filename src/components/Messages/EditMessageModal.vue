<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-[var(--color-surface)] rounded-2xl shadow-2xl max-w-md w-full border border-[var(--color-border)] animate-in fade-in zoom-in-90 duration-200"
        >
          <!-- Header -->
          <div
            class="px-6 py-4 border-b flex items-center justify-between"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <h2
              class="text-lg font-black"
              :style="{ color: 'var(--color-text-main)' }"
            >
              Modifier le message
            </h2>
            <button
              @click="closeModal"
              class="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
              :style="{ color: 'var(--color-text-sub)' }"
            >
              <i class="fas fa-xmark text-lg"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-4">
            <textarea
              ref="textareaRef"
              v-model="editedContent"
              @keydown.enter.ctrl="submit"
              @keydown.escape="closeModal"
              class="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 font-medium text-sm"
              :style="{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-main)',
                '--tw-ring-color': 'var(--color-primary)',
              }"
              rows="5"
            />
     
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t flex justify-end gap-3"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <button
              @click="closeModal"
              class="px-4 py-2 rounded-lg font-medium text-sm transition-colors hover:bg-black/5"
              :style="{ color: 'var(--color-text-sub)' }"
            >
              Annuler
            </button>
            <button
              @click="submit"
              class="px-4 py-2 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
              :style="{
                backgroundColor: 'var(--color-primary)',
              }"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  initialContent: String,
});

const emit = defineEmits(['submit', 'close']);

const editedContent = ref('');
const textareaRef = ref(null);

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      editedContent.value = props.initialContent || '';
      nextTick(() => {
        textareaRef.value?.focus();
        textareaRef.value?.select();
      });
    }
  },
);

const submit = () => {
  if (editedContent.value.trim() !== props.initialContent) {
    emit('submit', editedContent.value.trim());
  }
  closeModal();
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
