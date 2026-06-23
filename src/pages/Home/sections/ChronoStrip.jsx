import { chronoStrip } from '../../../data/chronologie.js'

// Section « Chronologie » (frise horizontale)
export default function ChronoStrip({ active, onSelect }) {
  return (
    <section className="chrono-section fade-up">
      <div className="section-eye">⏳ Chronologie</div>
      <div className="chrono-scroll">
        {chronoStrip.map((c) => (
          <div
            key={c.nom}
            className={'chrono-step' + (active === c.nom ? ' active' : '')}
            onClick={() => onSelect(c)}
          >
            <div className="chrono-dot-wrap">
              <div className={'chrono-line' + (c.left === 'hidden' ? ' hidden' : '')}></div>
              <div className="chrono-dot">{c.emoji}</div>
              <div className={'chrono-line' + (c.right === 'hidden' ? ' hidden' : '')}></div>
            </div>
            <div className="chrono-periode">{c.periode}</div>
            <div className="chrono-nom">{c.nom}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
