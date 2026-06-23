// Catégories de l'Explorer — comptages RÉELS calculés sur les 62 œuvres intégrées.
// Une œuvre peut compter dans plusieurs catégories (parcours thématique).
import { livres } from './livres/index.js'

const DEFS = [
  { icon: '📜', nom: 'Histoire', kw: ['taariika', 'histoire', 'history', 'almami', 'almaami', 'fuuta-jalon', 'fouta', 'biro', 'labe'] },
  { icon: '🕌', nom: 'Islam & Foi', kw: ['diina', 'islam', 'foi', 'al-islaamaaku', 'coran', 'theocra'] },
  { icon: '🗺️', nom: 'Colonisation', kw: ['colonial', 'colonisation', 'faransi', 'protectorat', 'français'] },
  { icon: '🎭', nom: 'Culture & Traditions', kw: ['culture', 'ethnograph', 'tradition', 'awlu', 'kompanya', 'defte', 'mœurs', 'moeurs'] },
  { icon: '🗣️', nom: 'Langue Pular', kw: ['pular', 'pulaar', 'gimdhi', 'gimɗi', 'langue', 'leluma', 'seerembhe', 'mombeya'] },
  { icon: '✍️', nom: 'Poésie & Oralité', kw: ['poesie', 'poésie', 'oogirde', 'qasida', 'oral', 'vers'] },
]

function textOf(l) {
  return [l.rubrique, l.titre, l.genre, ...(l.themes || []), ...(l.motsCles || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const categories = DEFS.map((d) => {
  const matched = livres.filter((l) => {
    const t = textOf(l)
    return d.kw.some((k) => t.includes(k))
  })
  return {
    icon: d.icon,
    nom: d.nom,
    nb: String(matched.length),
    slug: slugify(d.nom),
    livreSlugs: matched.map((l) => l.slug),
  }
})

// Index slug → liste des slugs de livres (pour filtrer les documents)
export const livreSlugsParCategorie = Object.fromEntries(categories.map((c) => [c.slug, c.livreSlugs]))

// Courtes présentations éditoriales par thème
const DESCRIPTIONS = {
  histoire: "Chroniques et études sur le Fouta-Djallon : la théocratie peule (almamiat), les almamy, les guerres et la marche vers la colonisation.",
  'islam-foi': "L'islam au Fouta-Djallon : implantation du djihad du XVIIIᵉ siècle, organisation religieuse, confréries et grandes figures de la foi.",
  colonisation: "Missions, traités de protectorat et administration française — la rencontre, souvent conflictuelle, entre le Fouta et la France.",
  'culture-traditions': "Mœurs, société, mariage, musique et vie quotidienne peule, vus par les voyageurs, ethnographes et lettrés du Fouta.",
  'langue-pular': "La langue pular (pulaar) et sa littérature écrite : grammaire, lexique et textes en caractères arabes (ajami) ou latins.",
  'poesie-oralite': "Poésie religieuse et profane, qasida et oogirde, transmission orale et patrimoine versifié du Fouta-Djallon.",
}

// Index slug → thème complet (pour la page /theme/:slug)
export const themeBySlug = Object.fromEntries(
  categories.map((c) => [c.slug, { ...c, description: DESCRIPTIONS[c.slug] || '' }]),
)
