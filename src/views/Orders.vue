<template>
  <div class="p-6 space-y-6 animate-fade-in">
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text-main)]">
          Mes Commandes
        </h1>
        <p class="text-[var(--color-text-sub)]">
          Suivez et gérez vos achats récents.
        </p>
      </div>
      <select
        class="bg-[var(--color-surface)] border border-[var(--color-border)] text-sm rounded-xl p-2 text-[var(--color-text-main)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
      >
        <option>3 derniers mois</option>
        <option>Année 2025</option>
        <option>Toutes les commandes</option>
      </select>
    </header>

    <!-- Skeleton -->
    <div v-if="isLoading" class="space-y-4">
      <SkeletonOrderRow v-for="i in 3" :key="i" />
    </div>

    <!-- Real orders -->
    <div v-else-if="orders.length > 0" class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden hover:shadow-md transition-shadow"
      >
        <div
          class="px-6 py-3 flex flex-wrap justify-between items-center gap-4 border-b"
          :style="{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }"
        >
          <div
            class="flex gap-6 text-xs font-medium text-[var(--color-text-sub)]"
          >
            <p>
              COMMANDE PASSÉE LE
              <span class="block text-[var(--color-text-main)] mt-1">{{
                order.date
              }}</span>
            </p>
            <p>
              TOTAL
              <span class="block text-[var(--color-text-main)] mt-1">{{
                order.total
              }}</span>
            </p>
            <p>
              N° DE COMMANDE
              <span class="block text-[var(--color-text-main)] mt-1"
                >#{{ order.id }}</span
              >
            </p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
              getStatusClass(order.status),
            ]"
          >
            {{ order.status }}
          </span>
        </div>

        <div
          class="p-6 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div class="flex items-center gap-6 w-full">
            <div
              class="w-24 h-24 rounded-2xl border p-2 flex items-center justify-center shrink-0 overflow-hidden"
              :style="{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
              }"
            >
              <img
                :src="order.productImage"
                :alt="order.productName"
                class="max-h-full object-contain"
              />
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-[var(--color-text-main)] text-lg">
                {{ order.productName }}
              </h4>
              <p class="text-sm text-[var(--color-text-sub)] line-clamp-1">
                {{ order.description }}
              </p>
              <div class="flex items-center gap-4 mt-2">
                <button
                  class="text-[var(--color-primary)] text-sm font-bold hover:underline"
                >
                  <i class="fa-solid fa-file-invoice mr-2"></i>Facture
                </button>
                <button
                  class="text-[var(--color-text-sub)] text-sm font-bold hover:underline"
                >
                  <i class="fa-solid fa-truck-fast mr-2"></i>Suivi
                </button>
              </div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              class="px-6 py-3 rounded-xl border border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)]/5 transition-all whitespace-nowrap"
            >
              Détails
            </button>
            <button
              class="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all whitespace-nowrap"
            >
              <i class="fa-solid fa-rotate-left mr-2"></i>Recommander
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="py-20 text-center border-2 border-dashed rounded-3xl space-y-6"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <div
        class="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
        :style="{ backgroundColor: 'var(--color-surface)' }"
      >
        <i
          class="fas fa-box-open text-4xl opacity-20"
          :style="{ color: 'var(--color-text-sub)' }"
        ></i>
      </div>
      <div>
        <h2
          class="text-2xl font-bold mb-2"
          :style="{ color: 'var(--color-text-main)' }"
        >
          Aucune commande trouvée
        </h2>
        <p
          class="opacity-60 max-w-sm mx-auto"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          Vos achats apparaîtront ici dès que vous aurez passé une commande.
        </p>
      </div>
      <router-link
        :to="{ name: 'Home' }"
        class="inline-block px-8 py-4 rounded-2xl font-bold text-white text-sm"
        :style="{ backgroundColor: 'var(--color-primary)' }"
      >
        Commencer à acheter
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { CONFIG } from '../config/index.js';

import { ref, onMounted } from "vue";
import SkeletonOrderRow from "../components/skeletons/SkeletonOrderRow.vue";
import apiClient from "../api/index.js";
import { useSeo } from "../composables/useSeo.js";

const isLoading = ref(true);
const orders = ref([]);

useSeo({
  title: "Mes Commandes - SASAYEE",
  description: "Consultez l'historique et l'état de vos commandes passées sur SASAYEE."
});

onMounted(async () => {
  try {
    const res = await apiClient.get("/orders");
    orders.value = (res.data.data || res.data || []).map((o) => ({
      id: o.id || o.reference,
      date: new Date(o.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      total: `${Number(o.total || 0).toLocaleString("fr-FR")} FCFA`,
      status: o.status || o.statut || "En cours",
      productName: o.product?.nom || o.items?.[0]?.name || "Produit",
      description: o.product?.description || o.items?.[0]?.description || "",
      productImage: o.product?.photos?.[0]
        ? `${CONFIG.STORAGE_URL}${o.product.photos[0]}`
        : "https://cdn-icons-png.flaticon.com/512/644/644458.png",
    }));
  } catch (err) {
    console.error("Erreur chargement commandes:", err);
    // Fallback
    orders.value = [
      {
        id: "CH-9824",
        date: "14 Janvier 2026",
        total: "1 299 000 FCFA",
        status: "Livré",
        productName: "iPhone 15 Pro Max",
        description: "Titane Naturel, 256GB - État : Neuf",
        productImage: "https://cdn-icons-png.flaticon.com/512/644/644458.png",
      },
      {
        id: "CH-8712",
        date: "28 Décembre 2025",
        total: "89 000 FCFA",
        status: "En cours",
        productName: "Clavier Mécanique RGB",
        description: "Switchs Red, Layout FR - Sans fil",
        productImage: "https://cdn-icons-png.flaticon.com/512/802/802271.png",
      },
    ];
  } finally {
    isLoading.value = false;
  }
});

const getStatusClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("livr")) return "bg-green-500/20 text-green-500";
  if (s.includes("cours") || s.includes("prép"))
    return "bg-blue-500/20 text-blue-500";
  if (s.includes("annul")) return "bg-red-500/20 text-red-500";
  return "bg-[var(--color-border)] text-[var(--color-text-sub)]";
};
</script>
