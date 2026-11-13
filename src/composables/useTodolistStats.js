import { computed } from 'vue'

export function useTodolistStats(taches) {
  const nombreTotalTaches = computed(() => {
    return taches.value.length
  })

  const nombreTachesTerminees = computed(() => {
    return taches.value.filter((t) => t.terminee).length
  })

  const aDesTaches = computed(() => {
    return taches.value.length > 0
  })

  return { nombreTotalTaches, nombreTachesTerminees, aDesTaches }
}