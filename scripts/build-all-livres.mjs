/**
 * build-all-livres.mjs
 * Découvre TOUS les « livres » du miroir (../archives-build/, toutes catégories),
 * les extrait via extractBook(), génère src/data/livres/_generated.js (registre auto),
 * et agrège les liens externes vers liens-externes.html.
 *
 * bookRel = chemin relatif à ../archives-build/ (ex: "bibliotheque/noirot/atfdb",
 *           "pular/...", "colonial/...").
 *
 * Un livre = un dossier avec table des matières (tdm/contents/toc/sommaire),
 *   ou, à défaut, un dossier-feuille contenant des chapitres .html (sans sous-livre).
 *
 * Usage : node scripts/build-all-livres.mjs
 */

import { readdirSync, statSync, existsSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { extractBook } from './extract-livre.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ARCH = join(ROOT, '..', 'archives-build')

// Livres déjà curés (bookRel relatif à archives/ -> slug). On garde leur fiche
// curée dans index.js mais on régénère leur JSON (liens, images).
const CURATED = {
  'bibliotheque/noirot/atfdb': 'atfdb',
  'bibliotheque/joseph_harris/fouta_diallon_history': 'harris_kfd',
  'bibliotheque/watt': 'watt',
  'bibliotheque/demougeot': 'demougeot',
  'bibliotheque/pmarty': 'pmarty_islam',
  'bibliotheque/patrick-oreilly': 'oreilly_gv',
  'bibliotheque/tauxier': 'tauxier_hpfd',
  'bibliotheque/bubakar_barry/bokarBiro': 'bubakar_bokarbiro',
  'bibliotheque/bik/cerno_abdurahmane': 'bik_cerno',
}
const EXCLUDE = new Set(['bibliotheque/monenembo/roi-de-kahel'])
// alfa-ibrahim-sow = miroir en double de aisow (aisow plus complet)
const EXCLUDE_PREFIX = ['bibliotheque/alfa-ibrahim-sow']
const isExcluded = (b) => EXCLUDE.has(b) || EXCLUDE_PREFIX.some((p) => b === p || b.startsWith(p + '/'))

const SKIP_SUBDIR = new Set([
  'css', 'js', 'assets', 'images', 'image', 'img', 'icones', 'icons',
  'nav', 'pictures', 'pictures-Pages', 'video', 'videos', 'sons', 'audio', 'pdf',
  'hts-cache',
])
const TOC_NAME_RE = /(^|[-_])(tdm|toc|contents|sommaire)([-_.]|$)/i
const GALLERY_RE = /(^|\/)(pictures?|gallery|galerie|diaporama|photos?|slideshow)(\/|-|$)|(^|\/)image\d+\.html$/i
const isContentHtml = (f) =>
  f.endsWith('.html') && f !== 'index.html' && !TOC_NAME_RE.test(f) && !GALLERY_RE.test(f)
const safeIsDir = (p) => { try { return statSync(p).isDirectory() } catch { return false } }

// Découverte récursive des dossiers-livres -> liste de bookRel
function findBooks(absDir, rel) {
  let entries
  try { entries = readdirSync(absDir) } catch { return [] }
  const htmls = entries.filter((e) => e.endsWith('.html'))
  const hasToc = htmls.some((h) => TOC_NAME_RE.test(h) || h === 'contents.html' || h === 'tdm.html')
  const contentCount = htmls.filter(isContentHtml).length

  if (hasToc && contentCount >= 1) return [rel] // livre : pas de descente
  const subdirs = entries.filter((e) => !SKIP_SUBDIR.has(e) && safeIsDir(join(absDir, e)))
  let books = []
  for (const sub of subdirs) books.push(...findBooks(join(absDir, sub), rel ? `${rel}/${sub}` : sub))
  if (books.length === 0 && contentCount >= 1) return [rel] // dossier-feuille
  return books
}

function slugify(bookRel) {
  return bookRel.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
}
// Détecte un genre poétique (vers pular, qaṣīda, gimɗi…) pour un rendu adapté
function genreFor(o) {
  const hay = `${o.rubrique} ${o.titre} ${(o.motsCles || []).join(' ')}`.toLowerCase()
  // Marqueurs poétiques explicites uniquement (éviter les faux positifs d'histoire)
  if (/oogirde|gim[iɗ]ɗ?i|qa[sṣ][iī]da|po[eè]me\b|po[eé]sie\b|mbayalu|qasida/.test(hay)) return 'poesie'
  return null
}
function badgeFor(rubrique) {
  const r = (rubrique || '').toLowerCase()
  if (/diina|islam/.test(r)) return { badge: 'ISLAM', icon: '🕌' }
  if (/taariika|histoire|history/.test(r)) return { badge: 'HISTOIRE', icon: '📜' }
  if (/ethnographie/.test(r)) return { badge: 'ETHNO.', icon: '🪶' }
  if (/culture/.test(r)) return { badge: 'CULTURE', icon: '📿' }
  if (/pular|gim|poe|gimi|gimɗi/.test(r)) return { badge: 'POÉSIE', icon: '📜' }
  if (/economie|société|societe/.test(r)) return { badge: 'SOCIÉTÉ', icon: '📈' }
  return { badge: 'ŒUVRE', icon: '📘' }
}

// ─── 1. Découverte ───────────────────────────────────────────────────────────
const allBooks = findBooks(ARCH, '').filter(Boolean)
const todo = allBooks.filter((b) => !isExcluded(b))
console.log(`Livres découverts : ${allBooks.length}  | exclus : ${allBooks.length - todo.length}`)

// bookRel -> slug (curé ou auto) ; on assure l'unicité des slugs
const slugByBook = {}
const usedSlugs = new Set()
for (const b of todo) {
  // slug propre : on retire le préfixe "bibliotheque/" (cas majoritaire)
  let s = CURATED[b] || slugify(b.replace(/^bibliotheque\//, ''))
  while (usedSlugs.has(s)) s += '_b'
  usedSlugs.add(s)
  slugByBook[b] = s
}
// bookRel triés par longueur décroissante pour résoudre le préfixe le plus spécifique
const bookRelsByLen = todo.slice().sort((a, b) => b.length - a.length)
function resolveSlug(archRel) {
  for (const b of bookRelsByLen) {
    if (archRel === b || archRel.startsWith(b + '/')) return slugByBook[b]
  }
  return null
}

// ─── 2. Extraction ───────────────────────────────────────────────────────────
const fiches = []
const externalAll = new Set()
let ok = 0, ko = 0, totalImg = 0
for (const bookRel of todo) {
  const slug = slugByBook[bookRel]
  let r
  try { r = extractBook(bookRel, slug, { resolveSlug }) } catch (e) { console.error(`  ✗ ${bookRel}: ${e.message}`) }
  if (!r) { ko++; continue }
  ok++
  totalImg += r.copied
  for (const u of r.out.liensExternes || []) externalAll.add(u)
  if (CURATED[bookRel]) continue // fiche curée dans index.js : pas de fiche auto
  const o = r.out
  const genre = genreFor(o)
  const { badge, icon } = genre === 'poesie' ? { badge: 'POÉSIE', icon: '📜' } : badgeFor(o.rubrique)
  fiches.push({
    slug, titre: o.titre || slug, auteur: o.auteur || '', annee: o.annee || '',
    editeur: o.editeur || '', rubrique: o.rubrique || '', resume: o.resume || '',
    badge, icon, genre, nbChapitres: o.nbChapitres, motsCles: o.motsCles.slice(0, 12),
  })
}
fiches.sort((a, b) => a.titre.localeCompare(b.titre, 'fr'))

// ─── 3. Écriture du registre généré ──────────────────────────────────────────
const header = `// FICHIER GÉNÉRÉ par scripts/build-all-livres.mjs — NE PAS ÉDITER À LA MAIN.
// Fiches auto des œuvres de la bibliothèque (métadonnées extraites des archives).
// Les fiches curées de index.js priment sur celles-ci (même slug).

export const livresGeneres = `
writeFileSync(join(ROOT, 'src', 'data', 'livres', '_generated.js'), header + JSON.stringify(fiches, null, 2) + '\n', 'utf8')

// ─── 4. Liens externes -> liens-externes.html (par domaine, sans doublon) ─────
const linksRes = updateLiens(externalAll)

console.log(`\n✓ Générés : ${ok}  | échecs : ${ko}  | images copiées : ${totalImg}`)
console.log(`→ _generated.js (${fiches.length} fiches) | total intégré : ${fiches.length + Object.keys(CURATED).length}`)
console.log(`→ liens externes : ${externalAll.size} URLs, ${linksRes.added} domaine(s) ajouté(s) à liens-externes.html`)

// ─── Helper : ajout des domaines externes manquants au fichier de liens ───────
function updateLiens(urls) {
  const file = join(ROOT, 'liens-externes.html')
  if (!existsSync(file)) return { added: 0 }
  let html = readFileSync(file, 'utf8')
  // domaines déjà présents
  const present = new Set((html.match(/href="https?:\/\/[^"]+"/g) || []).map((h) =>
    h.replace(/^href="https?:\/\//, '').replace(/\/.*$/, '').replace(/"$/, '').replace(/^www\./, '')
  ))
  // domaines issus du corpus (hors réseaux sociaux / analytics / fonts)
  const skip = /facebook|twitter|linkedin|instagram|youtube|google|fonts\.|gstatic|analytics|webfuuta\.site/i
  const domains = new Map()
  for (const u of urls) {
    if (skip.test(u)) continue
    let host
    try { host = new URL(u).host.replace(/^www\./, '') } catch { continue }
    if (present.has(host)) continue
    if (!domains.has(host)) domains.set(host, `${new URL(u).protocol}//${new URL(u).host}/`)
  }
  if (!domains.size) return { added: 0 }
  const cards = [...domains].sort().map(([host, url]) =>
    `\n      <div class="card">\n        <div class="card-label">Archive liée</div>\n        <div class="card-title">${host}</div>\n        <span class="card-url">${host}</span>\n        <a class="card-link" href="${url}" target="_blank" rel="noopener">Visiter →</a>\n      </div>\n`
  ).join('')
  const section = `\n  <!-- Sites cités dans les œuvres (auto) -->\n  <div class="section">\n    <div class="section-title">Sites cités dans les œuvres</div>\n    <div class="section-desc">Domaines externes référencés dans les textes intégrés, ajoutés automatiquement.</div>\n    <div class="card-grid">${cards}    </div>\n  </div>\n`
  // insérer avant la fermeture du conteneur .wrap (dernière </div> avant </body>) ou avant </body>
  if (html.includes('<!-- Sites cités dans les œuvres (auto) -->')) {
    // remplacer la section auto existante
    html = html.replace(/\n\s*<!-- Sites cités dans les œuvres \(auto\) -->[\s\S]*?<\/div>\n\s*<\/div>\n/, section)
  } else {
    html = html.replace(/<\/body>/i, section + '\n</body>')
  }
  writeFileSync(file, html, 'utf8')
  return { added: domains.size }
}
