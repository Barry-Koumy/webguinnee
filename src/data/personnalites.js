// Figures historiques affichées dans l'Explorer.
// Données réelles dérivées des personnages des livres intégrés (personnages.js).
import { personnages } from './personnages.js'

export const personnalites = personnages.map((p) => ({
  slug: p.slug,
  avatar: p.avatar,
  nom: p.nom,
  role: p.role,
  livres: p.livres || [],
}))
