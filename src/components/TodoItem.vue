<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  libelle: { type: String, required: true },
  terminee: { type: Boolean, required: true },
  peutUtiliserTriManuel: { type: Boolean, required: true },
  peutMonter: { type: Boolean, required: true },
  peutDescendre: { type: Boolean, required: true },
})

// Les quatre "sonnettes" que ce composant peut actionner
const emit = defineEmits([
  'demanderSuppression',
  'demanderChangementStatut',
  'demanderMontee',
  'demanderDescente',
])

const demanderSuppression = () => emit('demanderSuppression', props.id)
const demanderChangementStatut = () => emit('demanderChangementStatut', props.id)
const demanderMontee = () => emit('demanderMontee', props.id)
const demanderDescente = () => emit('demanderDescente', props.id)
</script>

<template>
  <li class="ligne">
    <input type="checkbox" :checked="props.terminee" @change="demanderChangementStatut" />
    <span :class="{ terminee: props.terminee }">{{ props.libelle }}</span>
    <button
      type="button"
      :disabled="!props.peutUtiliserTriManuel || !props.peutMonter"
      @click="demanderMontee"
    >
      ⬆
    </button>
    <button
      type="button"
      :disabled="!props.peutUtiliserTriManuel || !props.peutDescendre"
      @click="demanderDescente"
    >
      ⬇
    </button>
    <button type="button" @click="demanderSuppression">🗑 Supprimer</button>
  </li>
</template>

<style scoped>
.terminee {
  text-decoration: line-through;
  color: #999;
}
</style>
