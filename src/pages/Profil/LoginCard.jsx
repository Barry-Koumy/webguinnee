// Carte de connexion (état non connecté)
export default function LoginCard({ email, setEmail, onLogin, onRegister }) {
  return (
    <div className="pf-card">
      <h3>Bon retour 👋</h3>
      <p>Accédez à votre bibliothèque, votre progression et vos lectures hors ligne.</p>
      <div className="pf-field">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" autoComplete="email" />
      </div>
      <div className="pf-field">
        <label>Mot de passe</label>
        <input type="password" placeholder="••••••••" autoComplete="current-password" />
      </div>
      <button className="btn-main" onClick={onLogin}>Se connecter</button>
      <div className="pf-switch">Pas de compte ? <a onClick={onRegister}>S'inscrire gratuitement</a></div>
    </div>
  )
}
