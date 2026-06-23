import { profilMenu } from '../../data/profilMenu.js'

// Vue du profil connecté : en-tête, statistiques, menu, déconnexion
export default function ProfilConnecte({ name, onItem, onLogout }) {
  return (
    <>
      <div className="pf-head">
        <div className="pf-avatar">{name[0]?.toUpperCase()}</div>
        <div>
          <div className="pf-name">{name.charAt(0).toUpperCase() + name.slice(1)}</div>
          <div className="pf-role">Lecteur · membre depuis 2026</div>
        </div>
      </div>

      <div className="pf-stats">
        <div className="pf-stat"><div className="pf-stat-n">0</div><div className="pf-stat-l">Sauvegardés</div></div>
        <div className="pf-stat"><div className="pf-stat-n">0</div><div className="pf-stat-l">Hors ligne</div></div>
        <div className="pf-stat"><div className="pf-stat-n">0</div><div className="pf-stat-l">Contributions</div></div>
      </div>

      <div className="pf-menu">
        {profilMenu.map((m) => (
          <button className="pf-menu-item" key={m.label} onClick={() => onItem(m)}>
            <span className="pf-menu-icon">{m.icon}</span>
            <span className="pf-menu-label">{m.label}</span>
            <span className="pf-menu-arrow">›</span>
          </button>
        ))}
      </div>

      <button className="btn-ghost pf-logout" onClick={onLogout}>Se déconnecter</button>
    </>
  )
}
