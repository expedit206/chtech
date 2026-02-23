<template>
  <div class="p-6 space-y-8 animate-fade-in">
    <header class="flex flex-col gap-1">
      <h1 class="text-2xl md:text-3xl font-bold text-[var(--color-text-main)]">
        Bonjour <span class="text-[var(--color-primary)]">Christian</span>, ravi
        de vous revoir !
      </h1>
      <p class="text-[var(--color-text-sub)]">
        Voici un aperçu de votre activité sur CH-Tech.
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        class="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-[var(--color-text-main)]">
            Dernière commande
          </h3>
          <span class="text-xs font-mono text-[var(--color-text-sub)]"
            >#ORD-99284</span
          >
        </div>

        <div class="flex items-center gap-4 mb-8">
          <div
            class="w-16 h-16 bg-white rounded-2xl border border-[var(--color-border)] flex items-center justify-center"
          >
            <i
              class="fa-solid fa-laptop text-[var(--color-primary)] text-2xl"
            ></i>
          </div>
          <div>
            <p class="font-semibold text-[var(--color-text-main)]">
              MacBook Pro M3 - Space Grey
            </p>
            <p class="text-sm text-[var(--color-accent)] font-medium">
              Statut : En préparation
            </p>
          </div>
        </div>

        <div class="relative pt-4">
          <div
            class="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-[var(--color-border)]"
          >
            <div
              style="width: 35%"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--color-accent)] transition-all duration-500"
            ></div>
          </div>
          <div
            class="flex justify-between text-[10px] md:text-xs font-medium text-[var(--color-text-sub)] uppercase tracking-wider"
          >
            <span class="text-[var(--color-accent)]">Confirmé</span>
            <span class="text-[var(--color-accent)]">Préparation</span>
            <span>Expédié</span>
            <span>Livré</span>
          </div>
        </div>
      </div>

      <div
        class="bg-[var(--color-primary)] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20"
      >
        <i
          class="fa-solid fa-crown absolute -right-4 -top-4 text-white/10 text-8xl rotate-12"
        ></i>
        <h3 class="text-white/80 font-medium mb-1">Votre Fidélité</h3>
        <p class="text-4xl font-black mb-4">
          2,450 <span class="text-sm font-normal">pts</span>
        </p>
        <div class="bg-white/20 backdrop-blur-md rounded-xl p-3 inline-block">
          <p class="text-xs font-medium">
            Équivalent : <span class="font-bold">24.50 €</span>
          </p>
        </div>
        <button
          class="w-full mt-6 py-2 bg-[var(--color-pure)] text-[var(--color-primary)] rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all"
        >
          Convertir mes points
        </button>
      </div>
    </div>

    <section>
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-[var(--color-text-main)]">Favoris récents</h3>
        <button
          class="text-[var(--color-primary)] text-sm font-semibold hover:underline"
        >
          Voir tout
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl flex items-center gap-4 hover:border-[var(--color-primary)] transition-all cursor-pointer group"
        >
          <div
            class="w-12 h-12 bg-white rounded-lg border border-[var(--color-border)] flex items-center justify-center shrink-0"
          >
            <i
              class="fa-solid fa-mobile-screen-button text-[var(--color-text-sub)] group-hover:text-[var(--color-primary)]"
            ></i>
          </div>
          <div class="overflow-hidden">
            <p
              class="font-medium text-[var(--color-text-main)] truncate text-sm"
            >
              iPhone 15 Pro Max
            </p>
            <p class="text-xs text-[var(--color-text-sub)]">1,199.00 €</p>
          </div>
          <i
            class="fa-solid fa-chevron-right ml-auto text-[var(--color-text-sub)] text-xs"
          ></i>
        </div>
      </div>
    </section>
  </div>
</template>
