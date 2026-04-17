<template>
  <div class="p-4 md:p-8 animate-fade-in">
    <!-- Page Header -->
    <div class="mb-6">
      <h1
        class="text-2xl font-black"
        :style="{ color: 'var(--color-text-main)' }"
      >
        {{ roleFilter === 'vendeur' ? 'Vendeurs' : 'Utilisateurs' }}
      </h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--color-text-sub)' }">
        {{ totalUsers }} utilisateurs enregistrés
      </p>
    </div>

    <!-- Filters bar -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <!-- <div class="flex-1 relative">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
          :style="{ color: 'var(--color-text-main)' }" />
        <input v-model="search" @input="debouncedFetch" placeholder="Rechercher un utilisateur..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition"
          :style="{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }" />
      </div> -->
      <div class="flex-1 relative">
        <!-- Icône recherche -->
        <Search
          :size="16"
          class="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
          :style="{ color: 'var(--color-text-main)' }"
        />

        <!-- Input -->
        <input
          v-model="search"
          @input="debouncedFetch"
          placeholder="Rechercher un utilisateur..."
          class="w-full pl-9 pr-10 py-2.5 rounded-full border text-sm outline-none transition focus:border-primary"
          :style="{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-main)',
          }"
        />

        <!-- ❌ Bouton clear -->
        <button
          v-if="search"
          @click="clearSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>

      <select
        v-model="roleFilter"
        @change="fetchUsers"
        class="px-4 py-2.5 rounded-xl border text-sm outline-none"
        :style="{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-main)',
        }"
      >
        <option value="">Tous les rôles</option>
        <option value="user">Utilisateur</option>
        <option value="vendeur">Vendeur</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <!-- Table -->
    <div
      class="rounded-2xl border overflow-hidden"
      :style="{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }"
    >
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <div
          class="w-8 h-8 border-4 rounded-full animate-spin"
          style="
            border-color: var(--color-primary) transparent var(--color-primary)
              transparent;
          "
        />
      </div>

      <!-- Empty -->
      <div
        v-else-if="users.length === 0"
        class="flex flex-col items-center py-20 gap-3"
      >
        <Users
          :size="48"
          class="opacity-10"
          :style="{ color: 'var(--color-text-main)' }"
        />
        <p
          class="font-bold opacity-40"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          Aucun utilisateur trouvé
        </p>
      </div>

      <!-- Table content -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="border-b text-left text-xs font-black uppercase tracking-widest"
              :style="{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-sub)',
              }"
            >
              <th class="px-6 py-4">Utilisateur</th>
              <th class="px-6 py-4 hidden sm:table-cell">Contact</th>
              <th class="px-6 py-4">Rôle</th>
              <th class="px-6 py-4 hidden md:table-cell">Inscrit le</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            class="divide-y"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <tr
              v-for="user in users"
              :key="user.id"
              class="hover:opacity-90 transition-opacity group"
              :style="{ color: 'var(--color-text-main)' }"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="avatarUrl(user)"
                    class="w-9 h-9 rounded-full object-cover border"
                    :style="{ borderColor: 'var(--color-border)' }"
                  />
                  <div class="min-w-0">
                    <p class="font-bold text-sm truncate max-w-[140px]">{{ user.nom }}</p>

                  </div>
                </div>
              </td>
              <td class="px-6 py-4 hidden sm:table-cell">
                <p class="text-sm opacity-70 truncate max-w-[160px]">
                  {{ user.email || user.telephone }}
                </p>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-[11px] font-black px-2.5 py-1 rounded-full uppercase"
                  :class="{
                    'bg-red-500/15 text-red-400': user.role === 'admin',
                    'bg-indigo-500/15 text-indigo-400': user.role === 'vendeur',
                    'bg-slate-500/15 text-slate-400': user.role === 'user',
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 hidden md:table-cell text-sm opacity-50">
                {{ new Date(user.created_at).toLocaleDateString("fr-FR") }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <select
                    @change="changeRole(user.id, $event.target.value)"
                    :value="user.role"
                    class="text-xs px-2 py-1.5 rounded-lg border outline-none cursor-pointer"
                    :style="{
                      backgroundColor: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-main)',
                    }"
                  >
                    <option value="user">user</option>
                    <option value="vendeur">vendeur</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    @click="deleteUser(user)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10 text-red-400 opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="lastPage > 1"
        class="flex items-center justify-between px-6 py-4 border-t"
        :style="{ borderColor: 'var(--color-border)' }"
      >
        <span
          class="text-xs opacity-50"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          Page {{ currentPage }} / {{ lastPage }}
        </span>
        <div class="flex gap-2">
          <button
            @click="goPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-30 transition"
            :style="{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-main)',
            }"
          >
            ← Précédent
          </button>
          <button
            @click="goPage(currentPage + 1)"
            :disabled="currentPage >= lastPage"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border disabled:opacity-30 transition"
            :style="{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-main)',
            }"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { Search, Users, Trash2 } from "lucide-vue-next";

import apiClient from "../../api/index.js";
import { CONFIG } from "../../config/index.js";

const route = useRoute();
const users = ref([]);
const loading = ref(true);
const search = ref("");
const roleFilter = ref(route.query.role || "");
const currentPage = ref(1);
const lastPage = ref(1);
const totalUsers = ref(0);

let searchTimer = null;
const debouncedFetch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(fetchUsers, 350);
};

const fetchUsers = async (page = 1) => {
  loading.value = true;
  currentPage.value = page;
  try {
    const params = { page };
    if (search.value) params.search = search.value;
    if (roleFilter.value) params.role = roleFilter.value;
    const { data } = await apiClient.get("/admin/users", { params });
    users.value = data.data;
    lastPage.value = data.last_page;
    totalUsers.value = data.total;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// Re-charger si le paramètre de role change dans l'URL
watch(() => route.query.role, (newRole) => {
  roleFilter.value = newRole || "";
  fetchUsers(1);
});

const goPage = (p) => {
  if (p >= 1 && p <= lastPage.value) fetchUsers(p);
};

const avatarUrl = (user) => {
  if (user.photo) {
    if (user.photo.startsWith("http")) return user.photo;
    return CONFIG.STORAGE_URL + user.photo;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nom || "U")}&background=6366f1&color=fff`;
};

const changeRole = async (id, role) => {
  try {
    await apiClient.put(`/admin/users/${id}/role`, { role });
    const u = users.value.find((u) => u.id === id);
    if (u) u.role = role;
  } catch (e) {
    console.error(e);
  }
};

const deleteUser = async (user) => {
  if (!confirm(`Supprimer "${user.nom}" ? Cette action est irréversible.`))
    return;
  try {
    await apiClient.delete(`/admin/users/${user.id}`);
    users.value = users.value.filter((u) => u.id !== user.id);
    totalUsers.value--;
  } catch (e) {
    console.error(e);
  }
};

const clearSearch = () => {
  search.value = "";
  fetchUsers();
};


onMounted(() => fetchUsers());
</script>
