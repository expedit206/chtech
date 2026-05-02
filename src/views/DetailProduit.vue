<template>
  <div class="h-8"></div>

  <!-- ===================== LIGHTBOX ===================== -->
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="lightbox.open"
        class="fixed inset-0 z-[999] flex items-center justify-center"
        style="background: rgba(0, 0, 0, 0.92); backdrop-filter: blur(8px)"
        @click.self="closeLightbox"
        @keydown.esc="closeLightbox"
        @keydown.left="prevLightbox"
        @keydown.right="nextLightbox"
        tabindex="0"
        ref="lightboxEl"
      >
        <!-- Close button -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hover:bg-white/20"
        >
          <i class="fas fa-times text-lg"></i>
        </button>

        <!-- Counter -->
        <div
          class="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium tracking-widest"
        >
          {{ lightbox.index + 1 }} / {{ product.photos.length }}
        </div>

        <!-- Prev -->
        <button
          v-if="product.photos.length > 1"
          @click="prevLightbox"
          class="absolute left-3 md:left-6 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white border border-white/20 transition-all hover:bg-white/20 hover:scale-110"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <!-- Main image -->
        <Transition name="img-slide" mode="out-in">
          <img
            :key="lightbox.index"
            :src="product.photos[lightbox.index]"
            :alt="`Photo ${lightbox.index + 1}`"
            class="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
            draggable="false"
          />
        </Transition>

        <!-- Next -->
        <button
          v-if="product.photos.length > 1"
          @click="nextLightbox"
          class="absolute right-3 md:right-6 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white border border-white/20 transition-all hover:bg-white/20 hover:scale-110"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <!-- Thumbnail strip (lightbox bottom) -->
        <div
          v-if="product.photos.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-2xl"
          style="
            background: rgba(255, 255, 255, 0.07);
            backdrop-filter: blur(12px);
          "
        >
          <button
            v-for="(photo, i) in product.photos"
            :key="i"
            @click="lightbox.index = i"
            class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200"
            :class="
              lightbox.index === i
                ? 'border-white scale-110 shadow-lg'
                : 'border-white/20 opacity-50 hover:opacity-80'
            "
          >
            <img :src="photo" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ===================== MAIN PAGE ===================== -->
  <main class="max-w-7xl mx-auto px-4 py-6 md:py-10">
    <!-- Back -->
    <RouterLink
      :to="{ name: 'Home' }"
      class="inline-flex items-center gap-2 mb-6 text-sm font-semibold group"
      :style="{ color: 'var(--color-primary)' }"
    >
      <ArrowLeft
        :size="16"
        :stroke-width="3"
        class="transition-transform group-hover:-translate-x-1"
      />
      Retour aux produits
    </RouterLink>

    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse"
    >
      <div class="flex gap-3">
        <div class="hidden lg:flex flex-col gap-2">
          <div
            v-for="i in 4"
            :key="i"
            class="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
          ></div>
        </div>
        <div
          class="flex-1 aspect-square rounded-2xl bg-[var(--color-surface)] animate-pulse"
        ></div>
      </div>
      <div class="space-y-4">
        <div class="h-6 w-24 rounded-full bg-[var(--color-surface)]"></div>
        <div class="h-10 w-3/4 rounded-xl bg-[var(--color-surface)]"></div>
        <div class="h-8 w-1/3 rounded-xl bg-[var(--color-surface)]"></div>
        <div class="h-24 rounded-xl bg-[var(--color-surface)]"></div>
      </div>
    </div>

    <!-- Product grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <!-- ===== LEFT: Image Gallery ===== -->
      <div class="flex flex-col gap-4">
        <!-- MOBILE: horizontal scrollable thumbnails on top -->
        <div
          v-if="product.photos.length > 1"
          class="flex lg:hidden gap-2 overflow-x-auto pb-1 scroll-smooth"
          style="scrollbar-width: none"
        >
          <button
            v-for="(photo, i) in product.photos"
            :key="i"
            @click="selectedPhotoIndex = i"
            class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200"
            :class="
              selectedPhotoIndex === i
                ? 'border-[var(--color-primary)] shadow-lg scale-105'
                : 'border-transparent opacity-60 hover:opacity-90'
            "
          >
            <img :src="photo" class="w-full h-full object-cover" />
          </button>
        </div>

        <!-- Main image + vertical thumbs (desktop) -->
        <div class="flex gap-3">
          <!-- DESKTOP: vertical thumbnail strip on left -->
          <div
            v-if="product.photos.length > 1"
            class="hidden lg:flex flex-col gap-2 overflow-y-auto max-h-[520px] pr-1"
            style="scrollbar-width: thin"
          >
            <button
              v-for="(photo, i) in product.photos"
              :key="i"
              @click="selectedPhotoIndex = i"
              class="flex-shrink-0 w-[70px] h-[70px] rounded-xl overflow-hidden border-2 transition-all duration-200"
              :class="
                selectedPhotoIndex === i
                  ? 'border-[var(--color-primary)] shadow-md scale-105'
                  : 'border-transparent opacity-55 hover:opacity-90 hover:scale-102'
              "
            >
              <img
                :src="photo"
                :alt="`Vue ${i + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>

          <!-- Active photo -->
          <div
            class="flex-1 relative rounded-2xl overflow-hidden cursor-zoom-in group"
            :style="{
              backgroundColor: 'var(--color-surface)',
              border: `1px solid var(--color-border)`,
              aspectRatio: '1 / 1',
            }"
            @click="openLightbox(selectedPhotoIndex)"
          >
            <Transition name="img-swap" mode="out-in">
              <img
                :key="selectedPhotoIndex"
                :src="product.photos[selectedPhotoIndex]"
                :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Transition>

            <!-- Zoom hint overlay -->
            <div
              class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            >
              <div
                class="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
                style="
                  background: rgba(0, 0, 0, 0.45);
                  backdrop-filter: blur(6px);
                "
              >
                <i class="fas fa-search-plus"></i>
                Voir en grand
              </div>
            </div>

            <!-- Navigation arrows on main image (mobile, when > 1 photo) -->
            <button
              v-if="product.photos.length > 1"
              @click.stop="prevPhoto"
              class="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white"
              style="
                background: rgba(0, 0, 0, 0.45);
                backdrop-filter: blur(4px);
              "
            >
              <i class="fas fa-chevron-left text-xs"></i>
            </button>
            <button
              v-if="product.photos.length > 1"
              @click.stop="nextPhoto"
              class="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white"
              style="
                background: rgba(0, 0, 0, 0.45);
                backdrop-filter: blur(4px);
              "
            >
              <i class="fas fa-chevron-right text-xs"></i>
            </button>

            <!-- Photo count badge -->
            <div
              v-if="product.photos.length > 1"
              class="absolute bottom-3 right-3 text-[11px] text-white font-bold px-2.5 py-1 rounded-full"
              style="background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px)"
            >
              <i class="fas fa-images mr-1"></i>{{ selectedPhotoIndex + 1 }} /
              {{ product.photos.length }}
            </div>
          </div>
        </div>
      </div>

      <!-- ===== RIGHT: Product Info ===== -->
      <div class="flex flex-col gap-5">
        <!-- Category + Stock -->
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }"
          >
            {{ product.category || "Produit" }}
          </span>
          <span
            class="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border bg-[var(--color-surface)]"
            :class="
              product.quantity > 0
                ? 'text-[var(--color-primary)] border-[var(--color-primary)]/30'
                : 'text-[var(--color-accent)] border-[var(--color-accent)]/30'
            "
          >
            <span
              v-if="product.quantity > 0"
              class="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"
            ></span>

            {{ product.quantity > 0 ? "En stock" : "Rupture de stock" }}
          </span>

          <!-- <span
            v-if="product.quantity > 0"
            class="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border border-green-500/30 text-green-600 bg-green-50 dark:bg-green-900/20"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
            ></span>
            En stock
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border border-red-500/30 text-red-500 bg-red-50 dark:bg-red-900/20"
          >
            Rupture de stock
          </span> -->
        </div>

        <!-- Title + Price -->
        <div>
          <h1
            class="text-2xl md:text-3xl font-black mb-2 leading-tight"
            :style="{ color: 'var(--color-text-main)' }"
          >
            {{ product.name }}
          </h1>
          <div class="flex items-baseline gap-3">
            <p
              class="text-2xl font-black"
              :style="{ color: 'var(--color-primary)' }"
            >
              {{ product.price }}
            </p>
            <p
              v-if="product.old_price"
              class="text-lg font-bold line-through opacity-50"
              :style="{ color: 'var(--color-text-sub)' }"
            >
              {{ product.old_price }}
            </p>
          </div>
        </div>

        <!-- Rating & Interactions -->
        <div class="flex items-center gap-6 flex-wrap">
          <div class="flex items-center gap-1">
            <Star
              :size="16"
              :stroke-width="3"
              style="color: var(--color-rating); fill: var(--color-rating)"
            />
            <span
              class="font-bold"
              :style="{ color: 'var(--color-text-main)' }"
              >{{ product.rating }}</span
            >
            <span :style="{ color: 'var(--color-text-sub)' }"
              >({{ product.reviews }} avis)</span
            >
          </div>

          <div
            class="flex items-center gap-4 text-[11px] font-black opacity-60"
            :style="{ color: 'var(--color-text-sub)' }"
          >
            <div class="flex items-center gap-1.5">
              <Eye :size="14" :stroke-width="3" />
              <span>{{ formatNumber(displayCounts.clics) }} vues</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Heart :size="14" :stroke-width="3" />
              <span>{{ formatNumber(displayCounts.favorites) }} favoris</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Forward :size="14" :stroke-width="3" />
              <span>{{ formatNumber(displayCounts.shares) }} partages</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h3
            class="font-bold mb-2"
            :style="{ color: 'var(--color-text-main)' }"
          >
            Description
          </h3>
          <p
            :style="{ color: 'var(--color-text-sub)' }"
            class="text-sm leading-relaxed whitespace-pre-line"
          >
            {{ product.description }}
          </p>
        </div>

        <!-- Specs -->
        <div
          class="rounded-xl border p-4 grid grid-cols-2 gap-2"
          :style="{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-bg)',
          }"
        >
          <div
            v-for="spec in product.specs"
            :key="spec.label"
            class="flex items-center gap-2 text-sm"
          >
            <i
              :class="spec.icon"
              class="w-4 text-center opacity-60"
              :style="{ color: 'var(--color-primary)' }"
            ></i>
            <span :style="{ color: 'var(--color-text-sub)' }">
              <span
                class="font-semibold"
                :style="{ color: 'var(--color-text-main)' }"
                >{{ spec.label }}:</span
              >
              {{ spec.value }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-1">
          <button
            @click="handleToggleFavorite"
            class="flex-1 py-3 rounded-xl font-bold border-2 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5"
            :class="isFavorited ? 'bg-red-500/10' : ''"
            :style="{
              borderColor: isFavorited ? '#ef4444' : 'var(--color-border)',
              color: isFavorited ? '#ef4444' : 'var(--color-text-sub)',
            }"
            :title="isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          >
            <Heart
              :size="18"
              :stroke-width="3"
              :class="{ 'fill-current': isFavorited }"
            />
            {{ isFavorited ? "Dans vos favoris" : "Ajouter aux favoris" }}
          </button>

          <SocialShare
            v-if="product.id"
            :title="product.name"
            :url="configUrl + route.fullPath"
          />
        </div>

        <!-- Seller Info -->

        <router-link
          :to="{ name: 'PublicProfile', params: { id: product.user?.id } }"
          class="p-4 rounded-2xl border block hover:bg-black/5 transition-colors"
          :style="{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
          }"
        >
          <div class="flex items-center gap-3 mb-3">
            <img
              :src="
                product.user?.photo?.startsWith('http')
                  ? product.user.photo
                  : product.user?.photo
                    ? CONFIG.STORAGE_URL + product.user.photo
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(product.user?.nom || 'Vendeur')}&background=6366f1&color=fff&size=64`
              "
              class="w-12 h-12 rounded-full object-cover ring-2"
              :style="{ ringColor: 'var(--color-primary)' }"
            />
            <div>
              <!-- <p class="font-bold" :style="{ color: 'var(--color-text-main)' }">
                {{ product.user?.nom || "Vendeur" }}
              </p> -->
              <div class="flex items-center gap-2">
                <p
                  class="font-bold"
                  :style="{ color: 'var(--color-text-main)' }"
                >
                  {{ product.user?.nom || "Vendeur" }}
                </p>

                <!-- ICÔNE PARTAGER -->
                <button
                  @click.stop.prevent="shareProfile(product.user)"
                  title="Partager le profil du vendeur"
                  class="w-6 h-6 rounded-full flex items-center justify-center transition"
                >
                  <i class="fas fa-share-alt"></i>
                </button>
              </div>
              <p
                class="text-xs flex items-center gap-1"
                :style="{ color: 'var(--color-text-sub)' }"
              >
                <i class="fas fa-map-marker-alt text-[10px]"></i>
                {{ product.ville || "Cameroun" }}
                <span class="ml-1 text-yellow-500"
                  >⭐ {{ product.rating.toFixed(1) || "4.8" }}</span
                >
              </p>
            </div>
          </div>
          <button
            v-if="product.user?.id"
            @click.prevent="handleContactSeller"
            class="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all hover:scale-[1.02] active:scale-95"
            :style="{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
            }"
          >
            <i class="fas fa-shopping-bag"></i>
            Acheter ce produit
          </button>
          <div
            v-else
            class="w-full py-2.5 rounded-xl text-sm font-semibold text-center opacity-40 border"
            :style="{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-sub)',
            }"
          >
            Données vendeur indisponibles
          </div>
        </router-link>
      </div>
    </div>

    <!-- Related Products Sections (Lazy loaded) -->
    <div v-if="!loading" class="mt-16" ref="relatedContainer">
      <div v-if="loadingRelated" class="space-y-16 py-8">
        <!-- Spinner or Skeleton for related products -->
        <div class="flex justify-center items-center gap-2 opacity-50">
          <i
            class="fas fa-spinner fa-spin text-2xl text-[var(--color-primary)]"
          ></i>
          <span class="font-semibold text-sm"
            >Chargement des suggestions...</span
          >
        </div>
      </div>

      <div v-else-if="loadedRelated" class="space-y-16">
        <!-- Section: Same Seller -->
        <section v-if="shopProducts.length > 0">
          <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div class="flex items-center gap-3">
              <div
                class="w-1.5 h-8 bg-[var(--color-primary)] rounded-full"
              ></div>
              <h2
                class="text-2xl font-black text-[var(--color-text-main)] tracking-tight"
              >
                Dans la même boutique
              </h2>
            </div>
            <router-link
              v-if="product?.user?.id"
              :to="{ name: 'PublicProfile', params: { id: product.user.id } }"
              class="px-6 py-2.5 rounded-xl border-2 font-bold text-xs tracking-widest transition-all hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] active:scale-95"
              :style="{ borderColor: 'var(--color-primary)' }"
            >
              Voir la boutique
            </router-link>
          </div>
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          >
            <ProductCard
              v-for="p in shopProducts"
              :key="p.id"
              :product="p"
              :show-footer="false"
            />
          </div>
        </section>

        <!-- Section: Similar Products -->
        <section v-if="similarProducts.length > 0">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-1.5 h-8 bg-[var(--color-primary)] rounded-full"></div>
            <div>
              <h2 class="text-2xl font-black text-[var(--color-text-main)]">
                Produits similaires
              </h2>
              <p class="text-sm font-bold opacity-50 tracking-widest">
                D'autres pépites dans la catégorie {{ product.category }}
              </p>
            </div>
          </div>
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          >
            <ProductCard
              v-for="p in similarProducts"
              :key="p.id"
              :product="p"
              :show-footer="false"
            />
          </div>
        </section>
      </div>
      <!-- End loaded wrapper -->
    </div>
  </main>
</template>

<script setup>
import { CONFIG } from "../config/index.js";
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useProductStore } from "../stores/products.js";

import { useInteractionStore } from "../stores/interactions.js";
import { useAuthStore } from "../stores/auth.js";
import { useMessageStore } from "../stores/messages.js";
import ProductCard from "../components/ProductCard.vue";
import SocialShare from "../components/SocialShare.vue";
import { ArrowLeft, Heart, Star, Forward, Eye } from "lucide-vue-next";
import { useAlert } from "../composables/useAlert.js";
import { useSeo } from "../composables/useSeo.js";
import { useFlash } from "../composables/useFlash";
import { useToast } from "vue-toastification";

const configUrl = window.location.origin;

const alert = useAlert();
const flash = useFlash();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const interactionStore = useInteractionStore();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const loading = ref(true);
const selectedPhotoIndex = ref(0);
const lightboxEl = ref(null);
const shopProducts = ref([]);
const similarProducts = ref([]);

const relatedContainer = ref(null);
const loadingRelated = ref(false);
const loadedRelated = ref(false);

const getImageUrl = (photo) => {
  if (typeof photo === "string") {
    if (photo.startsWith("http")) return photo;
    return `${CONFIG.STORAGE_URL}${photo}`;
  }
  return "/placeholder.png";
};

const mapRelated = (list) =>
  (list || []).map((p) => ({
    ...p,
    id: p.id,
    name: p.nom,
    price: `${Number(p.prix).toLocaleString("fr-FR")} FCFA`,
    old_price: p.ancien_prix
      ? `${Number(p.ancien_prix).toLocaleString("fr-FR")} FCFA`
      : null,
    image:
      p.photos && p.photos.length > 0
        ? getImageUrl(p.photos[0])
        : "/placeholder.png",
    slug:
      p.slug && !p.slug.endsWith(`-${p.id}`)
        ? `${p.slug}-${p.id}`
        : p.slug || p.id,
    category: p.category ? { nom: p.category.nom } : { nom: "Produit" },
  }));

const loadRelatedProducts = async () => {
  if (loadedRelated.value || loadingRelated.value || !product.value.id) return;
  loadingRelated.value = true;
  try {
    const [similarData, shopData] = await Promise.all([
      productStore.getSimilarProducts(product.value.id),
      productStore.getShopProducts(product.value.id),
    ]);

    similarProducts.value = mapRelated(similarData.data);
    shopProducts.value = mapRelated(shopData.data);
    loadedRelated.value = true;
  } catch (err) {
    // console.error("Erreur lazy load produits:", err);
  } finally {
    loadingRelated.value = false;
  }
};

// Lightbox state
const lightbox = ref({ open: false, index: 0 });

const openLightbox = (index) => {
  lightbox.value = { open: true, index };
  nextTick(() => lightboxEl.value?.focus());
};

const closeLightbox = () => {
  lightbox.value.open = false;
};

const prevLightbox = () => {
  if (product.value.photos.length <= 1) return;
  lightbox.value.index =
    (lightbox.value.index - 1 + product.value.photos.length) %
    product.value.photos.length;
};

const nextLightbox = () => {
  if (product.value.photos.length <= 1) return;
  lightbox.value.index =
    (lightbox.value.index + 1) % product.value.photos.length;
};

// Main gallery navigation
const prevPhoto = () => {
  selectedPhotoIndex.value =
    (selectedPhotoIndex.value - 1 + product.value.photos.length) %
    product.value.photos.length;
};

const nextPhoto = () => {
  selectedPhotoIndex.value =
    (selectedPhotoIndex.value + 1) % product.value.photos.length;
};

// Keyboard listener for lightbox
const handleKeydown = (e) => {
  if (!lightbox.value.open) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevLightbox();
  if (e.key === "ArrowRight") nextLightbox();
};

let observer;
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  fetchProductData();

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadRelatedProducts();
      }
    },
    { rootMargin: "300px" },
  );
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  if (observer) observer.disconnect();
});

watch(relatedContainer, (el) => {
  if (el && observer && !loadedRelated.value) {
    observer.observe(el);
  }
});

watch(
  () => route.params.slug,
  () => {
    loadedRelated.value = false;
    loadingRelated.value = false;
    shopProducts.value = [];
    similarProducts.value = [];
    fetchProductData();
    // Scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
);

// Product data
const product = ref({
  id: null,
  name: "Chargement...",
  price: "N/A",
  price_raw: 0,
  photos: ["/placeholder.png"],
  rating: 0,
  reviews: 0,
  description: "Chargement...",
  specs: [],
  category: "Autre",
  quantity: 0,
  user: null,
  ville: "",
  condition: "Neuf",
});

// Dynamic SEO
useSeo({
  title: computed(() =>
    product.value.id ? `${product.value.name} - SASAYEE` : "Produit",
  ),
  description: computed(() => product.value.description),
  image: computed(() => product.value.photos[0]),
  type: "product",
  jsonLd: computed(() => {
    if (!product.value.id) return null;
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.value.name,
      image: product.value.photos,
      description: product.value.description,
      brand: {
        "@type": "Brand",
        name: "SASAYEE",
      },
      offers: {
        "@type": "Offer",
        url: typeof window !== "undefined" ? window.location.href : "",
        priceCurrency: "XAF",
        price: product.value.price_raw,
        availability:
          product.value.quantity > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        itemCondition:
          product.value.condition === "Neuf"
            ? "https://schema.org/NewCondition"
            : "https://schema.org/UsedCondition",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.value.rating,
        reviewCount: product.value.reviews || 1,
      },
    };
  }),
});

const isFavorited = computed(() =>
  interactionStore.isFavorited(product.value.id),
);

const displayCounts = computed(() => {
  const storeCounts = interactionStore.getProductCounts(product.value.id);
  return {
    clics: storeCounts.clics_count || 0,
    favorites: storeCounts.favorites_count || 0,
    shares: storeCounts.partages_count || 0,
  };
});

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

const fetchProductData = async () => {
  loading.value = true;
  selectedPhotoIndex.value = 0; // Reset gallery
  try {
    const slug = route.params.slug;
    if (!slug) throw new Error("Identifiant du produit manquant");

    const data = await productStore.getProductById(slug, true);
    const { produit, counts } = data;

    // Injecter directement les compteurs sans appel réseau additionnel
    if (counts && produit?.id) {
      interactionStore.productCounts[produit.id] = counts;
    }

    // Map all photos
    const allPhotos = (produit.photos?.length ? produit.photos : []).map(
      getImageUrl,
    );
    if (!allPhotos.length) allPhotos.push("/placeholder.png");

    product.value = {
      id: produit.id,
      name: produit.nom,
      price_raw: produit.prix,
      price: `${Number(produit.prix).toLocaleString("fr-FR")} FCFA`,
      old_price: produit.ancien_prix
        ? `${Number(produit.ancien_prix).toLocaleString("fr-FR")} FCFA`
        : null,
      photos: allPhotos,
      rating: parseFloat(produit.note_moyenne || 4.5),
      reviews: produit.nombre_avis || 0,
      description: produit.description || "Aucune description disponible",
      category: produit.category?.nom || "Autre",
      quantity: produit.quantite || 0,
      user: produit.user || null,
      condition: produit.condition || "Neuf",
      ville: produit.ville || "Cameroun",
      specs: [
        {
          icon: "fas fa-tag",
          label: "Catégorie",
          value: produit.category?.nom || "N/A",
        },
        {
          icon: "fas fa-cubes",
          label: "Stock",
          value: `${produit.quantite || 0} unité(s)`,
        },
        {
          icon: "fas fa-certificate",
          label: "Condition",
          value: produit.condition || "Neuf",
        },
        {
          icon: "fas fa-map-marker-alt",
          label: "Ville",
          value: produit.ville || "Non spécifiée",
        },
      ],
    };

    // Les vues et les compteurs sont maintenant gérés nativement par l'API principale.
  } catch (err) {
    flash.error(
      err.response?.data?.message || "Impossible de charger le produit",
    );
    console.error("Erreur lors du chargement du produit:", err);
  } finally {
    loading.value = false;
  }
};

const handleToggleFavorite = async () => {
  try {
    if (!authStore.isAuthenticated) {
      alert.promptLogin(router, route.fullPath);
      return;
    }
    await interactionStore.toggleFavorite(product.value.id);
  } catch (err) {
    console.error("Erreur favori:", err);
  }
};

const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: product.value.name,
        text: `Découvrez: ${product.value.name}`,
        url: window.location.href,
      });
      await interactionStore.shareProduct(product.value.id);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      await interactionStore.shareProduct(product.value.id);
      toast.success({
        title: "Lien copié !",
        message: "Le lien du produit a été copié dans votre presse-papiers.",
      });
    }
  } catch (err) {
    if (err.name !== "AbortError") console.error("Erreur partage:", err);
  }
};

const handleContactSeller = async () => {
  if (!authStore.isAuthenticated) {
    alert.promptLogin(router, route.fullPath);
    return;
  }

  // BUSINESS LOGIC: All product chats go to the Administrator by default
  let adminId = product.value.user?.id;
  try {
    const res = await apiClient.get("/chat/support-admin");
    if (res.data.success && res.data.admin_id) {
      adminId = res.data.admin_id;
    }
  } catch (e) {
    console.error("Impossible de récupérer l'admin", e);
  }

  if (adminId) {
    interactionStore.recordContact?.(product.value.id);
    messageStore.setProductTag({
      id: product.value.id,
      nom: product.value.name,
      photo_url: product.value.photos[0],
    });

    // Auto-fill an intent message to speed up the transaction
    messageStore.newMessage = `Bonjour, je souhaite acheter le produit "${product.value.name}" à ${product.value.price}.`;

    router.push({
      name: "messages",
      params: { receiverId: adminId },
      query: { productId: product.value.id },
    });
  }
};

// Votre fonction de partage définie localement
const shareProfile = async (user) => {
  // Préparation des données
  // Préparation des données - ON UTILISE .nom ICI AUSSI
  const shareData = {
    title: `Profil de ${user.nom || "Vendeur"}`, 
    text: `Découvrez le profil de ${user.nom || "Vendeur"} sur Sasayee`, // Et ici
    url: `${window.location.origin}/profile/${user.id}/public`,
  };

  // 1. Tentative de partage natif (Mobile)
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return; // Succès, on s'arrête ici
    } catch (error) {
      // L'utilisateur a annulé ou le partage a échoué
      // console.log("Partage non finalisé");
      return;
    }
  }

  // 2. Fallback pour Desktop (Copie du lien)
  // 2. Fallback pour Desktop (Copie du lien)
  try {
    await navigator.clipboard.writeText(shareData.url);

    // Utilisez la même structure que dans handleShare
    toast.success({
      title: "Lien copié !",
      message: "Le lien du profil a été copié dans votre presse-papiers.",
    });
  } catch (error) {
    // Pour l'erreur aussi, utilisez le format objet si nécessaire
    toast.error({
      title: "Erreur",
      message: "Impossible de copier le lien ❌",
    });
  }
};
</script>

<style scoped>
/* Lightbox fade */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

/* Image slide inside lightbox */
.img-slide-enter-active,
.img-slide-leave-active {
  transition: all 0.22s ease;
}

.img-slide-enter-from {
  opacity: 0;
  transform: scale(0.96);
}

.img-slide-leave-to {
  opacity: 0;
  transform: scale(1.04);
}

/* Image swap in main gallery */
.img-swap-enter-active,
.img-swap-leave-active {
  transition: opacity 0.2s ease;
}

.img-swap-enter-from,
.img-swap-leave-to {
  opacity: 0;
}

/* Hide scrollbar on mobile strip */
div::-webkit-scrollbar {
  height: 3px;
  width: 3px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 99px;
}
</style>
