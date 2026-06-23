/**
 * extract-livre.mjs
 * Lit les chapitres déjà réhabillés dans ../archives-build/bibliotheque/<...>/
 * et produit un JSON exploitable par le lecteur React : src/data/livres/<slug>.json
 *
 * CLI   : node scripts/extract-livre.mjs <fonds>/<livre> <slug>
 * Module: import { extractBook } from './extract-livre.mjs'
 *
 * Réutilise la convention des archives produites par build-archives.js :
 *   - contenu dans <article class="doc-content">…</article>
 *   - images en /futta-src/…   -> réécrites vers /livres/<slug>/<fichier> (copiées)
 *   - liens internes en /archives/…  -> chapitres du même livre -> ancres #chap:<id>
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, copyFileSync } from 'fs'
import { join, dirname, basename, relative } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
// bookRel est relatif à la racine des archives (ex: "bibliotheque/noirot/atfdb",
// "pular/gimDi/...", "colonial/...") afin de couvrir TOUT le miroir, pas seulement la bibliothèque.
const ARCHIVES = join(ROOT, '..', 'archives-build')
const FUTTA = join(ROOT, '..', 'futta', 'webfuuta.site') // sources d'images (lecture seule)

// Images de navigation/chrome à supprimer (toutes conventions de fonds)
const NAV_IMG = /\/(left|right|up|down|home|next|previous|back|backblue|fade|fleche\w*|puce\w*|bullet)\.(gif|png|jpe?g)$/i
// Pages de galerie/diaporama à exclure des chapitres
const GALLERY_RE = /(^|\/)(pictures?|gallery|galerie|diaporama|photos?|slideshow)(\/|-|$)|(^|\/)image\d+\.html$/i
// Libellés de navigation textuelle (liens « <-- Previous | Up | Next --> », etc.)
const NAV_TEXT = /^(?:&lt;|<)?\s*-*\s*(?:Previous|Pr[ée]c[ée]dent(?:e)?|Précédente|Up|Haut|Next|Suivant(?:e)?|Sommaire|Retour|Table\s+des\s+mati[eè]res|Home|Accueil)\s*-*\s*(?:&gt;|>)?$/i

const TOC_CANDIDATES = ['tdm.html', 'contents.html']
const TOC_NAME_RE = /(^|[-_])(tdm|toc|contents|sommaire)([-_.]|$)/i

// ─── Entités HTML → UTF-8 ────────────────────────────────────────────────────
const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  eacute: 'é', egrave: 'è', ecirc: 'ê', euml: 'ë',
  agrave: 'à', acirc: 'â', auml: 'ä',
  ugrave: 'ù', ucirc: 'û', uuml: 'ü',
  icirc: 'î', iuml: 'ï', ocirc: 'ô', ouml: 'ö',
  ccedil: 'ç', ntilde: 'ñ', oelig: 'œ', aelig: 'æ',
  aring: 'å', Aring: 'Å', oslash: 'ø', Oslash: 'Ø', szlig: 'ß', yuml: 'ÿ',
  Ntilde: 'Ñ', atilde: 'ã', Atilde: 'Ã', otilde: 'õ', Otilde: 'Õ',
  bull: '•', dagger: '†', Dagger: '‡', prime: '′', Prime: '″',
  aacute: 'á', Aacute: 'Á', eacute2: 'é', iacute: 'í', Iacute: 'Í',
  oacute: 'ó', Oacute: 'Ó', uacute: 'ú', Uacute: 'Ú',
  laquo: '«', raquo: '»', mdash: '—', ndash: '–',
  hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
  copy: '©', deg: '°', times: '×', middot: '·',
  pound: '£', euro: '€', cent: '¢', sect: '§', para: '¶',
  frac12: '½', frac14: '¼', frac34: '¾', ordm: 'º', ordf: 'ª', micro: 'µ',
  // Majuscules
  Eacute: 'É', Egrave: 'È', Ecirc: 'Ê', Agrave: 'À', Acirc: 'Â',
  Ccedil: 'Ç', Ocirc: 'Ô', Ouml: 'Ö', Ugrave: 'Ù', Ucirc: 'Û',
  Icirc: 'Î', Iuml: 'Ï', Oelig: 'Œ', Auml: 'Ä', Euml: 'Ë',
}
function decodeEntities(str) {
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, name) => (name in NAMED ? NAMED[name] : m))
}
// Décodage pour le corps HTML : on préserve les entités structurelles (&amp; &lt; &gt;)
function decodeBody(str) {
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, name) =>
      name === 'amp' || name === 'lt' || name === 'gt'
        ? m
        : name in NAMED ? NAMED[name] : m
    )
}

// ─── Helpers d'extraction (purs) ─────────────────────────────────────────────
function metaContent(html, name) {
  const re = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*?)["']`, 'i')
  const m = html.match(re)
  return m ? decodeEntities(m[1].trim()) : ''
}
function rawTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return m ? decodeEntities(m[1].replace(/\s*—\s*WebGuinée\s*$/i, '').trim()) : ''
}
function sectionLabel(html) {
  const t = rawTitle(html)
  const parts = t.split('/').map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean)
  return parts.length ? parts[parts.length - 1] : t
}

// Nettoyage du contenu d'un chapitre (sans réécriture de liens/images)
function docContent(html) {
  const m = html.match(/<article class="doc-content">([\s\S]*?)<\/article>/i)
  let body = m ? m[1] : ''
  // Couper tout le bloc footer (réseaux sociaux + copyright) jusqu'à la fin
  const fi = body.search(/<div id="footer">/i)
  if (fi !== -1) body = body.slice(0, fi)
  // Retirer le logo biblio de tête
  body = body.replace(/<h1>\s*<img[^>]*webfuuta-biblio0[^>]*>\s*<\/h1>/gi, '')
  // Retirer le bandeau de titre répété en tête de chaque page (jusqu'au sous-titre)
  const sousRe = /<p[^>]*class="sous_?titre"[^>]*>[\s\S]*?<\/p>/i
  const after = body.match(sousRe)
  if (after) body = body.slice(after.index + after[0].length)
  // hr/br/table de nav vides en tête
  body = body.replace(/^\s*(<hr[^>]*>|<br[^>]*>|\s)+/i, '')
  body = body.replace(/^\s*<table[^>]*>[\s\S]*?<\/table>/i, (t) =>
    /<td[^>]*>\s*[^<\s]/.test(t) ? t : ''
  )
  // Scripts / commentaires résiduels
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '')
  body = body.replace(/<!--[\s\S]*?-->/g, '')
  // Retirer les liens de navigation textuels (Previous / Up / Next / Sommaire…)
  body = body.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, (full, txt) =>
    NAV_TEXT.test(txt.replace(/<[^>]+>/g, '').trim()) ? '' : full
  )
  // Retirer les paragraphes/divs devenus vides (n'ayant plus que &nbsp;/espaces/br)
  body = body.replace(/<(p|div)[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, '')
  body = body.replace(/^\s*(<hr[^>]*>|<br[^>]*>|\s)+/i, '')
  return decodeBody(body.trim())
}

// Walk récursif des .html sous BOOK_DIR -> chemins relatifs (forward slashes)
function walkHtml(dir, base, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walkHtml(full, base, out)
    else if (name.endsWith('.html')) out.push(relative(base, full).replace(/\\/g, '/'))
  }
  return out
}

// ─── Extraction d'un livre ───────────────────────────────────────────────────
// Retourne { out, copied, outPath } ou null si aucun chapitre exploitable.
// opts.resolveSlug(archiveRelPath) -> slug d'un autre livre intégré (ou null)
export function extractBook(bookRel, slug = basename(bookRel), opts = {}) {
  const BOOK_DIR = join(ARCHIVES, bookRel)
  if (!existsSync(BOOK_DIR)) return null

  const BOOK_URL_PREFIX = `/archives/${bookRel}/`
  const resolveSlug = opts.resolveSlug || (() => null)
  const imagesToCopy = new Map()
  const externalLinks = new Set()

  const isToc = (rel) =>
    TOC_CANDIDATES.includes(rel) || rel === 'index.html' || TOC_NAME_RE.test(basename(rel))
  const isGallery = (rel) => GALLERY_RE.test(rel)
  const hrefToRel = (href) => {
    const clean = href.split('#')[0].split('?')[0]
    return clean.startsWith(BOOK_URL_PREFIX) ? clean.slice(BOOK_URL_PREFIX.length) : null
  }

  // TdM : noms exacts, sinon un fichier dont le nom évoque une TdM
  let TOC = TOC_CANDIDATES.find((c) => existsSync(join(BOOK_DIR, c))) || null
  if (!TOC) {
    const hit = readdirSync(BOOK_DIR).find((f) => f.endsWith('.html') && TOC_NAME_RE.test(f))
    if (hit) TOC = hit
  }

  // Ordre + titres des chapitres
  const files = []
  const titleByFile = {}
  const seen = new Set()
  if (TOC) {
    const tdm = readFileSync(join(BOOK_DIR, TOC), 'utf8')
    const re = /<a([^>]+)href="([^"]+?\.html(?:[#?][^"]*)?)"[^>]*>([\s\S]*?)<\/a>/gi
    let m
    while ((m = re.exec(tdm))) {
      if (/bc-link/.test(m[1])) continue
      const rel = hrefToRel(m[2])
      if (!rel || isToc(rel) || isGallery(rel) || seen.has(rel)) continue
      const label = decodeEntities(m[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
      seen.add(rel)
      files.push(rel)
      if (label) titleByFile[rel] = label
    }
  }
  const rest = walkHtml(BOOK_DIR, BOOK_DIR)
    .filter((rel) => !isToc(rel) && !isGallery(rel) && !seen.has(rel))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  for (const rel of rest) { seen.add(rel); files.push(rel) }

  if (!files.length) return null

  const relToId = {}
  files.forEach((rel) => { relToId[rel] = rel.replace(/\.html$/, '').replace(/\//g, '-') })

  // Réécriture images + liens internes du même livre
  const rewrite = (body) => {
    // Images : retirer assets/nav/galerie/malformées ; rewrite + copie pour le contenu
    body = body.replace(/<img\b[^>]*>/gi, (tag) => {
      const sm = tag.match(/\bsrc\s*=\s*["']([^"']*)["']/i)
      const src = sm ? sm[1] : ''
      const file = basename(src.split('#')[0].split('?')[0])
      // Ne garder que les vraies images de contenu (extension valide ; ni asset, ni nav)
      if (!src || src.startsWith('#') || /\/assets\//i.test(src) || NAV_IMG.test(src) ||
          !/\.(jpe?g|png|gif|webp|svg|bmp)$/i.test(file)) return ''
      const fm = src.match(/^\/futta-src\/(.+)$/)
      if (fm) {
        const abs = join(FUTTA, fm[1])
        if (existsSync(abs)) imagesToCopy.set(file, abs)
      }
      return tag.replace(/\bsrc\s*=\s*["'][^"']*["']/i, `src="/livres/${slug}/${file}"`)
    })
    // Liens (anchors complets) :
    //  - même livre  -> ancre in-app #chap:<id>
    //  - autre livre intégré -> /livre/<slug>
    //  - externe (http) -> collecté + délié (on garde le texte)
    //  - interne non résolu / mailto -> délié (on garde le texte)
    body = body.replace(/<a\b([^>]*?)href\s*=\s*["']([^"']*)["']([^>]*)>([\s\S]*?)<\/a>/gi, (full, pre, href, post, inner) => {
      if (/^https?:\/\//i.test(href)) { externalLinks.add(href); return inner }
      if (/^mailto:/i.test(href) || /^javascript:/i.test(href) || href.startsWith('#')) return inner
      // lien interne au sein du même livre -> chapitre
      const rel = hrefToRel(href)
      if (rel && !isToc(rel) && relToId[rel]) {
        return `<a href="#chap:${relToId[rel]}">${inner}</a>`
      }
      // lien vers une autre œuvre intégrée -> /livre/<slug>
      const archRel = href.replace(/^\/archives\//, '').split('#')[0].split('?')[0]
      const otherSlug = resolveSlug(archRel)
      if (otherSlug && otherSlug !== slug) {
        return `<a href="/livre/${otherSlug}">${inner}</a>`
      }
      // sinon : on délie (on conserve le texte, la détection d'entités fera le reste)
      return inner
    })
    return body
  }

  // Méta-livre depuis la TdM (ou 1er chapitre)
  const refHtml = readFileSync(join(BOOK_DIR, TOC || files[0]), 'utf8')
  const titleParts = rawTitle(refHtml).split('/').map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean)
  const rubrique = titleParts[1] || ''
  const auteur = titleParts[2] || ''
  const livreTitre = titleParts[3] || titleParts[titleParts.length - 1] || slug

  let editeur = '', annee = ''
  const sous = refHtml.match(/class="sous_?titre"[^>]*>([\s\S]*?)<\/p>/i)
  if (sous) {
    editeur = decodeEntities(sous[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    const ya = editeur.match(/\b(1[5-9]\d\d|20\d\d)\b/)
    if (ya) annee = ya[1]
  }

  const FALLBACK_TITLES = { intro: 'Introduction', conclusion: 'Conclusion', preface: 'Préface' }
  const chapitres = []
  for (const rel of files) {
    const p = join(BOOK_DIR, rel)
    if (!existsSync(p)) continue
    const html = readFileSync(p, 'utf8')
    const id = relToId[rel]
    const titre = titleByFile[rel] || FALLBACK_TITLES[id] || sectionLabel(html)
    const content = rewrite(docContent(html))
    if (content.replace(/<[^>]+>/g, '').trim().length < 40) continue // pages quasi-vides
    chapitres.push({ id, file: rel, titre: titre.replace(/\s+/g, ' ').trim(), html: content })
  }
  if (!chapitres.length) return null

  // Dédupliquer les titres identiques (sections multi-pages)
  const titleSeen = {}
  for (const c of chapitres) {
    titleSeen[c.titre] = (titleSeen[c.titre] || 0) + 1
    if (titleSeen[c.titre] > 1) c.titre = `${c.titre} (${titleSeen[c.titre]})`
  }

  const keywords = metaContent(refHtml, 'keywords') || metaContent(readFileSync(join(BOOK_DIR, files[0]), 'utf8'), 'keywords')
  const resume = metaContent(refHtml, 'description') || metaContent(readFileSync(join(BOOK_DIR, files[0]), 'utf8'), 'description')

  const out = {
    slug, titre: livreTitre, auteur, rubrique, annee, editeur, resume,
    motsCles: keywords.split(',').map((s) => s.trim()).filter(Boolean),
    nbChapitres: chapitres.length,
    liensExternes: [...externalLinks].sort(),
    chapitres,
  }

  // Écriture JSON
  const OUT_DIR = join(ROOT, 'src', 'data', 'livres')
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })
  const outPath = join(OUT_DIR, `${slug}.json`)
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')

  // Copie des images de contenu (futta reste intact)
  let copied = 0
  if (imagesToCopy.size) {
    const IMG_DIR = join(ROOT, 'public', 'livres', slug)
    if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true })
    for (const [file, abs] of imagesToCopy) {
      try { copyFileSync(abs, join(IMG_DIR, file)); copied++ } catch { /* ignore */ }
    }
  }

  return { out, copied, outPath }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  const bookRel = process.argv[2] || 'bibliotheque/noirot/atfdb'
  const slug = process.argv[3] || basename(bookRel)
  const r = extractBook(bookRel, slug)
  if (!r) { console.error(`✗ ${slug} : aucun chapitre exploitable (${bookRel})`); process.exit(1) }
  console.log(`✓ ${slug} : ${r.out.nbChapitres} chapitres → ${r.outPath}`)
  console.log(`  Titre   : ${r.out.titre}`)
  console.log(`  Auteur  : ${r.out.auteur}  | Rubrique : ${r.out.rubrique}  | ${r.out.editeur}`)
  console.log(`  Mots-clés: ${r.out.motsCles.length}  | Images copiées: ${r.copied}`)
}
