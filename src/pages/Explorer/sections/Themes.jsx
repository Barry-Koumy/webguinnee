import { themes } from '../../../data/themes.js'

// Carrousel « Thèmes clés »
export default function Themes({ onSelect }) {
  return (
    <div className="h-scroll-section anim anim-d3">
      <div className="section-label">
        <h3>🏷️ Thèmes clés</h3>
        <span className="see-all">Tout voir →</span>
      </div>
      <div className="h-scroll">
        {themes.map((t) => (
          <div className="theme-card" key={t.nom} onClick={() => onSelect(t)}>
            <div className="theme-icon">{t.icon}</div>
            <div className="theme-nom">{t.nom}</div>
            <div className="theme-nb">{t.nb}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
