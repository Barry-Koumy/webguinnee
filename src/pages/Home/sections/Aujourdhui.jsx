import { useNavigate } from 'react-router-dom'
import { livreDuJour } from '../../../data/livreDuJour.js'

// Tronque proprement un résumé pour l'aperçu
function apercu(texte, max = 220) {
  if (!texte || texte.length <= max) return texte
  return texte.slice(0, texte.lastIndexOf(' ', max)) + '…'
}

// Section « Le livre du jour » — met en avant une œuvre RÉELLE de la bibliothèque
export default function Aujourdhui({ offlineSaved, onOffline }) {
  const navigate = useNavigate()
  const l = livreDuJour

  return (
    <section className="hdj fade-up">
      <div className="section-eye">📖 Le livre du jour</div>
      <div className="hdj-card">
        <div className="hdj-top">
          <div className="hdj-date-block">
            <div className="hdj-day">{l.icon || '📘'}</div>
            <div className="hdj-month">{l.annee}</div>
          </div>
          <div className="hdj-meta">
            <div className="hdj-annee">{l.auteur}{l.regions?.[0] ? ` · ${l.regions[0]}` : ''}</div>
            <div className="hdj-titre">{l.titre}</div>
          </div>
        </div>
        <div className="hdj-body">
          <p className="hdj-desc">{apercu(l.resume)}</p>
          <div className="hdj-actions">
            <button className="btn-or" onClick={() => navigate('/livre/' + l.slug)}>📖 Lire l'œuvre</button>
            <button className="btn-ghost" onClick={onOffline} style={offlineSaved ? { borderColor: 'var(--or)', color: 'var(--or)' } : undefined}>
              {offlineSaved ? '✓ Sauvegardé' : '⬇ Hors ligne'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
