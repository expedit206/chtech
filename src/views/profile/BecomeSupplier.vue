<template>
  <div class="max-w-4xl mx-auto px-4 py-12 pt-24 text-[var(--color-text-main)]">
    <div
      class="bg-[var(--color-surface)] rounded-3xl shadow-xl overflow-hidden border border-[var(--color-border)]"
    >
      <div class="p-8 md:p-12">
        <div class="flex items-center gap-4 mb-8">
          <div
            class="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white"
          >
            <Store :size="28" />
          </div>
          <div>
            <h1 class="text-3xl font-black tracking-tight">
              Devenir Fournisseur
            </h1>
            <p class="text-[var(--color-text-sub)]">
              Rejoignez notre réseau de vendeurs certifiés
            </p>
          </div>
        </div>

        <!-- Success State -->
        <div v-if="requestStatus === 'pending'" class="text-center py-12">
          <div
            class="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Clock class="text-amber-600" :size="40" />
          </div>
          <h2 class="text-2xl font-bold mb-4">Demande en cours d'examen</h2>
          <p class="text-[var(--color-text-sub)] max-w-md mx-auto mb-8">
            Notre équipe analyse votre demande. Vous recevrez une notification
            dès qu'une décision sera prise.
          </p>
          <router-link
            :to="{ name: 'Home' }"
            class="text-[var(--color-primary)] font-bold hover:underline"
            >Retour à l'accueil</router-link
          >
        </div>

        <div v-else-if="requestStatus === 'approved'" class="text-center py-12">
          <div
            class="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle class="text-green-600" :size="40" />
          </div>
          <h2 class="text-2xl font-bold mb-4">Vous êtes fournisseur !</h2>
          <p class="text-[var(--color-text-sub)] mb-8">
            Félicitations ! Vous pouvez maintenant commencer à publier vos
            produits.
          </p>
          <router-link
            :to="{ name: 'my-products' }"
            class="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-[var(--color-primary)]/20"
          >
            Accéder à mon espace vendeur
          </router-link>
        </div>

        <!-- Form State -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-bold text-[var(--color-text-sub)]"
                >Nom de votre Boutique / Entreprise</label
              >
              <input
                v-model="form.company_name"
                required
                type="text"
                placeholder="Ex: My Tech Store"
                class="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 text-[var(--color-text-main)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all font-medium"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-[var(--color-text-sub)]"
                >Ville de résidence</label
              >
              <input
                :value="auth.user?.ville"
                disabled
                type="text"
                class="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-sub)] opacity-50 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-[var(--color-text-sub)]"
              >Quels types de produits vendez-vous ?</label
            >
            <textarea
              v-model="form.description"
              required
              rows="4"
              placeholder="Décrivez brièvement votre activité et les articles que vous comptez proposer..."
              class="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 text-[var(--color-text-main)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all font-medium"
            ></textarea>
          </div>

          <div
            class="p-6 bg-[var(--color-primary)]/5 rounded-2xl flex gap-4 border border-[var(--color-primary)]/10"
          >
            <Info class="text-[var(--color-primary)] shrink-0" :size="24" />
            <p class="text-sm text-[var(--color-text-sub)] leading-relaxed">
              En devenant fournisseur, vous acceptez nos conditions de vente. Un
              système de paiement sécurisé (Escrow) est mis en place pour
              protéger vos transactions et rassurer vos clients.
            </p>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isSubmitting" class="animate-spin" />
            {{ isSubmitting ? "Envoi en cours..." : "Envoyer ma demande" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth.js";
import apiClient from "../../api/index.js";
import { useToast } from "vue-toastification";
import { Store, Clock, CheckCircle, Info, Loader2 } from "lucide-vue-next";

const auth = useAuthStore();
const toast = useToast();

const form = ref({
  company_name: "",
  description: "",
});

const isSubmitting = ref(false);
const requestStatus = ref(null);

const fetchStatus = async () => {
  try {
    const response = await apiClient.get("/supplier-onboarding/status");
    if (response.data.data) {
      requestStatus.value = response.data.data.status;
    }
  } catch (error) {
    console.error("Erreur status:", error);
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const response = await apiClient.post(
      "/supplier-onboarding/apply",
      form.value,
    );
    toast.success(response.data.message);
    requestStatus.value = "pending";
  } catch (error) {
    toast.error(error.response?.data?.message || "Une erreur est survenue");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(fetchStatus);
</script>
