// Barre de navigation basse — 4 onglets (invité) ou 5 onglets (connecté)
const GUEST = [
  { icon: '🏠', lbl: 'Accueil' },
  { icon: '🗺️', lbl: 'Explorer' },
  { icon: '⏳', lbl: 'Chronologie' },
  { icon: '🎙️', lbl: 'Récits' },
]

export default function BottomNav({ connected, active, onGo, onIA }) {
  if (!connected) {
    return (
      <nav className="bottom-nav">
        <div className="nav-guest">
          {GUEST.map((n) => (
            <div key={n.lbl} className={'nav-item' + (active === n.lbl ? ' on' : '')} onClick={() => onGo(n.lbl)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-lbl">{n.lbl}</span>
            </div>
          ))}
        </div>
      </nav>
    )
  }

  return (
    <nav className="bottom-nav">
      <div className="nav-user" style={{ display: 'grid' }}>
        <div className={'nav-item' + (active === 'Accueil' ? ' on' : '')} onClick={() => onGo('Accueil')}>
          <span className="nav-icon">🏠</span><span className="nav-lbl">Accueil</span>
        </div>
        <div className={'nav-item' + (active === 'Explorer' ? ' on' : '')} onClick={() => onGo('Explorer')}>
          <span className="nav-icon">🗺️</span><span className="nav-lbl">Explorer</span>
        </div>
        <div className="nav-mid" onClick={onIA}>
          <div className="nav-mid-btn">✨</div>
          <span className="nav-lbl">IA</span>
        </div>
        <div className={'nav-item' + (active === 'Bibliothèque' ? ' on' : '')} onClick={() => onGo('Bibliothèque')}>
          <span className="nav-icon">📚</span><span className="nav-lbl">Biblio</span>
        </div>
        <div className={'nav-item' + (active === 'Profil' ? ' on' : '')} onClick={() => onGo('Profil')}>
          <span className="nav-icon">👤</span><span className="nav-lbl">Profil</span>
        </div>
      </div>
    </nav>
  )
}
