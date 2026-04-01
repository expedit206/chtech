<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-12"
    :style="{ backgroundColor: 'var(--color-bg)' }"
  >
    <div
      class="max-w-md w-full space-y-8 p-8 rounded-3xl border shadow-2xl transition-all duration-300"
      :style="{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }"
    >
      <div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold"
          :style="{ color: 'var(--color-text-main)' }"
        >
          Bienvenue sur Sassaye
        </h2>
        <p
          class="mt-2 text-center text-sm"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          Connectez-vous à votre compte
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label
              for="login"
              class="block text-sm font-medium mb-1"
              :style="{ color: 'var(--color-text-main)' }"
              >Email ou Téléphone</label
            >
            <input
              id="login"
              v-model="form.login"
              name="login"
              type="text"
              required
              class="appearance-none relative block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm"
              :style="{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-main)',
                '--tw-ring-color': 'var(--color-primary)',
              }"
              placeholder="votre@email.com ou 6xxxxxxxx"
            />
          </div>
          <div class="relative">
            <label
              for="password"
              class="block text-sm font-medium mb-1"
              :style="{ color: 'var(--color-text-main)' }"
            >
              Mot de passe
            </label>

            <input
              id="password"
              v-model="form.mot_de_passe"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="appearance-none relative block w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 sm:text-sm"
              :style="{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-main)',
                '--tw-ring-color': 'var(--color-primary)',
              }"
              placeholder="••••••••"
            />

            <!-- ICONE -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-[38px] text-[var(--color-text-sub)] hover:text-[var(--color-primary)] transition"
            >
              <Eye v-if="!showPassword" :size="18" />
              <EyeOff v-else :size="18" />
            </button>
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
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :style="{
              backgroundColor: 'var(--color-primary)',
              boxShadow:
                '0 10px 15px -3px var(--color-primary-light, rgba(99, 102, 241, 0.2))',
            }"
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
          <p class="text-sm" :style="{ color: 'var(--color-text-sub)' }">
            Vous n'avez pas de compte ?
            <router-link
              :to="{ name: 'Register' }"
              class="font-medium hover:underline transition-colors"
              :style="{ color: 'var(--color-primary)' }"
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
import { useHead } from "@vueuse/head";
import { Eye, EyeOff } from "lucide-vue-next";
const auth = useAuthStore();
const router = useRouter();
// const head = useHead();
useHead({
  title: "Connexion - Sasaye",
  meta: [
    {
      name: "description",
      content:
        "Connectez-vous à votre compte Sasaye pour accéder à vos commandes, favoris et plus encore.",
    },
  ],
});
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
    const redirectPath = router.currentRoute.value.query.redirect;
    router.push(redirectPath ? { path: redirectPath } : { name: "Home" });
  } catch (err) {
    error.value = err.response?.data?.message || "Identifiants incorrects";
  } finally {
    loading.value = false;
  }
};
const showPassword = ref(false);
</script>
