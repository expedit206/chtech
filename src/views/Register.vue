<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12" :style="{ backgroundColor: 'var(--color-bg)' }">
    <div class="max-w-md w-full space-y-8 p-8 rounded-3xl border shadow-2xl transition-all duration-300" :style="{
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
    }">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold" :style="{ color: 'var(--color-text-main)' }">
          Rejoignez SASAYEE
        </h2>
        <p class="mt-2 text-center text-sm" :style="{ color: 'var(--color-text-sub)' }">
          Créez votre compte en quelques secondes
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="nom" class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text-main)' }">Nom
              complet</label>
            <input id="nom" v-model="form.nom" name="nom" type="text" required
              class="appearance-none relative block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm"
              :style="{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-main)',
                '--tw-ring-color': 'var(--color-primary)',
              }" placeholder="Ex: Jean Dupont" />
          </div>
          <div>
            <label for="telephone" class="block text-sm font-medium mb-1"
              :style="{ color: 'var(--color-text-main)' }">Téléphone</label>
            <input id="telephone" v-model="form.telephone" name="telephone" type="tel" required
              class="appearance-none relative block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm"
              :style="{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-main)',
                '--tw-ring-color': 'var(--color-primary)',
              }" placeholder="Ex: 6XXXXXXXX" />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium mb-1"
              :style="{ color: 'var(--color-text-main)' }">Mot de passe</label>
            <input id="password" v-model="form.mot_de_passe" name="password" type="password" required
              class="appearance-none relative block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm"
              :style="{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-main)',
                '--tw-ring-color': 'var(--color-primary)',
              }" placeholder="••••••••" />
          </div>
          <div>
            <label for="parrain_code" class="block text-sm font-medium mb-1"
              :style="{ color: 'var(--color-text-main)' }">Code de parrainage (optionnel)</label>
            <input id="parrain_code" v-model="form.parrain_code" name="parrain_code" type="text"
              class="appearance-none relative block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm"
              :style="{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-main)',
                '--tw-ring-color': 'var(--color-primary)',
              }" placeholder="Code parrain" />
          </div>
        </div>

        <div v-if="error"
          class="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
          {{ error }}
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :style="{
              backgroundColor: 'var(--color-primary)',
              boxShadow:
                '0 10px 15px -3px var(--color-primary-light, rgba(99, 102, 241, 0.2))',
            }">
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </span>
            {{ loading ? "Inscription en cours..." : "S'inscrire" }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm" :style="{ color: 'var(--color-text-sub)' }">
            Vous avez déjà un compte ?
            <router-link :to="{ name: 'Login' }" class="font-medium hover:underline transition-colors"
              :style="{ color: 'var(--color-primary)' }">
              Connectez-vous
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useSeo } from "../composables/useSeo.js";
useSeo({
  title: "Inscription - SASAYEE",
  description: "Créez votre compte SASAYEE en quelques secondes et commencez à vendre ou acheter des produits et services partout au Cameroun."
});
const auth = useAuthStore();
const router = useRouter();

const form = reactive({
  nom: "",
  telephone: "",
  mot_de_passe: "",
  parrain_code: "",
});

const loading = ref(false);
const error = ref(null);

const handleRegister = async () => {
  loading.value = true;
  error.value = null;
  try {
    await auth.register(form);
    const redirectPath = router.currentRoute.value.query.redirect;
    router.push(redirectPath ? { path: redirectPath } : { name: "Home" });
  } catch (err) {
    if (err.response?.data?.errors) {
      error.value = Object.values(err.response.data.errors).flat()[0];
    } else {
      error.value =
        err.response?.data?.message || "Erreur lors de l'inscription";
    }
  } finally {
    loading.value = false;
  }
};
</script>
