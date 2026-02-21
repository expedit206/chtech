<template>
  <div class="min-h-screen bg-gray-50 pb-12 pt-6">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-serif font-bold mb-6">Mon Panier</h1>

      <div v-if="cart.items.length > 0" class="flex flex-col lg:flex-row gap-6">
        <!-- Liste des produits -->
        <div class="lg:w-2/3 space-y-4">
          <div v-for="item in cart.items" :key="item.id" class="bg-white p-4 shadow-sm border border-gray-100 rounded-xl">
            <div class="flex gap-4">
              <!-- Image -->
              <div class="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
              </div>
              <!-- Infos -->
              <div class="flex-grow min-w-0">
                <p class="text-[10px] text-gray-400 uppercase font-bold mb-1">{{ item.category || 'Produit' }}</p>
                <h3 class="text-base font-bold mb-2 truncate">{{ item.name }}</h3>
                <p class="text-yellow-600 font-bold text-base">{{ item.price.toLocaleString() }} FCFA</p>
                <div class="flex items-center mt-3">
                  <button @click="updateQuantity(item.id, item.quantity - 1)" class="p-2 bg-gray-100 rounded hover:bg-gray-200">-</button>
                  <span class="w-8 text-center font-bold text-sm">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, item.quantity + 1)" class="p-2 bg-gray-100 rounded hover:bg-gray-200">+</button>
                  <button @click="removeFromCart(item.id)" class="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-600">Supprimer</button>
                </div>
              </div>
              <!-- Total desktop -->
              <div class="hidden md:flex items-center w-32 justify-end">
                <span class="font-serif font-bold text-lg">
                  {{ (item.price * item.quantity).toLocaleString() }} <span class="text-xs">FCFA</span>
                </span>
              </div>
            </div>
            <!-- Total mobile -->
            <div class="flex justify-end mt-3 pt-3 border-t border-gray-100 md:hidden">
              <span class="font-serif font-bold text-base">
                Total: {{ (item.price * item.quantity).toLocaleString() }} <span class="text-xs">FCFA</span>
              </span>
            </div>
          </div>
          <router-link to="/" class="inline-flex items-center space-x-2 text-gray-500 hover:text-yellow-600 transition-colors font-bold uppercase text-xs mt-4">
            <span>Continuer mes achats</span>
          </router-link>
        </div>

        <!-- Résumé -->
        <div class="lg:w-1/3">
          <div class="bg-black text-white p-6 sticky top-20 rounded-xl">
            <h3 class="text-lg font-serif font-bold mb-6 pb-3 border-b border-white/10">Récapitulatif</h3>
            <div class="space-y-4 mb-6 text-base">
              <div class="flex justify-between text-gray-400">
                <span>Sous-total</span>
                <span>{{ cart.total.toLocaleString() }} FCFA</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>Livraison</span>
                <span>{{ shipping.toLocaleString() }} FCFA</span>
              </div>
              <div class="flex justify-between text-gray-400 italic text-sm">
                <span>Taxes</span>
                <span>Incluses</span>
              </div>
            </div>
            <div class="flex justify-between text-xl font-bold mb-8 pt-3 border-t border-white/10">
              <span class="text-yellow-400">TOTAL</span>
              <span class="text-yellow-600">{{ (cart.total + shipping).toLocaleString() }} FCFA</span>
            </div>
            <button class="w-full py-3 bg-yellow-600 text-white text-base font-bold uppercase tracking-widest hover:bg-yellow-700 transition-all rounded-lg">
              Commander
            </button>
            <div class="mt-8 flex items-center justify-center space-x-4 opacity-50 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" class="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" class="h-4" />
            </div>
          </div>
        </div>
      </div>

      <!-- Panier vide -->
      <div v-else class="bg-white py-12 text-center border border-gray-100 shadow-sm rounded-xl">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-200 mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8 mx-auto">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 001-1.3L17 13M7 13V6h13" />
          </svg>
        </div>
        <h2 class="text-2xl font-serif font-bold mb-2">Votre panier est vide</h2>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto text-base">Il semble que vous n'ayez pas encore trouvé votre coup de cœur. Explorez notre collection pour y remédier !</p>
        <router-link to="/" class="inline-block px-8 py-4 bg-yellow-600 text-white text-base font-bold uppercase tracking-widest hover:bg-yellow-700 transition-all rounded-lg">
          Découvrir nos produits
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart.js';
const cart = useCartStore();
const shipping = 2500;

function updateQuantity(id, qty) {
  if (qty < 1) return;
  cart.updateQuantity(id, qty);
}
function removeFromCart(id) {
  cart.removeFromCart(id);
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
