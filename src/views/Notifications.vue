<template>
  <div class="bg-[var(--color-bg)] min-h-screen py-8 md:py-16">
    <div class="max-w-4xl mx-auto px-4">
      <!-- En-tête -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 class="text-3xl font-black tracking-tight mb-2 flex items-center gap-4" :style="{ color: 'var(--color-text-main)' }">
            <Bell class="text-[var(--color-primary)]" :size="32" />
            Centre de Notifications
            <span v-if="unreadCount > 0"
              class="px-3 py-1 bg-[var(--color-primary)] text-white text-base font-black rounded-full animate-pulse">
              {{ unreadCount }}
            </span>
          </h1>
          <p class="text-[var(--color-text-sub)] opacity-70 font-medium text-sm">
            Restez informé de toute l'activité sur votre compte SASAYEE
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button v-if="unreadCount > 0" @click="store.markAllAsRead"
            class="text-sm font-black flex items-center gap-2 transition-all hover:opacity-80 active:scale-95"
            :style="{ color: 'var(--color-primary)' }">
            <CheckCheck :size="18" />
            Tout marquer comme lu
          </button>
          <button v-if="notifications.length > 0" @click="confirmClearAll"
            class="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl text-[var(--color-text-sub)] hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95">
            <Trash2 :size="18" />
          </button>
        </div>
      </div>

      <!-- Filtres -->
      <div class="flex gap-2 mb-8 overflow-x-auto pb-4 no-scrollbar">
        <button v-for="filter in filters" :key="filter.value" @click="store.setFilter(filter.value)" :class="[
          'flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-black transition-all active:scale-95 border flex items-center gap-2',
          store.activeFilter === filter.value
            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20'
            : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-sub)] opacity-70 hover:opacity-100 hover:border-[var(--color-primary)]',
        ]">
          <component :is="filter.icon" :size="16" />
          {{ filter.label }}
          <span v-if="filter.unreadCount > 0" class="ml-1.5 px-2 py-0.5 bg-black/10 rounded-full text-[10px] font-black">
            {{ filter.unreadCount }}
          </span>
        </button>
      </div>

      <!-- Main Content -->
      <div class="relative min-h-[400px]">
        <!-- Skeleton chargement -->
        <div v-if="loading && notifications.length === 0" class="space-y-4">
          <div v-for="i in 5" :key="i" class="bg-[var(--color-surface)] rounded-[32px] p-6 border border-[var(--color-border)] animate-pulse">
            <div class="flex items-start gap-5">
              <div class="w-14 h-14 bg-black/5 rounded-[24px] flex-shrink-0"></div>
              <div class="flex-1 space-y-3">
                <div class="h-5 bg-black/5 rounded-lg w-1/3"></div>
                <div class="h-4 bg-black/5 rounded-lg w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Liste des notifications -->
        <div v-else-if="filteredNotifications.length > 0" class="space-y-4">
          <TransitionGroup name="notif-list">
            <div v-for="notif in filteredNotifications" :key="notif.id" @click="handleNotifClick(notif)" :class="[
              'group bg-[var(--color-surface)] rounded-[32px] p-6 border border-[var(--color-border)] shadow-sm cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1',
              notif.read_at ? '' : 'ring-2 ring-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.02]',
            ]">
              <div class="flex items-start gap-5">
                <!-- Icône -->
                <div
                  :class="`w-14 h-14 rounded-[24px] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner`"
                  :style="{ backgroundColor: getBgColor(notif.data.type) }">
                  <component :is="getIcon(notif.data.type)" :size="24" :style="{ color: getColor(notif.data.type) }" />
                </div>

                <!-- Contenu -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <span :class="[
                          'text-[10px] font-black uppercase tracking-widest',
                          notif.read_at ? 'text-[var(--color-text-sub)] opacity-50' : 'text-[var(--color-primary)]',
                        ]">
                          {{ notif.data.title }}
                        </span>
                        <span v-if="!notif.read_at" class="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-ping"></span>
                      </div>
                      <p :class="[
                        'text-base font-bold leading-snug mb-1',
                        notif.read_at ? 'text-[var(--color-text-main)] opacity-70' : 'text-[var(--color-text-main)]',
                      ]">
                        {{ notif.data.message }}
                      </p>
                      <p class="text-xs font-medium opacity-40">
                        {{ formatTime(notif.created_at) }}
                      </p>
                    </div>

                    <!-- Bouton supprimer -->
                    <button @click.stop="store.deleteNotification(notif.id)"
                      class="opacity-0 group-hover:opacity-100 p-2.5 text-[var(--color-text-sub)] hover:text-red-500 hover:bg-red-500/10 transition-all rounded-2xl active:scale-95">
                      <X :size="18" />
                    </button>
                  </div>

                  <!-- Action Link if present -->
                  <div v-if="notif.data.action_url" class="mt-4 flex items-center gap-3">
                    <button
                      class="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-wider transition-all hover:bg-[var(--color-primary)]/90 active:scale-95">
                      Voir les détails
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Charger plus -->
          <div v-if="pagination.current_page < pagination.last_page" class="text-center mt-8">
            <button @click="loadMore" :disabled="loading"
              class="px-10 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] text-sm font-black transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95 disabled:opacity-50">
              <span v-if="loading" class="flex items-center gap-2">
                <Loader2 class="animate-spin" :size="18" />
                Chargement...
              </span>
              <span v-else>Charger plus de notifications</span>
            </button>
          </div>
        </div>

        <!-- État vide -->
        <div v-else class="bg-[var(--color-surface)] rounded-[40px] p-16 border border-[var(--color-border)] shadow-sm text-center">
          <div class="w-24 h-24 bg-black/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 opacity-20">
            <BellOff :size="48" :style="{ color: 'var(--color-text-sub)' }" />
          </div>
          <h3 class="text-2xl font-black mb-2" :style="{ color: 'var(--color-text-main)' }">
            Aucune notification
          </h3>
          <p class="text-[var(--color-text-sub)] opacity-60 text-sm max-w-xs mx-auto font-medium">
            Vous n'avez pas de notifications
            {{ store.activeFilter !== 'all' ? 'dans cette catégorie' : '' }}
            pour le moment.
          </p>
          <RouterLink to="/"
            class="inline-flex items-center gap-3 mt-8 px-10 py-4 bg-[var(--color-primary)] text-white rounded-[24px] font-black hover:opacity-90 transition-all active:scale-95 text-sm uppercase tracking-wider">
            Explorer les annonces
          </RouterLink>
        </div>
      </div>

      <!-- Paramètres de notification -->
      <div class="mt-16 bg-[var(--color-surface)] rounded-[40px] p-8 md:p-10 border border-[var(--color-border)] shadow-sm">
        <h2 class="text-2xl font-black mb-8 flex items-center gap-4" :style="{ color: 'var(--color-text-main)' }">
          <Settings class="text-[var(--color-primary)]" :size="28" />
          Préférences de notifications
        </h2>
        <div class="space-y-6">
          <div v-for="pref in preferences" :key="pref.key"
            class="flex items-center justify-between py-6 border-b border-[var(--color-border)] last:border-0 hover:bg-black/[0.01] transition-colors -mx-4 px-4 rounded-2xl">
            <div>
              <p class="text-base font-bold text-[var(--color-text-main)] mb-1">
                {{ pref.label }}
              </p>
              <p class="text-sm font-medium opacity-50">
                {{ pref.description }}
              </p>
            </div>
            <button @click="pref.enabled = !pref.enabled" :class="[
              'relative w-14 h-8 rounded-full transition-all duration-300 flex-shrink-0',
              pref.enabled ? 'bg-[var(--color-primary)]' : 'bg-black/10',
            ]">
              <span :class="[
                'absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 transform',
                pref.enabled ? 'translate-x-7' : 'translate-x-1',
              ]"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de confirmation suppression (Mark All) -->
    <Transition name="toast">
      <div v-if="showClearConfirm"
        class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] shadow-2xl p-6 flex items-center gap-6 z-50 min-w-[320px]">
        <div class="flex-1">
          <p class="text-sm font-black mb-1">Tout marquer comme lu ?</p>
          <p class="text-xs opacity-50 font-medium">Vous ne verrez plus les indicateurs de nouveaux messages.</p>
        </div>
        <div class="flex gap-2">
           <button @click="showClearConfirm = false"
            class="px-4 py-2 bg-black/5 rounded-xl text-xs font-black transition active:scale-95">
            Annuler
          </button>
          <button @click="executeClearAll"
            class="px-5 py-2 bg-[var(--color-primary)] text-white rounded-xl text-xs font-black hover:opacity-90 transition shadow-lg shadow-[var(--color-primary)]/20 active:scale-95">
            Confirmer
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useNotificationStore } from '../stores/notifications';
import { 
  Bell, 
  BellOff, 
  ShoppingBag, 
  MessageCircle, 
  CheckCircle, 
  Info,
  Package,
  Wallet,
  Trash2,
  X,
  Settings,
  XCircle,
  Clock,
  CheckCheck,
  Calendar,
  CreditCard,
  Key,
  Loader2
} from 'lucide-vue-next';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const store = useNotificationStore();
const router = useRouter();
const showClearConfirm = ref(false);

