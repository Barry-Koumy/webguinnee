import { useNavigate } from 'react-router-dom'
import { livreBySlug } from '../../../data/livres/index.js'

// Document mis en avant (« À la une ») — livre réel de la bibliothèque
export default function FeatureDoc({ onToast }) {
  const navigate = useNavigate()
  const livre = livreBySlug.atfdb

  return (
    <div className="feature-doc anim">
      <div className="feature-banner">
        <div className="feature-badge">⭐ À la une</div>
        <div className="feature-content">
          <div className="feature-genre">Récit de mission · {livre.rubrique} · {livre.annee}</div>
          <div className="feature-titre">{livre.titre}</div>
        </div>
      </div>
      <div className="feature-body">
        <div className="feature-auteur">
          <div className="auteur-avatar">{livre.icon || '📕'}</div>
          <div className="auteur-name"><strong>{livre.auteur}</strong> · {livre.annee}</div>
        </div>
        <div className="feature-meta-row">
          {livre.themes.slice(0, 3).map((t) => (
            <span className="meta-tag" key={t}>{t}</span>
          ))}
        </div>
        <div className="feature-actions">
          <button className="btn-or" onClick={() => navigate('/livre/' + livre.slug)}>📖 Lire maintenant</button>
          <button className="btn-ghost" onClick={() => onToast('⬇ Téléchargement...')}>⬇</button>
          <button className="btn-ghost" onClick={() => onToast('🔖 Sauvegardé')}>🔖</button>
        </div>
      </div>
    </div>
  )
}
