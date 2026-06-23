import { useState } from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import { useToast } from '../../hooks/useToast.jsx'
import LoginCard from './LoginCard.jsx'
import ProfilConnecte from './ProfilConnecte.jsx'
import './Profil.css'

export default function Profil() {
  const { showToast, ToastEl } = useToast()
  const [connected, setConnected] = useState(false)
  const [email, setEmail] = useState('')

  const login = () => {
    if (!email.trim()) { showToast('⚠️ Entrez votre email'); return }
    setConnected(true)
    showToast('👋 Bienvenue !')
  }

  const logout = () => {
    setConnected(false)
    setEmail('')
    showToast('À bientôt !')
  }

  const name = email.split('@')[0] || 'Invité'

  return (
    <Layout
      active="/profil"
      eyebrow="Votre compte"
      title="Mon <em>profil</em>"
      sub={connected ? undefined : 'Connectez-vous pour accéder à votre bibliothèque et vos contributions.'}
      toastEl={ToastEl}
    >
      <div className="p-profil">
        {connected ? (
          <ProfilConnecte name={name} onItem={(m) => showToast(m.icon + ' ' + m.label)} onLogout={logout} />
        ) : (
          <LoginCard
            email={email}
            setEmail={setEmail}
            onLogin={login}
            onRegister={() => showToast('📝 Inscription — bientôt')}
          />
        )}
      </div>
    </Layout>
  )
}
