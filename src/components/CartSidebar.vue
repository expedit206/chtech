<template>
  <Transition name="fade">
    <div
      v-if="cart.isSidebarOpen"
      class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
      @click="cart.isSidebarOpen = false"
    ></div>
  </Transition>

  <Transition name="slide">
    <div
      v-if="cart.isSidebarOpen"
      class="fixed right-0 top-0 h-full w-full max-w-md z-[70] bg-white shadow-2xl flex flex-col"
      :style="{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-main)',
      }"
    >
      <!-- Header -->
      <div
        class="px-6 py-4 border-b flex items-center justify-between"
        :style="{ borderColor: 'var(--color-border)' }"
      >
        <div class="flex items-center gap-3">
          <i
            class="fas fa-shopping-cart text-xl"
            :style="{ color: 'var(--color-primary)' }"
          ></i>
          <h2 class="text-xl font-bold font-serif">
            Mon Panier ({{ cart.count }})
          </h2>
        </div>
        <button
          @click="cart.isSidebarOpen = false"
          class="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <template v-if="cart.items.length > 0">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="flex gap-4 group"
          >
            <div
              class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border"
              :style="{ borderColor: 'var(--color-border)' }"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start mb-1">
                <h3 class="text-sm font-bold truncate pr-4">{{ item.name }}</h3>
                <button
                  @click="cart.removeFromCart(item.id)"
                  class="text-red-500 hover:text-red-600 transition-colors"
                >
                  <i class="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
              <p
                class="text-xs mb-2 uppercase tracking-tighter"
                :style="{ color: 'var(--color-text-sub)' }"
              >
                {{ item.category || "PRODUIT" }}
              </p>
              <div class="flex items-center justify-between">
                <div
                  class="flex items-center border rounded-lg"
                  :style="{ borderColor: 'var(--color-border)' }"
                >
                  <button
                    @click="cart.updateQuantity(item.id, item.quantity - 1)"
                    class="px-2 py-1 hover:bg-black/5"
                  >
                    -
                  </button>
                  <span class="px-3 text-xs font-bold">{{
                    item.quantity
                  }}</span>
                  <button
                    @click="cart.updateQuantity(item.id, item.quantity + 1)"
                    class="px-2 py-1 hover:bg-black/5"
                  >
                    +
                  </button>
                </div>
                <span
                  class="font-bold text-sm"
                  :style="{ color: 'var(--color-primary)' }"
                >
                  {{
                    (parseFloat(item.price) * item.quantity).toLocaleString()
                  }}
                  FCFA
                </span>
              </div>
            </div>
          </div>
        </template>

        <div
          v-else
          class="h-full flex flex-col items-center justify-center text-center space-y-4"
        >
          <div
            class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2"
          >
            <i class="fas fa-shopping-basket text-3xl text-gray-300"></i>
          </div>
          <h3 class="text-lg font-bold">Votre panier est vide</h3>
          <p class="text-sm px-10" :style="{ color: 'var(--color-text-sub)' }">
            Découvrez nos articles et commencez votre shopping !
          </p>
          <button
            @click="cart.isSidebarOpen = false"
            class="px-6 py-2 bg-black text-white rounded-full font-bold text-sm hover:scale-105 transition-transform"
          >
            Continuer mes achats
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div
        v-if="cart.items.length > 0"
        class="p-6 border-t space-y-4"
        :style="{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-bg)',
        }"
      >
        <div class="flex justify-between items-center text-lg font-bold">
          <span>Sous-total</span>
          <span :style="{ color: 'var(--color-primary)' }"
            >{{ cart.total.toLocaleString() }} FCFA</span
          >
        </div>
        <p
          class="text-[10px] text-center uppercase tracking-widest"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          Livraison calculée à l'étape suivante
        </p>
        <div class="grid grid-cols-2 gap-3">
          <router-link
            to="/cart"
            @click="cart.isSidebarOpen = false"
            class="py-3 text-center border-2 border-black rounded-xl font-bold text-sm hover:bg-black hover:text-white transition-all"
          >
            VOIR PANIER
          </router-link>
          <button
            class="py-3 bg-black text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
            :style="{ backgroundColor: 'var(--color-primary)' }"
          >
            PAYER <i class="fas fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCartStore } from "../stores/cart.js";
const cart = useCartStore();
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

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
