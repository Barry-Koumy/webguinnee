import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout.jsx'
import InfoPopover from '../../components/InfoPopover/InfoPopover.jsx'
import { getLivre, loadLivreContent } from '../../data/livres/index.js'
import { ENTITY_BY_SLUG, injectEntities } from '../../utils/entities.js'
import { rewriteHtmlAssets } from '../../utils/asset.js'
import './Livre.css'

const FONT_SIZES = ['s', 'm', 'l']
const THEMES = [
  { id: 'ivoire', label: 'Ivoire', sw: '#ffffff' },
  { id: 'sepia', label: 'Sépia', sw: '#f4ecd8' },
  { id: 'gris', label: 'Gris', sw: '#e7ebee' },
  { id: 'sombre', label: 'Nuit', sw: '#23272e' },
]

function readPref(key, fallback) {
  try { return localStorage.getItem(key) || fallback } catch { return fallback }
}
function writePref(key, value) {
  try { localStorage.setItem(key, value) } catch { /* ignore */ }
}
function readingMinutes(html) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

// Neutralise les liens morts : seuls #chap:, /livre/ et http(s) restent cliquables.
// Les autres (anciens liens internes /archives/… non servis) deviennent du texte simple.
function neutralizeDeadLinks(html) {
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (m, attrs, inner) => {
    const href = (attrs.match(/href\s*=\s*"([^"]*)"/i) || [])[1] || ''
    if (href.startsWith('#chap:') || href.startsWith('/livre/') || /^https?:\/\//i.test(href)) return m
    return `<span class="lv-deadlink">${inner}</span>`
  })
}

