// Carte d'un récit oral avec bouton lecture/pause
export default function RecitCard({ recit, playing, onToggle }) {
  return (
    <div className={'r-card' + (playing ? ' active' : '')}>
      <button className={'r-play' + (playing ? ' playing' : '')} onClick={onToggle} aria-label="Lire">
        {playing ? '⏸' : '▶'}
      </button>
      <div className="r-cover">{recit.emoji}</div>
      <div className="r-info">
        <div className="r-tag">{recit.tag}</div>
        <div className="r-titre">{recit.titre}</div>
        <div className="r-meta">{recit.lieu}</div>
      </div>
      <div className="r-dur">{recit.dur}</div>
    </div>
  )
}
