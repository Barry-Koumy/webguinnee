/**
 * build-archives.js
 * Parcourt futta/webfuuta.site/, extrait le contenu HTML,
 * le réhabille au style WebGuinée et l'écrit dans ../archives-build/ (hors bundle prod).
 *
 * Usage : node scripts/build-archives.js
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join, relative, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT      = join(__dirname, '..')                                   // webguinee/
const FUTTA     = join(ROOT, '..', 'futta', 'webfuuta.site')             // source
const OUT       = join(ROOT, '..', 'archives-build')                      // destination (hors bundle prod)

// ─── Libellés de catégories ────────────────────────────────────────────────
const CAT_LABEL = {
  _racine      : 'Accueil webFuuta',
  bibliotheque : 'Bibliothèque',
  culture      : 'Culture',
  islamique    : 'Islam & Théocratie',
  pular        : 'Langue Pular',
  colonial     : 'Période Coloniale',
  postcolonial : 'Ère Postcoloniale',
  societe      : 'Société',
  economie     : 'Économie',
  pays         : 'Pays & Géographie',
  cartes       : 'Cartes',
  campboiro    : 'Camp Boiro',
  memoriam     : 'In Memoriam',
  Memoriam     : 'In Memoriam',
  webguinee    : 'Guinée',
  pas          : 'Alpha Abdul-Rahman Bah',
  ctsai_erfj   : 'CERFJ',
  courier      : 'Correspondances Coloniales',
  ukafj        : 'UKAFJ',
  webJakanka   : 'Peuples — Jakanka',
  webJalonka   : 'Peuples — Jalonka',
  webOneyan    : 'Peuples — Oneyan',
  webPajad     : 'Peuples — Pajad',
  webSoninke   : 'Peuples — Soninké',
  webUnyey     : 'Peuples — Unyey',
  webpulaaku   : 'Pulaaku',
}

// Dossiers à ignorer (assets, CDN, sites externes, utilitaires)
const SKIP_DIRS = new Set([
  'css', 'js', 'assets', 'images', 'icones', 'icons',
  'favicons', 'video', 'webafriqa', 'webcote', 'nav',
  'hts-cache',
])

// Fichiers HTML à ignorer
const SKIP_FILES = new Set([
  'googlefa90f74738bea3ae.html',
  'sitemap-index.html',
  'backblue.gif',
  'fade.gif',
])

// ─── Walk récursif ──────────────────────────────────────────────────────────
function walk(dir, files = []) {
  let entries
  try { entries = readdirSync(dir) } catch { return files }
  for (const name of entries) {
    if (SKIP_FILES.has(name)) continue
    const full = join(dir, name)
    let st
    try { st = statSync(full) } catch { continue }
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(full, files)
    } else if (name.endsWith('.html')) {
      files.push(full)
    }
  }
  return files
}

// ─── Extraction de métadonnées ──────────────────────────────────────────────
function extractMeta(html, name) {
  const re = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*?)["']`,
    'i'
  )
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*?)["'][^>]+name=["']${name}["']`,
    'i'
  )
  const m = html.match(re) || html.match(re2)
  return m ? m[1].trim() : ''
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return m ? m[1].trim() : ''
}

function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (!m) return ''
  let body = m[1]
  // Supprimer scripts
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '')
  // Supprimer noscript
  body = body.replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
  // Supprimer commentaires HTML
  body = body.replace(/<!--[\s\S]*?-->/g, '')
  // Supprimer liens CSS externes (parfois en body)
  body = body.replace(/<link[^>]+>/gi, '')
  return body.trim()
}

// ─── Réécriture des chemins d'images et de liens ────────────────────────────
function rewritePaths(body, srcFile) {
  const srcDir = dirname(srcFile)

  // Résoudre un href/src relatif en chemin absolu relatif à FUTTA
  function toFuttaRelative(raw) {
    if (!raw || raw.startsWith('http') || raw.startsWith('//') ||
        raw.startsWith('mailto:') || raw.startsWith('data:') ||
        raw.startsWith('#') || raw.startsWith('javascript')) {
      return null
    }
    try {
      const abs    = resolve(srcDir, raw.split('?')[0].split('#')[0])
      const rel    = relative(FUTTA, abs).replace(/\\/g, '/')
      return rel
    } catch { return null }
  }

  // Images → /futta-src/{rel}
  body = body.replace(
    /(<img[^>]+src=)(["'])([^"']*?)(["'])/gi,
    (_, pre, q1, raw, q2) => {
      const rel = toFuttaRelative(raw)
      if (rel === null) return _
      return `${pre}${q1}/futta-src/${rel}${q2}`
    }
  )

  // Liens internes HTML → /archives/{rel}
  body = body.replace(
    /(<a[^>]+href=)(["'])([^"']*?)(["'])/gi,
    (_, pre, q1, raw, q2) => {
      if (!raw || raw.startsWith('http') || raw.startsWith('//') ||
          raw.startsWith('mailto:') || raw.startsWith('#') ||
          raw.startsWith('javascript')) return _
      const anchor   = raw.includes('#') ? '#' + raw.split('#')[1] : ''
      const filePart = raw.split('#')[0]
      if (!filePart) return `${pre}${q1}${anchor}${q2}`
      const rel = toFuttaRelative(filePart)
      if (rel === null) return _
      return `${pre}${q1}/archives/${rel}${anchor}${q2}`
    }
  )

  return body
}

// ─── Décoder le titre pour affichage ────────────────────────────────────────
function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, (e) => String.fromCharCode(parseInt(e.slice(2), 10)))
}

// ─── Calcul du fil d'Ariane ─────────────────────────────────────────────────
function breadcrumb(relPath) {
  // relPath = path relative to FUTTA, ex: "bibliotheque/aisow/crfj/avant-propos.html"
  const parts = relPath.split('/').filter(Boolean)
  const depth  = parts.length          // nombre de segments y compris fichier
  const crumbs = [{ label: 'Accueil', href: '/' }]

  // Archives
  const archivesHref = `${'../'.repeat(depth)}archives/index.html`
  crumbs.push({ label: 'Archives', href: archivesHref })

  // Catégorie
  if (parts.length >= 1) {
    const cat  = parts[0]
    const href = `${'../'.repeat(depth - 1)}index.html`
    crumbs.push({ label: CAT_LABEL[cat] || cap(cat), href })
  }

  // Sous-dossiers intermédiaires
  for (let i = 1; i < parts.length - 1; i++) {
    const seg  = parts[i]
    const back = '../'.repeat(depth - 1 - i)
    crumbs.push({ label: cap(seg.replace(/-/g, ' ')), href: `${back}index.html` })
  }

  // Page actuelle (sans lien)
  crumbs.push({ label: null, href: null })

  return crumbs
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ─── Template HTML WebGuinée ─────────────────────────────────────────────────
function buildPage({ title, description, keywords, author, body, crumbs }) {
  const displayTitle = decodeEntities(title || 'Sans titre')

  const crumbHtml = crumbs.map((c, i) => {
    if (i === crumbs.length - 1) {
      return `<span class="bc-current">${displayTitle.split('/').pop().trim() || 'Page'}</span>`
    }
    return `<a class="bc-link" href="${c.href}">${c.label}</a>`
  }).join('<span class="bc-sep">›</span>')

  const metaDesc  = description ? `<meta name="description" content="${description}" />` : ''
  const metaKey   = keywords    ? `<meta name="keywords"    content="${keywords}"    />` : ''

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
${metaDesc}
${metaKey}
<title>${displayTitle} — WebGuinée</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<style>
:root{
  --or:#C9933A; --or-clair:#E8B96A;
  --vert:#1A3A2A; --vert-moyen:#2D5A3F; --vert-clair:#4A7C59;
  --ivoire:#FAF7F2; --beige:#F0EBE1; --beige2:#E8E0D0;
  --texte:#1A1A1A; --texte-clair:#666;
  --radius:12px; --shadow:0 2px 16px rgba(0,0,0,.08);
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Outfit',sans-serif;background:var(--ivoire);color:var(--texte);min-height:100vh;line-height:1.7}
a{color:var(--vert-clair);text-decoration:none}
a:hover{color:var(--or);text-decoration:underline}
img{max-width:100%;height:auto;border-radius:4px}

/* Header */
.site-header{background:var(--vert);padding:0 24px;position:sticky;top:0;z-index:100;
  display:flex;align-items:center;gap:14px;min-height:60px;box-shadow:0 2px 12px rgba(0,0,0,.25)}
