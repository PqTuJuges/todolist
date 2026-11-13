<script setup>
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'

// Le texte en cours de saisie
const nouvelleTache = ref('')

const emit = defineEmits(['demanderAjoutTache'])

const champSaisie = useTemplateRef('champSaisie')

const gererSoumission = () => {
  const libelle = nouvelleTache.value.trim()
  if (!libelle) return

  emit('demanderAjoutTache', libelle)
  nouvelleTache.value = ''
}

// Raccourci clavier la touche N redonne le focus au champ de saisie
const gererRaccourciClavier = (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return

  if (event.target.matches('input[type="checkbox"], textarea')) return

  if (event.key.toLowerCase() === 'n') {
    event.preventDefault()
    champSaisie.value?.focus()
  }
}

onMounted(() => {
  champSaisie.value.focus()
  window.addEventListener('keydown', gererRaccourciClavier)
})

onUnmounted(() => {
  window.removeEventListener('keydown', gererRaccourciClavier)
})
</script>

<template>
  <form class="ligne" @submit.prevent="gererSoumission">
    <input ref="champSaisie" type="text" v-model="nouvelleTache" placeholder="Nouvelle tâche…" />
    <button type="submit" :disabled="nouvelleTache.trim() === ''">Ajouter</button>
  </form>
</template>