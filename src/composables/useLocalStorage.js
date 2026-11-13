import { watch, isRef } from 'vue'

function aLaMemeForme(valeurInitiale, valeurRestauree) {
  if (Array.isArray(valeurInitiale)) return Array.isArray(valeurRestauree)
  if (typeof valeurInitiale === 'number') return Number.isFinite(valeurRestauree)
  return typeof valeurRestauree === typeof valeurInitiale
}


export function useLocalStorage(cle, donnee) {
  const valeurInitiale = isRef(donnee) ? donnee.value : donnee

  try {
    const texte = localStorage.getItem(cle)

    if (texte !== null) {
      const valeurRestauree = JSON.parse(texte)

      if (aLaMemeForme(valeurInitiale, valeurRestauree)) {
        if (isRef(donnee)) {
          donnee.value = valeurRestauree
        } else {
          donnee.splice(0, donnee.length, ...valeurRestauree)
        }
      }
    }
  } catch (erreur) {
    console.warn(`Restauration impossible pour la clé "${cle}" :`, erreur)
  }

  watch(
    donnee,
    (nouvelleValeur) => {
      try {
        localStorage.setItem(cle, JSON.stringify(nouvelleValeur))
      } catch (erreur) {
        console.warn(`Sauvegarde impossible pour la clé "${cle}" :`, erreur)
      }
    },
    { deep: true },
  )
}