.logo-icon{font-size:28px;line-height:1}
.logo-name{font-family:'Playfair Display',serif;color:#fff;font-size:18px;font-weight:700;letter-spacing:.3px}
.logo-sub{color:var(--or-clair);font-size:11px;letter-spacing:.5px;text-transform:uppercase}
.header-home{margin-left:auto;color:var(--or-clair);font-size:13px;text-decoration:none;
  border:1px solid rgba(201,147,58,.35);padding:5px 14px;border-radius:20px;transition:all .2s}
.header-home:hover{background:var(--or);color:#fff;border-color:var(--or)}

/* Fil d'Ariane */
.breadcrumb{background:var(--beige);border-bottom:1px solid var(--beige2);padding:10px 24px;
  font-size:13px;color:var(--texte-clair);display:flex;align-items:center;flex-wrap:wrap;gap:4px}
.bc-link{color:var(--vert-clair)}
.bc-link:hover{color:var(--or)}
.bc-sep{color:var(--beige2);margin:0 2px}
.bc-current{color:var(--texte-clair)}

/* Métadonnées */
.doc-meta{background:var(--beige);border-left:3px solid var(--or);
  padding:14px 20px;margin:28px auto 0;max-width:820px;border-radius:0 8px 8px 0;
  font-size:13px;color:var(--texte-clair);display:flex;flex-wrap:wrap;gap:12px}
.doc-meta span{display:flex;align-items:center;gap:6px}
.doc-meta strong{color:var(--texte)}

/* Contenu principal */
.page-wrap{max-width:820px;margin:0 auto;padding:28px 24px 60px}
.doc-content{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);padding:32px 36px}

/* Typographie du contenu hérité */
.doc-content h1,.doc-content h2,.doc-content h3{
  font-family:'Playfair Display',serif;color:var(--vert);margin:1.2em 0 .5em;line-height:1.3}
.doc-content h1{font-size:1.75rem;border-bottom:2px solid var(--or);padding-bottom:.3em}
.doc-content h2{font-size:1.35rem}
.doc-content h3{font-size:1.1rem;color:var(--vert-moyen)}
.doc-content p{margin:.7em 0;line-height:1.8}
.doc-content ul,.doc-content ol{padding-left:1.4em;margin:.7em 0}
.doc-content li{margin:.35em 0}
.doc-content table{width:100%;border-collapse:collapse;margin:1em 0;font-size:.9rem}
.doc-content td,.doc-content th{padding:6px 10px;border:1px solid var(--beige2);text-align:left}
.doc-content th{background:var(--beige);font-weight:600;color:var(--vert)}
.doc-content blockquote{border-left:3px solid var(--or);padding:.5em 1em;
  background:var(--ivoire);margin:1em 0;font-style:italic;color:var(--texte-clair)}
.doc-content hr{border:none;border-top:1px solid var(--beige2);margin:1.5em 0}
.doc-content .notes,.doc-content .note{font-size:.85rem;color:var(--texte-clair);
  border-top:1px solid var(--beige2);padding-top:.8em;margin-top:1.5em}
.doc-content .byline{font-size:.9rem;color:var(--texte-clair);margin:.3em 0 1em;font-style:italic}

/* Footer */
.site-footer{background:var(--vert);color:rgba(255,255,255,.65);text-align:center;
  padding:20px 24px;font-size:12px;margin-top:40px}
.site-footer a{color:var(--or-clair)}

@media(max-width:640px){
  .doc-content{padding:20px 16px}
  .page-wrap{padding:16px 12px 40px}
}
</style>
</head>
<body>

<header class="site-header">
  <div class="logo-icon">🌍</div>
  <div>
    <div class="logo-name">WebGuinée</div>
    <div class="logo-sub">Mémoire, Histoire &amp; Avenir</div>
  </div>
  <a class="header-home" href="/">← Accueil</a>
</header>

<nav class="breadcrumb" aria-label="Fil d'Ariane">
  ${crumbHtml}
</nav>

${author || description ? `
<div class="page-wrap" style="padding-bottom:0">
  <div class="doc-meta">
    ${author      ? `<span>✍️ <strong>Auteur</strong> ${author}</span>` : ''}
    ${description ? `<span>📝 ${description}</span>`                    : ''}
  </div>
</div>` : ''}

<div class="page-wrap">
  <article class="doc-content">
    ${body || '<p style="color:var(--texte-clair);font-style:italic">Contenu non disponible.</p>'}
  </article>
</div>

<footer class="site-footer">
  <p>Archives WebGuinée &mdash; Source : <em>webfuuta.site</em> (HTTrack, 2026) &mdash;
  <a href="/archives/index.html">Retour aux archives</a></p>
</footer>

</body>
</html>`
}

// ─── Page d'index de catégorie ───────────────────────────────────────────────
function buildIndex({ label, entries }) {
  const rows = entries.map(({ relPath, title, description, author }) => {
    const href  = `/archives/${relPath}`
    const short = decodeEntities(title.split('/').pop().split('—').pop().trim() || 'Sans titre')
    const sub   = description ? `<div style="font-size:.82rem;color:var(--texte-clair);margin-top:2px">${description}</div>` : ''
    const aut   = author      ? `<span style="font-size:.78rem;color:var(--or);display:block;margin-top:3px">✍️ ${author}</span>` : ''
    return `
    <li>
      <a href="${href}" style="display:block;padding:12px 16px;border-radius:8px;transition:background .15s;text-decoration:none;color:inherit;background:#fff;border:1px solid var(--beige2);margin-bottom:6px">
        <strong style="color:var(--vert);font-family:'Playfair Display',serif">${short}</strong>
        ${aut}${sub}
      </a>
    </li>`
  }).join('\n')

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${label} — Archives WebGuinée</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<style>
:root{--or:#C9933A;--or-clair:#E8B96A;--vert:#1A3A2A;--vert-moyen:#2D5A3F;--vert-clair:#4A7C59;--ivoire:#FAF7F2;--beige:#F0EBE1;--beige2:#E8E0D0;--texte:#1A1A1A;--texte-clair:#666}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Outfit',sans-serif;background:var(--ivoire);color:var(--texte);min-height:100vh}
a{color:var(--vert-clair)}
.site-header{background:var(--vert);padding:0 24px;display:flex;align-items:center;gap:14px;min-height:60px;box-shadow:0 2px 12px rgba(0,0,0,.25)}
.logo-name{font-family:'Playfair Display',serif;color:#fff;font-size:18px;font-weight:700}
.logo-sub{color:var(--or-clair);font-size:11px;letter-spacing:.5px;text-transform:uppercase}
.header-home{margin-left:auto;color:var(--or-clair);font-size:13px;border:1px solid rgba(201,147,58,.35);padding:5px 14px;border-radius:20px;text-decoration:none}
.hero{background:linear-gradient(135deg,var(--vert) 60%,var(--vert-moyen));padding:40px 24px;color:#fff}
.hero h1{font-family:'Playfair Display',serif;font-size:2rem;margin-bottom:8px}
.hero p{color:rgba(255,255,255,.7);font-size:.95rem}
.wrap{max-width:820px;margin:0 auto;padding:28px 24px 60px}
ul{list-style:none;padding:0}
.site-footer{background:var(--vert);color:rgba(255,255,255,.65);text-align:center;padding:20px 24px;font-size:12px}
.site-footer a{color:var(--or-clair)}
@media(max-width:640px){.hero h1{font-size:1.5rem}}
</style>
</head>
<body>
<header class="site-header">
  <div style="font-size:28px">🌍</div>
  <div>
    <div class="logo-name">WebGuinée</div>
    <div class="logo-sub">Archives</div>
  </div>
  <a class="header-home" href="/archives/index.html">← Toutes les archives</a>
</header>

<div class="hero">
  <div style="max-width:820px;margin:0 auto">
    <div style="color:var(--or-clair);font-size:.8rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Archives</div>
    <h1>${label}</h1>
    <p>${entries.length} document${entries.length > 1 ? 's' : ''}</p>
  </div>
</div>

<div class="wrap">
  <ul>${rows}</ul>
</div>

<footer class="site-footer">
  <p>Archives WebGuinée — <a href="/archives/index.html">Retour aux archives</a></p>
</footer>
</body>
</html>`
}

