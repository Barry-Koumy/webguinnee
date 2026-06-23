import { useParams, useNavigate, Navigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout.jsx'
import { regionBySlug } from '../../data/regions.js'
import { getLivre } from '../../data/livres/index.js'
import '../Bibliotheque/Bibliotheque.css'
import './Region.css'

export default function Region() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const region = regionBySlug[slug]

  // Slug inconnu → retour à l'Explorer
  if (!region) return <Navigate to="/explorer" replace />

  const livresRegion = (region.livreSlugs || [])
    .map((s) => getLivre(s))
    .filter(Boolean)
    .sort((a, b) => a.titre.localeCompare(b.titre, 'fr'))

  return (
    <Layout
      active="/explorer"
      eyebrow="Régions historiques"
      title={`${region.icon} ${region.nom}`}
      sub={`${livresRegion.length} œuvre${livresRegion.length > 1 ? 's' : ''} rattachée${livresRegion.length > 1 ? 's' : ''} à cette région.`}
      toastEl={null}
    >
      <div className="p-biblio">
        <button className="region-back" onClick={() => navigate('/explorer')}>← Explorer</button>

        {region.description && <p className="region-intro">{region.description}</p>}

        {livresRegion.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🗺️</div>
            <h3>Aucune œuvre pour l'instant</h3>
            <p>Le corpus actuel ne contient pas encore d'ouvrage rattaché à cette région.</p>
          </div>
        ) : (
          <div className="biblio-grid">
            {livresRegion.map((l) => (
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
