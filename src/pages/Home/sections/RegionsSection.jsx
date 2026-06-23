import { regionsAccueil } from '../../../data/regions.js'

// Section « Explorer par région »
export default function RegionsSection({ onSelect }) {
  return (
    <section className="regions fade-up">
      <div className="section-eye" style={{ paddingRight: 22 }}>🗺️ Explorer par région</div>
      <div className="regions-scroll">
        {regionsAccueil.map((r) => (
          <div className="region-card" key={r.nom} onClick={() => onSelect(r)}>
            <div className={'region-bg ' + r.cls}>
              <div className="region-emoji-big">{r.emoji}</div>
              <div className="region-nom">{r.nom}</div>
              <div className="region-docs">{r.docs}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
