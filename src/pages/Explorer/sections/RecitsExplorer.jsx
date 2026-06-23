import { recits } from '../../../data/recits.js'

export default function RecitsExplorer({ onSelect }) {
  return (
    <div className="docs-section anim">
      <div className="section-label">
        <h3>🎙️ Récits oraux</h3>
        <span className="see-all">Tout voir →</span>
      </div>
      <div className="doc-list">
        {recits.map((r) => (
          <div className="doc-card" key={r.titre} onClick={() => onSelect(r)}>
            <div className="doc-cover audio">
              <span>{r.emoji}</span>
              <span className="doc-type-badge">AUDIO</span>
            </div>
            <div className="doc-info">
              <div className="doc-titre">{r.titre}</div>
              <div className="doc-auteur">{r.lieu}</div>
              <div className="doc-chips">
                <span className="doc-chip">{r.tag}</span>
              </div>
              <div className="doc-meta">🎙️ {r.dur}</div>
            </div>
            <button className="doc-action">▶</button>
          </div>
        ))}
      </div>
    </div>
  )
}
