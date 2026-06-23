// Documents de l'Explorer — DÉRIVÉS du registre réel des livres (62 œuvres).
// Toute entrée pointe vers le lecteur intégré via `route`. Plus aucune donnée fictive.
import { livres } from './livres/index.js'

// Couverture « texte » pour les récits/biographies, « pdf » sinon (purement cosmétique)
function coverFor(l) {
  const b = (l.badge || '').toUpperCase()
  return ['BIOGRAPHIE', 'JOURNAL', 'RÉCIT', 'ŒUVRE'].includes(b) ? 'text' : 'pdf'
}

// Chips : rubrique + 2 thèmes (curés) ou mots-clés (auto), dédupliqués
// (insensible à la casse, pour éviter p.ex. « Islam · Islam »)
function chipsFor(l) {
  const extra = (l.themes && l.themes.length ? l.themes : l.motsCles) || []
  const seen = new Set()
  const out = []
  for (const c of [l.rubrique, ...extra.slice(0, 3)].filter(Boolean)) {
    const k = c.trim().toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    out.push(c)
    if (out.length === 3) break
  }
  return out
}

function metaFor(l) {
  const parts = []
  if (l.nbChapitres) parts.push(`📖 ${l.nbChapitres} chapitre${l.nbChapitres > 1 ? 's' : ''}`)
  if (l.annee) parts.push(l.annee)
  return parts.join(' · ') || l.rubrique || ''
}

// Évite « Auteur · Auteur » quand l'auteur n'a pas pu être distingué du titre
function auteurFor(l) {
  if (!l.auteur || l.auteur === l.titre) return l.annee || l.rubrique || '—'
  return l.annee ? `${l.auteur} · ${l.annee}` : l.auteur
}

// Documents — vue liste de l'Explorer
export const documentsListe = livres.map((l) => ({
  cover: coverFor(l),
  icon: l.icon || '📘',
  badge: l.badge || 'ŒUVRE',
  titre: l.titre,
  auteur: auteurFor(l),
  chips: chipsFor(l),
  meta: metaFor(l),
  action: '→',
  toast: '📖 Ouverture du livre...',
  route: `/livre/${l.slug}`,
  slug: l.slug,
}))

// Documents — vue grille de l'Explorer
export const documentsGrille = livres.map((l) => ({
  cover: coverFor(l),
  icon: l.icon || '📘',
  titre: l.titre,
  meta: metaFor(l),
  route: `/livre/${l.slug}`,
  slug: l.slug,
}))
