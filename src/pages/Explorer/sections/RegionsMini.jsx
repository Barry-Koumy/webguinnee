import { regionsExplorer } from '../../../data/regions.js'

// Grille « Régions historiques » (mini cartes)
export default function RegionsMini({ onSelect }) {
  return (
    <div className="regions-section anim anim-d2">
      <div className="section-label">
        <h3>🗺️ Régions historiques</h3>
        <span className="see-all">Carte →</span>
      </div>
      <div className="regions-grid">
        {regionsExplorer.map((r) => (
          <div className="region-mini" key={r.nom} onClick={() => onSelect(r)}>
            <div className={'rmini-bg ' + r.cls}>
              <div className="rmini-arrow">→</div>
              <div className="rmini-icon">{r.icon}</div>
              <div className="rmini-nom">{r.nom}</div>
              <div className="rmini-nb">{r.nb}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
