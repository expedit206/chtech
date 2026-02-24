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
      to="/"
      class="inline-flex items-center gap-2 mb-6 text-sm font-semibold group"
      :style="{ color: 'var(--color-primary)' }"
    >
      <i
        class="fas fa-arrow-left transition-transform group-hover:-translate-x-1"
      ></i>
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
            class="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700"
          ></div>
        </div>
        <div
          class="flex-1 aspect-square rounded-2xl bg-gray-200 dark:bg-gray-700"
        ></div>
      </div>
      <div class="space-y-4">
        <div class="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-10 w-3/4 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-8 w-1/3 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-24 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
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
          </span>
        </div>

        <!-- Title + Price -->
        <div>
          <h1
            class="text-2xl md:text-3xl font-black mb-2 leading-tight"
            :style="{ color: 'var(--color-text-main)' }"
          >
            {{ product.name }}
          </h1>
          <p
            class="text-2xl font-black"
            :style="{ color: 'var(--color-primary)' }"
          >
            {{ product.price }}
          </p>
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-0.5">
            <i
              v-for="n in 5"
              :key="n"
              class="fas fa-star text-sm"
              :class="
                n <= Math.round(product.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              "
            ></i>
          </div>
          <span
            class="text-sm font-bold"
            :style="{ color: 'var(--color-text-main)' }"
          >
            {{ product.rating.toFixed(1) }}
          </span>
          <span class="text-sm" :style="{ color: 'var(--color-text-sub)' }">
            ({{ product.reviews }} avis)
          </span>
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
            class="text-sm leading-relaxed"
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
            @click="handleAddToCart"
            class="flex-1 py-3.5 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }"
          >
            <i class="fas fa-shopping-cart"></i>
            Ajouter au panier
          </button>

          <button
            @click="handleToggleFavorite"
            class="px-4 py-3.5 rounded-xl font-bold border-2 transition-all active:scale-95 hover:scale-105"
            :class="isFavorited ? 'bg-red-50 dark:bg-red-900/20' : ''"
            :style="{
              borderColor: isFavorited ? '#ef4444' : 'var(--color-border)',
              color: isFavorited ? '#ef4444' : 'var(--color-text-sub)',
            }"
            :title="isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          >
            <i
              class="fas fa-heart"
              :class="isFavorited ? 'text-red-500' : ''"
            ></i>
          </button>

          <button
            @click="handleShare"
            class="px-4 py-3.5 rounded-xl font-bold border-2 transition-all active:scale-95 hover:scale-105"
            :style="{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-sub)',
            }"
            title="Partager"
          >
            <i class="fas fa-share-alt"></i>
          </button>
        </div>

        <!-- Seller Info -->
        <div
          class="p-4 rounded-2xl border"
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
                    ? `http://localhost:8000/storage/${product.user.photo}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(product.user?.nom || 'Vendeur')}&background=6366f1&color=fff&size=64`
              "
              class="w-12 h-12 rounded-full object-cover ring-2"
              :style="{ ringColor: 'var(--color-primary)' }"
            />
            <div>
              <p class="font-bold" :style="{ color: 'var(--color-text-main)' }">
                {{ product.user?.nom || "Vendeur" }}
              </p>
              <p
                class="text-xs flex items-center gap-1"
                :style="{ color: 'var(--color-text-sub)' }"
              >
                <i class="fas fa-map-marker-alt text-[10px]"></i>
                {{ product.ville || "Cameroun" }}
                <span class="ml-1 text-yellow-500"
                  >⭐ {{ product.rating.toFixed(1) }}</span
                >
              </p>
            </div>
          </div>
          <button
            v-if="product.user?.id"
            @click="handleContactSeller"
            class="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all hover:scale-[1.02] active:scale-95"
            :style="{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
            }"
          >
            <i class="fas fa-comment-dots"></i>
            Contacter le vendeur
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
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useProductStore } from "../stores/products.js";
import { useInteractionStore } from "../stores/interactions.js";
import { useAuthStore } from "../stores/auth.js";
import { useCartStore } from "../stores/cart.js";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const interactionStore = useInteractionStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

const loading = ref(true);
const error = ref(null);
const selectedPhotoIndex = ref(0);
const lightboxEl = ref(null);

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

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));

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

const isFavorited = computed(() =>
  interactionStore.isFavorited(product.value.id),
);

const getImageUrl = (photo) => {
  if (typeof photo === "string") {
    if (photo.startsWith("http")) return photo;
    return `http://localhost:8000/storage/${photo}`;
  }
  return "/placeholder.png";
};

onMounted(async () => {
  try {
    const productId = route.params.id;
    if (!productId) throw new Error("ID du produit manquant");

    const produit = await productStore.getProductById(productId);

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

    interactionStore.recordView(productId);
  } catch (err) {
    error.value = err.message;
    console.error("Erreur lors du chargement du produit:", err);
  } finally {
    loading.value = false;
  }
});

const handleAddToCart = async () => {
  try {
    await cartStore.addToCart({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price_raw,
      image: product.value.photos[0],
      category: product.value.category,
    });
  } catch (err) {
    console.error("Erreur ajout panier:", err);
  }
};

const handleToggleFavorite = async () => {
  try {
    if (!authStore.isAuthenticated) {
      router.push({ path: "/login", query: { redirect: route.fullPath } });
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
    }
  } catch (err) {
    if (err.name !== "AbortError") console.error("Erreur partage:", err);
  }
};

const handleContactSeller = () => {
  if (!authStore.isAuthenticated) {
    router.push({ path: "/login", query: { redirect: route.fullPath } });
    return;
  }
  if (product.value.user?.id) {
    interactionStore.recordContact?.(product.value.id);
    router.push({
      name: "messages",
      params: { receiverId: product.value.user.id },
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
