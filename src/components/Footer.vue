<script setup lang="ts">
import { CONFIG } from "../config/index.js";
import FooterActions from "./FooterActions.vue";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-vue-next";
import { RouterLink } from "vue-router";
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
      class="max-w-7xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-12"
    >
      <div class="col-span-2 md:col-span-1">
        <div class="mb-6">
          <img
            :src="CONFIG.LOGO_URL"
            alt="SASAYEE Logo"
            class="h-16 md:h-20 w-auto object-contain"
          />
        </div>
        <p class="text-sm leading-relaxed opacity-70 mb-6">
          La marketplace de référence au Cameroun pour acheter et vendre en
          toute confiance. Découvrez une sélection de produits de qualité, des
          offres exclusives et un service client dédié pour une expérience
          e-commerce inégalée.
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
            <RouterLink
              :to="{ name: 'Support' }"
              class="hover:text-[var(--color-primary)]"
              >Aide & SAV</RouterLink
            >
          </li>
          <li>
            <RouterLink
              :to="{ name: 'become-vendeur' }"
              class="hover:text-[var(--color-primary)]"
              >Devenir vendeur
            </RouterLink>
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
        <p>© {{ new Date().getFullYear() }} SASAYEE. TOUS DROITS RÉSERVÉS.</p>
        <div class="flex gap-6">
          <RouterLink :to="{ name: 'mentions_legales' }"
            >Mentions Légales</RouterLink
          >
          <RouterLink :to="{ name: 'conditions_generales_d_utilisation' }"
            >Conditions Générales d'Utilisation
          </RouterLink>
          <RouterLink :to="{ name: 'politique_de_confidentialite' }"
            >Confidentialité</RouterLink
          >
        </div>
      </div>
    </div>
    <FooterActions />
  </footer>
</template>
