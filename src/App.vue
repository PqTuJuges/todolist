<script setup>
import { ref } from 'vue'

// ---------- Données réactives ----------
const taches = ref([
  { id: 1, libelle: 'apprendre', terminee: false, ordre: 1 },
  { id: 2, libelle: 'manger', terminee: false, ordre: 2 },
  { id: 3, libelle: 'dormir', terminee: false, ordre: 3 },
])
const nouvelleTache = ref('')
const triCritere = ref('manuel')
const prochainId = ref(4)

const CLE_LOCALSTORAGE_TACHES = 'todolist:taches'
const CLE_LOCALSTORAGE_PROCHAIN_ID = 'todolist:prochainId'

// ---------- Fonctions ----------

function sauvegarder() {
  localStorage.setItem(CLE_LOCALSTORAGE_TACHES, JSON.stringify(taches.value))
  localStorage.setItem(CLE_LOCALSTORAGE_PROCHAIN_ID, String(prochainId.value))
}

function appliquerTri() {
  switch (triCritere.value) {
    case 'creation':
      taches.value.sort((a, b) => a.id - b.id)
      break
    case 'libelleAsc':
      taches.value.sort((a, b) => a.libelle.localeCompare(b.libelle))
      break
    case 'libelleDesc':
      taches.value.sort((a, b) => b.libelle.localeCompare(a.libelle))
      break
    case 'terminee':
      taches.value.sort(
        (a, b) => Number(a.terminee) - Number(b.terminee) || a.libelle.localeCompare(b.libelle),
      )
      break
    default:
      // 'manuel'
      taches.value.sort((a, b) => a.ordre - b.ordre)
  }
}

function ajouterTache() {
  const libelle = nouvelleTache.value.trim()
  if (libelle === '') return

  taches.value.push({
    id: prochainId.value,
    libelle: libelle,
    terminee: false,
    ordre: prochainId.value,
  })

  prochainId.value++
  nouvelleTache.value = ''
  appliquerTri()
  sauvegarder()
}

function basculerTerminee(id) {
  const tache = taches.value.find((t) => t.id === id)
  if (tache) {
    tache.terminee = !tache.terminee
    sauvegarder()
  }
}

function supprimerTache(id) {
  taches.value = taches.value.filter((t) => t.id !== id)
  sauvegarder()
}

function monter(id) {
  if (triCritere.value !== 'manuel') return

  const index = taches.value.findIndex((t) => t.id === id)
  if (index > 0) {
    const courante = taches.value[index]
    const voisine = taches.value[index - 1]
    const ordreTemp = courante.ordre
    courante.ordre = voisine.ordre
    voisine.ordre = ordreTemp
    appliquerTri()
    sauvegarder()
  }
}

function descendre(id) {
  if (triCritere.value !== 'manuel') return

  const index = taches.value.findIndex((t) => t.id === id)
  if (index !== -1 && index < taches.value.length - 1) {
    const courante = taches.value[index]
    const voisine = taches.value[index + 1]
    const ordreTemp = courante.ordre
    courante.ordre = voisine.ordre
    voisine.ordre = ordreTemp
    appliquerTri()
    sauvegarder()
  }
}
const tachesSauvegardees = localStorage.getItem(CLE_LOCALSTORAGE_TACHES)
if (tachesSauvegardees !== null) {
  taches.value = JSON.parse(tachesSauvegardees)
}

const prochainIdSauvegarde = localStorage.getItem(CLE_LOCALSTORAGE_PROCHAIN_ID)
if (prochainIdSauvegarde !== null) {
  prochainId.value = Number(prochainIdSauvegarde)
}
appliquerTri()
</script>

<template>
  <h2>Exo Synthèse</h2>

  <!-- Formulaire d'ajout -->
  <form class="ligne" @submit.prevent="ajouterTache">
    <input type="text" v-model="nouvelleTache" placeholder="Nouvelle tâche…" />
    <button type="submit" :disabled="nouvelleTache.trim() === ''">Ajouter</button>
  </form>

  <!-- Sélection du tri -->
  <div class="ligne">
    <select v-model="triCritere" @change="appliquerTri">
      <option value="manuel">Ordre personnalisé</option>
      <option value="creation">Ordre de création</option>
      <option value="libelleAsc">Libellé A→Z</option>
      <option value="libelleDesc">Libellé Z→A</option>
      <option value="terminee">Non terminées d'abord</option>
    </select>
    <button @click="appliquerTri">Appliquer</button>
  </div>
  <p class="aide">Les flèches ⬆ et ⬇ ne fonctionnent que si le tri est « Ordre personnalisé ».</p>

  <!-- Compteurs -->
  <div class="ligne">
    <span>Total : {{ taches.length }}</span>
    <span>Terminées : {{ taches.filter((t) => t.terminee).length }}</span>
  </div>

  <!-- Liste (rendu conditionnel) -->
  <ul v-if="taches.length > 0">
    <li v-for="tache in taches" :key="tache.id" class="ligne">
      <span :class="{ terminee: tache.terminee }">{{ tache.libelle }}</span>
      <button @click="monter(tache.id)" :disabled="triCritere !== 'manuel'">⬆</button>
      <button @click="descendre(tache.id)" :disabled="triCritere !== 'manuel'">⬇</button>
      <button @click="basculerTerminee(tache.id)">✔</button>
      <button @click="supprimerTache(tache.id)">🗑 Supprimer</button>
    </li>
  </ul>
  <p v-else>Aucune tâche à afficher</p>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}

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

.terminee {
  text-decoration: line-through;
  color: #999;
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
