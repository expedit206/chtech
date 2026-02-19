<template>
  <section class="mx-auto max-w-7xl px-4 mt-4">
    <div
      class="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl shadow-lg border"
      :style="{
        backgroundColor: 'var(--color-accent)',
        borderColor: 'var(--color-border)',
      }"
    >
      <div class="flex items-center gap-4">
        <h2
          class="text-lg md:text-xl font-black text-[var(--color-pure)] uppercase tracking-tighter"
        >
          Spéciale Promo !! | Stock Limité
        </h2>
        <button
          class="hidden md:block px-4 py-1.5 rounded-lg text-[10px] font-bold bg-white/20 text-white border border-white/30 hover:bg-white/30 transition"
        >
          VOIR PLUS...
        </button>
      </div>

      <div class="flex items-center gap-3 mt-4 md:mt-0">
        <span class="text-xs font-bold text-white/90 uppercase"
          >Fin dans :</span
        >
        <div class="flex items-center gap-2">
          <div
            class="flex items-center gap-1 bg-white px-3 py-2 rounded-xl shadow-inner"
          >
            <span class="text-sm font-black" style="color: var(--color-accent)"
              >14j</span
            >
            <span class="opacity-30">:</span>
            <span class="text-sm font-black" style="color: var(--color-accent)"
              >12h</span
            >
            <span class="opacity-30">:</span>
            <span class="text-sm font-black" style="color: var(--color-accent)"
              >35m</span
            >
            <span class="opacity-30">:</span>
            <span class="text-sm font-black" style="color: var(--color-accent)"
              >23s</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No props needed for this specific static promo section as per current design
</script>
