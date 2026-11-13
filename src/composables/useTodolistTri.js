import { computed } from 'vue'

export function useTodolistTri(taches, triCritere) {
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

  return { tachesTriees, peutUtiliserTriManuel }
}