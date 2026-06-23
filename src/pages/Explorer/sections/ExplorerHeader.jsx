import { useNavigate } from 'react-router-dom'

// En-tête de l'Explorer (logo, nav desktop, bouton filtres)
export default function ExplorerHeader({ onOpenFilter }) {
  const navigate = useNavigate()

  return (
    <header>
      <a href="#" className="logo" onClick={(e) => { e.preventDefault(); navigate('/') }}>
        <div className="logo-icon">🌍</div>
        <div>
          <div className="logo-name">WebGuinée</div>
          <div className="logo-sub">Mémoire, Histoire & Avenir</div>
        </div>
      </a>
      <nav className="nav-desktop">
        <a onClick={() => navigate('/')}>Accueil</a>
        <a className="on">Explorer</a>
        <a onClick={(e) => e.preventDefault()}>Régions</a>
        <a onClick={() => navigate('/chronologie')}>Chronologie</a>
        <a onClick={(e) => e.preventDefault()}>Archives</a>
      </nav>
      <div className="header-right">
        <button className="btn-icon" onClick={onOpenFilter}>⚙️</button>
        <button className="btn-icon" onClick={() => navigate('/profil')}>👤</button>
      </div>
    </header>
  )
}