const notifications = computed(() => store.notifications);
const unreadCount = computed(() => store.unreadCount);
const loading = computed(() => store.loading);
const pagination = computed(() => store.pagination);

// ── Filtres ──────────────────────────────────────────────────────────────────
const filters = computed(() => [
  {
    value: "all",
    label: "Toutes",
    icon: Bell,
    unreadCount: store.unreadCount,
  },
  {
    value: "message",
    label: "Messages",
    icon: MessageCircle,
    unreadCount: store.notifications.filter(
      (n) => n.data.type === "message" && !n.read_at
    ).length,
  },
  {
    value: "order",
    label: "Commandes",
    icon: Package,
    unreadCount: store.notifications.filter(
      (n) => n.data.type === "order" && !n.read_at
    ).length,
  },
  {
    value: "wallet",
    label: "Paiements",
    icon: Wallet,
    unreadCount: store.notifications.filter(
      (n) => n.data.type === "wallet" && !n.read_at
    ).length,
  },
  {
    value: "sale",
    label: "Ventes",
    icon: ShoppingBag,
    unreadCount: store.notifications.filter(
      (n) => n.data.type === "sale" && !n.read_at
    ).length,
  },
]);

const filteredNotifications = computed(() => {
  if (store.activeFilter === 'all') return notifications.value;
  return notifications.value.filter(n => n.data.type === store.activeFilter);
});

