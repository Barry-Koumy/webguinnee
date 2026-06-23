import { categories } from '../../../data/categories.js'

// Grille « Parcourir par thème » (filtre les documents au clic)
export default function Categories({ active, onSelect }) {
  return (
    <div className="categories-section anim anim-d1">
      <div className="section-label" style={{ padding: 0, marginBottom: 12 }}>
        <h3>🏷️ Parcourir par thème</h3>
      </div>
      <div className="cat-grid">
        {categories.map((c, i) => (
          <div key={c.nom} className={'cat-card' + (active === i ? ' on' : '')} onClick={() => onSelect(i)}>
            <div className="cat-icon">{c.icon}</div>
            <div className="cat-nom">{c.nom}</div>
            <div className="cat-nb">{c.nb}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
