import { quickChips } from '../../../data/explorerFiltres.js'

// Filtres rapides + accès au tiroir de filtres
export default function QuickChips({ selected, onToggle, onOpenFilter }) {
  return (
    <div className="chips-zone">
      {quickChips.map((c) => (
        <div key={c} className={'fchip' + (selected.has(c) ? ' on' : '')} onClick={() => onToggle(c)}>{c}</div>
      ))}
      <div className="fchip" onClick={onOpenFilter}>⚙️ Filtres</div>
    </div>
  )
}