// ── Date relative ─────────────────────────────────────────────────────────
const formatTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
};

// ── Actions ──────────────────────────────────────────────────────────────────
const handleNotifClick = async (notif) => {
  if (!notif.read_at) await store.markAsRead(notif.id);
  if (notif.data.action_url) router.push(notif.data.action_url);
};

const loadMore = () => {
  store.fetchNotifications(pagination.value.current_page + 1);
};

const confirmClearAll = () => {
  showClearConfirm.value = true;
};

const executeClearAll = async () => {
  await store.markAllAsRead();
  showClearConfirm.value = false;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const getIcon = (type) => {
  switch (type) {
    case 'order': return Package;
    case 'sale': return ShoppingBag;
    case 'message': return MessageCircle;
    case 'wallet': return Wallet;
    case 'success': return CheckCircle;
    default: return Info;
  }
};

const getBgColor = (type) => {
  switch (type) {
    case 'order': return 'rgba(59, 130, 246, 0.1)';
    case 'sale': return 'rgba(34, 197, 94, 0.1)';
    case 'message': return 'rgba(168, 85, 247, 0.1)';
    case 'wallet': return 'rgba(234, 179, 8, 0.1)';
    default: return 'rgba(107, 114, 128, 0.1)';
  }
};

const getColor = (type) => {
  switch (type) {
    case 'order': return '#3b82f6';
    case 'sale': return '#22c55e';
    case 'message': return '#a855f7';
    case 'wallet': return '#eab308';
    default: return '#6b7280';
  }
};

const preferences = ref([
  {
    key: "new_properties",
    label: "Nouvelles annonces",
    description: "Recevoir des alertes pour les nouvelles annonces",
    enabled: true,
  },
  {
    key: "visit_confirmation",
    label: "Messages directs",
    description: "Notifications pour les nouveaux messages reçus",
    enabled: true,
  },
  {
    key: "application_updates",
    label: "Mises à jour reventes",
    description: "Alertes quand votre statut de revente change",
    enabled: true,
  },
]);

onMounted(() => {
  store.fetchNotifications();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Transitions liste */
.notif-list-enter-active,
.notif-list-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.notif-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.notif-list-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

/* Toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(40px) scale(0.8);
}
</style>
