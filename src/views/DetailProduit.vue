<template>
  <div class="h-8"></div>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <!-- Back button -->
    <RouterLink
      to="/"
      class="inline-flex items-center gap-2 mb-8 text-sm font-semibold"
      :style="{ color: 'var(--color-primary)' }"
    >
      <!-- <i class="fas fa-arrow-left">
        
      </i> -->
      <ArrowLeft
        :size="16"
        :stroke-width="3"
        class="text-[var(--color-primary)] hover:bg-[var(--color-text-sub)] hover:p-4 hover:rounded-full flex justify-center items-center hover:text-white"
      />
      Retour aux produits
    </RouterLink>

    <!-- Product Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Images -->
      <div class="flex flex-col gap-4">
        <div
          class="rounded-2xl overflow-hidden aspect-square"
          :style="{
            backgroundColor: 'var(--color-surface)',
            border: `1px solid var(--color-border)`,
          }"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Details -->
      <div class="flex flex-col gap-6">
        <div>
          <span
            class="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }"
          >
            En stock
          </span>
          <h1
            class="text-3xl font-black mb-2"
            :style="{ color: 'var(--color-text-main)' }"
          >
            {{ product.name }}
          </h1>
          <p
            class="text-xl font-bold"
            :style="{ color: 'var(--color-primary)' }"
          >
            {{ product.price }}
          </p>
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <!-- <i class="fas fa-star text-yellow-400"></i> -->
            <Star :size="16" :stroke-width="3" class="text-yellow-400" />
            <span
              class="font-bold"
              :style="{ color: 'var(--color-text-main)' }"
              >{{ product.rating }}</span
            >
            <span :style="{ color: 'var(--color-text-sub)' }"
              >({{ product.reviews }} avis)</span
            >
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
            class="text-sm leading-relaxed"
          >
            {{ product.description }}
          </p>
        </div>

        <!-- Specifications -->
        <div>
          <h3
            class="font-bold mb-3"
            :style="{ color: 'var(--color-text-main)' }"
          >
            Caractéristiques
          </h3>
          <ul class="space-y-2 text-sm">
            <li
              v-for="spec in product.specs"
              :key="spec"
              class="flex items-center gap-2"
              :style="{ color: 'var(--color-text-sub)' }"
            >
              <i class="fas fa-check text-green-500"></i>
              {{ spec }}
            </li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            @click="handleAddToCart"
            class="flex-1 py-3 rounded-lg font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            :style="{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-pure)',
            }"
          >
            <i class="fas fa-shopping-cart"></i> Ajouter au panier
          </button>
          <button
            @click="handleToggleFavorite"
            class="px-6 py-3 rounded-lg font-bold border transition-all active:scale-95"
            :class="{ 'bg-red-100': isFavorited }"
            :style="{
              borderColor: isFavorited ? 'red' : 'var(--color-primary)',
              color: isFavorited ? 'red' : 'var(--color-primary)',
            }"
            :title="isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          >
            <!-- <i
              class="fas fa-heart"
              :class="{ 'text-red-500': isFavorited }"
            ></i> -->
            <Heart
              :size="16"
              :stroke-width="3"
              :class="{ 'text-red-500': isFavorited }"
            />
          </button>
          <button
            @click="handleShare"
            class="px-4 py-3 rounded-lg font-bold border transition-all active:scale-95"
            :style="{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
            }"
            title="Partager"
          >
            <!-- <i class="fas fa-share-alt"></i> -->
            <Forward :size="16" :stroke-width="3" />
          </button>
        </div>

        <!-- Seller Info -->
        <div
          class="p-4 rounded-xl border"
          :style="{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
          }"
        >
          <div class="flex items-center gap-3 mb-3">
            <img
              :src="
                product.user?.photo ||
                `https://ui-avatars.com/api/?name=${product.user?.nom || 'Vendeur'}&background=6366f1&color=fff`
              "
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p class="font-bold" :style="{ color: 'var(--color-text-main)' }">
                {{ product.user?.nom || "Vendeur" }}
              </p>
              <p class="text-sm" :style="{ color: 'var(--color-text-sub)' }">
                Vendeur {{ product.user?.id ? "vérifiée" : "" }} ⭐
                {{ product.rating }}
              </p>
            </div>
          </div>
          <RouterLink
            v-if="product.user?.id"
            :to="{ name: 'messages', params: { receiverId: product.user.id } }"
            @click="handleContactSeller"
            class="w-full py-2 rounded-lg text-sm font-semibold block text-center mt-2 hover:bg-gray-100 transition"
            :style="{ color: 'var(--color-primary)' }"
          >
            Contacter le vendeur
          </RouterLink>
          <button
            v-else
            class="w-full py-2 rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed"
            :style="{ color: 'var(--color-primary)' }"
            disabled
          >
            Données vendeur indisponibles
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useProductStore } from "../stores/products.js";
import { useInteractionStore } from "../stores/interactions.js";
import { useAuthStore } from "../stores/auth.js";
import { useCartStore } from "../stores/cart.js";
import { ArrowLeft } from "lucide-vue-next";
import { Heart, Star, Forward } from "lucide-vue-next";
const route = useRoute();
const productStore = useProductStore();
const interactionStore = useInteractionStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const loading = ref(true);
const error = ref(null);

