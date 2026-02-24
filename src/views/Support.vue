<template>
  <div class="p-6 space-y-8 animate-fade-in pb-20 max-w-7xl mx-auto">
    <header class="text-center max-w-2xl mx-auto space-y-6">
      <h1 class="text-4xl font-extrabold text-[var(--color-text-main)] tracking-tight">
        Comment pouvons-nous vous aider ?
      </h1>
      <div class="relative group">
        <Search
          class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-sub)] group-focus-within:text-[var(--color-primary)] transition-colors"
          :size="20"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une solution (ex: API, paiement, compte...)"
          class="w-full pl-12 pr-4 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
        />
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <section class="lg:col-span-2 space-y-6">
        <h3 class="font-bold text-xl text-[var(--color-text-main)] flex items-center gap-3">
          <HelpCircle class="text-[var(--color-primary)]" :size="24" />
          Questions fréquentes
        </h3>

        <div class="space-y-4">
          <div
            v-for="(faq, index) in filteredFaqs"
            :key="index"
            class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all hover:border-[var(--color-primary)]/50"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full flex justify-between items-center p-5 text-left transition-colors"
              :class="{'bg-[var(--color-primary)]/5': faq.open}"
            >
              <span class="font-semibold text-[var(--color-text-main)]">{{ faq.question }}</span>
              <component 
                :is="faq.open ? ChevronUp : ChevronDown" 
                class="text-[var(--color-text-sub)] shrink-0 transition-transform duration-300"
                :size="20"
              />
            </button>

            <transition name="expand">
              <div v-if="faq.open" class="border-t border-[var(--color-border)]">
                <p class="p-5 text-sm text-[var(--color-text-sub)] leading-relaxed bg-[var(--color-bg)]/30">
                  {{ faq.answer }}
                </p>
              </div>
            </transition>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <h3 class="font-bold text-xl text-[var(--color-text-main)]">Support direct</h3>

        <div class="bg-[var(--color-primary)] rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
          <MessageCircle class="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform" :size="120" />
          
          <h4 class="font-bold text-lg mb-2">Chat en direct</h4>
          <p class="text-sm text-white/80 mb-6 relative z-10">
            Réponse moyenne en moins de 2 minutes. Idéal pour les questions techniques rapides.
          </p>
          <button class="w-full py-3 bg-white text-[var(--color-primary)] rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95 relative z-10">
            <MessageSquareText :size="18" />
            Lancer le Chat
          </button>
        </div>

        <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6">
          <div class="w-12 h-12 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center mb-4">
            <Ticket class="text-[var(--color-accent)]" :size="24" />
          </div>
          <h4 class="font-bold text-[var(--color-text-main)] mb-1">Envoyer un ticket</h4>
          <p class="text-xs text-[var(--color-text-sub)] mb-6">
            Pour les demandes complexes ou les bugs, nous vous répondons sous 24h.
          </p>
          <button class="w-full py-3 border border-[var(--color-border)] text-[var(--color-text-main)] rounded-xl font-bold text-sm hover:bg-[var(--color-bg)] hover:border-[var(--color-primary)] transition-all">
            Créer un ticket
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { 
  Search, HelpCircle, ChevronDown, ChevronUp, 
  MessageCircle, MessageSquareText, Ticket 
} from "lucide-vue-next";

const searchQuery = ref("");

const faqs = ref([
  {
    question: "Comment suivre l'avancement de mon projet ?",
    answer: "Vous pouvez suivre l'état de vos services en temps réel dans votre tableau de bord CH-TECH, section 'Mes Commandes'.",
    open: true,
  },
  {
    question: "Quels sont les modes de paiement acceptés au Cameroun ?",
    answer: "Nous acceptons Orange Money, MTN Mobile Money, ainsi que les cartes Visa et Mastercard.",
    open: false,
  },
  {
    question: "Comment sécurisez-vous mes données personnelles ?",
    answer: "Toutes vos données sont chiffrées via TLS 1.3 et stockées sur des serveurs sécurisés conformes au RGPD.",
    open: false,
  },
  {
    question: "Proposez-vous une API pour les développeurs ?",
    answer: "Oui, CH-TECH dispose d'une documentation API complète pour intégrer nos solutions à vos propres applications.",
    open: false,
  },
  {
    question: "Comment réinitialiser mon mot de passe ?",
    answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Un lien de réinitialisation vous sera envoyé par email.",
    open: false,
  },
  {
    question: "Quels sont les délais pour un remboursement ?",
    answer: "Après validation, le remboursement est traité sous 5 à 7 jours ouvrés sur votre mode de paiement initial.",
    open: false,
  },
  {
    question: "Puis-je modifier ma commande après validation ?",
    answer: "Une modification est possible tant que le statut n'est pas 'En cours de traitement'. Contactez rapidement le support.",
    open: false,
  },
  {
    question: "Comment devenir partenaire CH-TECH ?",
    answer: "Vous pouvez postuler via notre formulaire de contact dédié aux partenariats dans le pied de page.",
    open: false,
  },
]);

// Fonction pour ouvrir une question et fermer les autres (optionnel)
const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open;
};

// Filtrer les FAQs selon la recherche
const filteredFaqs = computed(() => {
  return faqs.value.filter(f => 
    f.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped>
/* Animation d'ouverture fluide */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 200px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
