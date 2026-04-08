<template>
  <div class="p-4 md:p-8 space-y-8 animate-fade-in">
    <!-- Header with cover -->
    <div class="rounded-3xl overflow-hidden relative" :style="{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }">
      <!-- Cover banner -->
      <div class="h-36 md:h-48 relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <img v-if="shopForm.cover" :src="shopForm.cover" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/20"></div>
        <label class="absolute bottom-3 right-3 cursor-pointer">
          <input type="file" accept="image/*" class="hidden" @change="onCoverSelect" />
          <span class="flex items-center gap-2 px-3 py-1.5 bg-black/50 text-white rounded-xl text-xs font-bold backdrop-blur-sm hover:bg-black/70 transition">
            <Camera :size="14" /> Changer la bannière
          </span>
        </label>
      </div>

      <!-- Avatar + info -->
      <div class="flex flex-col md:flex-row gap-4 p-6 pt-0">
        <div class="relative -mt-10 shrink-0">
          <img :src="avatarUrl" class="w-20 h-20 rounded-2xl border-4 object-cover shadow-lg"
            :style="{ borderColor: 'var(--color-surface)' }" />
          <label class="absolute -bottom-1 -right-1 cursor-pointer w-7 h-7 rounded-full flex items-center justify-center shadow-md"
            :style="{ backgroundColor: 'var(--color-primary)' }">
            <input type="file" accept="image/*" class="hidden" @change="onAvatarSelect" />
            <Camera :size="12" class="text-white" />
          </label>
        </div>
        <div class="flex-1 pt-2 md:pt-4">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 class="text-xl font-black" :style="{ color: 'var(--color-text-main)' }">
                {{ auth.user?.nom || 'Mon Profil' }}
              </h1>
              <p class="text-sm mt-0.5" :style="{ color: 'var(--color-text-sub)' }">
                Vendeur · {{ auth.user?.email }}
              </p>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
                  :style="{ backgroundColor: 'var(--color-primary)' }">
                  ✓ Vendeur vérifié
                </span>
              </div>
            </div>
            <router-link :to="{ name: 'PublicProfile', params: { id: auth.user?.id || '0' } }"
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all hover:bg-opacity-80"
              :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-sub)' }">
              <Eye :size="16" /> Voir ma boutique publique
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Infos de la boutique -->
      <div class="rounded-2xl border p-6 space-y-4"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <h2 class="font-black text-base" :style="{ color: 'var(--color-text-main)' }">
          <Store :size="18" class="inline mr-2" />Informations de la boutique
        </h2>

        <div>
          <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Nom complet</label>
          <input v-model="shopForm.nom" placeholder="Votre nom commercial"
            class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
        </div>

        <div>
          <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Description / Bio</label>
          <textarea v-model="shopForm.bio" rows="4" placeholder="Décrivez votre boutique..."
            class="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
            :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }"></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Numéro de téléphone</label>
          <input v-model="shopForm.telephone" placeholder="+237 6XX XXX XXX"
            class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
        </div>

        <div>
          <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Ville / Localisation</label>
          <input v-model="shopForm.ville" placeholder="ex: Douala, Yaoundé..."
            class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
        </div>
      </div>

      <!-- Réseaux et liens -->
      <div class="space-y-4">
        <div class="rounded-2xl border p-6 space-y-4"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <h2 class="font-black text-base" :style="{ color: 'var(--color-text-main)' }">
            <Globe :size="18" class="inline mr-2" />Réseaux & Liens
          </h2>

          <div>
            <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Site web</label>
            <input v-model="shopForm.website" placeholder="https://..."
              class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
          </div>

          <div>
            <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">WhatsApp Business</label>
            <input v-model="shopForm.whatsapp" placeholder="+237..."
              class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
          </div>

          <div>
            <label class="block text-xs font-bold mb-1.5 opacity-60" :style="{ color: 'var(--color-text-sub)' }">Instagram</label>
            <input v-model="shopForm.instagram" placeholder="@username"
              class="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
          </div>
        </div>

        <!-- Quick actions -->
        <div class="rounded-2xl border p-6 space-y-3"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <h2 class="font-black text-base" :style="{ color: 'var(--color-text-main)' }">
            <Zap :size="18" class="inline mr-2" />Actions rapides
          </h2>
          <router-link :to="{ name: 'my-products', query: { add: 'true' } }"
            class="flex items-center gap-3 p-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
            :style="{ backgroundColor: 'var(--color-primary)' }">
            <Plus :size="18" /> Ajouter un produit
          </router-link>
          <router-link :to="{ name: 'vendeur-orders' }"
            class="flex items-center gap-3 p-3 rounded-xl font-bold text-sm border transition-all"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
            <ShoppingCart :size="18" /> Voir les commandes clients
          </router-link>
          <router-link :to="{ name: 'seller-stats' }"
            class="flex items-center gap-3 p-3 rounded-xl font-bold text-sm border transition-all"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }">
            <TrendingUp :size="18" /> Mes statistiques
          </router-link>
        </div>
      </div>
    </div>

    <!-- Save button -->
    <div class="flex justify-end">
      <button @click="saveSettings" :disabled="saving"
        class="flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
        :style="{ backgroundColor: 'var(--color-primary)' }">
        <Save :size="18" />
        {{ saving ? 'Enregistrement...' : 'Sauvegarder les modifications' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Camera, Store, Globe, Eye, Zap, Plus, ShoppingCart, TrendingUp, Save } from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth.js';
import apiClient from '../../api/index.js';
import { CONFIG } from '../../config/index.js';
import { useSeo } from '../../composables/useSeo.js';

useSeo({ title: 'Ma Boutique - SASAYEE', description: 'Gérez les informations de votre boutique vendeur.' });

const auth = useAuthStore();
const saving = ref(false);

const avatarUrl = computed(() => {
  const photo = auth.user?.photo;
  if (!photo) return `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.nom || 'V')}&background=6366f1&color=fff&size=128`;
  return photo.startsWith('http') ? photo : `${CONFIG.STORAGE_URL}${photo}`;
});

const shopForm = ref({
  nom: auth.user?.nom || '',
  bio: auth.user?.bio || '',
  telephone: auth.user?.telephone || '',
  ville: auth.user?.ville || '',
  website: auth.user?.website || '',
  whatsapp: auth.user?.whatsapp || '',
  instagram: auth.user?.instagram || '',
  cover: auth.user?.cover || '',
});

const onCoverSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  shopForm.value.cover = URL.createObjectURL(file);
};

const onAvatarSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  // Show locally
  const url = URL.createObjectURL(file);
  // Would need an upload endpoint
};

const saveSettings = async () => {
  saving.value = true;
  try {
    await apiClient.put('/user/profile', {
      nom: shopForm.value.nom,
      bio: shopForm.value.bio,
      telephone: shopForm.value.telephone,
      ville: shopForm.value.ville,
      website: shopForm.value.website,
      whatsapp: shopForm.value.whatsapp,
      instagram: shopForm.value.instagram,
    });
    // Refresh user data
    await auth.fetchUser?.();
    alert('Boutique mise à jour avec succès !');
  } catch (e) {
    console.error(e);
    alert('Erreur lors de la sauvegarde.');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  // Refresh form with current user data
  if (auth.user) {
    shopForm.value = {
      nom: auth.user.nom || '',
      bio: auth.user.bio || '',
      telephone: auth.user.telephone || '',
      ville: auth.user.ville || '',
      website: auth.user.website || '',
      whatsapp: auth.user.whatsapp || '',
      instagram: auth.user.instagram || '',
      cover: auth.user.cover || '',
    };
  }
});
</script>
