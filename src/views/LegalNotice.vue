<template>
  <div class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] pb-20">
    <header class="py-20 px-6 text-center">
      <div class="max-w-4xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-6">
          <Scale :size="14" /> Conformité
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">Mentions Légales</h1>
        <p class="text-[var(--color-text-sub)] text-lg max-w-2xl mx-auto">
          Informations obligatoires concernant l'éditeur et l'hébergeur de la plateforme CH-TECH.
        </p>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 grid gap-6">
      <section class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Building2 :size="24" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold mb-4">Éditeur du site</h2>
            <div class="grid md:grid-cols-2 gap-6 text-sm text-[var(--color-text-sub)]">
              <div class="space-y-2">
                <p><span class="font-bold text-[var(--color-text-main)] uppercase">Dénomination :</span> CH-TECH Solutions</p>
                <p><span class="font-bold text-[var(--color-text-main)] uppercase">Siège social :</span> Douala,Bafoussam Cameroun</p>
                <p><span class="font-bold text-[var(--color-text-main)] uppercase">Directeur de publication :</span> <a href="https://borisaubin.vercel.app/" target="_blank" class="text-[var(--color-primary)] hover:underline">Aubin Boris Simo</a> </p>
              </div>
              <div class="space-y-2">
                <p><span class="font-bold text-[var(--color-text-main)] uppercase">Email :</span> legal@ch-tech.com</p>
                <p><span class="font-bold text-[var(--color-text-main)] uppercase">Numéro de registre :</span> RC/DLA/2026/B/1234</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Server :size="24" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold mb-4">Hébergement</h2>
            <p class="text-sm text-[var(--color-text-sub)] leading-relaxed">
              Le site <strong>CH-TECH</strong> est hébergé par : <br />
              <span class="font-bold text-[var(--color-text-main)]">Hostinger</span><br />
             
              Site web : <a href="https://hostinger.com" class="text-[var(--color-primary)] hover:underline">www.hostinger.com</a>
            </p>
          </div>
        </div>
      </section>

      <section class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <ShieldCheck :size="24" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold mb-4">Propriété Intellectuelle</h2>
            <p class="text-sm text-[var(--color-text-sub)] leading-relaxed">
              Sauf mention contraire, tous les éléments accessibles sur le site (textes, images, graphismes, logo, icônes, sons, logiciels) restent la propriété exclusive de CH-TECH. 
              Toute exploitation non autorisée du site ou de l’un des éléments qu’il contient sera considérée comme constitutive d’une contrefaçon.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <Info :size="24" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold mb-4">Cookies et Données personnelles</h2>
            <p class="text-sm text-[var(--color-text-sub)] mb-4 leading-relaxed">
              Pour en savoir plus sur la gestion de vos données et vos droits, veuillez consulter notre politique dédiée.
            </p>
            <RouterLink 
              to="/ressources/politique-de-confidentialite" 
              class="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:gap-3 transition-all"
            >
              Consulter la politique de confidentialité <ArrowRight :size="16" />
            </RouterLink>
          </div>
        </div>
      </section>

      <div class="text-center pt-10">
        <p class="text-sm text-[var(--color-text-sub)] mb-4">Une question d'ordre juridique ?</p>
        <a 
          href="mailto:legal@ch-tech.com" 
          class="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[var(--color-text-main)] text-[var(--color-pure)] font-bold hover:scale-105 transition-transform"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }"
        >
          <Mail :size="18" /> Nous contacter
        </a>
      </div>
    </main>
  </div>
</template>

<script setup>
import { 
  Scale, Building2, Server, ShieldCheck, 
  Info, ArrowRight, Mail 
} from "lucide-vue-next";
</script>