// ─── Master index ────────────────────────────────────────────────────────────
function buildMasterIndex(groups) {
  const cards = Object.entries(groups).map(([cat, entries]) => {
    const label = CAT_LABEL[cat] || cap(cat)
    return `
    <a href="/archives/${cat}/index.html" style="display:block;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.07);padding:20px 24px;text-decoration:none;color:inherit;border:1px solid var(--beige2);transition:transform .15s,box-shadow .15s">
      <div style="font-family:'Playfair Display',serif;color:var(--vert);font-size:1.1rem;font-weight:700;margin-bottom:4px">${label}</div>
      <div style="color:var(--texte-clair);font-size:.85rem">${entries.length} document${entries.length > 1 ? 's' : ''}</div>
    </a>`
  }).join('\n')

  const total = Object.values(groups).reduce((s, e) => s + e.length, 0)

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="Archives complètes de WebGuinée — Bibliothèque, Culture, Islam, Histoire et plus." />
<title>Archives — WebGuinée</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<style>
:root{--or:#C9933A;--or-clair:#E8B96A;--vert:#1A3A2A;--vert-moyen:#2D5A3F;--vert-clair:#4A7C59;--ivoire:#FAF7F2;--beige:#F0EBE1;--beige2:#E8E0D0;--texte:#1A1A1A;--texte-clair:#666}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Outfit',sans-serif;background:var(--ivoire);color:var(--texte)}
a:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.12)!important}
.site-header{background:var(--vert);padding:0 24px;display:flex;align-items:center;gap:14px;min-height:64px;box-shadow:0 2px 12px rgba(0,0,0,.25)}
.logo-name{font-family:'Playfair Display',serif;color:#fff;font-size:20px;font-weight:700}
.logo-sub{color:var(--or-clair);font-size:11px;letter-spacing:.5px;text-transform:uppercase}
.header-home{margin-left:auto;color:var(--or-clair);font-size:13px;border:1px solid rgba(201,147,58,.35);padding:6px 16px;border-radius:20px;text-decoration:none;white-space:nowrap}
.hero{background:linear-gradient(135deg,var(--vert) 0%,var(--vert-moyen) 100%);padding:48px 24px;text-align:center;color:#fff}
.hero-eye{color:var(--or-clair);font-size:.8rem;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px}
.hero h1{font-family:'Playfair Display',serif;font-size:2.4rem;margin-bottom:10px}
.hero h1 em{color:var(--or-clair);font-style:italic}
.hero-sub{color:rgba(255,255,255,.75);font-size:1rem;max-width:500px;margin:0 auto 20px}
.hero-stat{display:inline-flex;gap:32px;background:rgba(255,255,255,.08);border-radius:12px;padding:14px 28px;margin-top:8px}
.stat-n{font-size:1.6rem;font-weight:700;color:var(--or-clair)}
.stat-l{font-size:.75rem;text-transform:uppercase;letter-spacing:.5px;opacity:.7}
.wrap{max-width:900px;margin:0 auto;padding:40px 24px 60px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.section-eye{color:var(--or);font-size:.8rem;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px;font-weight:600}
.site-footer{background:var(--vert);color:rgba(255,255,255,.65);text-align:center;padding:24px;font-size:12px;margin-top:20px}
.site-footer a{color:var(--or-clair)}
@media(max-width:480px){.hero h1{font-size:1.7rem}.hero-stat{gap:20px}}
</style>
</head>
<body>
<header class="site-header">
  <div style="font-size:32px">🌍</div>
  <div>
    <div class="logo-name">WebGuinée</div>
    <div class="logo-sub">Mémoire, Histoire &amp; Avenir</div>
  </div>
  <a class="header-home" href="/">← Accueil</a>
</header>

<div class="hero">
  <div class="hero-eye">Patrimoine Guinéen</div>
  <h1>Archives <em>historiques</em></h1>
  <p class="hero-sub">Bibliothèque, culture, Islam, colonisation — des milliers de pages numérisées.</p>
  <div class="hero-stat">
    <div><div class="stat-n">${total}</div><div class="stat-l">Documents</div></div>
    <div><div class="stat-n">${Object.keys(groups).length}</div><div class="stat-l">Catégories</div></div>
  </div>
</div>

<div class="wrap">
  <div class="section-eye">📂 Parcourir par catégorie</div>
  <div class="grid">
    ${cards}
  </div>
</div>

<footer class="site-footer">
  <p>Archives WebGuinée &mdash; Source : <em>webfuuta.site</em> (HTTrack 2026)</p>
</footer>
</body>
</html>`
}

// ─── Écriture sécurisée ──────────────────────────────────────────────────────
function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content, 'utf-8')
}

// ─── Main ────────────────────────────────────────────────────────────────────
console.log('🔍 Scan de', FUTTA, '...')
const allFiles = walk(FUTTA)
console.log(`   ${allFiles.length} fichiers HTML trouvés`)

// Groupes par catégorie (premier segment de chemin relatif)
const groups = {}
const processed = []
let skip = 0

for (const srcFile of allFiles) {
  const html = readFileSync(srcFile, 'utf-8')

  // Ne pas générer les pages quasi-vides ou purement techniques
  const bodyRaw = extractBody(html)
  if (bodyRaw.replace(/<[^>]+>/g, '').trim().length < 80) { skip++; continue }

  // Ignorer les pages d'erreur 404 du serveur source
  const titleRaw = extractTitle(html)
  if (/404\s*(error|not\s*found)/i.test(titleRaw) || /page\s*not\s*found/i.test(titleRaw)) { skip++; continue }

  const relPath = relative(FUTTA, srcFile).replace(/\\/g, '/')
  const title   = titleRaw
  const desc    = extractMeta(html, 'description') || extractMeta(html, 'Description')
  const kw      = extractMeta(html, 'keywords')    || extractMeta(html, 'Keywords')
  const author  = extractMeta(html, 'auteur')      || extractMeta(html, 'author') ||
                  extractMeta(html, 'editeur')     || extractMeta(html, 'editor')
  const body    = rewritePaths(bodyRaw, srcFile)

  const parts   = relPath.split('/')
  // Les fichiers à la racine (pas dans un sous-dossier) vont dans "_racine"
  const topCat  = parts.length > 1 ? parts[0] : '_racine'
  if (!groups[topCat]) groups[topCat] = []
  groups[topCat].push({ relPath, title, description: desc, author })

  const crumbs  = breadcrumb(relPath)
  const page    = buildPage({ title, description: desc, keywords: kw, author, body, crumbs, relPath })

  const outFile = join(OUT, relPath)
  writeFile(outFile, page)
  processed.push(relPath)
}

console.log(`✅ ${processed.length} pages générées  (${skip} ignorées)`)

// Index par catégorie
for (const [cat, entries] of Object.entries(groups)) {
  const label = CAT_LABEL[cat] || cap(cat)
  const idx   = buildIndex({ category: cat, label, entries })
  writeFile(join(OUT, cat, 'index.html'), idx)
  console.log(`   📂 ${cat}/ — ${entries.length} documents`)
}

// Master index
writeFile(join(OUT, 'index.html'), buildMasterIndex(groups))
console.log('🏠 Master index généré →', join(OUT, 'index.html'))
console.log('\n✨ Terminé ! Lancer : npm run dev  puis ouvrir /archives/index.html')
