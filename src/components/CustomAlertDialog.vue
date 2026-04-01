<template>
  <Transition name="fade">
    <div
      v-if="alertStore.isVisible"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="alertStore.close"
    >
      <Transition name="zoom">
        <div
          class="w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border"
          :style="{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }"
        >
          <!-- Decorative Top Bar based on TYPE -->
          <div :class="typeStyles[alertStore.type].bar" class="h-2"></div>

          <div class="p-8 text-center">
            <!-- Icon -->
            <div
              class="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl shadow-lg transition-transform hover:scale-110"
              :class="typeStyles[alertStore.type].iconBg"
            >
              <i :class="typeStyles[alertStore.type].icon"></i>
            </div>

            <!-- Title & Message -->
            <h3 class="text-2xl font-serif font-black tracking-tight mb-2">
              {{ alertStore.title }}
            </h3>
            <p class="text-sm leading-relaxed opacity-70 mb-8 whitespace-pre-wrap">
              {{ alertStore.message }}
            </p>

            <!-- Actions -->
            <div class="flex flex-col gap-3">
              <button
                @click="alertStore.confirm"
                class="w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all active:scale-95 shadow-xl shadow-primary/20"
                :style="{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-pure)',
                }"
              >
                {{ alertStore.confirmText.toUpperCase() }}
              </button>
              
              <button
                v-if="alertStore.showCancel"
                @click="alertStore.cancel"
                class="w-full py-4 rounded-2xl font-bold text-sm tracking-widest opacity-60 hover:opacity-100 transition-opacity"
              >
                {{ alertStore.cancelText.toUpperCase() }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { useAlertStore } from "../stores/alert";

const alertStore = useAlertStore();

const typeStyles = {
  success: {
    bar: "bg-green-500",
    iconBg: "bg-green-100 text-green-600",
    icon: "fas fa-check-circle",
  },
  error: {
    bar: "bg-red-500",
    iconBg: "bg-red-100 text-red-600",
    icon: "fas fa-exclamation-triangle",
  },
  warning: {
    bar: "bg-yellow-500",
    iconBg: "bg-yellow-100 text-yellow-600",
    icon: "fas fa-exclamation-circle",
  },
  info: {
    bar: "bg-indigo-500",
    iconBg: "bg-indigo-100 text-indigo-600",
    icon: "fas fa-info-circle",
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
