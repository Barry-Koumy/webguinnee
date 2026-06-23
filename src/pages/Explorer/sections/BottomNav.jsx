import { useNavigate } from 'react-router-dom'

// Barre de navigation basse de l'Explorer (onglet Explorer actif)
export default function BottomNav() {
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      <div className="nav-item" onClick={() => navigate('/')}>
        <span className="nav-icon">🏠</span><span className="nav-lbl">Accueil</span>
      </div>
      <div className="nav-item on">
        <span className="nav-icon">🗺️</span><span className="nav-lbl">Explorer</span>
      </div>
      <div className="nav-mid" onClick={() => navigate('/ia')}>
        <div className="nav-mid-btn">✨</div>
        <span className="nav-lbl">IA</span>
      </div>
      <div className="nav-item" onClick={() => navigate('/bibliotheque')}>
        <span className="nav-icon">📚</span><span className="nav-lbl">Biblio</span>
      </div>
      <div className="nav-item" onClick={() => navigate('/profil')}>
        <span className="nav-icon">👤</span><span className="nav-lbl">Profil</span>
      </div>
    </nav>
  )
}
