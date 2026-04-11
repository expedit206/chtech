<template>
  <div class="relative" v-click-outside="closeDropdown">
    <!-- Bell Icon with Badge -->
    <button 
      @click="toggleDropdown"
      class="p-2.5 rounded-2xl transition-all duration-300 relative group"
      :style="{ 
        backgroundColor: isOpen ? 'var(--color-primary-light)' : 'var(--color-surface)',
        border: '1px solid var(--color-border)'
      }"
    >
      <Bell 
        :size="20" 
        :class="{'animate-tada': unreadCount > 0 && !isOpen}"
        :style="{ color: isOpen ? 'var(--color-primary)' : 'var(--color-text-sub)' }" 
      />
      
      <!-- Unread Badge -->
      <span 
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-black border-2"
        :style="{ 
          backgroundColor: 'var(--color-primary)', 
          color: 'white',
          borderColor: 'var(--color-surface)'
        }"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <transition name="fade-slide">
      <div 
        v-if="isOpen"
        class="absolute right-0 mt-3 w-80 md:w-96 rounded-3xl shadow-2xl overflow-hidden z-[100] border backdrop-blur-xl"
        :style="{ 
          backgroundColor: 'rgba(var(--color-surface-rgb), 0.95)', 
          borderColor: 'var(--color-border)' 
        }"
      >
        <!-- Header -->
        <div class="p-5 flex items-center justify-between border-b" :style="{ borderColor: 'var(--color-border)' }">
          <h3 class="font-black text-lg" :style="{ color: 'var(--color-text-main)' }">Notifications</h3>
          <button 
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-xs font-bold transition-all hover:opacity-70"
            :style="{ color: 'var(--color-primary)' }"
          >
            Tout marquer comme lu
          </button>
        </div>

        <!-- Notifications List -->
        <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
          <div v-if="loading && notifications.length === 0" class="p-10 flex flex-col items-center gap-3">
             <div class="w-8 h-8 border-3 border-t-transparent animate-spin rounded-full" :style="{ borderColor: 'var(--color-primary)' }" />
             <p class="text-xs opacity-50 font-bold">Chargement...</p>
          </div>

          <div v-else-if="notifications.length === 0" class="p-12 flex flex-col items-center gap-4 text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center opacity-10" :style="{ backgroundColor: 'var(--color-text-sub)' }">
              <BellOff :size="32" />
            </div>
            <div>
              <p class="font-black text-sm" :style="{ color: 'var(--color-text-main)' }">Aucune notification</p>
              <p class="text-xs opacity-50 mt-1">Vous serez informé ici de vos activités importantes.</p>
            </div>
          </div>

          <div v-else class="divide-y" :style="{ borderColor: 'var(--color-border)' }">
            <div 
              v-for="notif in notifications" 
              :key="notif.id"
              @click="handleNotificationClick(notif)"
              class="p-4 flex gap-4 cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5 relative group"
              :class="{ 'bg-primary/5': !notif.read_at }"
            >
              <!-- Unread dot -->
              <div v-if="!notif.read_at" class="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: 'var(--color-primary)' }" />
              
              <!-- Icon/Avatar based on type -->
              <div class="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center" :style="{ backgroundColor: getBgColor(notif.data.type) }">
                <component 
                  :is="getIcon(notif.data.type)" 
                  :size="18" 
                  :style="{ color: getColor(notif.data.type) }"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-black mb-0.5 truncate" :style="{ color: 'var(--color-text-main)' }">
                  {{ notif.data.title }}
                </p>
                <p class="text-xs leading-relaxed opacity-70 line-clamp-2" :style="{ color: 'var(--color-text-sub)' }">
                  {{ notif.data.message }}
                </p>
                <p class="text-[10px] mt-2 font-bold opacity-40 uppercase tracking-tighter">
                  {{ formatTime(notif.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t text-center" :style="{ borderColor: 'var(--color-border)' }">
          <router-link 
            to="/notifications" 
            @click="closeDropdown"
            class="text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all"
            :style="{ color: 'var(--color-text-main)' }"
          >
            Voir tout l'historique
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
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
  Wallet
} from 'lucide-vue-next';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const store = useNotificationStore();
const router = useRouter();
const isOpen = ref(false);

const notifications = computed(() => store.notifications.slice(0, 5));
const unreadCount = computed(() => store.unreadCount);
const loading = computed(() => store.loading);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    store.fetchNotifications();
  }
};

const closeDropdown = () => {
  isOpen.value = false;
};

const markAllAsRead = async () => {
  await store.markAllAsRead();
};

const handleNotificationClick = async (notif) => {
  if (!notif.read_at) {
    await store.markAsRead(notif.id);
  }
  
  closeDropdown();
  
  if (notif.data.action_url) {
    router.push(notif.data.action_url);
  }
};

const formatTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
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

// Directive simple pour fermer au clic extérieur
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el._clickOutside);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el._clickOutside);
  }
};

onMounted(() => {
  // Optionnel: fecth initial pour le badge
  store.fetchNotifications();
});
</script>

<style scoped>
.animate-tada {
  animation: tada 1s ease-in-out infinite;
}

@keyframes tada {
  0% { transform: scale(1); }
  10%, 20% { transform: scale(0.9) rotate(-3deg); }
  30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
  40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
  100% { transform: scale(1) rotate(0); }
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}
</style>
