<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-12"
  >
    <div
      class="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
    >
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Bienvenue sur CHTECH
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          Connectez-vous à votre compte
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label
              for="login"
              class="block text-sm font-medium text-gray-300 mb-1"
              >Email ou Téléphone</label
            >
            <input
              id="login"
              v-model="form.login"
              name="login"
              type="text"
              required
              class="appearance-none relative block w-full px-4 py-3 border border-white/10 placeholder-gray-500 text-white bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
              placeholder="votre@email.com ou 6xxxxxxxx"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-300 mb-1"
              >Mot de passe</label
            >
            <input
              id="password"
              v-model="form.mot_de_passe"
              name="password"
              type="password"
              required
              class="appearance-none relative block w-full px-4 py-3 border border-white/10 placeholder-gray-500 text-white bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div
          v-if="error"
          class="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20"
        >
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              v-if="loading"
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ loading ? "Connexion en cours..." : "Se connecter" }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-400">
            Vous n'avez pas de compte ?
            <router-link
              to="/register"
              class="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Inscrivez-vous
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

const auth = useAuthStore();
const router = useRouter();

const form = reactive({
  login: "",
  mot_de_passe: "",
});

const loading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    await auth.login(form);
    const redirectPath = router.currentRoute.value.query.redirect || "/";
    router.push(redirectPath);
  } catch (err) {
    error.value = err.response?.data?.message || "Identifiants incorrects";
  } finally {
    loading.value = false;
  }
};
</script>
