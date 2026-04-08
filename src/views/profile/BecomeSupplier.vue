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

        <div v-if="loadingStatus" class="p-8 text-center text-[var(--color-primary)] font-bold animate-pulse">
          Vérification du statut de votre demande...
        </div>

        <div v-else-if="existingRequest" class="flex flex-col items-center justify-center p-8 text-center bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
          <div v-if="existingRequest.status === 'pending'" class="text-amber-500 mb-4">
            <Clock class="w-16 h-16 mx-auto mb-2" />
            <h3 class="text-xl font-bold">Demande en cours d'examen</h3>
            <p class="text-sm text-[var(--color-text-sub)] mt-2">
              Votre demande pour devenir vendeur est actuellement en cours d'évaluation par notre équipe. 
              Vous recevrez une notification d'ici peu.
            </p>
          </div>
          <div v-else-if="existingRequest.status === 'approved'" class="text-green-500 mb-4">
            <CheckCircle class="w-16 h-16 mx-auto mb-2" />
            <h3 class="text-xl font-bold">Demande approuvée !</h3>
            <p class="text-sm text-[var(--color-text-sub)] mt-2">
              Félicitations, vous êtes maintenant un vendeur officiel sur SASAYEE.
              <br>Reconnectez-vous ou actualisez la page pour voir vos nouvelles fonctionnalités !
            </p>
          </div>
          <div v-else-if="existingRequest.status === 'rejected'" class="text-red-500 mb-4">
            <XCircle class="w-16 h-16 mx-auto mb-2" />
            <h3 class="text-xl font-bold">Demande rejetée</h3>
            <p class="text-sm text-[var(--color-text-sub)] mt-2">
              Nous n'avons malheureusement pas pu valider votre demande pour devenir vendeur.
              Veuillez contacter le support pour plus d'informations.
            </p>
          </div>
        </div>

        <form v-else
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
        <div class="" v-if="!existingRequest && !loadingStatus">
          <p class="mt-4 text-sm text-[var(--color-text-sub)] italic">
            <i
              >Vos informations seront examinées par notre équipe avant d'être
              approuvées.</i
            >
          </p>
        </div>
      </section>

      <aside class="space-y-8">
        <!-- <div
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
        </div> -->

        <div
          class="p-6 bg-[var(--color-surface)] rounded-xl shadow-sm text-center"
        >
          <Mail class="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3" />
          <h3 class="font-bold mb-1">Besoin d'aide ?</h3>
          <p class="text-sm text-[var(--color-text-sub)] mb-4">
            Notre équipe vous répond sous 24h.
          </p>
          <a
            href="https://wa.me/237683461329?text=Bonjour%20l'equipe%20SASAYEE.com%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20l'ouverture%20d'une%20boutique%20vendeur%20sur%20votre%20plateforme.%20Pourriez-vous%20m'indiquer%20les%20%C3%A9tapes%20%C3%A0%20suivre%20%3F"
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
  CheckCircle,
  XCircle,
} from "lucide-vue-next";
import apiClient from "../../api";
import { useAlert } from "../../composables/useAlert.js";

import { useSeo } from "../../composables/useSeo.js";
useSeo({
  title: "Devenir Vendeur - SASAYEE",
  description: "Ouvrez votre boutique sur SASAYEE et commencez à vendre vos produits à des milliers de clients au Cameroun. Inscription rapide et support 24/7."
});

const alert = useAlert();

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
const existingRequest = ref(null);
const loadingStatus = ref(true);

const fetchStatus = async () => {
  try {
    const res = await apiClient.get("/supplier-onboarding/status");
    if (res.data.success && res.data.data) {
      existingRequest.value = res.data.data;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du statut :", error);
  } finally {
    loadingStatus.value = false;
  }
};

import { onMounted } from "vue";
onMounted(() => {
  fetchStatus();
});

const submitForm = async () => {
  try {
    const payload = {
      company_name: form.structure,
      description: `Nom complet: ${form.nom}\nCatégorie: ${form.categorie}\nLocalisation: ${form.localisation}\nContact: ${form.contact}`
    };
    
    const response = await apiClient.post("/supplier-onboarding/apply", payload);
    
    alert.success({
      title: "Candidature Envoyée",
      message: response.data.message || "Votre demande a été soumise avec succès ! Notre équipe vous contactera sous 24h."
    });
    
    // Switch to status view
    fetchStatus();
  } catch (error) {
    alert.error({
      title: "Erreur",
      message: error.response?.data?.message || "Une erreur s'est produite lors de l'envoi de votre candidature."
    });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
