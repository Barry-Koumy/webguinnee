import { useNavigate } from 'react-router-dom'
import { desktopLinks, bottomNavItems } from '../../data/navigation.js'
import './Layout.css'

// Coquille commune : header + bandeau + contenu + nav bas.
// `active` = chemin de la route courante (pour surligner la nav).
export default function Layout({ active, eyebrow, title, sub, children, toastEl }) {
  const navigate = useNavigate()

  return (
    <div className="page-shell">
      {toastEl}

      <header>
        <a className="logo" onClick={() => navigate('/')}>
          <div className="logo-icon">🌍</div>
          <div>
            <div className="logo-name">WebGuinée</div>
            <div className="logo-sub">Mémoire, Histoire & Avenir</div>
          </div>
        </a>
        <nav className="nav-desktop">
          {desktopLinks.map((l) => (
            <a key={l.to} className={active === l.to ? 'on' : undefined} onClick={() => navigate(l.to)}>{l.label}</a>
          ))}
        </nav>
        <div className="header-right">
          <button className="btn-icon" onClick={() => navigate('/profil')}>👤</button>
        </div>
      </header>

      <section className="page-header">
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h1 className="page-title" dangerouslySetInnerHTML={{ __html: title }} />
        {sub && <p className="page-sub">{sub}</p>}
      </section>

      <main className="page-body">{children}</main>

      <nav className="bottom-nav">
        {bottomNavItems.map((n) =>
          n.mid ? (
            <div key={n.to} className={'nav-mid' + (active === n.to ? ' on' : '')} onClick={() => navigate(n.to)}>
              <div className="nav-mid-btn">{n.icon}</div>
              <span className="nav-lbl">{n.lbl}</span>
            </div>
          ) : (
            <div key={n.to} className={'nav-item' + (active === n.to ? ' on' : '')} onClick={() => navigate(n.to)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-lbl">{n.lbl}</span>
            </div>
          )
        )}
      </nav>
    </div>
  )
}
