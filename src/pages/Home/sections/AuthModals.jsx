// Modales de connexion et d'inscription (bottom-sheets)
export default function AuthModals({ modal, setModal, lEmail, setLEmail, onLogin, rNom, setRNom, onRegister }) {
  return (
    <>
      {/* CONNEXION */}
      <div className={'overlay' + (modal === 'conn' ? ' active' : '')} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
        <div className="modal">
          <div className="modal-handle"></div>
          <h2>Bon retour 👋</h2>
          <p>Accédez à votre bibliothèque, progression et lectures hors ligne.</p>
          <div className="field">
            <label>Email</label>
            <input type="email" value={lEmail} onChange={(e) => setLEmail(e.target.value)} placeholder="votre@email.com" autoComplete="email" />
          </div>
          <div className="field">
            <label>Mot de passe</label>
            <input type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="btn-main" onClick={onLogin}>Se connecter</button>
          <div className="modal-switch">Pas de compte ? <a onClick={() => setModal('reg')}>S'inscrire gratuitement</a></div>
        </div>
      </div>

      {/* INSCRIPTION */}
      <div className={'overlay' + (modal === 'reg' ? ' active' : '')} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
        <div className="modal">
          <div className="modal-handle"></div>
          <h2>Rejoignez-nous 🌍</h2>
          <p>Créez votre compte gratuit et accédez à toute la mémoire de la Guinée.</p>
          <div className="field">
            <label>Prénom et nom</label>
            <input type="text" value={rNom} onChange={(e) => setRNom(e.target.value)} placeholder="Mamadou Diallo" autoComplete="name" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="votre@email.com" autoComplete="email" />
          </div>
          <div className="field">
            <label>Mot de passe</label>
            <input type="password" placeholder="Minimum 8 caractères" autoComplete="new-password" />
          </div>
          <button className="btn-main" onClick={onRegister}>Créer mon compte</button>
          <div className="modal-switch">Déjà un compte ? <a onClick={() => setModal('conn')}>Se connecter</a></div>
        </div>
      </div>
    </>
  )
}
