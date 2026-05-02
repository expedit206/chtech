<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade-backdrop">
      <div
        v-if="cartStore.isDrawerOpen"
        class="fixed inset-0 z-[88] bg-black/50 backdrop-blur-sm"
        @click="cartStore.isDrawerOpen = false"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="slide-drawer">
      <div
        v-if="cartStore.isDrawerOpen"
        class="fixed top-0 right-0 h-full w-full max-w-md z-[90] flex flex-col shadow-2xl"
        :style="{ backgroundColor: 'var(--color-surface)' }"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] shrink-0"
        >
          <div class="flex items-center gap-3">
            <ShoppingCart
              :size="20"
              :style="{ color: 'var(--color-primary)' }"
            />
            <h2
              class="text-lg font-black"
              :style="{ color: 'var(--color-text-main)' }"
            >
              Mon Panier
              <span class="ml-2 text-sm font-bold opacity-50"
                >({{ cartStore.totalItems }} article{{
                  cartStore.totalItems > 1 ? "s" : ""
                }})</span
              >
            </h2>
          </div>
          <button
            @click="cartStore.isDrawerOpen = false"
            class="p-2 rounded-full transition-colors hover:bg-[var(--color-border)]/40"
            :style="{ color: 'var(--color-text-sub)' }"
          >
            <X :size="20" />
          </button>
        </div>

        <!-- Items list -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <!-- Empty state -->
          <div
            v-if="cartStore.isEmpty"
            class="flex flex-col items-center justify-center h-full gap-4 text-center px-8"
          >
            <div
              class="w-20 h-20 rounded-2xl bg-[var(--color-border)]/20 flex items-center justify-center"
            >
              <ShoppingCart
                :size="36"
                class="opacity-30"
                :style="{ color: 'var(--color-text-sub)' }"
              />
            </div>
            <p
              class="font-bold text-lg"
              :style="{ color: 'var(--color-text-main)' }"
            >
              Votre panier est vide
            </p>
            <p
              class="text-sm opacity-60"
              :style="{ color: 'var(--color-text-sub)' }"
            >
              Ajoutez des produits depuis la marketplace
            </p>
            <router-link
              :to="{ name: 'Home' }"
              @click="cartStore.isDrawerOpen = false"
              class="mt-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition hover:opacity-90 active:scale-95"
              :style="{ backgroundColor: 'var(--color-primary)' }"
            >
              Explorer la marketplace
            </router-link>
          </div>

          <!-- Cart items -->
          <ul v-else class="p-4 space-y-3">
            <li
              v-for="item in cartStore.items"
              :key="item.productId"
              class="flex gap-4 items-center bg-[var(--color-bg)] rounded-2xl p-3 border border-[var(--color-border)] transition-all hover:border-[var(--color-primary)]/30"
            >
              <!-- Image -->
              <div
                class="w-16 h-16 rounded-xl overflow-hidden border border-[var(--color-border)] shrink-0 bg-[var(--color-surface)]"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
                <div
                  v-else
                  class="w-full h-full flex rounded-full items-center justify-center opacity-30"
                >
                  <Package :size="24" />
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <router-link
                  :to="{ name: 'DetailProduit', params: { slug: item.slug } }"
                  @click="cartStore.isDrawerOpen = false"
                  class="font-bold text-sm line-clamp-2 leading-snug hover:underline"
                  :style="{ color: 'var(--color-text-main)' }"
                >
                  {{ item.name }}
                </router-link>
                <p
                  class="text-xs font-black mt-1"
                  :style="{ color: 'var(--color-primary)' }"
                >
                  {{ formatMoney(item.priceRaw * item.quantity) }}
                </p>
                <p
                  class="text-[10px] opacity-50 mt-0.5"
                  :style="{ color: 'var(--color-text-sub)' }"
                >
                  {{ formatMoney(item.priceRaw) }} × {{ item.quantity }}
                </p>
              </div>

              <!-- Quantity + Remove -->
              <div class="flex flex-col items-end gap-2 shrink-0">
                <button
                  @click="cartStore.removeItem(item.productId)"
                  class="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 :size="14" />
                </button>
                <div
                  class="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden"
                >
                  <button
                    @click="
                      cartStore.updateQuantity(
                        item.productId,
                        item.quantity - 1,
                      )
                    "
                    class="w-7 h-7 flex items-center justify-center transition-colors hover:bg-[var(--color-primary)]/10"
                    :style="{ color: 'var(--color-primary)' }"
                    :disabled="item.quantity <= 1"
                  >
                    <Minus :size="12" />
                  </button>
                  <span
                    class="text-xs font-black w-6 text-center"
                    :style="{ color: 'var(--color-text-main)' }"
                  >
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="
                      cartStore.updateQuantity(
                        item.productId,
                        item.quantity + 1,
                      )
                    "
                    class="w-7 h-7 flex items-center justify-center transition-colors hover:bg-[var(--color-primary)]/10"
                    :style="{ color: 'var(--color-primary)' }"
                    :disabled="item.quantity >= item.maxStock"
                  >
                    <Plus :size="12" />
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <div
          v-if="!cartStore.isEmpty"
          class="shrink-0 border-t border-[var(--color-border)] p-4 space-y-3"
        >
          <!-- Total -->
          <div class="flex justify-between items-center">
            <span
              class="text-sm font-bold"
              :style="{ color: 'var(--color-text-sub)' }"
              >Total estimé</span
            >
            <span
              class="text-xl font-black underline"
              :style="{ color: 'var(--color-primary)' }"
              >{{ formatMoney(cartStore.totalPrice) }}</span
            >
          </div>

          <!-- Delivery address (optional) -->
          <div>
            <label
              class="text-[10px] font-black tracking-wider opacity-60 mb-1 flex items-center gap-1.5"
              :style="{ color: 'var(--color-text-sub)' }"
            >
              <MapPin :size="11" />
              Adresse de livraison
              <span class="opacity-50 normal-case font-medium"
                >(optionnel)</span
              >
            </label>
            <input
              v-model="deliveryAddress"
              type="text"
              placeholder="Ex: Quartier Bastos, Rue 1.820, Yaoundé"
              class="w-full px-3 py-2 rounded border text-sm outline-none transition-all"
              :style="{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text-main)',
              }"
              @focus="$event.target.style.borderColor = 'var(--color-primary)'"
              @blur="$event.target.style.borderColor = 'var(--color-border)'"
            />
          </div>

          <!-- CTA -->
          <button
            @click="proceedToChat"
            :disabled="isProceedingToChat"
            class="w-full py-2 rounded font-black text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 hover:opacity-90 disabled:opacity-60"
            :style="{ backgroundColor: 'var(--color-primary)' }"
          >
            <i v-if="isProceedingToChat" class="fas fa-spinner fa-spin" />
            <MessageCircle v-else :size="18" />
            <span>{{
              isProceedingToChat
                ? "Ouverture du chat..."
                : "Passer une commande"
            }}</span>
          </button>

          <button
            @click="cartStore.clearCart()"
            class="w-full py-2 rounded-xl text-xs font-bold transition-colors hover:bg-red-500/10 hover:text-red-500"
            :style="{ color: 'var(--color-text-sub)' }"
          >
          <span class="flex items-center justify-center gap-2">
            <X :size="20" class="dark:hover:bg-red-500" /> Vider le panier
          </span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  ShoppingCart,
  X,
  Trash2,
  Minus,
  Plus,
  Package,
  MessageCircle,
  MapPin,
} from "lucide-vue-next";
import { useCartStore } from "../../stores/cart.js";
import { useMessageStore } from "../../stores/messages.js";
import { useAuthStore } from "../../stores/auth.js";
import { useAlertStore } from "../../stores/alert.js";
import apiClient from "../../api/index.js";

