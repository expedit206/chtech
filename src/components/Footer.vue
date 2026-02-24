<script setup lang="ts">
import FooterActions from "./FooterActions.vue";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-vue-next";
</script>

<template>
  <footer
    class="mt-20 border-t"
    :style="{
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
      color: 'var(--color-text-main)',
    }"
  >
    <div
      class="max-w-7xl mx-auto px-4 py-12 border-b"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 class="text-xl font-bold">Rejoignez la révolution</h3>
          <p class="text-sm opacity-70">
            Recevez les meilleures offres et les nouveaux projets chaque
            semaine.
          </p>
        </div>
        <div class="flex w-full md:w-auto gap-2">
          <input
            type="email"
            placeholder="votre@email.com"
            class="px-4 py-2 rounded-lg flex-1 md:w-64 outline-none border"
            :style="{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)',
            }"
          />
          <button
            class="px-6 py-2 rounded-lg font-bold transition-transform active:scale-95"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }"
          >
            S'inscrire
          </button>
        </div>
      </div>
    </div>

    <div
      class="max-w-7xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-12"
    >
      <div class="col-span-2 md:col-span-1">
        <h2
          class="text-2xl font-black tracking-tighter mb-4"
          :style="{ color: 'var(--color-primary)' }"
        >
          chtech
        </h2>
        <p class="text-sm leading-relaxed opacity-70 mb-6">
          La première marketplace dédiée aux solutions technologiques
          révolutionnaires. Achetez, vendez et innovez.
        </p>
        <div class="flex gap-4">
          <a href="#" class="hover:opacity-70 transition-opacity">
            <!-- <i class="fab fa-facebook-f"></i
          > -->
            <Facebook :stroke-width="3" />
          </a>
          <a href="#" class="hover:opacity-70 transition-opacity">
            <Twitter :stroke-width="3" />
          </a>
          <a href="#" class="hover:opacity-70 transition-opacity">
            <Instagram :stroke-width="3" />
          </a>
          <a href="#" class="hover:opacity-70 transition-opacity">
    
            <!-- <i class="fab fa-linkedin-in"></i
          > -->
          <Linkedin :stroke-width="3" />
        </a>
        </div>
      </div>

      <div>
        <h4 class="font-bold mb-6">Acheter</h4>
        <ul class="space-y-4 text-sm opacity-70">
          <li>
            <a href="#" class="hover:text-[var(--color-primary)]"
              >Toutes les catégories</a
            >
          </li>
          <li>
            <a href="#" class="hover:text-[var(--color-primary)]">Promotions</a>
          </li>
          <li>
            <a href="#" class="hover:text-[var(--color-primary)]"
              >Suivi de commande</a
            >
          </li>
          <li>
            <a href="#" class="hover:text-[var(--color-primary)]">Aide & SAV</a>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-6">Vendre</h4>
        <ul class="space-y-4 text-sm opacity-70">
          <li>
            <a href="#" class="hover:text-[var(--color-primary)]"
              >Devenir vendeur</a
            >
          </li>
          <li>
            <a href="#" class="hover:text-[var(--color-primary)]"
              >Règles de la marketplace</a
            >
          </li>
          <li>
            <a href="#" class="hover:text-[var(--color-primary)]">Espace Pro</a>
          </li>
          <li>
            <a href="#" class="hover:text-[var(--color-primary)]"
              >Affiliation</a
            >
          </li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-6">Paiement sécurisé</h4>
        <div class="flex flex-wrap gap-3 mb-6 items-center">
          <i class="fab fa-cc-visa text-3xl"></i>
          <i class="fab fa-cc-mastercard text-3xl"></i>
          <i class="fab fa-cc-paypal text-3xl"></i>

          <div
            class="w-8 h-8 rounded-md flex items-center justify-center p-1 shadow-sm transition-transform hover:scale-110"
            style="background-color: #ffcc00"
            title="MTN Mobile Money"
          >
            <svg viewBox="0 0 100 100" class="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="#004F9F"
                stroke-width="4"
              />
              <text
                x="50"
                y="65"
                font-family="Arial, sans-serif"
                font-weight="bold"
                font-size="40"
                fill="#004F9F"
                text-anchor="middle"
              >
                MTN
              </text>
            </svg>
          </div>

          <div
            class="w-8 h-8 rounded-md flex items-center justify-center p-1 shadow-sm transition-transform hover:scale-110"
            style="background-color: #ff6600"
            title="Orange Money"
          >
            <svg viewBox="0 0 24 24" class="w-full h-full" fill="white">
              <path d="M3 3h18v18H3V3zm13 13h3v3h-3v-3z" />
            </svg>
          </div>

          <i class="fab fa-cc-apple-pay text-3xl"></i>
        </div>

        <p class="text-xs opacity-60 italic">
          Transactions sécurisées par cryptage SSL de bout en bout.
        </p>
      </div>
    </div>

    <div
      class="py-6 border-t"
      :style="{
        borderColor: 'var(--color-border)',
        backgroundColor: 'rgba(0,0,0,0.02)',
      }"
    >
      <div
        class="max-w-7xl mx-auto px-4 flex flex-col md:row justify-between items-center gap-4 text-[10px] uppercase tracking-widest opacity-60"
      >
        <p>© 2026 CHTECH. TOUS DROITS RÉSERVÉS.</p>
        <div class="flex gap-6">
          <a href="#">Mentions Légales</a>
          <a href="#">CGV</a>
          <a href="#">Confidentialité</a>
        </div>
      </div>
    </div>
    <FooterActions />
  </footer>
</template>
