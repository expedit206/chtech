<template>
  <div class="p-6 space-y-8 animate-fade-in pb-20">
    <header class="text-center max-w-2xl mx-auto space-y-4">
      <h1 class="text-3xl font-extrabold text-[var(--color-text-main)]">
        Comment pouvons-nous vous aider ?
      </h1>
      <div class="relative">
        <i
          class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-sub)]"
        ></i>
        <input
          type="text"
          placeholder="Rechercher une solution (ex: remboursement, livraison...)"
          class="w-full pl-12 pr-4 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
        />
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <section class="lg:col-span-2 space-y-4">
        <h3
          class="font-bold text-lg text-[var(--color-text-main)] flex items-center gap-2"
        >
          <i
            class="fa-solid fa-circle-question text-[var(--color-primary)]"
          ></i>
          Questions fréquentes
        </h3>

        <div class="space-y-3">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 cursor-pointer hover:border-[var(--color-primary)] transition-all group"
          >
            <div
              class="flex justify-between items-center"
              @click="faq.open = !faq.open"
            >
              <span class="font-medium text-[var(--color-text-main)]">{{
                faq.question
              }}</span>
              <i
                :class="[
                  'fa-solid text-[var(--color-text-sub)] transition-transform',
                  faq.open ? 'fa-chevron-up' : 'fa-chevron-down',
                ]"
              ></i>
            </div>
            <p
              v-if="faq.open"
              class="mt-3 text-sm text-[var(--color-text-sub)] leading-relaxed animate-slide-down"
            >
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <h3 class="font-bold text-lg text-[var(--color-text-main)]">
          Contactez-nous
        </h3>

        <div
          class="bg-[var(--color-primary)] rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
        >
          <i
            class="fa-solid fa-comments absolute -right-2 -bottom-2 text-white/10 text-7xl"
          ></i>
          <h4 class="font-bold text-lg mb-2">Chat en direct</h4>
          <p class="text-sm text-white/80 mb-6">
            Réponse moyenne en moins de 2 minutes.
          </p>
          <button
            class="w-full py-3 bg-white text-[var(--color-primary)] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
          >
            <i class="fa-solid fa-comment-dots"></i>
            Lancer le Chat
          </button>
        </div>

        <div
          class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6"
        >
          <div
            class="w-12 h-12 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center mb-4"
          >
            <i
              class="fa-solid fa-envelope-open-text text-[var(--color-accent)] text-xl"
            ></i>
          </div>
          <h4 class="font-bold text-[var(--color-text-main)] mb-1">
            Envoyer un ticket
          </h4>
          <p class="text-xs text-[var(--color-text-sub)] mb-6">
            Pour les demandes complexes, nous vous répondons sous 24h.
          </p>
          <button
            class="w-full py-3 border border-[var(--color-border)] text-[var(--color-text-main)] rounded-xl font-bold text-sm hover:bg-[var(--color-bg)] transition-all"
          >
            Créer un ticket
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const faqs = ref([
  {
    question: "Comment suivre ma commande ?",
    answer:
      "Vous pouvez suivre votre colis en temps réel dans la section 'Mes Commandes' en cliquant sur le bouton 'Suivi'.",
    open: true,
  },
  {
    question: "Quels sont les délais de remboursement ?",
    answer:
      "Une fois le produit retourné et inspecté, le remboursement est effectué sous 5 à 7 jours ouvrés.",
    open: false,
  },
  {
    question: "Puis-je modifier mon adresse de livraison ?",
    answer:
      "Si la commande n'est pas encore expédiée, vous pouvez la modifier via le support client.",
    open: false,
  },
]);
</script>
