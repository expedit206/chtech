<template>
  <div class="p-4 md:p-8 space-y-8 animate-fade-in">
    <!-- Header with cover -->
    <div class="rounded-3xl overflow-hidden relative" :style="{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
      <!-- Cover banner -->
      <div class="h-36 md:h-48 relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 group">
        <img v-if="coverUrl" :src="coverUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
        
        <!-- Uploading Overlay -->
        <div v-if="uploadingCover" class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <Loader2 class="animate-spin mb-2" :size="32" />
          <span class="text-xs font-black uppercase tracking-widest">Envoi en cours...</span>
        </div>

        <label v-else class="absolute bottom-3 right-3 cursor-pointer">
          <input type="file" accept="image/*" class="hidden" @change="onCoverSelect" />
          <span class="flex items-center gap-2 px-3 py-1.5 bg-black/50 text-white rounded-xl text-xs font-bold backdrop-blur-sm hover:bg-black/70 transition-all hover:scale-105 active:scale-95">
            <Camera :size="14" /> {{ auth.user?.cover ? 'Changer la bannière' : 'Ajouter une bannière' }}
          </span>
        </label>
      </div>

      <!-- Avatar + info -->
      <div class="flex flex-col md:flex-row gap-4 p-6 pt-0">
        <div class="relative -mt-10 shrink-0 group">
          <div class="relative w-24 h-24 md:w-32 md:h-32">
            <img :src="avatarUrl" class="w-full h-full rounded-2xl border-4 object-cover shadow-lg transition-all"
              :style="{ borderColor: 'var(--color-surface)' }" />
            
            <!-- Avatar Uploading -->
            <div v-if="uploadingAvatar" class="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center text-white backdrop-blur-[2px]">
              <Loader2 class="animate-spin" :size="24" />
            </div>

            <label v-else class="absolute -bottom-1 -right-1 cursor-pointer w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
              :style="{ backgroundColor: 'var(--color-primary)' }">
              <input type="file" accept="image/*" class="hidden" @change="onAvatarSelect" />
              <Camera :size="16" class="text-white" />
            </label>
          </div>
        </div>
        <div class="flex-1 pt-2 md:pt-4">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 class="text-xl md:text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">
                {{ auth.user?.nom || 'Mon Profil' }}
              </h1>
              <p class="text-sm mt-0.5 opacity-60" :style="{ color: 'var(--color-text-main)' }">
                Membre depuis le {{ formatDate(auth.user?.created_at) }}
              </p>
            
            </div>
            <router-link :to="{ name: 'PublicProfile', params: { id: auth.user?.id || '0' } }"
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]"
              :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-sub)' }">
              <Eye :size="16" /> Aperçu Boutique
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Infos de la boutique -->
      <div class="rounded-2xl border p-6 space-y-4 shadow-sm"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <h2 class="font-black text-base flex items-center gap-2" :style="{ color: 'var(--color-text-main)' }">
          <span class="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
            <Store :size="18" />
          </span>
          Informations Générales
        </h2>

        <div class="space-y-4 pt-2">
          <div>
            <label class="block text-xs font-black uppercase tracking-widest mb-1.5 opacity-40">Nom de la boutique / Marque</label>
            <input v-model="shopForm.nom" placeholder="Ex: Jean Boutique, Star Store..."
              class="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
          </div>

          <div>
            <label class="block text-xs font-black uppercase tracking-widest mb-1.5 opacity-40">Biographie / Description</label>
            <textarea v-model="shopForm.bio" rows="4" placeholder="Décrivez ce que vous vendez et votre expertise..."
              class="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none focus:border-[var(--color-primary)] transition-colors"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-black uppercase tracking-widest mb-1.5 opacity-40">Téléphone</label>
              <input v-model="shopForm.telephone" placeholder="6XX XXX XXX"
                class="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-widest mb-1.5 opacity-40">Ville</label>
              <input v-model="shopForm.ville" placeholder="Ex: Douala"
                class="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
            </div>
          </div>
        </div>
      </div>

      <!-- Réseaux et liens -->
      <div class="space-y-6">
        <div class="rounded-2xl border p-6 space-y-4 shadow-sm"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <h2 class="font-black text-base flex items-center gap-2" :style="{ color: 'var(--color-text-main)' }">
            <span class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Globe :size="18" />
            </span>
            Réseaux & Contact
          </h2>

          <div class="space-y-4 pt-2">
            <div>
              <label class="block text-xs font-black uppercase tracking-widest mb-1.5 opacity-40">Site Web (Optionnel)</label>
              <input v-model="shopForm.website" placeholder="https://votre-site.com"
                class="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-blue-500 transition-colors"
                :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-widest mb-1.5 opacity-40">Numéro WhatsApp Business</label>
              <input v-model="shopForm.whatsapp" placeholder="+237 6XXXXXXXX"
                class="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-green-500 transition-colors"
                :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
            </div>

            <div>
              <label class="block text-xs font-black uppercase tracking-widest mb-1.5 opacity-40">Identifiant Instagram</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-sm font-bold">@</span>
                <input v-model="shopForm.instagram" placeholder="Identifiant"
                  class="w-full pl-8 pr-4 py-3 rounded-xl border text-sm outline-none focus:border-pink-500 transition-colors"
                  :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
              </div>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="rounded-2xl border p-6 space-y-3 shadow-sm bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)]"
          :style="{ borderColor: 'var(--color-border)' }">
          <h2 class="font-black text-xs uppercase tracking-[0.2em] opacity-40 mb-2">Actions Rapides</h2>
          
          <div class="grid grid-cols-2 gap-3">
            <router-link :to="{ name: 'my-products', query: { add: 'true' } }"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl font-bold text-xs bg-[var(--color-primary)] text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Plus :size="20" /> Nouveau Produit
            </router-link>
            
            <router-link :to="{ name: 'vendeur-orders' }"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl font-bold text-xs border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:scale-105 active:scale-95"
              :style="{ color: 'var(--color-text-main)' }">
              <ShoppingCart :size="20" class="text-orange-500" /> Ventes (Commandes)
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Save button -->
    <div class="sticky bottom-6 flex flex-col items-end gap-3 z-20">
      <!-- Feedback messages -->
      <transition name="slide-up">
        <div v-if="saveSuccess" class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-500 text-white font-black text-sm shadow-xl">
          <Check :size="18" /> Boutique mise à jour !
        </div>
      </transition>
      
      <transition name="slide-up">
        <div v-if="saveError" class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500 text-white font-black text-sm shadow-xl">
          <X :size="18" /> {{ saveError }}
        </div>
      </transition>

      <button @click="saveSettings" :disabled="saving"
        class="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-sm text-white shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 group"
        :style="{ backgroundColor: 'var(--color-primary)' }">
        <Save v-if="!saving" :size="20" class="group-hover:rotate-12 transition-transform" />
        <Loader2 v-else class="animate-spin" :size="20" />
        {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Camera, Store, Globe, Eye, Zap, Plus, ShoppingCart, TrendingUp, Save, Loader2, Check, X } from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth.js';
