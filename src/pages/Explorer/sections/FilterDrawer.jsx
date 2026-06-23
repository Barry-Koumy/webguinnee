import { filterGroups } from '../../../data/explorerFiltres.js'

// Tiroir (bottom-sheet) de filtres détaillés
export default function FilterDrawer({ open, selected, onToggle, onClose, onApply, onReset }) {
  return (
    <div
      className={'filter-overlay' + (open ? ' active' : '')}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="filter-drawer">
        <div className="drawer-handle"></div>
        <div className="drawer-title">Filtrer les résultats</div>

        {filterGroups.map((g) => (
          <div className="filter-group" key={g.label}>
            <div className="filter-group-label">{g.label}</div>
            <div className="filter-chips">
              {g.chips.map((c) => (
                <span key={c} className={'fchip-sm' + (selected.has(c) ? ' on' : '')} onClick={() => onToggle(c)}>{c}</span>
              ))}
            </div>
          </div>
        ))}

        <div className="drawer-actions">
          <button className="btn-reset" onClick={onReset}>Réinitialiser</button>
          <button className="btn-apply" onClick={onApply}>Voir les résultats</button>
        </div>
      </div>
    </div>
  )
}
