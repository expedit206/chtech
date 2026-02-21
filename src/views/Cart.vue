<template>
  <div
    class="min-h-screen pb-20 pt-10"
    :style="{
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text-main)',
    }"
  >
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Breadcrumbs -->
      <nav
        class="flex mb-8 text-[10px] uppercase tracking-widest font-bold opacity-60"
      >
        <router-link to="/" class="hover:text-primary transition-colors"
          >Accueil</router-link
        >
        <span class="mx-2">/</span>
        <span>Votre Panier</span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Main Content -->
        <div class="lg:w-2/3">
          <header
            class="mb-10 flex items-end justify-between border-b pb-6"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <h1
              class="text-4xl md:text-5xl font-serif font-black tracking-tighter"
            >
              Mon Panier
            </h1>
            <span class="text-sm font-bold opacity-60 uppercase tracking-widest"
              >{{ cart.count }} ARTICLES</span
            >
          </header>

          <template v-if="cart.items.length > 0">
            <div class="space-y-8">
              <div
                v-for="item in cart.items"
                :key="item.id"
                class="group flex flex-col sm:flex-row gap-6 pb-8 border-b last:border-0"
                :style="{ borderColor: 'var(--color-border)' }"
              >
                <!-- Image -->
                <div
                  class="relative w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border group-hover:shadow-md transition-all duration-500"
                  :style="{ borderColor: 'var(--color-border)' }"
                >
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <!-- Info -->
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex justify-between items-start">
                      <div>
                        <p
                          class="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-2"
                        >
                          {{ item.category || "PRODUIT" }}
                        </p>
                        <h3
                          class="text-xl font-bold mb-1 group-hover:text-primary transition-colors"
                        >
                          {{ item.name }}
                        </h3>
                      </div>
                      <button
                        @click="cart.removeFromCart(item.id)"
                        class="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all hover:rotate-90"
                      >
                        <i class="fas fa-times text-xl"></i>
                      </button>
                    </div>
                    <p
                      class="text-sm opacity-60 line-clamp-2 mt-2 leading-relaxed max-w-md"
                    >
                      Article de haute qualité sélectionné pour vous. Profitez
                      de nos meilleures offres sur toute la boutique.
                    </p>
                  </div>

                  <div class="flex items-center justify-between mt-6">
                    <!-- Qty Switcher -->
                    <div
                      class="flex items-center bg-surface border rounded-xl overflow-hidden p-1 shadow-inner"
                      :style="{ borderColor: 'var(--color-border)' }"
                    >
                      <button
                        @click="cart.updateQuantity(item.id, item.quantity - 1)"
                        class="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors font-bold text-lg"
                      >
                        -
                      </button>
                      <span class="w-12 text-center font-black text-sm">{{
                        item.quantity
                      }}</span>
                      <button
                        @click="cart.updateQuantity(item.id, item.quantity + 1)"
                        class="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors font-bold text-lg"
                      >
                        +
                      </button>
                    </div>

                    <!-- Price -->
                    <div class="text-right">
                      <p
                        class="text-[10px] uppercase font-bold opacity-40 mb-1"
                      >
                        Total Article
                      </p>
                      <p
                        class="text-2xl font-serif font-black tracking-tight"
                        :style="{ color: 'var(--color-primary)' }"
                      >
                        {{ (parseInt(item.price) *  parseInt(item.quantity)).toLocaleString() }}
                        <span class="text-xs">FCFA</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-12 flex flex-col sm:flex-row gap-4">
              <router-link
                to="/"
                class="px-8 py-4 bg-surface border-2 rounded-2xl font-bold text-sm hover:bg-black hover:text-white hover:border-black transition-all text-center flex items-center justify-center gap-2"
                :style="{ borderColor: 'var(--color-border)' }"
              >
                <i class="fas fa-arrow-left text-[10px]"></i> CONTINUER MON
                SHOPPING
              </router-link>
              <button
                @click="cart.clearCart()"
                class="px-8 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all text-center uppercase tracking-widest"
              >
                Vider le panier
              </button>
            </div>
          </template>

          <div
            v-else
            class="py-20 text-center space-y-8 border-2 border-dashed rounded-3xl"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <div
              class="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto shadow-sm"
            >
              <i class="fas fa-shopping-bag text-4xl opacity-20"></i>
            </div>
            <div>
              <h2 class="text-3xl font-serif font-bold mb-4">
                Votre panier est vide
              </h2>
              <p class="opacity-60 max-w-sm mx-auto leading-relaxed">
                Il est temps de le remplir ! Explorez nos catégories pour
                dénicher les pépites qui vous manquent.
              </p>
            </div>
            <router-link
              to="/"
              class="inline-block px-10 py-5 bg-primary text-white rounded-2xl font-black text-sm tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/20"
            >
              DÉCOUVRIR NOS PRODUITS
            </router-link>
          </div>
        </div>

        <!-- Sidebar Summary -->
        <div class="lg:w-1/3">
          <div
            class="sticky top-32 p-8 rounded-3xl bg-surface border shadow-sm space-y-8"
            :style="{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }"
          >
            <h3
              class="text-2xl font-serif font-black border-b pb-4"
              :style="{ borderColor: 'var(--color-border)' }"
            >
              Récapitulatif
            </h3>

            <div class="space-y-4">
              <div
                class="flex justify-between font-bold text-sm uppercase tracking-tight"
              >
                <span class="opacity-60">Articles ({{ cart.count }})</span>
                <span>{{ cart.total.toLocaleString() }} FCFA</span>
              </div>
              <div
                class="flex justify-between font-bold text-sm uppercase tracking-tight"
              >
                <span class="opacity-60">Livraison</span>
                <span v-if="cart.count > 0" class="text-green-500"
                  >Estimée à 2,500 FCFA</span
                >
                <span v-else>0 FCFA</span>
              </div>
              <div
                class="pt-4 border-t flex flex-col gap-1"
                :style="{ borderColor: 'var(--color-border)' }"
              >
                <p class="text-[10px] font-black uppercase opacity-40">
                  Bon de réduction
                </p>
                <div class="flex gap-2">
                  <input
                    type="text"
                    placeholder="CODE123"
                    class="flex-1 bg-bg border rounded-xl px-4 py-2 text-sm font-bold uppercase"
                    :style="{ borderColor: 'var(--color-border)' }"
                  />
                  <button
                    class="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>

            <div
              class="pt-6 border-t flex justify-between items-end"
              :style="{ borderColor: 'var(--color-border)' }"
            >
              <div>
                <p class="text-[10px] font-black uppercase opacity-40 mb-1">
                  Total Net
                </p>
                <p
                  class="text-3xl font-serif font-black text-primary leading-none"
                >
                  {{
                    (cart.total + (cart.count > 0 ? 2500 : 0)).toLocaleString()
                  }}
                  <span class="text-sm">FCFA</span>
                </p>
              </div>
            </div>

            <button
              :disabled="cart.count === 0"
              class="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm items-center justify-center gap-3 hover:opacity-90 transition-all flex shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              @click="proceedToCheckout"
            >
              PASSER À LA CAISSE <i class="fas fa-arrow-right text-[10px]"></i>
            </button>

            <!-- Payment Methods -->
            <div
              class="flex items-center justify-center gap-4 opacity-30 grayscale pt-2"
            >
              <i class="fab fa-cc-visa text-2xl"></i>
              <i class="fab fa-cc-mastercard text-2xl"></i>
              <i class="fab fa-apple-pay text-2xl"></i>
              <i class="fab fa-google-pay text-2xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from "../stores/cart.js";
const cart = useCartStore();

const proceedToCheckout = () => {
  // Logic for checkout (e.g. redirect to payment page)
  alert("Initialisation du paiement...");
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.text-primary {
  color: var(--color-primary);
}
.bg-primary {
  background-color: var(--color-primary);
}
.bg-surface {
  background-color: var(--color-surface);
}
.bg-bg {
  background-color: var(--color-bg);
}
</style>