import apiClient from '../../api/index.js';
import { CONFIG } from '../../config/index.js';
import { useSeo } from '../../composables/useSeo.js';

useSeo({ 
  title: 'Paramètres Boutique - SASAYEE', 
  description: 'Gérez l\'apparence et les informations de votre boutique vendeur sur SASAYEE.' 
});

const auth = useAuthStore();
const saving = ref(false);
const uploadingAvatar = ref(false);
const uploadingCover = ref(false);

const avatarUrl = computed(() => {
  const photo = auth.user?.photo;
  if (!photo) return `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.nom || 'V')}&background=6366f1&color=fff&size=256`;
  return photo.startsWith('http') ? photo : `${CONFIG.STORAGE_URL}${photo}`;
});

const coverUrl = computed(() => {
  const cover = auth.user?.cover;
  if (!cover) return null;
  return cover.startsWith('http') ? cover : `${CONFIG.STORAGE_URL}${cover}`;
});

const shopForm = ref({
  nom: auth.user?.nom || '',
  bio: auth.user?.bio || '',
  telephone: auth.user?.telephone || '',
  ville: auth.user?.ville || '',
  website: auth.user?.website || '',
  whatsapp: auth.user?.whatsapp || '',
  instagram: auth.user?.instagram || '',
});

const onCoverSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    saveError.value = "La bannière est trop lourde (max 5 Mo)";
    setTimeout(() => { saveError.value = ''; }, 4000);
    return;
  }

  uploadingCover.value = true;
  const formData = new FormData();
  formData.append('cover', file);

  try {
    await apiClient.post('/profile/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    await auth.fetchUser();
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false; }, 3000);
  } catch (err) {
    console.error(err);
    saveError.value = err.response?.data?.message || "Erreur lors de l'envoi de la bannière";
    setTimeout(() => { saveError.value = ''; }, 4000);
  } finally {
    uploadingCover.value = false;
  }
};

const onAvatarSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    saveError.value = "La photo est trop lourde (max 2 Mo)";
    setTimeout(() => { saveError.value = ''; }, 4000);
    return;
  }

  uploadingAvatar.value = true;
  const formData = new FormData();
  formData.append('photo', file);

  try {
    await apiClient.post('/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    await auth.fetchUser();
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false; }, 3000);
  } catch (err) {
    console.error(err);
    saveError.value = err.response?.data?.message || "Erreur lors de l'envoi de la photo";
    setTimeout(() => { saveError.value = ''; }, 4000);
  } finally {
    uploadingAvatar.value = false;
  }
};

const saveSuccess = ref(false);
const saveError = ref('');

const saveSettings = async () => {
  saving.value = true;
  saveSuccess.value = false;
  saveError.value = '';
  try {
    await apiClient.post('/updateProfile', shopForm.value);
    await auth.fetchUser();
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false; }, 3500);
  } catch (e) {
    console.error(e);
    saveError.value = e?.response?.data?.message || 'Erreur lors de la sauvegarde.';
    setTimeout(() => { saveError.value = ''; }, 4000);
  } finally {
    saving.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '...';
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
};

onMounted(() => {
  if (auth.user) {
    shopForm.value = {
      nom: auth.user.nom || '',
      bio: auth.user.bio || '',
      telephone: auth.user.telephone || '',
      ville: auth.user.ville || '',
      website: auth.user.website || '',
      whatsapp: auth.user.whatsapp || '',
      instagram: auth.user.instagram || '',
    };
  }
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>

