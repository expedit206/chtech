<template>
  <div class="p-6 space-y-8 animate-fade-in pb-20">
    <header class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-black text-[var(--color-text-main)] font-serif tracking-tighter">Paramètres du compte
        </h1>
        <p class="text-[var(--color-text-sub)] text-sm">Gérez vos informations personnelles et la sécurité de votre
          compte.</p>
      </div>
      <button @click="confirmLogout"
        class="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all shadow-sm">
        <i class="fa-solid fa-power-off"></i>
        Déconnexion
      </button>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <!-- Section Informations du Profil -->
      <section
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 space-y-8 shadow-sm">
        <div class="flex items-center gap-3 border-b border-[var(--color-border)] pb-6">
          <div
            class="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
            <i class="fa-solid fa-user"></i>
          </div>
          <h3 class="font-black text-[var(--color-text-main)] uppercase tracking-widest text-xs">Informations
            Personnelles</h3>
        </div>

        <!-- Avatar Update -->
        <div class="flex flex-col sm:flex-row items-center gap-8 pb-4">
          <div class="relative group">
            <div
              class="w-32 h-32 rounded-full border-4 border-[var(--color-primary)] overflow-hidden bg-[var(--color-bg)] shadow-2xl transition-transform cursor-pointer"
              @click="triggerFileInput">
              <img :src="profilePhotoUrl" alt="Profil"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div
                class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i class="fa-solid fa-camera text-white text-2xl"></i>
              </div>
            </div>
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="hidden" />
          </div>
          <div class="text-center sm:text-left space-y-2">
            <h4 class="font-black text-lg text-[var(--color-text-main)]">Photo de profil</h4>
            <p class="text-xs text-[var(--color-text-sub)]">Optimisez votre présence avec une photo réelle. JPG ou PNG
              acceptés.</p>
            <div class="flex gap-3 justify-center sm:justify-start">
              <button @click="triggerFileInput"
                class="text-xs font-black uppercase tracking-widest text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] hover:opacity-70 transition-opacity pb-1">Changer
                la photo</button>
            </div>
          </div>
        </div>

        <!-- Personal Info Form -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label
                class="block text-[10px] font-black text-[var(--color-text-sub)] uppercase tracking-[0.2em] mb-2 ml-1">Nom
                Complet</label>
              <input type="text" v-model="profileForm.nom"
                class="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-4 text-sm text-[var(--color-text-main)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all shadow-inner" />
            </div>
            <div>
              <label
                class="block text-[10px] font-black text-[var(--color-text-sub)] uppercase tracking-[0.2em] mb-2 ml-1">Adresse
                Email</label>
              <input type="email" v-model="profileForm.email"
                class="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-4 text-sm text-[var(--color-text-main)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all shadow-inner" />
            </div>
          </div>
          <button @click="updateProfile" :disabled="loadingProfile"
            class="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-black text-sm tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50">
            <i v-if="loadingProfile" class="fas fa-circle-notch fa-spin"></i>
            Sauvegarder les modifications
          </button>
        </div>
      </section>

      <!-- Section Sécurité -->
      <section
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 space-y-8 shadow-sm">
        <div class="flex items-center gap-3 border-b border-[var(--color-border)] pb-6">
          <div
            class="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h3 class="font-black text-[var(--color-text-main)] uppercase tracking-widest text-xs">Sécurité & Accès</h3>
        </div>

        <div class="space-y-6">
          <p class="text-sm font-bold text-[var(--color-text-main)]">Changer votre mot de passe</p>
          <div class="space-y-4">
            <div class="relative">
              <input type="password" v-model="passwordForm.current" placeholder="Mot de passe actuel"
                class="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-4 text-sm outline-none text-[var(--color-text-main)] focus:ring-2 focus:ring-[var(--color-accent)] transition-all shadow-inner" />
            </div>
            <div class="relative">
              <input type="password" v-model="passwordForm.new" placeholder="Nouveau mot de passe"
                class="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-4 text-sm outline-none text-[var(--color-text-main)] focus:ring-2 focus:ring-[var(--color-accent)] transition-all shadow-inner" />
            </div>
            <div class="relative">
              <input type="password" v-model="passwordForm.confirm" placeholder="Confirmer le nouveau mot de passe"
                class="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-4 text-sm outline-none text-[var(--color-text-main)] focus:ring-2 focus:ring-[var(--color-accent)] transition-all shadow-inner" />
            </div>
            <button @click="updatePassword" :disabled="loadingPassword"
              class="w-full py-4 bg-[var(--color-accent)] text-white rounded-2xl font-black text-sm tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-pink-500/20 disabled:opacity-50">
              <i v-if="loadingPassword" class="fas fa-circle-notch fa-spin"></i>
              METTRE À JOUR LE MOT DE PASSE
            </button>
          </div>
        </div>
      </section>

      <!-- Section Danger Area -->
      <section class="xl:col-span-2 mt-8">
        <div
          class="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="text-center md:text-left space-y-2">
            <h3 class="font-black text-red-500 text-xl tracking-tight">Zone de danger</h3>
            <p class="text-sm text-[var(--color-text-sub)] max-w-md">
              Attention : La suppression de votre compte est irréversible. Toutes vos données seront définitivement
              perdues.
            </p>
          </div>
          <button @click="confirmDeleteAccount"
            class="px-10 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl shadow-red-500/10">
            Supprimer le compte
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { CONFIG } from '../config/index.js';

