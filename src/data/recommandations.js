// Recommandations « Pour vous » (Accueil) — œuvres RÉELLES de la bibliothèque.
// Cliquables : naviguent vers le lecteur /livre/:slug.
import { livres } from './livres/index.js'

const REGION_EMOJI = {
  'Fouta Djallon': '🏔️',
  'Basse Guinée': '🌊',
  'Haute Guinée': '🌿',
  'Guinée Forestière': '🌳',
}

// Les fiches curées (riches) sont en tête du registre
export const recommandations = livres.slice(0, 8).map((l) => {
  const region = l.regions?.[0]
  return {
    cat: l.rubrique,
    titre: l.titre,
    region: `${REGION_EMOJI[region] || '📚'} ${region || l.rubrique}`,
    slug: l.slug,
  }
})
