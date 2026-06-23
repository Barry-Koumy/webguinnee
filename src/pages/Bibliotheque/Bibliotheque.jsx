import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout.jsx'
import { livres } from '../../data/livres/index.js'
import './Bibliotheque.css'

// Normalise une rubrique pour le regroupement
function rubriqueLabel(r) {
  const map = {
    Taariika: 'Histoire', History: 'Histoire', Histoire: 'Histoire',
    Diina: 'Islam & Religion', Culture: 'Culture',
    Bibliothèque: 'Biographies & Portraits', Ethnographie: 'Ethnographie',
  }
  return map[r] || r || 'Autres'
}

const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export default function Bibliotheque() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const filtered = livres.filter((l) => {
    if (!q.trim()) return true
    const hay = norm(l.titre + ' ' + l.auteur + ' ' + l.rubrique)
    return hay.includes(norm(q))
  })

  // Regrouper par rubrique normalisée, trier les groupes et les titres
  const groups = {}
  for (const l of filtered) {
    const g = rubriqueLabel(l.rubrique)
    ;(groups[g] = groups[g] || []).push(l)
  }
  const orderedGroups = Object.entries(groups).sort((a, b) => b[1].length - a[1].length)
  for (const [, list] of orderedGroups) list.sort((a, b) => a.titre.localeCompare(b.titre, 'fr'))

  return (
    <Layout
      active="/bibliotheque"
      eyebrow="La collection"
      title="La <em>bibliothèque</em>"
      sub={`${livres.length} œuvres du Fouta-Djallon reconstruites et lisibles en ligne.`}
      toastEl={null}
    >
      <div className="p-biblio">
        <div className="biblio-search">
          <span className="biblio-search-ic">🔍</span>
          <input
            type="search"
            placeholder="Rechercher un titre, un auteur…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && <button className="biblio-search-clear" onClick={() => setQ('')} aria-label="Effacer">✕</button>}
        </div>

        {filtered.length === 0 && (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <h3>Aucune œuvre trouvée</h3>
            <p>Essayez un autre titre ou nom d'auteur.</p>
          </div>
        )}

        {orderedGroups.map(([groupe, list]) => (
          <section className="biblio-group" key={groupe}>
            <h2 className="biblio-group-title">{groupe} <span className="biblio-group-n">{list.length}</span></h2>
            <div className="biblio-grid">
              {list.map((l) => (
                <button className="biblio-card" key={l.slug} onClick={() => navigate('/livre/' + l.slug)}>
                  <div className="biblio-card-cover">
                    {l.cover ? <img src={l.cover} alt="" loading="lazy" /> : <span className="biblio-card-ic">{l.icon || '📘'}</span>}
                    <span className="biblio-card-badge">{l.badge || 'ŒUVRE'}</span>
                  </div>
                  <div className="biblio-card-body">
                    <div className="biblio-card-title">{l.titre}</div>
                    <div className="biblio-card-author">{l.auteur || '—'}{l.annee ? ` · ${l.annee}` : ''}</div>
                    {l.nbChapitres ? <div className="biblio-card-meta">📖 {l.nbChapitres} chapitres</div> : null}
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  )
}
