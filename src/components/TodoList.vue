<script setup>
import TodoItem from './TodoItem.vue'

const props = defineProps({
  taches: { type: Array, required: true },
  peutUtiliserTriManuel: { type: Boolean, required: true },
})

const emit = defineEmits([
  'demanderSuppression',
  'demanderChangementStatut',
  'demanderMontee',
  'demanderDescente',
])
</script>

<template>
  <ul>
    <TodoItem
      v-for="(tache, index) in props.taches"
      :key="tache.id"
      :id="tache.id"
      :libelle="tache.libelle"
      :terminee="tache.terminee"
      :peut-utiliser-tri-manuel="props.peutUtiliserTriManuel"
      :peut-monter="index > 0"
      :peut-descendre="index < props.taches.length - 1"
      @demander-suppression="(id) => emit('demanderSuppression', id)"
      @demander-changement-statut="(id) => emit('demanderChangementStatut', id)"
      @demander-montee="(id) => emit('demanderMontee', id)"
      @demander-descente="(id) => emit('demanderDescente', id)"
    />
  </ul>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
</style>