export default function Livre() {
  const { slug, chapId } = useParams()
  const navigate = useNavigate()
  const livre = getLivre(slug)
  const reading = chapId != null

  const [content, setContent] = useState({ slug: null, chapitres: [] })
  const [entity, setEntity] = useState(null)
  const [font, setFontState] = useState(() => readPref('lv-font', 'm'))
  const [theme, setThemeState] = useState(() => readPref('lv-theme', 'ivoire'))
  const [progress, setProgress] = useState(0)
  const articleRef = useRef(null)

  const setFont = (v) => { setFontState(v); writePref('lv-font', v) }
  const setTheme = (v) => { setThemeState(v); writePref('lv-theme', v) }

  useEffect(() => {
    let alive = true
    loadLivreContent(slug).then((c) => { if (alive) setContent({ slug, chapitres: c.chapitres }) })
    return () => { alive = false }
  }, [slug])

  const loading = content.slug !== slug
  const chapitres = loading ? [] : content.chapitres
  const chapIndex = reading ? chapitres.findIndex((c) => c.id === chapId) : -1
  const current = chapIndex >= 0 ? chapitres[chapIndex] : null
  const html = current ? rewriteHtmlAssets(neutralizeDeadLinks(injectEntities(current.html))) : ''

  const goRead = (id) => navigate(`/livre/${slug}/chapitre/${id}`)
  const goSommaire = () => navigate(`/livre/${slug}`)

  // Remonter en haut à l'ouverture d'un chapitre
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [chapId, slug])

  // Barre de progression (mode lecture)
  useEffect(() => {
    if (!reading) return
    const onScroll = () => {
      const el = articleRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const done = Math.min(Math.max(-rect.top, 0), Math.max(total, 0))
      setProgress(total > 0 ? done / total : 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reading, chapId])

  // Navigation clavier (flèches) en lecture
  useEffect(() => {
    if (!reading) return
    const onKey = (e) => {
      if (e.target.closest('input, textarea')) return
      const list = content.chapitres
      const i = list.findIndex((c) => c.id === chapId)
      if (i < 0) return
      if (e.key === 'ArrowRight' && list[i + 1]) navigate(`/livre/${slug}/chapitre/${list[i + 1].id}`)
      else if (e.key === 'ArrowLeft' && list[i - 1]) navigate(`/livre/${slug}/chapitre/${list[i - 1].id}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reading, chapId, slug, content.chapitres, navigate])

  if (!livre) {
    return (
      <Layout active="/bibliotheque" eyebrow="Bibliothèque" title="Livre introuvable" toastEl={null}>
        <div className="lv-missing">
          <p>Ce livre n'est pas (encore) intégré.</p>
          <button className="btn-or" onClick={() => navigate('/bibliotheque')}>Retour à la bibliothèque</button>
        </div>
      </Layout>
    )
  }

  // Délégation de clics dans le texte du chapitre
  const onReaderClick = (e) => {
    const ent = e.target.closest('.entity')
    if (ent) {
      const data = ENTITY_BY_SLUG[ent.dataset.entity]
      if (data) setEntity(data)
      return
    }
    const a = e.target.closest('a')
    if (!a) return
    const href = a.getAttribute('href') || ''
    if (href.startsWith('#chap:')) {
      e.preventDefault()
      goRead(href.slice('#chap:'.length))
    } else if (href.startsWith('/livre/')) {
      e.preventDefault()
      navigate(href)
    } else if (/^https?:\/\//i.test(href)) {
      e.preventDefault()
      window.open(href, '_blank', 'noopener')
    } else {
      // Lien interne mort (ex: /archives/… non servi) → ne pas casser la navigation SPA
      e.preventDefault()
    }
  }

  // ─── PAGE DE LECTURE (chapitre) ────────────────────────────────
  if (reading) {
    if (loading) {
      return (
        <Layout active="/bibliotheque" eyebrow={livre.titre} title="Chargement…" toastEl={null}>
          <p className="lv-loading">Chargement du chapitre…</p>
        </Layout>
      )
    }
    if (!current) {
      return (
        <Layout active="/bibliotheque" eyebrow={livre.titre} title="Chapitre introuvable" toastEl={null}>
          <div className="lv-missing">
            <button className="btn-or" onClick={goSommaire}>← Retour au sommaire</button>
          </div>
        </Layout>
      )
    }
    const prevC = chapitres[chapIndex - 1]
    const nextC = chapitres[chapIndex + 1]
    return (
      <Layout active="/bibliotheque" eyebrow={livre.auteur} title={livre.titre} sub={`Chapitre ${chapIndex + 1} / ${chapitres.length}`} toastEl={null}>
        <div className="p-livre">
          <button className="lv-back" onClick={goSommaire}>← Sommaire</button>

          <section className={'lv-reader lv-theme--' + theme}>
            <div className="lv-progress"><span style={{ width: `${Math.round(progress * 100)}%` }} /></div>

            <div className="lv-reader-bar">
              <span className="lv-reader-eyebrow">Chapitre {chapIndex + 1} / {chapitres.length} · {readingMinutes(current.html)} min</span>
              <div className="lv-reader-ctl">
                <div className="lv-themectl" role="group" aria-label="Couleur de page">
                  {THEMES.map((t) => (
                    <button key={t.id} className={'lv-swatch' + (theme === t.id ? ' on' : '')} style={{ background: t.sw }} onClick={() => setTheme(t.id)} title={t.label} aria-label={'Couleur ' + t.label} />
                  ))}
                </div>
                <div className="lv-fontctl" role="group" aria-label="Taille du texte">
                  <button className="lv-fbtn" disabled={font === FONT_SIZES[0]} onClick={() => setFont(FONT_SIZES[Math.max(0, FONT_SIZES.indexOf(font) - 1)])} aria-label="Réduire">A−</button>
                  <button className="lv-fbtn" disabled={font === FONT_SIZES[FONT_SIZES.length - 1]} onClick={() => setFont(FONT_SIZES[Math.min(FONT_SIZES.length - 1, FONT_SIZES.indexOf(font) + 1)])} aria-label="Agrandir">A+</button>
                </div>
              </div>
            </div>

            <h2 className="lv-reader-title">{current.titre}</h2>

            <article
              ref={articleRef}
              className={'lv-content lv-content--' + font + (livre.genre === 'poesie' ? ' lv-content--poesie' : '')}
              onClick={onReaderClick}
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <div className="lv-nav">
              <button className="lv-nav-btn" disabled={!prevC} onClick={() => prevC && goRead(prevC.id)}>
                <span className="lv-nav-dir">← Précédent</span>
                {prevC && <span className="lv-nav-name">{prevC.titre}</span>}
              </button>
              <button className="lv-nav-btn lv-nav-btn--top" onClick={goSommaire} aria-label="Sommaire">📑</button>
              <button className="lv-nav-btn" disabled={!nextC} onClick={() => nextC && goRead(nextC.id)}>
                <span className="lv-nav-dir">Suivant →</span>
                {nextC && <span className="lv-nav-name">{nextC.titre}</span>}
              </button>
            </div>
          </section>
        </div>

        <InfoPopover entity={entity} onClose={() => setEntity(null)} onOpenLivre={(s) => { setEntity(null); navigate('/livre/' + s) }} />
      </Layout>
    )
  }

  // ─── PAGE FICHE + SOMMAIRE ─────────────────────────────────────
  const persos = (livre.personnages || []).map((s) => ENTITY_BY_SLUG[s]).filter(Boolean)
  const lieux = (livre.lieux || []).map((s) => ENTITY_BY_SLUG[s]).filter(Boolean)

  return (
    <Layout active="/bibliotheque" eyebrow={livre.rubrique} title={livre.titre} sub={livre.sousTitre} toastEl={null}>
      <div className="p-livre">
        <section className="lv-hero">
          <div className="lv-cover">
            {livre.cover ? <img src={livre.cover} alt={livre.titre} /> : <div className="lv-cover-ph">{livre.icon || '📖'}</div>}
            <span className="lv-badge">{livre.badge || 'LIVRE'}</span>
          </div>
          <div className="lv-meta">
            <div className="lv-author">
              {livre.portrait && <img className="lv-portrait" src={livre.portrait} alt={livre.auteur} />}
              <div>
                <button className="lv-author-name" onClick={() => { const a = ENTITY_BY_SLUG[livre.auteurSlug]; if (a) setEntity(a) }}>
                  {livre.auteur || '—'}
                </button>
                <div className="lv-edit">{[livre.annee, livre.editeur].filter(Boolean).join(' · ')}</div>
              </div>
            </div>
            {livre.resume && <p className="lv-resume">{livre.resume}</p>}

            <div className="lv-tags">
              {livre.regions?.map((r) => <span key={r} className="lv-tag lv-tag--region">📍 {r}</span>)}
              {livre.themes?.map((t) => <span key={t} className="lv-tag lv-tag--theme">{t}</span>)}
            </div>

            <button className="btn-or lv-read-btn" disabled={loading || !chapitres.length} onClick={() => chapitres[0] && goRead(chapitres[0].id)}>
              {loading ? 'Chargement…' : `📖 Lire — ${chapitres.length} chapitres`}
            </button>
          </div>
        </section>

        {(persos.length > 0 || lieux.length > 0) && (
          <section className="lv-entities">
            {persos.length > 0 && (
              <div className="lv-ent-group">
                <h3 className="lv-ent-title">👤 Personnages</h3>
                <div className="lv-chips">
                  {persos.map((p) => (
                    <button key={p.slug} className="lv-chip" onClick={() => setEntity(p)}>
                      <span className="lv-chip-ic">{p.avatar || '👤'}</span>{p.nom}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {lieux.length > 0 && (
              <div className="lv-ent-group">
                <h3 className="lv-ent-title">🗺️ Lieux</h3>
                <div className="lv-chips">
                  {lieux.map((l) => (
                    <button key={l.slug} className="lv-chip" onClick={() => setEntity(l)}>
                      <span className="lv-chip-ic">{l.emoji || '📍'}</span>{l.nom}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="lv-toc">
          <h3 className="lv-ent-title">📑 Sommaire</h3>
          {loading ? (
            <p className="lv-loading">Chargement du livre…</p>
          ) : (
            <ol className="lv-toc-list">
              {chapitres.map((c, i) => (
                <li key={c.id}>
                  <button className="lv-toc-item" onClick={() => goRead(c.id)}>
                    <span className="lv-toc-num">{i + 1}</span>
                    <span className="lv-toc-lbl">{c.titre}</span>
                    <span className="lv-toc-time">{readingMinutes(c.html)} min</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <InfoPopover entity={entity} onClose={() => setEntity(null)} onOpenLivre={(s) => { setEntity(null); navigate('/livre/' + s) }} />
    </Layout>
  )
}
