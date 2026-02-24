<template>
  <div class="p-6 space-y-6 animate-fade-in">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text-main)]">Mes Favoris</h1>
        <p class="text-[var(--color-text-sub)]">Retrouvez les articles que vous avez aimés.</p>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl font-bold text-sm hover:bg-[var(--color-primary)]/20 transition-all">
        <!-- <i class="fa-solid fa-cart-plus"></i> -->
        <ShoppingCart class="text-lg" :stroke-width="3" />  
         Tout ajouter au panier
      </button>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="product in favorites" 
        :key="product.id"
        class="group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-4 transition-all hover:shadow-xl hover:-translate-y-1"
      >
        <div 
          v-if="product.onSale" 
          class="absolute top-4 left-4 z-10 bg-[var(--color-accent)] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse"
        >
          Promo
        </div>

        <button class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-[var(--color-border)] text-[var(--color-text-sub)] rounded-full hover:text-red-500 hover:bg-white transition-all">
          <!-- <i class="fa-solid fa-heart-crack"></i> -->
          <Heart class="text-lg" :stroke-width="3" />
        </button>

        <div class="aspect-square bg-white rounded-2xl mb-4 p-4 flex items-center justify-center border border-[var(--color-border)]/50">
          <img :src="product.image" :alt="product.name" class="max-h-full object-contain group-hover:scale-110 transition-transform duration-500">
        </div>

        <div class="">
      
          <h4 class="font-bold text-[var(--color-text-main)] leading-tight line-clamp-1 max-h-[2rem]">
            {{ product.name }}
          </h4>
          
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-black text-[var(--color-text-main)]">{{ product.price }} €</span>
            <span v-if="product.oldPrice" class="text-sm text-[var(--color-text-sub)] line-through">{{ product.oldPrice }} €</span>
          </div>
        </div>

        <button class="w-full mt-4 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all">
          <i class="fa-solid fa-bag-shopping"></i>
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ShoppingCart, Heart } from "lucide-vue-next"
const favorites = ref([
  {
    id: 1,
    name: 'Logitech G Pro X Superlight 2',
    price: '159.00',
    oldPrice: '179.00',
    onSale: true,
    image: 'https://cdn-icons-png.flaticon.com/512/3233/3233512.png'
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5 Noise Canceling',
    price: '349.00',
    onSale: false,
    image: 'https://cdn-icons-png.flaticon.com/512/27/27753.png'
  },
  {
    id: 3,
    name: 'PlayStation 5 Console Slim Edition',
    price: '449.00',
    oldPrice: '549.00',
    onSale: true,
    image: 'https://cdn-icons-png.flaticon.com/512/588/588298.png'
  }
]);
</script>