import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useAlert } from '../composables/useAlert';
import { useRouter } from 'vue-router';
import apiClient from '../api';

const authStore = useAuthStore();
const alert = useAlert();
const router = useRouter();

const fileInput = ref(null);
const loadingProfile = ref(false);
const loadingPassword = ref(false);

const profileForm = reactive({
  nom: authStore.user?.nom || '',
  email: authStore.user?.email || '',
});

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: '',
});

const profilePhotoUrl = computed(() => {
  if (authStore.user?.photo) {
    if (authStore.user.photo.startsWith('http')) return authStore.user.photo;
    return `${CONFIG.API_BASE_URL}/storage/${authStore.user.photo}`;

  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.nom || 'User')}&background=6366f1&color=fff&size=200`;
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert.error({ title: 'Fichier trop volumineux', message: 'La taille maximale est de 2MB.' });
    return;
  }

  const formData = new FormData();
  formData.append('photo', file);

  try {
    const response = await apiClient.post('/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    authStore.setUser(response.data.user);
    alert.success({ title: 'Photo mise à jour', message: 'Votre nouvelle photo de profil a été enregistrée.' });
  } catch (error) {
    alert.error({ title: 'Erreur', message: 'Impossible de mettre à jour la photo.' });
  }
};

const updateProfile = async () => {
  loadingProfile.value = true;
  try {
    const response = await apiClient.post('/updateProfile', profileForm);
    authStore.setUser(response.data.user);
    alert.success({ title: 'Profil mis à jour', message: 'Vos informations personnelles ont été enregistrées avec succès.' });
  } catch (error) {
    alert.error({ title: 'Oups !', message: error.response?.data?.message || 'Erreur lors de la mise à jour.' });
  } finally {
    loadingProfile.value = false;
  }
};

const updatePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert.warning({ message: 'Les nouveaux mots de passe ne correspondent pas.' });
    return;
  }

  loadingPassword.value = true;
  try {
    await apiClient.post('/updatePassword', {
      current_password: passwordForm.current,
      new_password: passwordForm.new,
      new_password_confirmation: passwordForm.confirm,
    });
    alert.success({ title: 'Succès', message: 'Votre mot de passe a été modifié.' });
    passwordForm.current = '';
    passwordForm.new = '';
    passwordForm.confirm = '';
  } catch (error) {
    alert.error({ title: 'Erreur de mot de passe', message: error.response?.data?.message || 'L\'ancien mot de passe est incorrect.' });
  } finally {
    loadingPassword.value = false;
  }
};

const confirmLogout = () => {
  alert.confirm({
    title: 'Déconnexion',
    message: 'Êtes-vous sûr de vouloir quitter votre session ?',
    confirmText: 'Se déconnecter',
    onConfirm: async () => {
      await authStore.logout();
      router.push({ name: 'Home' });
      alert.info({ message: 'Vous avez été déconnecté.' });
    }
  });
};

const confirmDeleteAccount = () => {
  alert.confirm({
    title: 'ACTION IRREVERSIBLE',
    message: 'Voulez-vous vraiment supprimer votre compte ? Toutes vos données seront effacées.',
    confirmText: 'SUPPRIMER MON COMPTE',
    type: 'error',
    onConfirm: async () => {
      try {
        await apiClient.delete('/user');
        await authStore.logout();
        router.push({ name: 'Home' });
        alert.success({ title: 'Compte supprimé', message: 'Votre compte a été supprimé avec succès.' });
      } catch (error) {
        alert.error({ message: 'Erreur lors de la suppression du compte.' });
      }
    }
  });
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
