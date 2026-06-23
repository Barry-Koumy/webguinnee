import { useNavigate } from 'react-router-dom'

// En-tête de la page d'accueil (logo, nav desktop, connexion/avatar)
export default function SiteHeader({ connected, userName, onLogin }) {
  const navigate = useNavigate()

  return (
    <header>
      <a href="#" className="logo" onClick={(e) => e.preventDefault()}>
        <div className="logo-icon">🌍</div>
        <div>
          <div className="logo-name">WebGuinée</div>
          <div className="logo-sub">Mémoire, Histoire & Avenir</div>
        </div>
      </a>
      <nav className="nav-desktop">
        <a onClick={() => navigate('/explorer')}>Explorer</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Régions</a>
        <a onClick={() => navigate('/chronologie')}>Chronologie</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Archives</a>
      </nav>
      <div className="header-right">
        {!connected && <button className="btn-login" onClick={onLogin}>Se connecter</button>}
        {connected && <button className="avatar-btn show">{userName[0]?.toUpperCase()}</button>}
      </div>
    </header>
  )
}
