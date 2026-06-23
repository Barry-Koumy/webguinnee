// Statistiques RÉELLES dérivées du registre des livres intégrés (62 œuvres).
// Remplace les compteurs fictifs des bandeaux Accueil / Explorer.
import { livres } from './livres/index.js'

const auteurs = new Set(
  livres
    .map((l) => (l.auteur || '').trim())
    .filter((a) => a && a !== '—')
)

const rubriques = new Set(livres.map((l) => l.rubrique).filter(Boolean))

export const stats = {
  nbLivres: livres.length,
  nbAuteurs: auteurs.size,
  nbRubriques: rubriques.size,
  nbRegions: 4, // Fouta Djallon, Basse / Haute Guinée, Guinée Forestière
}
