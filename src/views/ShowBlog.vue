<script setup>
import { ref } from "vue";
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Send,
  Forward,
  MoreHorizontal,
} from "lucide-vue-next";

const openMenu = ref(null);

const toggleMenu = (i) => {
  openMenu.value = openMenu.value === i ? null : i;
};

const comments = ref([
  { name: "Kevin", text: "Super article 🔥 j’ai appris beaucoup !" },
  { name: "Sandra", text: "Très intéressant surtout la partie UX 👏" },
  { name: "Junior Dev", text: "Merci ça m’aide énormément 🙌" },
  { name: "Aline", text: "Tu peux faire un article Laravel ?" },
  { name: "Marc", text: "Très clair et bien expliqué 👍" },
  { name: "Dev Cam", text: "On veut plus de contenu 🚀" },
  { name: "Cynthia", text: "Simple et efficace, j’aime beaucoup" },
  { name: "Patrick", text: "Ça motive à progresser 💪" },
  { name: "Steve", text: "Article top merci 🙏" },
  { name: "Boris Tech Fan", text: "Contenu de qualité 💯" },
]);

const related = ref([
  { title: "Optimiser les performances web en 2026" },
  { title: "Les bases d’un bon design UI moderne" },
  { title: "Laravel vs Node : que choisir ?" },
  { title: "Comment structurer un projet pro" },
  { title: "Améliorer l’expérience utilisateur" },
]);
</script>

<template>
  <div
    class="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8"
  >
    <!-- 📝 ARTICLE -->
    <div class="lg:col-span-2">
      <!-- BACK -->
      <button
        class="flex items-center gap-2 mb-5 text-xs font-semibold hover:opacity-70"
        :style="{ color: 'var(--color-text-sub)' }"
      >
        <ArrowLeft :size="16" />
        Retour
      </button>

      <!-- IMAGE -->
      <div
        class="rounded-xl overflow-hidden mb-4 border"
        :style="{ borderColor: 'var(--color-border)' }"
      >
        <img
          src="https://via.placeholder.com/800x400"
          class="w-full h-[220px] md:h-[300px] object-cover"
        />
      </div>

      <!-- TITLE -->
      <h1
        class="text-lg md:text-xl font-bold mb-2"
        :style="{ color: 'var(--color-text-main)' }"
      >
        Comment se démarquer en développement web en 2026 ?
      </h1>

      <!-- AUTHOR -->
      <div class="flex items-center gap-2 mb-4">
        <img
          src="https://ui-avatars.com/api/?name=Admin"
          class="w-6 h-6 rounded-full"
        />
        <span
          class="text-[11px] font-semibold"
          :style="{ color: 'var(--color-text-main)' }"
        >
          Admin
        </span>
        <span class="text-[10px]" :style="{ color: 'var(--color-text-sub)' }">
          • il y a 2h
        </span>
      </div>

      <!-- CONTENT -->
      <div
        class="text-[13px] leading-relaxed space-y-3 mb-6"
        :style="{ color: 'var(--color-text-sub)' }"
      >
        <p>
          Dans un environnement numérique en constante évolution, il devient
          essentiel pour chaque développeur de se démarquer.
        </p>
        <p>
          L’objectif est de créer des solutions performantes, modernes et
          orientées utilisateur tout en restant compétitif.
        </p>
      </div>

      <!-- ACTIONS -->
      <div
        class="flex items-center justify-between border-t pt-3 mb-6"
        :style="{ borderColor: 'var(--color-border)' }"
      >
        <div class="flex items-center gap-4">
          <button
            class="flex items-center gap-1 text-xs hover:opacity-70"
            :style="{ color: 'var(--color-text-main)' }"
          >
            <ThumbsUp :size="16" />
            120
          </button>

          <div
            class="flex items-center gap-1 text-xs"
            :style="{ color: 'var(--color-text-main)' }"
          >
            <MessageCircle :size="16" />
            {{ comments.length }}
          </div>
        </div>

        <Forward :size="16" :color="'var(--color-text-main)'" />
      </div>

      <!-- 💬 COMMENTS -->
      <div class="space-y-4">
        <h2
          class="text-sm font-bold"
          :style="{ color: 'var(--color-text-main)' }"
        >
          Commentaires
        </h2>

        <!-- INPUT (Facebook style) -->
        <div class="relative">
          <textarea
            placeholder="Écrire un commentaire..."
            rows="1"
            class="w-full rounded-full py-2 pl-4 pr-10 text-xs resize-none focus:outline-none border"
            :style="{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-main)',
            }"
          ></textarea>

          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-white hover:opacity-80 transition"
            :style="{ backgroundColor: 'var(--color-primary)' }"
          >
            <Send :size="14" />
          </button>
        </div>

        <!-- LIST -->
        <div v-for="(comment, i) in comments" :key="i" class="flex gap-2 pt-3">
          <img
            :src="`https://ui-avatars.com/api/?name=${comment.name}`"
            class="w-6 h-6 rounded-full"
          />

          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div class="flex gap-2 items-center">
                <span
                  class="text-[11px] font-semibold"
                  :style="{ color: 'var(--color-text-main)' }"
                >
                  {{ comment.name }}
                </span>

                <span
                  class="text-[10px]"
                  :style="{ color: 'var(--color-text-sub)' }"
                >
                  • il y a 5 min
                </span>
              </div>

              <!-- MENU -->
              <div class="relative">
                <button @click="toggleMenu(i)">
                  <MoreHorizontal :size="16" />
                </button>

                <div
                  v-if="openMenu === i"
                  class="absolute right-0 mt-2 w-32 rounded-lg shadow text-xs overflow-hidden border"
                  :style="{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }"
                >
                  <button
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

            <p
              class="text-[11px] mt-1"
              :style="{ color: 'var(--color-text-sub)' }"
            >
              {{ comment.text }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 📚 SIDEBAR -->
    <aside class="space-y-4 lg:sticky lg:top-6 h-fit">
      <h3
        class="text-sm font-bold"
        :style="{ color: 'var(--color-text-main)' }"
      >
        Articles similaires
      </h3>

      <div
        v-for="(item, i) in related"
        :key="i"
        class="flex gap-3 p-2 rounded-lg cursor-pointer transition hover:opacity-80"
        :style="{ backgroundColor: 'var(--color-surface)' }"
      >
        <img
          src="https://via.placeholder.com/120x80"
          class="w-20 h-14 object-cover rounded-md"
        />

        <div class="flex-1">
          <p
            class="text-[12px] font-semibold leading-tight line-clamp-2"
            :style="{ color: 'var(--color-text-main)' }"
          >
            {{ item.title }}
          </p>

          <span class="text-[10px]" :style="{ color: 'var(--color-text-sub)' }">
            il y a 2 jours
          </span>
        </div>
      </div>
    </aside>
  </div>
</template>
