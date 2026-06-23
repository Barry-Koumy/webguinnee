import { tabs } from '../../../data/explorerFiltres.js'

// Onglets de catégories (Tout / Documents / Récits oraux / …)
export default function FilterTabs({ active, onSelect }) {
  return (
    <div className="filter-tabs-wrap">
      <div className="filter-tabs">
        {tabs.map((t) => (
          <div key={t.id} className={'tab' + (active === t.id ? ' on' : '')} onClick={() => onSelect(t)}>
            {t.label}
          </div>
        ))}
      </div>
    </div>
  )
}
