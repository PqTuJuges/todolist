<script setup>
import { ref, computed, watch } from 'vue'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'

// ---------- Données réactives (le parent reste la source de vérité) ----------
const taches = ref([
  { id: 1, libelle: 'Apprendre les bases de Vue.js', terminee: false, ordre: 1 },
  { id: 2, libelle: "Faire l'exercice de synthèse", terminee: false, ordre: 2 },
  { id: 3, libelle: 'Relire le cours sur les listes', terminee: false, ordre: 3 },
])
const triCritere = ref('manuel')
const prochainId = ref(4)

// ---------- Propriétés calculées ----------
const nombreTotalTaches = computed(() => {
  return taches.value.length
})

const nombreTachesTerminees = computed(() => {
  return taches.value.filter((t) => t.terminee).length
})

const aDesTaches = computed(() => {
  return taches.value.length > 0
})

const peutUtiliserTriManuel = computed(() => {
  return triCritere.value === 'manuel'
})

const tachesTriees = computed(() => {
  switch (triCritere.value) {
    case 'creation':
      return taches.value.toSorted((a, b) => a.id - b.id)
    case 'libelleAsc':
      return taches.value.toSorted((a, b) => a.libelle.localeCompare(b.libelle))
    case 'libelleDesc':
      return taches.value.toSorted((a, b) => b.libelle.localeCompare(a.libelle))
    case 'terminee':
      return taches.value.toSorted(
        (a, b) => Number(a.terminee) - Number(b.terminee) || a.libelle.localeCompare(b.libelle),
      )
    default:
      // 'manuel'
      return taches.value.toSorted((a, b) => a.ordre - b.ordre)
  }
})

// ---------- Clés localStorage ----------
const CLE_LOCALSTORAGE_TACHES = 'todolist:taches'
const CLE_LOCALSTORAGE_PROCHAIN_ID = 'todolist:prochainId'

// ---------- Initialisation : restauration depuis le navigateur ----------
const tachesSauvegardees = localStorage.getItem(CLE_LOCALSTORAGE_TACHES)
if (tachesSauvegardees !== null) {
  taches.value = JSON.parse(tachesSauvegardees)
}

const prochainIdSauvegarde = localStorage.getItem(CLE_LOCALSTORAGE_PROCHAIN_ID)
if (prochainIdSauvegarde !== null) {
  prochainId.value = Number(prochainIdSauvegarde)
}

// ---------- Observateurs : sauvegarde automatique ----------
// deep: true est indispensable : "taches" est une ref contenant un tableau,
// et on veut réagir aux push() et aux modifications des tâches elles-mêmes.
watch(
  taches,
  (nouvellesTaches) => {
    localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(nouvellesTaches))
  },
  { deep: true },
)

watch(prochainId, (nouvelId) => {
  localStorage.setItem(CLE_LOCALSTORAGE_PROCHAIN_ID, String(nouvelId))
})

// ---------- Fonctions métier (appelées quand un enfant émet un événement) ----------
function ajouterTache(libelle) {
  taches.value.push({
    id: prochainId.value,
    libelle: libelle,
    terminee: false,
    ordre: prochainId.value,
  })
  prochainId.value++
}

function basculerTerminee(id) {
  const tache = taches.value.find((t) => t.id === id)
  if (tache) {
    tache.terminee = !tache.terminee
  }
}

function supprimerTache(id) {
  taches.value = taches.value.filter((t) => t.id !== id)
}

function monter(id) {
  if (!peutUtiliserTriManuel.value) return

  const index = tachesTriees.value.findIndex((t) => t.id === id)
  if (index > 0) {
    const courante = tachesTriees.value[index]
    const voisine = tachesTriees.value[index - 1]
    const ordreTemp = courante.ordre
    courante.ordre = voisine.ordre
    voisine.ordre = ordreTemp
  }
}

function descendre(id) {
  if (!peutUtiliserTriManuel.value) return

  const index = tachesTriees.value.findIndex((t) => t.id === id)
  if (index !== -1 && index < tachesTriees.value.length - 1) {
    const courante = tachesTriees.value[index]
    const voisine = tachesTriees.value[index + 1]
    const ordreTemp = courante.ordre
    courante.ordre = voisine.ordre
    voisine.ordre = ordreTemp
  }
}
</script>

<template>
  <h2>Exo Synthèse</h2>

  <!-- Formulaire d'ajout : l'enfant émet "demanderAjoutTache" avec le libellé -->
  <TodoForm @demander-ajout-tache="ajouterTache" />

  <!-- Sélection du tri -->
  <div class="ligne">
    <select v-model="triCritere">
      <option value="manuel">Ordre personnalisé</option>
      <option value="creation">Ordre de création</option>
      <option value="libelleAsc">Libellé A→Z</option>
      <option value="libelleDesc">Libellé Z→A</option>
      <option value="terminee">Non terminées d'abord</option>
    </select>
  </div>
  <p class="aide">Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est « Ordre personnalisé ».</p>

  <!-- Compteurs -->
  <div class="ligne">
    <span>Total : {{ nombreTotalTaches }}</span>
    <span>Terminées : {{ nombreTachesTerminees }}</span>
  </div>

  <!-- Liste : on transmet la liste déjà triée et on écoute les demandes -->
  <TodoList
    v-if="aDesTaches"
    :taches="tachesTriees"
    :peut-utiliser-tri-manuel="peutUtiliserTriManuel"
    @demander-suppression="supprimerTache"
    @demander-changement-statut="basculerTerminee"
    @demander-montee="monter"
    @demander-descente="descendre"
  />
  <p v-else>Aucune tâche à afficher</p>
</template>

<!-- Style NON scoped : ces règles servent aussi aux composants enfants -->
<style>
.ligne {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.aide {
  font-size: 0.85rem;
  color: #666;
}

button {
  padding: 0.25rem 0.6rem;
  border: 1px solid #888;
  border-radius: 4px;
  background: #f4f4f4;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #e4e4e4;
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
