<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { useToast } from "vue-toastification";
import apiClient from "../api/index.js";
import { CONFIG } from "../config/index.js";

import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Send,
  Forward,
  MoreHorizontal,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const openMenu = ref(null);
const blog = ref(null);
const isLoading = ref(true);
const comments = ref([]);
const newComment = ref("");
const isSubmitting = ref(false);
const editingCommentId = ref(null);
const editCommentContent = ref("");
const related = ref([]); // Fetch related if api supports it

const toggleMenu = (i) => {
  openMenu.value = openMenu.value === i ? null : i;
};

const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/800x400";
  return path.startsWith("http") ? path : `${CONFIG.API_BASE_URL}/storage/${path}`;
};

const getUserPhotoUrl = (user) => {
  if (user?.photo) {
    return user.photo.startsWith("http") ? user.photo : `${CONFIG.API_BASE_URL}/storage/${user.photo}`;
  }
  return `https://ui-avatars.com/api/?name=${user?.nom || "User"}&background=random`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffH = Math.floor((now - d) / 3600000);
  if (diffH < 1) return "À l'instant";
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `il y a ${diffD}j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

onMounted(async () => {
  try {
    const slug = route.params.slug;
  
  const resBlog = await apiClient.get(`/blogs/posts/${slug}`)
  const resComments = await  apiClient.get(`/blogs/posts/${slug}/comments`)

    // Blog details
    blog.value = resBlog.data.data || resBlog.data || null;
    
    // Comments
    const commentsData = resComments.data.data;
    comments.value = Array.isArray(commentsData) ? commentsData : (commentsData?.data || []);

    // Optional: Fetch related using public search API
    // apiClient.get(`/blogs/posts/search?c=${blog.value?.category_id}...`)
  } catch (err) {
    console.error("Erreur chargement blog:", err);
    toast.error("Impossible de charger l'article");
  } finally {
    isLoading.value = false;
  }
});

const submitComment = async () => {
  if (!authStore.isAuthenticated) {
    toast.info("Veuillez vous connecter pour commenter");
    router.push({ name: "Login", query: { redirect: route.fullPath } });
    return;
  }
  if (!newComment.value.trim()) return;

  isSubmitting.value = true;
  try {
    const slug = route.params.slug;
    
    // Ajout optimiste (simulation temps réel instantanée)
    const optimisticComment = {
      id: Date.now(),
      content: newComment.value,
      created_at: new Date().toISOString(),
      user: authStore.user,
      user_id: authStore.user?.id
    };
    comments.value.unshift(optimisticComment);
    
    const savedContent = newComment.value;
    newComment.value = "";
    
    // On envoie le commentaire en arrière-plan sans bloquer
    apiClient.post(`/blog/posts/${slug}/storeComments`, {
      content: savedContent
    }).catch(err => {
      console.error(err);
    });
    
  } catch (err) {
    toast.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

const canEditOrDelete = (comment) => {
  if (!authStore.user || comment.user_id !== authStore.user.id) return false;
  
  const commentDate = new Date(comment.created_at);
  const now = new Date();
  const diffHours = (now - commentDate) / (1000 * 60 * 60);
  
  return diffHours <= 24;
};

const startEdit = (comment) => {
  editingCommentId.value = comment.id;
  editCommentContent.value = comment.content || comment.text;
  openMenu.value = null;
};

const cancelEdit = () => {
  editingCommentId.value = null;
  editCommentContent.value = "";
};

const updateComment = async (comment) => {
  if (!editCommentContent.value.trim()) return;
  
  const originalContent = comment.content || comment.text;
  comment.content = editCommentContent.value;
  comment.text = editCommentContent.value;
  editingCommentId.value = null;
  
  try {
    const slug = route.params.slug;
    await apiClient.put(`/blog/posts/${slug}/comments/${comment.id}`, {
      content: comment.content
    });
    toast.success("Commentaire modifié");
  } catch (err) {
    comment.content = originalContent;
    comment.text = originalContent;
    toast.error("Erreur lors de la modification");
  }
};

const deleteComment = async (comment) => {
  if (!confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;
  
  openMenu.value = null;
  const index = comments.value.findIndex(c => c.id === comment.id);
  const deletedComment = comments.value[index];
  comments.value.splice(index, 1);
  
  try {
    const slug = route.params.slug;
    await apiClient.delete(`/blog/posts/${slug}/comments/${comment.id}`);
    toast.success("Commentaire supprimé");
  } catch (err) {
    comments.value.splice(index, 0, deletedComment);
    toast.error("Erreur lors de la suppression");
  }
};

const toggleLike = async () => {
  if (!authStore.isAuthenticated) {
    toast.info("Veuillez vous connecter pour aimer l'article");
    return;
  }
  
  // Simulation temps réel (Optimistic UI)
  const previousLiked = blog.value.is_liked;
  const previousCount = blog.value.likes_count || 0;
  
  blog.value.is_liked = !previousLiked;
  blog.value.likes_count = previousLiked ? previousCount - 1 : previousCount + 1;

  try {
    const slug = route.params.slug;
    const res = await apiClient.post(`/blog/posts/${slug}/like`);
    // Sync final values from server if provided
    if (res.data.likes_count !== undefined) blog.value.likes_count = res.data.likes_count;
    if (res.data.liked !== undefined) blog.value.is_liked = res.data.liked;
  } catch (err) {
    // Rollback
    blog.value.is_liked = previousLiked;
    blog.value.likes_count = previousCount;
    toast.error("Action impossible");
  }
};

const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: blog.value?.titre || blog.value?.title,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié dans le presse-papier");
  }
};
</script>

<template>
  <div
    class="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8"
  >
    <!-- 📝 ARTICLE -->
    <div class="lg:col-span-2">
      <div v-if="isLoading" class="animate-pulse space-y-6">
        <div class="h-8 w-24 bg-[var(--color-surface)] rounded"></div>
        <div class="h-[220px] md:h-[300px] bg-[var(--color-surface)] rounded-xl"></div>
        <div class="h-8 w-3/4 bg-[var(--color-surface)] rounded"></div>
        <div class="h-32 bg-[var(--color-surface)] rounded"></div>
      </div>
      
      <template v-else-if="blog">
        <!-- BACK -->
        <button
          @click="$router.push({ name: 'Blogs' })"
          class="flex items-center gap-2 mb-5 text-xs font-semibold hover:opacity-70"
          :style="{ color: 'var(--color-text-sub)' }"
        >
          <ArrowLeft :size="16" />
          Retour aux articles
        </button>

      <!-- IMAGE -->
      <div
        class="rounded-xl overflow-hidden mb-4 border"
        :style="{ borderColor: 'var(--color-border)' }"
      >
        <img
          :src="getImageUrl(blog.image)"
          :alt="blog.titre || blog.title"
          class="w-full h-[220px] md:h-[300px] object-cover"
        />
      </div>

      <!-- TITLE -->
      <h1
        class="text-lg md:text-xl font-bold mb-2"
        :style="{ color: 'var(--color-text-main)' }"
      >
        {{ blog.titre || blog.title }}

        <span class="text-[10px]" :style="{ color: 'var(--color-text-sub)' }">
            • {{ formatDate(blog.created_at) }}
          </span>

      </h1>

   

      <!-- CONTENT -->
      <div
        class="text-[13px] leading-relaxed space-y-4 mb-6 whitespace-pre-wrap"
        :style="{ color: 'var(--color-text-main)' }"
        v-html="blog.contenu || blog.content"
      ></div>

      <!-- ACTIONS -->
      <div
        class="flex items-center justify-between border-t border-b py-4 mb-6"
        :style="{ borderColor: 'var(--color-border)' }"
      >
        <div class="flex items-center gap-4">
          <button
            @click="toggleLike"
            class="flex items-center gap-1.5 text-xs hover:opacity-70 transition-colors"
            :class="blog.is_liked ? 'text-blue-500' : ''"
            :style="{ color: blog.is_liked ? 'var(--color-primary)' : 'var(--color-text-main)' }"
          >
            <ThumbsUp :size="16" />
            <span class="font-bold">{{ blog.likes_count || 0 }}</span>
          </button>

          <div
            class="flex items-center gap-1.5 text-xs"
            :style="{ color: 'var(--color-text-main)' }"
          >
            <MessageCircle :size="16" />
            <span class="font-bold">{{ comments.length }}</span>
          </div>
        </div>

        <button @click="shareArticle" class="flex items-center gap-1.5 text-xs hover:opacity-70 transition-colors" :style="{ color: 'var(--color-text-main)' }">
          <Forward :size="16" /> Partager
        </button>
      </div>

      <!-- 💬 COMMENTS -->
      <div class="space-y-4">
        <h2
          class="text-sm font-bold"
          :style="{ color: 'var(--color-text-main)' }"
        >
          Commentaires
        </h2>

        <!-- INPUT -->
        <div class="relative">
          <textarea
            v-model="newComment"
            placeholder="Écrire un commentaire..."
            rows="1"
            class="w-full rounded-full py-2.5 pl-4 pr-12 text-xs resize-none focus:outline-none border transition-colors focus:border-[var(--color-primary)]"
            :style="{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-main)',
            }"
            @keydown.enter.prevent="submitComment"
            :disabled="isSubmitting"
          ></textarea>

          <button
            @click="submitComment"
            :disabled="isSubmitting || !newComment.trim()"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-white transition disabled:opacity-50"
            :style="{ backgroundColor: 'var(--color-primary)' }"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin text-xs"></i>
            <Send v-else :size="14" />
          </button>
        </div>

        <!-- LIST -->
        <div v-if="comments.length === 0" class="py-4 text-center text-xs opacity-50" :style="{ color: 'var(--color-text-sub)' }">
          Soyez le premier à commenter !
        </div>
        <div v-else v-for="comment in comments" :key="comment?.id" class="flex gap-3 pt-4 border-b pb-4" :style="{ borderColor: 'var(--color-border)' }">
          <img
            :src="getUserPhotoUrl(comment?.user)"
            class="w-8 h-8 rounded-full shadow-sm object-cover"
          />

          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div class="flex gap-2 items-center">
                <span
                  class="text-[12px] font-bold"
                  :style="{ color: 'var(--color-text-main)' }"
                >
                  {{ comment?.user?.nom || comment?.name || 'Utilisateur' }}
                </span>

                <span
                  class="text-[10px]"
                  :style="{ color: 'var(--color-text-sub)' }"
                >
                  • {{ formatDate(comment?.created_at) }}
                </span>
              </div>

              <!-- MENU (Optional for own comments) -->
              <div v-if="canEditOrDelete(comment)" class="relative">
                <button @click="toggleMenu(comment?.id)" class="hover:bg-black/5 p-1 rounded-full transition">
                  <MoreHorizontal :size="16" />
                </button>

                <div
                  v-if="openMenu === comment?.id"
                  class="absolute right-0 mt-2 w-32 rounded-lg shadow text-xs overflow-hidden border"
                  :style="{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }"
                >
                  <button
                    @click="startEdit(comment)"
                    class="block w-full text-left px-3 py-2 transition"
                    :style="{ color: 'var(--color-text-main)' }"
                    @mouseover="
                      $event.target.style.backgroundColor = 'var(--color-bg)'
                    "
                    @mouseleave="
                      $event.target.style.backgroundColor = 'transparent'
                    "
                  >
                    Modifier
                  </button>

                  <button
                    @click="deleteComment(comment)"
                    class="block w-full text-left px-3 py-2 transition"
                    :style="{
                      color: '#ef4444',
                    }"
                    @mouseover="
                      $event.target.style.backgroundColor = 'var(--color-bg)'
                    "
                    @mouseleave="
                      $event.target.style.backgroundColor = 'transparent'
                    "
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <div v-if="editingCommentId === comment?.id" class="mt-2 text-xs">
              <textarea
                v-model="editCommentContent"
                class="w-full rounded-xl p-3 resize-none border focus:outline-none focus:border-[var(--color-primary)]"
                :style="{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-main)'
                }"
                rows="2"
              ></textarea>
              <div class="flex justify-end gap-2 mt-2">
                <button @click="cancelEdit" class="px-3 py-1.5 rounded-full border hover:bg-black/5" :style="{ borderColor: 'var(--color-border)' }">Annuler</button>
                <button @click="updateComment(comment)" class="px-3 py-1.5 rounded-full text-white" :style="{ backgroundColor: 'var(--color-primary)' }">Enregistrer</button>
              </div>
            </div>
            
            <p
              v-else
              class="text-[13px] mt-1.5 leading-relaxed"
              :style="{ color: 'var(--color-text-main)' }"
            >
              {{ comment?.content || comment?.text }}
            </p>
          </div>
        </div>
      </div>
      </template>

      <!-- 404/Error State -->
      <div v-if="!isLoading && !blog" class="py-20 text-center">
        <i class="fas fa-file-alt text-4xl mb-4 opacity-20"></i>
        <h2 class="text-xl font-bold mb-2">Article introuvable</h2>
        <button @click="$router.push({ name: 'Blogs' })" class="text-[var(--color-primary)] font-bold mt-2">Retour aux articles</button>
      </div>
    </div>

   
  </div>
</template>
