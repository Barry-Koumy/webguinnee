// « Livre du jour » — sélection déterministe d'une œuvre RÉELLE du registre,
// qui change chaque jour mais reste stable au cours d'une même journée.
import { livres } from './livres/index.js'

// On ne retient que les œuvres présentables (résumé + année renseignés)
const candidats = livres.filter((l) => l.resume && l.annee)

const jourEpoch = Math.floor(Date.now() / 86_400_000)
export const livreDuJour = candidats[jourEpoch % candidats.length] || livres[0]
