import { recitsAccueil } from '../../../data/recits.js'

// Section « Récits oraux » (accueil)
export default function RecitsSection({ playing, onToggle }) {
  return (
    <section className="recit-section fade-up">
      <div className="section-eye">🎙️ Récits oraux</div>
      <p className="recit-sub">L'histoire vit aussi dans les voix des anciens</p>
      <div className="player-cards">
        {recitsAccueil.map((p, i) => (
          <div className="player-card" key={p.titre}>
            <button className={'play-btn' + (playing === i ? ' playing' : '')} onClick={() => onToggle(i)} aria-label="Lire">
              {playing === i ? '⏸' : '▶'}
            </button>
            <div className="player-info">
              <div className="player-tag">{p.tag}</div>
              <div className="player-titre">{p.titre}</div>
              <div className="player-meta">{p.meta}</div>
            </div>
            <div className="player-dur">{p.dur}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
