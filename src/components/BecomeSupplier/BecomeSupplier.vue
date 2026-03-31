<template>
  <div class="max-w-3xl mx-auto p-6 bg-[var(--color-surface)] rounded-lg shadow-md mt-10">
    <h2 class="text-2xl font-bold text-[var(--color-text-main)] mb-6">
      Devenir Vendeur
    </h2>

    <form @submit.prevent="submitForm" class="space-y-5">

      <!-- Nom du vendeur -->
      <div>
        <label class="block text-[var(--color-text-sub)] mb-1" for="nom">
          Nom complet
        </label>
        <input
          type="text"
          id="nom"
          v-model="form.nom"
          placeholder="Votre nom complet"
          class="w-full p-3 rounded border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          required
        />
      </div>

      <!-- Nom de la structure -->
      <div>
        <label class="block text-[var(--color-text-sub)] mb-1" for="structure">
          Nom de la structure / entreprise
        </label>
        <input
          type="text"
          id="structure"
          v-model="form.structure"
          placeholder="Nom de votre entreprise"
          class="w-full p-3 rounded border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          required
        />
      </div>

      <!-- Catégorie des articles -->
      <div>
        <label class="block text-[var(--color-text-sub)] mb-1" for="categorie">
          Catégorie des articles
        </label>
        <select
          id="categorie"
          v-model="form.categorie"
          class="w-full p-3 rounded border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          required
        >
          <option disabled value="">Sélectionnez une catégorie</option>
          <option>Électronique</option>
          <option>Mode</option>
          <option>Maison & Décoration</option>
          <option>Sport</option>
          <option>Autres</option>
        </select>
      </div>

      <!-- Localisation -->
      <div>
        <label class="block text-[var(--color-text-sub)] mb-1" for="localisation">
          Localisation
        </label>
        <input
          type="text"
          id="localisation"
          v-model="form.localisation"
          placeholder="Ville, pays"
          class="w-full p-3 rounded border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          required
        />
      </div>

      <!-- Contacts -->
      <div>
        <label class="block text-[var(--color-text-sub)] mb-1" for="contact">
          Contact (Email ou téléphone)
        </label>
        <input
          type="text"
          id="contact"
          v-model="form.contact"
          placeholder="Ex: exemple@email.com / +237 6XXXXXXX"
          class="w-full p-3 rounded border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          required
        />
      </div>

      <!-- Bouton de soumission -->
      <button
        type="submit"
        class="w-full py-3 rounded bg-[var(--color-primary)] text-[var(--color-pure)] font-semibold hover:bg-[var(--color-accent)] transition-colors"
      >
        Soumettre
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  nom: '',
  structure: '',
  categorie: '',
  localisation: '',
  contact: ''
})

const submitForm = () => {
  console.log('Formulaire envoyé:', form)
  alert('Votre demande de devenir vendeur a été soumise !')
  // Ici tu peux faire un axios.post pour envoyer les données au serveur
}
</script>

<style scoped>
/* Optionnel : styles supplémentaires */
</style>
