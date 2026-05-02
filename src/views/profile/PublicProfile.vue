<template>
  <div
    class="min-h-screen pb-20"
    :style="{
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text-main)',
    }"
  >
    <!-- Header/Cover Area -->
    <div
      class="h-48 md:h-64 relative overflow-hidden bg-zinc-200 dark:bg-zinc-800"
    >
      <img
        v-if="userCoverUrl"
        :src="userCoverUrl"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"
      ></div>
    </div>

    <!-- Profile Info Card -->
    <div class="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
      <div
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8"
      >
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="relative">
            <div
              class="w-32 h-32 rounded-full border-2 border-[var(--color-border)] overflow-hidden bg-[var(--color-bg)]"
            >
              <img :src="userPhotoUrl" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="flex-1 text-center md:text-left">
            <h1
              class="text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-1"
            >
              {{ user?.nom || "Chargement..." }}
            </h1>

            <div
              class="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-[var(--color-text-sub)]"
            >
              <span v-if="user?.ville" class="flex items-center gap-1.5">
                <i class="fas fa-map-marker-alt opacity-70"></i>
                {{ user.ville }}
              </span>
              <span class="flex items-center gap-1.5">
                <i class="fas fa-calendar-alt opacity-70"></i>
                Depuis {{ formatDate(user?.created_at) }}
              </span>
            </div>
          </div>

          <button
            @click.stop.prevent="shareProfile(user)"
            class="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <i class="fas fa-share-alt text-[var(--color-text-sub)]"></i>
          </button>
        </div>

        <div
          class="grid grid-cols-3 gap-8 mt-10 pt-6 border-t border-[var(--color-border)]"
        >
          <div class="text-center md:text-left">
            <p
              class="text-[10px] font-medium text-[var(--color-text-sub)] uppercase tracking-tight mb-1"
            >
              Produits
            </p>
            <p class="text-xl font-bold">{{ user?.produits_count || 0 }}</p>
          </div>
          <div class="text-center md:text-left">
            <p
              class="text-[10px] font-medium text-[var(--color-text-sub)] uppercase tracking-tight mb-1"
            >
              Vues
            </p>
            <p class="text-xl font-bold">
              {{ formatLargeNumber(user?.total_views || 0) }}
            </p>
          </div>
          <div class="text-center md:text-left">
            <p
              class="text-[10px] font-medium text-[var(--color-text-sub)] uppercase tracking-tight mb-1"
            >
              Évaluation
            </p>
            <p
              class="text-xl font-bold flex items-center justify-center md:justify-start gap-1.5"
            >
              4.8 <i class="fas fa-star text-yellow-400 text-sm"></i>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs/Content -->
    <div class="max-w-7xl mx-auto px-4 mt-12">
      <div class="flex gap-8 border-b border-[var(--color-border)] mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative"
          :class="
            activeTab === tab.id
              ? 'text-[var(--color-primary)]'
              : 'opacity-40 hover:opacity-100'
          "
        >
          {{ tab.label }}
          <div
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-primary)] rounded-full"
          ></div>
        </button>
      </div>

      <!-- Loading State -->
      <div
        v-if="loadingItems"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse"
      >
        <div
          v-for="i in 5"
          :key="i"
          class="aspect-[3/4] bg-[var(--color-surface)] rounded-3xl"
        ></div>
      </div>

      <!-- Products Grid -->
      <div
        v-else-if="activeTab === 'products'"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
        <div
          v-if="products.length === 0"
          class="col-span-full py-20 text-center opacity-40"
        >
          <i class="fas fa-box-open text-6xl mb-4"></i>
          <p class="font-bold">Aucun produit en vente pour le moment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CONFIG } from "../../config/index.js";
import { shareProfile } from "../../utils/share.js";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "../../api";
import ProductCard from "../../components/ProductCard.vue";
import { useMessageStore } from "../../stores/messages";
import { useAuthStore } from "../../stores/auth";
import { useSeo } from "../../composables/useSeo.js";

const route = useRoute();
const router = useRouter();
const messageStore = useMessageStore();
const authStore = useAuthStore();
// Si vous avez besoin de récupérer l'utilisateur (cas d'une page profil)
const props = defineProps(["user"]);
const user = ref(null);
const products = ref([]);
const loadingItems = ref(true);
const activeTab = ref("products");

const userCoverUrl = computed(() => {
  if (user.value?.cover) {
    if (user.value.cover.startsWith("http")) return user.value.cover;
    return `${CONFIG.STORAGE_URL}${user.value.cover}`;
  }
  return null;
});

const userPhotoUrl = computed(() => {
  if (user.value?.photo) {
    if (user.value.photo.startsWith("http")) return user.value.photo;
    return `${CONFIG.STORAGE_URL}${user.value.photo}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value?.nom || "User")}&background=6366f1&color=fff&size=256`;
});

// Dynamic SEO
useSeo({
  title: computed(() =>
    user.value?.nom ? `${user.value.nom} - Profil Vendeur` : "Profil",
  ),
  description: computed(() =>
    user.value?.nom
      ? `Découvrez les produits de ${user.value.nom} sur SASAYEE. ${user.value.produits_count} produits disponibles.`
      : "Profil vendeur sur SASAYEE",
  ),
  image: computed(() => userPhotoUrl.value),
  type: "profile",
});

const tabs = [{ id: "products", label: "Produits" }];

const fetchProfile = async () => {
  try {
    const response = await apiClient.get(`/profile/public/${route.params.id}`);
    user.value = response.data;
  } catch (error) {
    console.error("Erreur profil:", error);
  }
};

const fetchUserItems = async () => {
  loadingItems.value = true;
  try {
    // En supposant qu'on a un endpoint pour filtrer les produits par utilisateur
    const response = await apiClient.get("/marketplace/produits", {
      params: { user_id: route.params.id },
    });

    // Formater les prix et images comme dans le store
    products.value = (response.data.produits || []).map((p) => {
      let photoUrl = "/placeholder.png";
      if (p.photos && p.photos.length > 0) {
        const firstPhoto = p.photos[0];
        if (typeof firstPhoto === "string") {
          if (firstPhoto.startsWith("http")) {
            photoUrl = firstPhoto;
          } else {
            // Nettoyer le chemin pour éviter les doubles slashes
            const cleanPath = firstPhoto.startsWith("/")
              ? firstPhoto.substring(1)
              : firstPhoto;
            photoUrl = `${CONFIG.STORAGE_URL}${cleanPath}`;
          }
        }
      }

      return {
        ...p,
        id: p.id,
        name: p.nom,
        slug:
          p.slug && !p.slug.endsWith(`-${p.id}`)
            ? `${p.slug}-${p.id}`
            : p.slug || p.id,
        price: p.prix ? `${Number(p.prix).toLocaleString()} FCFA` : "N/A",
        image: photoUrl,
      };
    });
  } catch (error) {
    console.error("Erreur items:", error);
  } finally {
    loadingItems.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatLargeNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

const handleContact = () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: "Login", query: { redirect: route.fullPath } });
    return;
  }

  // Aller vers le chat avec ce vendeur
  router.push({ name: "messages", params: { receiverId: user.value.id } });
};

onMounted(() => {
  fetchProfile();
  fetchUserItems();
});

watch(
  () => route.params.id,
  () => {
    fetchProfile();
    fetchUserItems();
  },
);
</script>
