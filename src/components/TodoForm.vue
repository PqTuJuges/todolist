<script setup>
import { ref } from 'vue'

// Le texte en cours de saisie ne concerne que le formulaire : état local.
const nouvelleTache = ref('')

const emit = defineEmits(['demanderAjoutTache'])

const gererSoumission = () => {
  const libelle = nouvelleTache.value.trim()
  if (!libelle) return

  // On ne crée pas la tâche ici : on demande au parent de le faire.
  emit('demanderAjoutTache', libelle)
  nouvelleTache.value = ''
}
</script>

<template>
  <form class="ligne" @submit.prevent="gererSoumission">
    <input type="text" v-model="nouvelleTache" placeholder="Nouvelle tâche…" />
    <button type="submit" :disabled="nouvelleTache.trim() === ''">Ajouter</button>
  </form>
</template>
