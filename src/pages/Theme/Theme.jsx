import { useParams, useNavigate, Navigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout.jsx'
import { themeBySlug } from '../../data/categories.js'
import { getLivre } from '../../data/livres/index.js'
import '../Bibliotheque/Bibliotheque.css'
import './Theme.css'

export default function Theme() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const theme = themeBySlug[slug]

  // Slug inconnu → retour à l'Explorer
  if (!theme) return <Navigate to="/explorer" replace />

  const livresTheme = (theme.livreSlugs || [])
    .map((s) => getLivre(s))
    .filter(Boolean)
    .sort((a, b) => a.titre.localeCompare(b.titre, 'fr'))

  return (
    <Layout
      active="/explorer"
      eyebrow="Parcourir par thème"
      title={`${theme.icon} ${theme.nom}`}
      sub={`${livresTheme.length} œuvre${livresTheme.length > 1 ? 's' : ''} rattachée${livresTheme.length > 1 ? 's' : ''} à ce thème.`}
      toastEl={null}
    >
      <div className="p-biblio">
        <button className="theme-back" onClick={() => navigate('/explorer')}>← Explorer</button>

        {theme.description && <p className="theme-intro">{theme.description}</p>}

        {livresTheme.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🏷️</div>
            <h3>Aucune œuvre pour l'instant</h3>
            <p>Le corpus actuel ne contient pas encore d'ouvrage rattaché à ce thème.</p>
          </div>
        ) : (
          <div className="biblio-grid">
            {livresTheme.map((l) => (
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
        )}
      </div>
    </Layout>
  )
}
