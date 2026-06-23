// Régions — comptages RÉELS dérivés des 62 œuvres intégrées.
// Le corpus webFuuta porte sur le Fouta-Djallon : c'est la région par défaut
// pour toute œuvre qui ne se rattache pas explicitement à une autre région.
import { livres } from './livres/index.js'

const KW = {
  'Basse Guinée': ['basse guinée', 'rio nunez', 'rio-nunez', 'boke', 'boké', 'conakry', 'kindia', 'nunez', 'dubreka'],
  'Haute Guinée': ['haute guinée', 'kankan', 'siguiri', 'malink', 'kouroussa', 'dinguiraye'],
  'Guinée Forestière': ['forestière', 'forestiere', 'nzérékoré', 'nzerekore', 'guerze', 'kissi', 'macenta', 'forêt'],
}

function textOf(l) {
  return [l.rubrique, l.titre, ...(l.regions || []), ...(l.lieux || []), ...(l.themes || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

const slugsParRegion = { 'Fouta Djallon': [], 'Basse Guinée': [], 'Haute Guinée': [], 'Guinée Forestière': [] }
for (const l of livres) {
  const t = textOf(l)
  let placed = false
  for (const [region, kws] of Object.entries(KW)) {
    if (kws.some((k) => t.includes(k))) {
      slugsParRegion[region].push(l.slug)
      placed = true
    }
  }
  // Par défaut (et pour toute mention explicite du Fouta) → Fouta Djallon
  if (!placed || /fouta|fuuta|labe|timbo|pita|mamou|dalaba/.test(t)) slugsParRegion['Fouta Djallon'].push(l.slug)
}

const counts = Object.fromEntries(Object.entries(slugsParRegion).map(([r, s]) => [r, s.length]))

// Index slug-de-région → liste des slugs de livres (pour filtrer les documents)
export const livreSlugsParRegion = {
  'fouta-djallon': slugsParRegion['Fouta Djallon'],
  'basse-guinee': slugsParRegion['Basse Guinée'],
  'haute-guinee': slugsParRegion['Haute Guinée'],
  'guinee-forestiere': slugsParRegion['Guinée Forestière'],
}

// Régions — version page d'accueil (grandes cartes)
export const regionsAccueil = [
  { cls: 'r1', emoji: '🏔️', nom: 'Fouta Djallon', docs: `${counts['Fouta Djallon']} œuvres`, slug: 'fouta-djallon' },
  { cls: 'r2', emoji: '🌊', nom: 'Basse Guinée', docs: `${counts['Basse Guinée']} œuvres`, slug: 'basse-guinee' },
  { cls: 'r3', emoji: '🌿', nom: 'Haute Guinée', docs: `${counts['Haute Guinée']} œuvres`, slug: 'haute-guinee' },
  { cls: 'r4', emoji: '🌳', nom: 'Guinée Forestière', docs: `${counts['Guinée Forestière']} œuvres`, slug: 'guinee-forestiere' },
]

// Courtes présentations éditoriales par région
const DESCRIPTIONS = {
  'fouta-djallon': "Château d'eau de l'Afrique de l'Ouest, berceau de la théocratie peule (almamiat) fondée au XVIIIᵉ siècle. Cœur du corpus webFuuta : histoire, islam, langue et poésie pular.",
  'basse-guinee': "Région côtière et estuaires (Rio Nunez, Boké, Conakry, Dubréka) — comptoirs, commerce et premiers contacts avec les Européens.",
  'haute-guinee': "Savanes de l'est (Kankan, Siguiri, Kouroussa, Dinguiraye) — monde mandingue, grands axes commerciaux et foyers religieux.",
  'guinee-forestiere': "Massif forestier du sud-est (N'zérékoré, Macenta, Kissidougou) — sociétés de la forêt, peuples guerzé, toma et kissi.",
}

// Régions — version Explorer (mini cartes)
export const regionsExplorer = [
  { cls: 'r1', icon: '🏔️', nom: 'Fouta Djallon', nb: `${counts['Fouta Djallon']} œuvres`, slug: 'fouta-djallon', livreSlugs: livreSlugsParRegion['fouta-djallon'] },
  { cls: 'r2', icon: '🌊', nom: 'Basse Guinée', nb: `${counts['Basse Guinée']} œuvres`, slug: 'basse-guinee', livreSlugs: livreSlugsParRegion['basse-guinee'] },
  { cls: 'r3', icon: '🌿', nom: 'Haute Guinée', nb: `${counts['Haute Guinée']} œuvres`, slug: 'haute-guinee', livreSlugs: livreSlugsParRegion['haute-guinee'] },
  { cls: 'r4', icon: '🌳', nom: 'Guinée Forestière', nb: `${counts['Guinée Forestière']} œuvres`, slug: 'guinee-forestiere', livreSlugs: livreSlugsParRegion['guinee-forestiere'] },
]

// Index slug → région complète (pour la page /region/:slug)
export const regionBySlug = Object.fromEntries(
  regionsExplorer.map((r) => [r.slug, { ...r, description: DESCRIPTIONS[r.slug] || '' }]),
)
