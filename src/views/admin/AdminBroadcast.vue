<template>
  <div class="p-4 md:p-8 animate-fade-in">
    <div class="mb-6">
      <h1 class="text-2xl font-black" :style="{ color: 'var(--color-text-main)' }">Broadcast</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">Envoyer un message à tous les utilisateurs</p>
    </div>


    <div class="max-w-2xl mx-auto">
      <!-- Info banner -->
      <div class="flex items-start gap-3 p-4 rounded-2xl mb-8 border"
        style="background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.2)">
        <AlertTriangle :size="18" class="text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-bold text-red-400">Utilisation avec précaution</p>
          <p class="text-xs mt-0.5" :style="{ color: 'var(--color-text-sub)' }">
            Ce message sera envoyé à tous les utilisateurs de la plateforme. Assurez-vous que le contenu est important et pertinent.
          </p>
        </div>
      </div>

      <!-- Form -->
      <div class="rounded-2xl border p-8"
        :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
        <form @submit.prevent="sendBroadcast" class="space-y-5">
          <div>
            <label class="block text-xs font-black uppercase tracking-wide mb-2 opacity-60"
              :style="{ color: 'var(--color-text-sub)' }">Titre du message</label>
            <input v-model="form.title" required maxlength="100"
              placeholder="Ex: Mise à jour importante de SASAYEE"
              class="w-full px-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)', '--tw-ring-color': 'var(--color-primary)' }" />
            <p class="text-right text-xs opacity-40 mt-1">{{ form.title.length }}/100</p>
          </div>

          <div>
            <label class="block text-xs font-black uppercase tracking-wide mb-2 opacity-60"
              :style="{ color: 'var(--color-text-sub)' }">Contenu du message</label>
            <textarea v-model="form.message" required maxlength="500" rows="5"
              placeholder="Rédigez votre message ici..."
              class="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition"
              :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
            <p class="text-right text-xs opacity-40 mt-1">{{ form.message.length }}/500</p>
          </div>

          <div>
            <label class="block text-xs font-black uppercase tracking-wide mb-2 opacity-60"
              :style="{ color: 'var(--color-text-sub)' }">Type de notification</label>
            <div class="grid grid-cols-3 gap-3">
              <label v-for="t in types" :key="t.value"
                class="flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all"
                :style="form.type === t.value
                  ? { borderColor: t.color, backgroundColor: t.color + '12' }
                  : { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }">
                <input type="radio" v-model="form.type" :value="t.value" class="sr-only" />
                <component :is="t.icon" :size="20" :style="{ color: form.type === t.value ? t.color : 'var(--color-text-sub)' }" />
                <span class="text-xs font-bold" :style="{ color: form.type === t.value ? t.color : 'var(--color-text-sub)' }">
                  {{ t.label }}
                </span>
              </label>
            </div>
          </div>

          <!-- Preview -->
          <div v-if="form.title || form.message" class="rounded-2xl border p-4"
            :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
            <p class="text-xs font-black uppercase tracking-wide mb-3 opacity-40"
              :style="{ color: 'var(--color-text-sub)' }">Aperçu</p>
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: selectedType.color + '20', color: selectedType.color }">
                <component :is="selectedType.icon" :size="18" />
              </div>
              <div>
                <p class="font-bold text-sm" :style="{ color: 'var(--color-text-main)' }">{{ form.title || '...' }}</p>
                <p class="text-xs mt-1 opacity-70" :style="{ color: 'var(--color-text-sub)' }">{{ form.message || '...' }}</p>
              </div>
            </div>
          </div>

          <button type="submit" :disabled="sending || !form.title || !form.message"
            class="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :style="{ backgroundColor: 'var(--color-primary)', color: 'white' }">
            <component :is="sending ? Loader2 : Megaphone" :size="18" :class="sending ? 'animate-spin' : ''" />
            {{ sending ? 'Envoi en cours...' : 'Envoyer à tous les utilisateurs' }}
          </button>
        </form>
      </div>

      <!-- History -->
      <div v-if="history.length > 0" class="mt-8">
        <h2 class="font-black mb-4 text-sm" :style="{ color: 'var(--color-text-main)' }">Messages envoyés</h2>
        <div class="space-y-3">
          <div v-for="h in history" :key="h.id" class="rounded-2xl border p-4"
            :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-bold text-sm truncate" :style="{ color: 'var(--color-text-main)' }">{{ h.title }}</p>
                <p class="text-xs mt-0.5 opacity-60 line-clamp-2" :style="{ color: 'var(--color-text-sub)' }">{{ h.message }}</p>
              </div>
              <span class="text-[10px] opacity-40 flex-shrink-0">{{ new Date(h.sent_at).toLocaleDateString('fr-FR') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Megaphone, AlertTriangle, Bell, Info, Loader2, Zap } from 'lucide-vue-next';

import apiClient from '../../api/index.js';

const sending = ref(false);
const history = ref([]);

const form = ref({ title: '', message: '', type: 'info' });

const types = [
  { value: 'info', label: 'Info', icon: Info, color: '#6366f1' },
  { value: 'alert', label: 'Alerte', icon: AlertTriangle, color: '#f59e0b' },
  { value: 'promo', label: 'Promo', icon: Zap, color: '#22c55e' },
];

const selectedType = computed(() => types.find(t => t.value === form.value.type) ?? types[0]);

const sendBroadcast = async () => {
  if (!confirm('Envoyer ce message à tous les utilisateurs ?')) return;
  sending.value = true;
  try {
    await apiClient.post('/admin/chat/broadcast', form.value);
    history.value.unshift({ ...form.value, id: Date.now(), sent_at: new Date().toISOString() });
    form.value = { title: '', message: '', type: 'info' };
    alert('✅ Message envoyé avec succès !');
  } catch (e) {
    console.error(e);
    alert('Erreur lors de l\'envoi.');
  } finally {
    sending.value = false;
  }
};
</script>
