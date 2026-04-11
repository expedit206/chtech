<template>
  <div class="min-h-screen pb-20 pt-24 px-4 md:px-8 max-w-4xl mx-auto">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <h1 class="text-3xl font-black tracking-tight mb-2" :style="{ color: 'var(--color-text-main)' }">
          Centre de Notifications
        </h1>
        <p class="text-[var(--color-text-sub)] opacity-70 font-medium">
          Retrouvez l'historique complet de vos activités
        </p>
      </div>
      
      <div class="flex gap-3">
        <button 
          v-if="unreadCount > 0"
          @click="store.markAllAsRead"
          class="px-6 py-3 rounded-2xl text-sm font-black transition-all active:scale-95 border"
          :style="{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-main)' 
          }"
        >
          Tout marquer comme lu
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="space-y-4">
      <!-- Loading State -->
      <div v-if="loading && notifications.length === 0" class="py-20 flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-t-transparent animate-spin rounded-full mb-4" :style="{ borderColor: 'var(--color-primary)' }" />
        <p class="text-sm font-bold opacity-50">Chargement de vos notifications...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="notifications.length === 0" class="py-32 flex flex-col items-center text-center bg-white/5 backdrop-blur-xl rounded-[40px] border" :style="{ borderColor: 'var(--color-border)' }">
        <div class="w-24 h-24 rounded-[32px] flex items-center justify-center opacity-10 mb-6" :style="{ backgroundColor: 'var(--color-text-sub)' }">
          <BellOff :size="48" />
        </div>
        <h2 class="text-xl font-black mb-2" :style="{ color: 'var(--color-text-main)' }">Rien à signaler !</h2>
        <p class="max-w-xs text-sm opacity-50 px-4" :style="{ color: 'var(--color-text-sub)' }">
          Vos notifications apparaîtront ici au fur et à mesure de vos activités sur SASAYEE.
        </p>
        <router-link to="/" class="mt-8 px-8 py-3 rounded-full text-sm font-black bg-primary text-white" :style="{ backgroundColor: 'var(--color-primary)' }">
          Retour à l'accueil
        </router-link>
      </div>

      <!-- List State -->
      <template v-else>
        <div 
          v-for="notif in notifications" 
          :key="notif.id"
          class="group relative bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border transition-all hover:translate-y-[-2px] hover:shadow-xl"
          :style="{ 
            borderColor: notif.read_at ? 'var(--color-border)' : 'var(--color-primary-light)',
            backgroundColor: notif.read_at ? 'var(--color-surface)' : 'rgba(var(--color-primary-rgb), 0.03)'
          }"
        >
          <!-- Unread Indicator bar -->
          <div v-if="!notif.read_at" class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full" :style="{ backgroundColor: 'var(--color-primary)' }" />

          <div class="flex gap-6">
            <!-- Icon -->
            <div class="w-14 h-14 rounded-3xl flex-shrink-0 flex items-center justify-center shadow-inner" :style="{ backgroundColor: getBgColor(notif.data.type) }">
              <component :is="getIcon(notif.data.type)" :size="24" :style="{ color: getColor(notif.data.type) }" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1 gap-4">
                <h3 class="text-lg font-black truncate pr-10" :style="{ color: 'var(--color-text-main)' }">
                  {{ notif.data.title }}
                </h3>
                <span class="text-[10px] font-black uppercase opacity-40 whitespace-nowrap">
                  {{ formatTime(notif.created_at) }}
                </span>
              </div>
              
              <p class="text-base leading-relaxed opacity-70 mb-4" :style="{ color: 'var(--color-text-sub)' }">
                {{ notif.data.message }}
              </p>

              <div class="flex items-center gap-4">
                <button 
                  v-if="notif.data.action_url"
                  @click="goTo(notif)"
                  class="px-5 py-2 rounded-xl text-xs font-black transition-all hover:scale-105"
                  :style="{ backgroundColor: 'var(--color-primary)', color: 'white' }"
                >
                  Voir les détails
                </button>
                
                <button 
                  v-if="!notif.read_at"
                  @click="store.markAsRead(notif.id)"
                  class="text-xs font-bold opacity-60 hover:opacity-100 transition-all underline decoration-2 underline-offset-4"
                  :style="{ color: 'var(--color-text-main)' }"
                >
                  Marquer comme lu
                </button>

                <button 
                  @click="store.deleteNotification(notif.id)"
                  class="ml-auto p-2 opacity-0 group-hover:opacity-100 transition-all text-red-500 hover:bg-red-500/10 rounded-xl"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination / Load More -->
        <div v-if="pagination.current_page < pagination.last_page" class="py-10 text-center">
          <button 
            @click="loadMore"
            :disabled="loading"
            class="px-10 py-4 rounded-full font-black text-sm border-2 transition-all hover:bg-black/5 active:scale-95 disabled:opacity-50"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }"
          >
            {{ loading ? 'Chargement...' : 'Charger plus de notifications' }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
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
  Trash2
} from 'lucide-vue-next';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const store = useNotificationStore();
const router = useRouter();

const notifications = computed(() => store.notifications);
const unreadCount = computed(() => store.unreadCount);
const loading = computed(() => store.loading);
const pagination = computed(() => store.pagination);

const formatTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
};

const goTo = async (notif) => {
  if (!notif.read_at) await store.markAsRead(notif.id);
  if (notif.data.action_url) router.push(notif.data.action_url);
};

const loadMore = () => {
  store.fetchNotifications(pagination.value.current_page + 1);
};

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

onMounted(() => {
  store.fetchNotifications();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
