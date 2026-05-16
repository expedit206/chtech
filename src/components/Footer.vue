<script setup lang="ts">
// import { CONFIG } from "../config/index.js";
import { CONFIG } from "../config/index.js";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Smartphone,
  QrCode,
  ShieldCheck,
  Lock,
} from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>

<template>
  <footer
    class="mt-10 border-t"
    :style="{
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
      color: 'var(--color-text-main)',
    }"
  >
    <div
      class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-16"
    >
      <!-- LOGO + DESCRIPTION -->
      <div class="space-y-6">
        <router-link :to="{ name: 'Home' }" class="inline-block">
          <img
            :src="CONFIG.LOGO_URL"
            alt="SASAYEE Logo"
            class="h-16 md:h-20 w-auto object-contain"
          />
        </router-link>

        <p
          class="text-sm leading-7 max-w-sm"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          La marketplace moderne au Cameroun pour acheter et vendre en toute
          confiance.
        </p>

        <div class="flex items-center gap-4">
          <a href="#" class="hover:opacity-70 transition-opacity">
            <Facebook :stroke-width="2" :size="18" />
          </a>

          <a href="#" class="hover:opacity-70 transition-opacity">
            <Twitter :stroke-width="2" :size="18" />
          </a>

          <a href="#" class="hover:opacity-70 transition-opacity">
            <Instagram :stroke-width="2" :size="18" />
          </a>

          <a href="#" class="hover:opacity-70 transition-opacity">
            <Linkedin :stroke-width="2" :size="18" />
          </a>
        </div>
      </div>

      <!-- NAVIGATION -->
      <div class="space-y-6">
        <h4 class="font-semibold text-sm uppercase tracking-wider">Acheter</h4>

        <ul
          class="space-y-3 text-sm"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          <li>
            <RouterLink
              :to="{ name: 'Blogs' }"
              class="hover:text-[var(--color-primary)] transition-colors"
            >
Blog            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'Support' }"
              class="hover:text-[var(--color-primary)] transition-colors"
            >
              Aide & SAV
            </RouterLink>
          </li>

          <li>
            <RouterLink
              :to="{ name: 'become-vendeur' }"
              class="hover:text-[var(--color-primary)] transition-colors"
            >
              Devenir vendeur
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="#"
              class="hover:text-[var(--color-primary)] transition-colors"
            >
              Livraison
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="#"
              class="hover:text-[var(--color-primary)] transition-colors"
            >
              Promotions
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- PAIEMENT -->
      <div class="space-y-6">
        <h4 class="font-semibold text-sm uppercase tracking-wider">
          Paiement sécurisé
        </h4>

        <div class="flex items-center gap-3 flex-wrap">
          <!-- Orange -->
          <div class="flex flex-col items-center gap-1">
            <div class="p-2 rounded-xl bg-[#ff6600]/10 text-[#ff6600]">
              <Smartphone :stroke-width="2" :size="20" />
            </div>
            <span class="text-[10px] font-medium">Orange</span>
          </div>

          <!-- MTN -->
          <div class="flex flex-col items-center gap-1">
            <div class="p-2 rounded-xl bg-[#ffcc00]/20 text-[#004F9F]">
              <Smartphone :stroke-width="2" :size="20" />
            </div>
            <span class="text-[10px] font-medium">MTN</span>
          </div>

          <!-- Code -->
          <div class="flex flex-col items-center gap-1">
            <div
              class="p-2 rounded-xl"
              :style="{
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text-sub)',
              }"
            >
              <QrCode :stroke-width="2" :size="20" />
            </div>

            <span class="text-[10px] font-medium"> Code Marchand </span>
          </div>
        </div>

        <!-- BOX -->
        <div
          class="p-4 rounded-2xl border"
          :style="{
            backgroundColor: 'rgba(99,102,241,0.05)',
            borderColor: 'rgba(99,102,241,0.10)',
          }"
        >
          <div class="flex items-start gap-3">
            <ShieldCheck
              :size="18"
              class="mt-0.5 text-[var(--color-primary)]"
            />

            <p
              class="text-xs leading-6"
              :style="{ color: 'var(--color-text-sub)' }"
            >
              Mobile Money et paiement par code pour des transactions rapides,
              sécurisées et accessibles sans carte bancaire.
            </p>
          </div>
        </div>

        <p
          class="text-[11px] italic flex items-center gap-2"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          <Lock :size="12" />
          SSL 256 bits — Transactions sécurisées.
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
        class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-widest opacity-60"
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
  </footer>
</template>
