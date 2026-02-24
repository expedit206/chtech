<template>
  <div class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] pb-20">
    <header class="py-16 px-6 text-center border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-extrabold mb-4">Conditions d'utilisation</h1>
        <p class="text-[var(--color-text-sub)] text-lg">
          Règles et directives pour utiliser la plateforme CH-TECH en toute sécurité.
        </p>
        <p class="text-xs font-medium text-[var(--color-primary)] mt-6 uppercase tracking-widest">
          Dernière mise à jour : 10 octobre 2025
        </p>
      </div>
    </header>

    <div class="sticky top-0 z-30 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] mb-10">
      <div class="max-w-6xl mx-auto px-4 overflow-x-auto">
        <nav class="flex items-center gap-2 py-4 whitespace-nowrap">
          <button v-for="tab in tabs" :key="tab.id" @click="scrollTo(tab.id)"
            class="px-4 py-2 rounded-full text-sm font-medium border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <main class="max-w-4xl mx-auto px-6 space-y-8">
      
      <section id="intro" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-3">
          <Info :size="24" class="text-[var(--color-primary)]" /> Introduction
        </h2>
        <p class="text-[var(--color-text-sub)] leading-relaxed">
          Bienvenue sur <strong>CH-TECH</strong>, votre hub d'innovation technologique. En accédant à nos services, vous acceptez de vous conformer aux présentes conditions. Nous avons conçu ces règles pour garantir une expérience optimale et sécurisée à tous nos utilisateurs.
        </p>
      </section>

      <section id="conduite" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
          <ShieldAlert :size="24" class="text-amber-500" /> Règles de conduite
        </h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <h3 class="font-bold text-emerald-500 flex items-center gap-2">
              <CheckCircle :size="18" /> Comportement autorisé
            </h3>
            <ul class="space-y-3 text-sm text-[var(--color-text-sub)]">
              <li class="flex items-start gap-2">• Respect mutuel entre tous les utilisateurs de CH-TECH.</li>
              <li class="flex items-start gap-2">• Utilisation honnête des ressources et APIs mises à disposition.</li>
              <li class="flex items-start gap-2">• Respect des engagements pris lors des échanges collaboratifs.</li>
            </ul>
          </div>
          <div class="space-y-4">
            <h3 class="font-bold text-red-500 flex items-center gap-2">
              <XCircle :size="18" /> Comportement interdit
            </h3>
            <ul class="space-y-3 text-sm text-[var(--color-text-sub)]">
              <li class="flex items-start gap-2">• Harcèlement, intimidation ou usurpation d'identité.</li>
              <li class="flex items-start gap-2">• Publication de code malveillant ou tentatives de reverse-engineering.</li>
              <li class="flex items-start gap-2">• Publicité trompeuse ou spam via nos systèmes de messagerie.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="paiements" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-3">
          <CreditCard :size="24" class="text-[var(--color-primary)]" /> Transactions et Paiements
        </h2>
        <div class="space-y-4 text-sm text-[var(--color-text-sub)]">
          <p><span class="font-bold text-[var(--color-text-main)]">Abonnements :</span> Nos services premium sont soumis à une facturation périodique claire et sans frais cachés.</p>
          <p><span class="font-bold text-[var(--color-text-main)]">Sécurité :</span> Nous utilisons des protocoles de paiement sécurisés pour toutes vos transactions bancaires.</p>
          <p><span class="font-bold text-[var(--color-text-main)]">Responsabilité :</span> Vous êtes responsable de la gestion de vos factures et du maintien à jour de vos informations de paiement.</p>
        </div>
      </section>

      <section id="propriete" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-3">
          <Copyright :size="24" class="text-[var(--color-accent)]" /> Propriété Intellectuelle
        </h2>
        <p class="text-sm text-[var(--color-text-sub)] leading-relaxed">
          L'ensemble du contenu présent sur la plateforme CH-TECH (logos, designs, codes sources propriétaires) est protégé par les lois internationales sur la propriété intellectuelle. Toute reproduction sans accord préalable est strictement interdite.
        </p>
      </section>

      <section id="resiliation" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-3">
          <UserMinus :size="24" class="text-red-500" /> Résiliation
        </h2>
        <div class="space-y-3 text-sm text-[var(--color-text-sub)]">
          <p>Vous pouvez fermer votre compte CH-TECH à tout moment depuis vos paramètres de profil.</p>
          <p>Nous nous réservons le droit de suspendre ou de supprimer les comptes qui violent de manière répétée nos règles de sécurité ou de conduite.</p>
        </div>
      </section>

      <section id="contact" class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        <h2 class="text-2xl font-bold mb-6">Contact</h2>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
            <Mail class="text-[var(--color-primary)]" :size="20" />
            <span class="font-medium">contact@ch-tech.com</span>
          </div>
          <div class="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
            <Clock class="text-amber-500" :size="20" />
            <span class="text-sm text-[var(--color-text-sub)]">Réponse sous 24h à 48h ouvrées.</span>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { 
  Info, ShieldAlert, CheckCircle, XCircle, CreditCard, 
  Copyright, UserMinus, Mail, Clock 
} from "lucide-vue-next";

const tabs = [
  { name: "Introduction", id: "intro" },
  { name: "Conduite", id: "conduite" },
  { name: "Paiements", id: "paiements" },
  { name: "Propriété", id: "propriete" },
  { name: "Résiliation", id: "resiliation" },
  { name: "Contact", id: "contact" },
];

const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -100; // Pour ne pas être caché par la barre de navigation
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};
</script>
