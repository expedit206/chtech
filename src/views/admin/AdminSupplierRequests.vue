<template>
  <div class="max-w-6xl mx-auto px-4 py-12 pt-24 text-[var(--color-text-main)]">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black tracking-tight">
          Demandes Fournisseurs
        </h1>
        <p class="text-[var(--color-text-sub)]">
          Gérer les demandes d'activation du statut vendeur
        </p>
      </div>
      <div
        class="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full text-sm font-bold"
      >
        {{ requests.filter((r) => r.status === "pending").length }} en attente
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-[var(--color-primary)]" :size="48" />
    </div>

    <div
      v-else-if="requests.length === 0"
      class="text-center py-20 bg-[var(--color-surface)] rounded-3xl border-2 border-dashed border-[var(--color-border)]"
    >
      <Store
        class="mx-auto text-[var(--color-text-sub)] opacity-20 mb-4"
        :size="64"
      />
      <p class="text-xl font-bold text-[var(--color-text-sub)]">
        Aucune demande pour le moment
      </p>
    </div>

    <div v-else class="grid gap-6">
      <div
        v-for="req in requests"
        :key="req.id"
        class="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div
            class="w-16 h-16 rounded-2xl bg-[var(--color-bg)] flex-shrink-0 flex items-center justify-center border border-[var(--color-border)]"
          >
            <UserIcon
              class="text-[var(--color-text-sub)] opacity-40"
              :size="32"
            />
          </div>

          <div class="flex-grow space-y-3">
            <div class="flex items-center gap-3">
              <h3 class="text-xl font-bold">{{ req.company_name }}</h3>
              <span
                class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                :class="{
                  'bg-amber-500/20 text-amber-500 border border-amber-500/30':
                    req.status === 'pending',
                  'bg-green-500/20 text-green-500 border border-green-500/30':
                    req.status === 'approved',
                  'bg-red-500/20 text-red-500 border border-red-500/30':
                    req.status === 'rejected',
                }"
              >
                {{ req.status }}
              </span>
            </div>

            <div
              class="flex flex-wrap gap-4 text-sm text-[var(--color-text-sub)]"
            >
              <div class="flex items-center gap-1">
                <UserCircle :size="16" />
                <span>{{ req.user?.nom }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Mail :size="16" />
                <span>{{ req.user?.email }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Calendar :size="16" />
                <span
                  >Posté le
                  {{ new Date(req.created_at).toLocaleDateString() }}</span
                >
              </div>
            </div>

            <p
              class="text-[var(--color-text-main)] opacity-80 bg-[var(--color-bg)]/50 p-4 rounded-xl border border-[var(--color-border)] text-sm italic"
            >
              "{{ req.description }}"
            </p>
          </div>

          <div
            v-if="req.status === 'pending'"
            class="flex md:flex-col gap-2 w-full md:w-auto"
          >
            <button
              @click="handleAction(req.id, 'approved')"
              class="flex-1 px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
            >
              <Check :size="16" /> Approuver
            </button>
            <button
              @click="handleAction(req.id, 'rejected')"
              class="flex-1 px-6 py-2 border border-red-500/20 bg-red-500/10 text-red-600 rounded-xl font-bold hover:bg-red-500/20 transition text-sm flex items-center justify-center gap-2"
            >
              <X :size="16" /> Rejeter
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "../../api/index.js";
import { useToast } from "vue-toastification";
import {
  Loader2,
  Store,
  User as UserIcon,
  UserCircle,
  Mail,
  Calendar,
  Check,
  X,
} from "lucide-vue-next";

const toast = useToast();
const requests = ref([]);
const isLoading = ref(true);

const fetchRequests = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get("/admin/supplier-requests");
    requests.value = response.data.data;
  } catch (error) {
    toast.error("Erreur lors du chargement des demandes");
  } finally {
    isLoading.value = false;
  }
};

const handleAction = async (id, status) => {
  try {
    const response = await apiClient.put(`/admin/supplier-requests/${id}`, {
      status,
    });
    toast.success(response.data.message);
    fetchRequests(); // Refresh
  } catch (error) {
    toast.error("Erreur lors de l'action");
  }
};

onMounted(fetchRequests);
</script>
