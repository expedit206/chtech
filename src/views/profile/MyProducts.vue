<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1
          class="text-2xl font-black tracking-tight text-[var(--color-text-main)]"
        >
          Mes Produits
        </h1>
        <p class="text-[var(--color-text-sub)] text-sm">
          Gérez votre inventaire et vos ventes en direct.
        </p>
      </div>
      <button
        @click="openModal()"
        class="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20"
      >
        <Plus :size="20" />
        Ajouter un produit
      </button>
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="p-6 rounded-3xl border bg-[var(--color-surface)] shadow-sm"
        :style="{ borderColor: 'var(--color-border)' }"
      >
        <div class="flex items-center justify-between mb-2">
          <div
            class="p-3 rounded-2xl"
            :style="{ backgroundColor: stat.color + '10' }"
          >
            <component
              :is="stat.icon"
              :size="24"
              :style="{ color: stat.color }"
            />
          </div>
          <span
            class="text-xs font-bold px-2 py-1 rounded-full bg-green-500/10 text-green-600"
            >+{{ stat.trend }}% ce mois</span
          >
        </div>
        <p class="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">
          {{ stat.label }}
        </p>
        <p class="text-2xl font-black text-[var(--color-text-main)]">
          {{ stat.value }}
        </p>
      </div>
    </div>

    <!-- Products Table -->
    <div
      class="rounded-3xl border bg-[var(--color-surface)] overflow-hidden shadow-xl"
      :style="{ borderColor: 'var(--color-border)' }"
    >
      <div
        v-if="loading"
        class="p-20 flex flex-col items-center justify-center gap-4"
      >
        <Loader2 class="animate-spin text-[var(--color-primary)]" :size="48" />
        <p class="text-[var(--color-text-sub)] font-bold animate-pulse">
          Chargement de votre inventaire...
        </p>
      </div>

      <div v-else-if="products.length === 0" class="p-20 text-center">
        <div
          class="w-24 h-24 bg-[var(--color-bg)] rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Package class="opacity-10" :size="48" />
        </div>
        <h3 class="text-xl font-bold text-[var(--color-text-main)] mb-2">
          Votre inventaire est vide
        </h3>
        <p class="text-[var(--color-text-sub)] text-sm mb-8 max-w-sm mx-auto">
          Commencez à vendre vos articles en les ajoutant à votre catalogue
          SASAYEE dès maintenant.
        </p>
        <button
          @click="openModal()"
          class="px-8 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-bold hover:opacity-90 transition-all"
        >
          Ajouter un produit
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead
            class="bg-[var(--color-bg)]/50 text-[var(--color-text-sub)] text-[10px] uppercase font-black tracking-widest border-b"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <tr>
              <th class="px-8 py-5">Produit</th>
              <th class="px-8 py-5">Catégorie</th>
              <th class="px-8 py-5">Prix / Stock</th>
              <th class="px-8 py-5">Visibilité</th>
              <th class="px-8 py-5">Performance</th>
              <th class="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            class="divide-y"
            :style="{ divideColor: 'var(--color-border)' }"
          >
            <tr
              v-for="product in products"
              :key="product.id"
              class="group hover:bg-[var(--color-primary)]/[0.02] transition-colors"
            >
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div
                    class="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden border shadow-sm"
                    :style="{ borderColor: 'var(--color-border)' }"
                  >
                    <img
                      :src="product.photos?.[0] || '/placeholder.png'"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      v-if="product.is_promoted"
                      class="absolute top-0 left-0 bg-amber-400 p-0.5"
                    >
                      <Star :size="8" class="text-white fill-white" />
                    </div>
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span
                      class="font-bold text-[var(--color-text-main)] truncate max-w-[200px]"
                      >{{ product.nom }}</span
                    >
                    <span
                      class="text-[10px] text-[var(--color-text-sub)] truncate max-w-[200px]"
                      >{{ product.description?.substring(0, 40) }}...</span
                    >
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span
                  class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-[var(--color-bg)] border shadow-sm"
                  :style="{ borderColor: 'var(--color-border)' }"
                >
                  {{ product.category?.nom || "Autre" }}
                </span>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <div class="flex items-baseline gap-1.5">
                    <span class="font-black text-sm text-[var(--color-primary)]"
                      >{{ Number(product.prix).toLocaleString() }} FCFA</span
                    >
                    <span
                      v-if="product.ancien_prix"
                      class="text-[9px] line-through opacity-50 text-[var(--color-text-sub)]"
                    >
                      {{ Number(product.ancien_prix).toLocaleString() }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1.5 mt-1">
                    <div
                      class="h-1.5 w-12 rounded-full bg-[var(--color-bg)] overflow-hidden"
                    >
                      <div
                        class="h-full rounded-full"
                        :class="
                          product.quantite < 5 ? 'bg-red-500' : 'bg-green-500'
                        "
                        :style="{
                          width:
                            Math.min(100, (product.quantite / 20) * 100) + '%',
                        }"
                      ></div>
                    </div>
                    <span
                      class="text-[10px] font-bold"
                      :class="
                        product.quantite < 5
                          ? 'text-red-500'
                          : 'text-[var(--color-text-sub)]'
                      "
                      >{{ product.quantite }} en stock</span
                    >
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span
                  :class="
                    product.est_actif
                      ? 'bg-green-500/10 text-green-600 border-green-500/20'
                      : 'bg-[var(--color-bg)] text-[var(--color-text-sub)] border-[var(--color-border)]'
                  "
                  class="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border opacity-80"
                >
                  {{ product.est_actif ? "Public" : "Brouillon" }}
                </span>
              </td>
              <td class="px-8 py-6">
                <div
                  class="flex items-center gap-4 text-[var(--color-text-sub)]"
                >
                  <div class="flex items-center gap-1.5">
                    <Eye :size="14" />
                    <span class="text-xs font-bold">{{
                      product.clics_count || 0
                    }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <Heart :size="14" />
                    <span class="text-xs font-bold">{{
                      product.favorites_count || 0
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <div
                  class="flex items-center justify-end gap-1 opacity-100 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    @click="openModal(product)"
                    class="p-3 hover:bg-[var(--color-primary)]/10 text-[var(--color-text-sub)] hover:text-[var(--color-primary)] rounded-2xl transition-all"
                  >
                    <Edit2 :size="18" />
                  </button>
                  <button
                    @click="confirmDelete(product)"
                    class="p-3 hover:bg-red-500/10 text-[var(--color-text-sub)] hover:text-red-500 rounded-2xl transition-all"
                  >
                    <Trash2 :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Modal -->

    
    <transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[110] flex items-center justify-center p-2"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closeModal"
        ></div>
        <div
          class="relative w-full max-w-2xl bg-[var(--color-surface)] rounded-xl shadow-lg overflow-hidden border"
          :style="{ borderColor: 'var(--color-border)' }"
        >
          <!-- Header -->
          <div
            class="px-6 py-4 border-b flex items-center justify-between"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <div>
              <h2 class="text-xl font-semibold tracking-tight">
                {{ isEditing ? "Éditer le produit" : "Nouveau trésor" }}
              </h2>
              <p
                class="text-[var(--color-text-sub)] text-xs font-medium uppercase tracking-wider mt-0.5"
              >
                Détails de l'article
              </p>
            </div>
            <button
              @click="closeModal"
              class="p-2 hover:bg-[var(--color-bg)] rounded-lg transition-colors"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- Form -->
          <form
            @submit.prevent="saveProduct"
            class="px-6 py-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
          >
            <!-- Grid Nom & Cat -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label
                  class="text-[9px] font-semibold uppercase opacity-50 ml-1"
                  >Nom commercial</label
                >
                <input
                  v-model="form.nom"
                  required
                  type="text"
                  placeholder="ex: iPhone 15 Pro Max"
                  class="w-full px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-transparent focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none font-medium text-[var(--color-text-main)]"
                />
              </div>
              <div class="space-y-1">
                <label
                  class="text-[9px] font-semibold uppercase opacity-50 ml-1"
                  >Catégorie</label
                >
                <select
                  v-model="form.category_id"
                  required
                  class="w-full px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-transparent focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none font-medium text-[var(--color-text-main)]"
                >
                  <option value="" disabled>Sélectionner...</option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.nom }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-1">
              <label class="text-[9px] font-semibold uppercase opacity-50 ml-1"
                >Description détaillée</label
              >
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Décrivez votre produit pour séduire vos clients..."
                class="w-full px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-transparent focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none font-normal resize-none text-[var(--color-text-main)]"
              ></textarea>
            </div>

            <!-- Photos Section -->
            <div class="space-y-2">
              <label class="text-[9px] font-semibold uppercase opacity-50 ml-1"
                >Catalogue Photos</label
              >
              <div
                class="flex flex-wrap gap-3 p-3 rounded-2xl bg-[var(--color-bg)]/30 border border-dashed"
                :style="{ borderColor: 'var(--color-border)' }"
              >
                <div
                  v-for="(photo, index) in previewPhotos"
                  :key="index"
                  class="relative group w-20 h-20 rounded-lg overflow-hidden border shadow-sm"
                >
                  <img :src="photo" class="w-full h-full object-cover" />
                  <button
                    @click.prevent="removePhoto(index)"
                    class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-100 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
                <label
                  class="w-20 h-20 rounded-lg border border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-primary)] transition-colors group"
                >
                  <div
                    class="p-1 rounded bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] transition-colors"
                  >
                    <Plus :size="20" />
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    class="hidden"
                    @change="handlePhotoUpload"
                  />
                </label>
              </div>
            </div>

            <!-- Pricing & Inventory -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label
                  class="text-[9px] font-semibold uppercase opacity-50 ml-1"
                  >Prix (FCFA)</label
                >
                <div class="relative">
                  <input
                    v-model="form.prix"
                    required
                    type="number"
                    class="w-full pl-3 pr-10 py-2 rounded-lg bg-[var(--color-bg)] border border-transparent focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 font-medium text-[var(--color-text-main)]"
                  />
                  <span
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold opacity-30"
                    >CFA</span
                  >
                </div>
              </div>
              <div v-if="isEditing" class="space-y-1">
                <label
                  class="text-[9px] font-semibold uppercase opacity-50 ml-1"
                  >Ancien prix</label
                >
                <div class="relative">
                  <input
                    v-model="form.ancien_prix"
                    type="number"
                    class="w-full pl-3 pr-10 py-2 rounded-lg bg-[var(--color-bg)] border border-transparent focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 font-medium text-[var(--color-text-main)]"
                  />
                  <span
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold opacity-30"
                    >CFA</span
                  >
                </div>
              </div>
              <div class="space-y-1">
                <label
                  class="text-[9px] font-semibold uppercase opacity-50 ml-1"
                  >Stock</label
                >
                <input
                  v-model="form.stock"
                  required
                  type="number"
                  class="w-full px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-transparent focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 font-medium text-[var(--color-text-main)]"
                />
              </div>
            </div>
          </form>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t flex gap-3"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <button
              @click="closeModal"
              class="flex-1 py-3 rounded-lg font-medium bg-[var(--color-border)] hover:opacity-80 transition-all text-[var(--color-text-main)]"
            >
              Abandonner
            </button>
            <button
              @click="saveProduct"
              :disabled="saving"
              class="flex-1 py-3 rounded-lg font-semibold bg-[var(--color-primary)] text-white hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-[var(--color-primary)]/25"
            >
              <Loader2 v-if="saving" class="animate-spin" :size="20" />
              <span>{{
                isEditing ? "Confirmer les modifications" : "Lancer la vente"
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import {
  Plus,
  Package,
  Edit2,
  Trash2,
  Loader2,
  X,
  DollarSign,
  Eye,
  Heart,
  Info,
  Star,
} from "lucide-vue-next";
import { useProductStore } from "../../stores/products.js";
import { useRoute, useRouter } from "vue-router";
import apiClient from "../../api/index.js";
import { useFlash } from "../../composables/useFlash.js";
import { useAlert } from "../../composables/useAlert.js";

const alertStore = useAlert();
const flash = useFlash();

const route = useRoute();
const router = useRouter();

const productStore = useProductStore();
const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const saving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const currentProductId = ref(null);

const form = ref({
  nom: "",
  description: "",
  prix: 0,
  ancien_prix: null,
  category_id: "",
  stock: 0,
  ville: "",
  photos: [],
  old_photos: [],
});

const previewPhotos = ref([]);
const newPhotoFiles = ref([]);

const stats = computed(() => {
  const totalStock = products.value.reduce(
    (acc, p) => acc + (p.quantite || 0),
    0,
  );
  const totalValue = products.value.reduce(
    (acc, p) => acc + Number(p.prix || 0) * (p.quantite || 0),
    0,
  );
  return [
    {
      label: "Catalogue",
      value: products.value.length,
      icon: Package,
      color: "#6366f1",
      trend: 12,
    },
    {
      label: "Inventaire",
      value: totalStock,
      icon: Star,
      color: "#f59e0b",
      trend: 5,
    },
    {
      label: "Valeur estimée",
      value: totalValue.toLocaleString() + " CFA",
      icon: DollarSign,
      color: "#10b981",
      trend: 8,
    },
  ];
});

const fetchMyProducts = async () => {
  loading.value = true;
  try {
    const res = await apiClient.get("/user/mesProduits");
    products.value = res.data.produits;
  } catch (err) {
    flash.error("Erreur lors de la récupération de vos produits");
    console.error("Error fetching my products", err);
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    if (productStore.categories.length === 0) {
      await productStore.fetchCategories();
    }
    categories.value = productStore.categories;
  } catch (err) {
    console.error("Error fetching categories", err);
  }
};

onMounted(() => {
  fetchMyProducts();
  fetchCategories();

  if (route.query.add === 'true') {
    openModal();
    // Remove the query parameter from the URL to prevent reopening on refresh
    const newQuery = { ...route.query };
    delete newQuery.add;
    router.replace({ query: newQuery });
  }
});

const openModal = (product = null) => {
  if (product) {
    isEditing.value = true;
    currentProductId.value = product.id;
    form.value = {
      nom: product.nom,
      description: product.description,
      prix: product.prix,
      ancien_prix: product.ancien_prix,
      category_id: product.category_id,
      stock: product.quantite,
      ville: product.ville,
      old_photos: product.photos || [],
    };
    previewPhotos.value = [...(product.photos || [])];
  } else {
    isEditing.value = false;
    currentProductId.value = null;
    form.value = {
      nom: "",
      description: "",
      prix: 0,
      ancien_prix: null,
      category_id: "",
      stock: 0,
      ville: "",
      photos: [],
      old_photos: [],
    };
    previewPhotos.value = [];
  }
  newPhotoFiles.value = [];
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  if (route.query.add) {
    const newQuery = { ...route.query };
    delete newQuery.add;
    router.replace({ query: newQuery });
  }
};

const handlePhotoUpload = (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    newPhotoFiles.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => previewPhotos.value.push(e.target.result);
    reader.readAsDataURL(file);
  });
};

const removePhoto = (index) => {
  const photo = previewPhotos.value[index];
  previewPhotos.value.splice(index, 1);

  const oldIdx = form.value.old_photos.indexOf(photo);
  if (oldIdx > -1) {
    form.value.old_photos.splice(oldIdx, 1);
  } else {
    // If it was a new photo, this is simplified. Ideally track files separately.
    // For now, if user removes a "new" photo, they might want to clear all and re-upload
    // or we'd need a more robust file tracking system.
  }
};

const saveProduct = async () => {
  saving.value = true;
  if (!form.value.category_id) {
    flash.warning("Veuillez sélectionner une catégorie.");
    saving.value = false;
    return;
  }

  if (newPhotoFiles.value.length === 0 && !isEditing.value) {
    flash.warning("Veuillez ajouter au moins une photo pour ce produit.");
    saving.value = false;
    return;
  }

  const formData = new FormData();
  formData.append("nom", form.value.nom);
  formData.append("description", form.value.description);
  formData.append("prix", form.value.prix);
  if (form.value.ancien_prix) {
    formData.append("ancien_prix", form.value.ancien_prix);
  }
  formData.append("category_id", form.value.category_id);
  formData.append("stock", form.value.stock);
  formData.append("ville", form.value.ville);
  formData.append("condition", "neuf");

  newPhotoFiles.value.forEach((file) => {
    formData.append("photos[]", file);
  });

  if (isEditing.value) {
    form.value.old_photos.forEach((photo) => {
      formData.append("old_photos[]", photo);
    });
    // POST with _method PUT for multipart form data
    formData.append("_method", "POST");
  }

  try {
    const url = isEditing.value
      ? `/user/produits/${currentProductId.value}`
      : "/user/produits";
    await apiClient.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await fetchMyProducts();
    flash.success(isEditing.value ? "Produit mis à jour !" : "Produit ajouté avec succès !");
    closeModal();
  } catch (err) {
    console.error("Error saving product", err.response?.data || err);
    const erreurs = err.response?.data?.errors;
    let msg = "Erreur lors de l'enregistrement. Vérifiez les champs.";
    if (erreurs) {
      msg = Object.values(erreurs).flat().join(" ");
    }
    flash.error(msg);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (product) => {
  alertStore.confirm({
    title: "Supprimer le produit",
    message: `Voulez-vous vraiment retirer "${product.nom}" du catalogue ?`,
    confirmText: "Supprimer",
    type: "error",
    onConfirm: async () => {
      try {
        await apiClient.post(`/user/delete/produit/${product.id}`);
        flash.success("Produit supprimé.");
        await fetchMyProducts();
      } catch (err) {
        flash.error("Impossible de supprimer le produit.");
        console.error("Error deleting product", err);
      }
    }
  });
};



watch(
  () => route.query.add,
  (newVal) => {
    if (newVal === "true") {
      openModal();
    }
  },
);

onMounted(() => {
  fetchMyProducts();
  fetchCategories();

  if (route.query.add === "true") {
    openModal();
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>
