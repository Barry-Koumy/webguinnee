// Une ère de la frise verticale (en-tête cliquable + événements dépliables)
export default function TimelineEra({ era, open, onToggle, onEvent }) {
  return (
    <div className={'tl-era' + (open ? ' open' : '')}>
      <button className="tl-head" onClick={onToggle}>
        <span className="tl-dot">{era.emoji}</span>
        <span className="tl-head-txt">
          <span className="tl-periode">{era.periode}</span>
          <span className="tl-titre">{era.titre}</span>
        </span>
        <span className="tl-chevron">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="tl-events">
          {era.events.map((e) => (
            <div className="tl-event" key={e.date} onClick={() => onEvent(e)}>
              <span className="tl-event-date">{e.date}</span>
              <span className="tl-event-txt">{e.txt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
