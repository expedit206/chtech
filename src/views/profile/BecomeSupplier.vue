<template>
  <div
    class="bg-[var(--color-bg)] text-[var(--color-text-main)] px-6 md:px-20 py-2 space-y-12 max-w-7xl mx-auto"
  >
    <section class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="p-6 bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] flex flex-col items-center text-center gap-2"
      >
        <component
          :is="stat.icon"
          class="w-8 h-8 text-[var(--color-primary)] mb-2"
        />
        <h4 class="text-3xl font-extrabold text-[var(--color-primary)]">
          {{ stat.value }}
        </h4>
        <p
          class="text-[var(--color-text-sub)] text-sm font-medium tracking-wide"
        >
          {{ stat.label }}
        </p>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
      <section
        ref="formSection"
        class="lg:col-span-2 p-8 bg-[var(--color-surface)] rounded-xl shadow-md border border-[var(--color-border)]"
      >
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3">
          <span
            class="p-2 bg-[var(--color-primary)] text-white rounded-lg text-sm"
            >01</span
          >
          Formulaire Devenir Vendeur
        </h2>

        <form
          @submit.prevent="submitForm"
          class="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            type="text"
            v-model="form.nom"
            placeholder="Nom complet"
            required
            class="w-full p-4 rounded-lg border border-[var(--color-border)] bg-transparent focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
          />

          <input
            type="text"
            v-model="form.structure"
            placeholder="Nom de la structure"
            required
            class="w-full p-4 rounded-lg border border-[var(--color-border)] bg-transparent focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
          />

          <select
            v-model="form.categorie"
            required
            class="w-full p-4 rounded-lg border border-[var(--color-border)] bg-transparent focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
          >
            <option disabled value="">Catégorie des articles</option>
            <option>Électronique</option>
            <option>Mode</option>
            <option>Maison & Décoration</option>
            <option>Sport</option>
            <option>Autres</option>
          </select>

          <input
            type="text"
            v-model="form.localisation"
            placeholder="Localisation (ville, pays)"
            required
            class="w-full p-4 rounded-lg border border-[var(--color-border)] bg-transparent focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
          />

          <input
            type="text"
            v-model="form.contact"
            placeholder="Contact (email / téléphone)"
            required
            class="md:col-span-2 w-full p-4 rounded-lg border border-[var(--color-border)] bg-transparent focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
          />

          <button
            type="submit"
            class="md:col-span-2 py-4 rounded-lg bg-[var(--color-primary)] text-[var(--color-pure)] font-bold text-lg hover:bg-[var(--color-accent)] transform hover:-translate-y-1 transition-all shadow-lg"
          >
            Soumettre ma candidature
          </button>
        </form>
      </section>

      <aside class="space-y-8">
        <div
          class="p-6 bg-[var(--color-surface)] rounded-xl border-l-4 border-[var(--color-primary)] shadow-sm"
        >
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
            <Folder class="w-5 h-5 text-[var(--color-primary)]" /> Documents
          </h3>
          <ul class="space-y-4 text-[var(--color-text-sub)] text-sm">
            <li class="flex gap-2">✅ <span>Pièce d’identité valide</span></li>
            <li class="flex gap-2">
              ✅ <span>Extrait du registre de commerce</span>
            </li>
            <li class="flex gap-2">✅ <span>Logo de votre structure</span></li>
          </ul>
        </div>

        <div
          class="p-6 bg-[var(--color-surface)] rounded-xl shadow-sm text-center"
        >
          <Mail class="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3" />
          <h3 class="font-bold mb-1">Besoin d'aide ?</h3>
          <p class="text-sm text-[var(--color-text-sub)] mb-4">
            Notre équipe vous répond sous 24h.
          </p>
          <a
            href="https://wa.me/237683461329?text=Bonjour%20l'equipe%20SAssaye.com%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20l'ouverture%20d'une%20boutique%20vendeur%20sur%20votre%20plateforme.%20Pourriez-vous%20m'indiquer%20les%20%C3%A9tapes%20%C3%A0%20suivre%20%3F"
            class="text-[var(--color-primary)] font-bold hover:underline block truncate"
            >WhatsApp: +237 683461329</a
          >
        </div>
      </aside>
    </div>

    
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import {
  Folder,
  Users,
  ShoppingCart,
  Clock,
  Book,
  Mail,
  ArrowUp,
} from "lucide-vue-next";

const form = reactive({
  nom: "",
  structure: "",
  categorie: "",
  localisation: "",
  contact: "",
});

const stats = [
  { label: "Vendeurs", value: "1200+", icon: Users },
  { label: "Ventes / mois", value: "4500+", icon: ShoppingCart },
  { label: "Clients", value: "5000+", icon: Users },
  { label: "Support", value: "24/7", icon: Clock },
];

const formSection = ref(null);

const submitForm = () => {
  console.log("Formulaire envoyé:", form);
  alert("Votre demande a été soumise !");
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