const cartStore = useCartStore();
const messageStore = useMessageStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const router = useRouter();

const isProceedingToChat = ref(false);
const deliveryAddress = ref("");

const formatMoney = (amount) =>
  `${Number(amount || 0).toLocaleString("fr-FR")} FCFA`;

const proceedToChat = async () => {
  if (!authStore.isAuthenticated) {
    alertStore.showAlert({
      title: "Connexion requise",
      message: "Veuillez vous connecter pour passer une commande.",
      type: "warning",
      confirmText: "Se connecter",
      showCancel: true,
      onConfirm: () =>
        router.push({
          name: "Login",
          query: { redirect: router.currentRoute.value.fullPath },
        }),
    });
    return;
  }

  isProceedingToChat.value = true;

  try {
    const response = await apiClient.get("/chat/support-admin");
    const adminId = response.data.admin_id;

    if (!adminId) {
      alertStore.showAlert({
        title: "Erreur",
        message: "Service client indisponible.",
        type: "error",
      });
      return;
    }

    // Stocker le panier + adresse (pas de message manuel — il est généré automatiquement)
    messageStore.setCartItems(cartStore.toPayload(), {
      deliveryAddress: deliveryAddress.value.trim() || null,
    });

    cartStore.isDrawerOpen = false;
    await router.push({ name: "messages", params: { receiverId: adminId } });

    cartStore.clearCart();
    deliveryAddress.value = "";
  } catch (err) {
    console.error("Erreur panier → chat:", err);
    alertStore.showAlert({
      title: "Erreur",
      message: "Impossible d'ouvrir le chat. Veuillez réessayer.",
      type: "error",
    });
  } finally {
    isProceedingToChat.value = false;
  }
};
</script>

<style scoped>
.fade-backdrop-enter-active,
.fade-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.fade-backdrop-enter-from,
.fade-backdrop-leave-to {
  opacity: 0;
}

.slide-drawer-enter-active,
.slide-drawer-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-drawer-enter-from,
.slide-drawer-leave-to {
  transform: translateX(100%);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-sub);
}
</style>
