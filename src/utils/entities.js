// Détection et balisage des entités (personnages, lieux) dans le HTML des chapitres.
// Les entités curées (personnages.js, lieux.js) sont repérées par leurs alias et
// enveloppées dans un <button class="entity"> que la page Livre intercepte pour
// ouvrir une popover info (InfoPopover).

import { personnages } from '../data/personnages.js'
import { lieux } from '../data/lieux.js'

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Index { alias -> {slug, kind} } + registre { slug -> entité enrichie }
// kind = catégorie ('personnage' | 'lieu') ; on préserve le `type` d'origine
// des lieux (ville, région, province…) sous la clé `type`.
function buildIndex() {
  const byAlias = []
  const bySlug = {}
  const add = (list, kind) => {
    for (const e of list) {
      bySlug[e.slug] = { ...e, kind }
      for (const a of e.aliases || [e.nom]) byAlias.push({ alias: a, slug: e.slug, kind })
    }
  }
  add(personnages, 'personnage')
  add(lieux, 'lieu')
  // alias les plus longs en premier (priorité de correspondance)
  byAlias.sort((a, b) => b.alias.length - a.alias.length)
  return { byAlias, bySlug }
}

export const { byAlias: ENTITY_ALIASES, bySlug: ENTITY_BY_SLUG } = buildIndex()

// Une seule regex alternant tous les alias (ordre = plus longs d'abord)
const ALIAS_RE = new RegExp(
  '(' + ENTITY_ALIASES.map((e) => escapeRe(e.alias)).join('|') + ')',
  'g'
)
const ALIAS_LOOKUP = Object.fromEntries(ENTITY_ALIASES.map((e) => [e.alias, e]))

// Enveloppe la 1re occurrence de chaque entité dans le HTML d'un chapitre.
// On ne touche qu'au texte (hors balises) pour ne pas casser le markup.
export function injectEntities(html) {
  const seen = new Set()
  // tokeniser : segments de balises vs texte
  const parts = html.split(/(<[^>]+>)/g)
  let inAnchor = false
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i]
    if (!seg) continue
    if (seg[0] === '<') {
      if (/^<a[\s>]/i.test(seg)) inAnchor = true
      else if (/^<\/a>/i.test(seg)) inAnchor = false
      continue // balise : on saute
    }
    if (inAnchor) continue // ne pas baliser le texte d'un lien existant
    parts[i] = seg.replace(ALIAS_RE, (match) => {
      const meta = ALIAS_LOOKUP[match]
      if (!meta || seen.has(meta.slug)) return match
      seen.add(meta.slug)
      return `<button type="button" class="entity entity--${meta.kind}" data-entity="${meta.slug}">${match}</button>`
    })
  }
  return parts.join('')
}