const product = ref({
  id: null,
  name: "Chargement...",
  price: "N/A",
  image: "/placeholder.png",
  rating: 0,
  reviews: 0,
  description: "Chargement...",
  specs: [],
  category: "Autre",
  quantity: 0,
  user: null,
});

const isFavorited = computed(() => {
  return interactionStore.isFavorited(product.value.id);
});

const handleAddToCart = async () => {
  try {
    await cartStore.addToCart({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price_raw, // We'll add this mapping
      image: product.value.image,
      category: product.value.category,
    });
  } catch (err) {
    console.error("Erreur ajout panier:", err);
  }
};

onMounted(async () => {
  try {
    const productId = route.params.id;
    if (!productId) {
      throw new Error("ID du produit manquant");
    }

    // Récupérer les détails du produit depuis l'API
    const produit = await productStore.getProductById(productId);

    // Mapper les données du backend au format du composant
    product.value = {
      id: produit.id,
      name: produit.nom,
      price_raw: produit.prix,
      price: `${produit.prix.toLocaleString()} FCFA`,
      image: produit.photos?.[0]
        ? getImageUrl(produit.photos[0])
        : "/placeholder.png",
      rating: parseFloat(produit.note_moyenne || 4.5),
      reviews: produit.nombre_avis || 0,
      description: produit.description || "Aucune description disponible",
      category: produit.category?.nom || "Autre",
      quantity: produit.quantite || 0,
      user: produit.user,
      condition: produit.condition || "Neuf",
      ville: produit.ville || "Non spécifiée",
      specs: [
        `Catégorie: ${produit.category?.nom}`,
        `Quantité disponible: ${produit.quantite}`,
        `Condition: ${produit.condition || "Neuf"}`,
      ],
    };

    // Enregistrer la vue
    interactionStore.recordView(productId);
  } catch (err) {
    error.value = err.message;
    console.error("Erreur lors du chargement du produit:", err);
  } finally {
    loading.value = false;
  }
});

const getImageUrl = (photo) => {
  if (typeof photo === "string") {
    if (photo.startsWith("http")) return photo;
    return `http://localhost:8000/storage/${photo}`;
  }
  return "/placeholder.png";
};

const handleToggleFavorite = async () => {
  try {
    if (!authStore.isAuthenticated) {
      alert("Veuillez vous connecter pour ajouter en favori");
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
      await interactionStore.shareProduct(product.value.id);
      alert("Lien copié! 📋");
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Erreur partage:", err);
    }
  }
};

const handleContactSeller = () => {
  if (product.value.user?.id) {
    interactionStore.recordContact(product.value.id);
    // Naviguer vers les messages avec le vendeur
  }
};
</script>
