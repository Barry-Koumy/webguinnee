import { personnalites } from '../../../data/personnalites.js'

// Figures historiques.
// layout="scroll" → carrousel horizontal (vue d'ensemble) ;
// layout="list"   → liste verticale détaillée (sous-onglet « Personnalités »).
export default function Personnalites({ onSelect, layout = 'scroll' }) {
  if (layout === 'list') {
    return (
      <div className="perso-list-section anim anim-d2">
        <div className="section-label">
          <h3>👤 Figures historiques ({personnalites.length})</h3>
        </div>
        <div className="perso-list">
          {personnalites.map((p) => (
            <div className="perso-row" key={p.slug || p.nom} onClick={() => onSelect(p)} style={{ cursor: 'pointer' }}>
              <div className="perso-avatar">{p.avatar}</div>
              <div className="perso-row-info">
                <div className="perso-nom">{p.nom}</div>
                <div className="perso-role">{p.role}</div>
              </div>
              <div className="perso-row-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-scroll-section anim anim-d2">
      <div className="section-label">
        <h3>👤 Figures historiques</h3>
        <span className="see-all">Tout voir →</span>
      </div>
      <div className="h-scroll">
        {personnalites.map((p) => (
          <div className="perso-card" key={p.slug || p.nom} onClick={() => onSelect(p)}>
            <div className="perso-avatar">{p.avatar}</div>
            <div className="perso-nom">{p.nom}</div>
            <div className="perso-role">{p.role}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
