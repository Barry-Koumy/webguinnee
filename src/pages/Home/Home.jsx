import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast.jsx'
import { useFadeUp } from '../../hooks/useFadeUp.js'
import AuthModals from './sections/AuthModals.jsx'
import SiteHeader from './sections/SiteHeader.jsx'
import Hero from './sections/Hero.jsx'
import Progression from './sections/Progression.jsx'
import Recommandations from './sections/Recommandations.jsx'
import Aujourdhui from './sections/Aujourdhui.jsx'
import Citation from './sections/Citation.jsx'
import RegionsSection from './sections/RegionsSection.jsx'
import ChronoStrip from './sections/ChronoStrip.jsx'
import RecitsSection from './sections/RecitsSection.jsx'
import Cta from './sections/Cta.jsx'
import BottomNav from './sections/BottomNav.jsx'
import './Home.css'

// Cibles de navigation depuis la barre basse (libellé → route)
const NAV_ROUTES = {
  Explorer: '/explorer',
  Chronologie: '/chronologie',
  Récits: '/recits',
  Bibliothèque: '/bibliotheque',
  Profil: '/profil',
}

export default function Home() {
  const navigate = useNavigate()
  const { showToast, ToastEl } = useToast()

  const [connected, setConnected] = useState(false)
  const [userName, setUserName] = useState('')
  const [modal, setModal] = useState(null) // null | 'conn' | 'reg'
  const [query, setQuery] = useState('')
  const [activeChrono, setActiveChrono] = useState(null)
  const [activeNav, setActiveNav] = useState('Accueil')
  const [playing, setPlaying] = useState(null)
  const [offlineSaved, setOfflineSaved] = useState(false)

  const [lEmail, setLEmail] = useState('')
  const [rNom, setRNom] = useState('')

  const pf1 = useRef(null)
  const pf2 = useRef(null)

  useFadeUp([connected])

  // anime les barres de progression à la connexion
  useEffect(() => {
    if (!connected) return
    const t = setTimeout(() => {
      if (pf1.current) pf1.current.style.width = '67%'
      if (pf2.current) pf2.current.style.width = '23%'
    }, 300)
    return () => clearTimeout(t)
  }, [connected])

  const activate = (name) => {
    setConnected(true)
    setUserName(name)
    showToast('👋 Bienvenue ' + name + ' !')
  }

  const login = () => {
    if (!lEmail.trim()) { showToast('⚠️ Entrez votre email'); return }
    const name = lEmail.split('@')[0]
    setModal(null)
    activate(name.charAt(0).toUpperCase() + name.slice(1))
  }

  const register = () => {
    if (!rNom.trim()) { showToast('⚠️ Entrez votre prénom et nom'); return }
    setModal(null)
    activate(rNom.split(' ')[0])
  }

  const saveOffline = () => {
    if (!connected) { setModal('conn'); showToast("🔒 Connectez-vous d'abord"); return }
    setOfflineSaved(true)
    showToast('✓ Disponible hors ligne')
  }

  const requireAuth = (action) => {
    if (!connected) { setModal('conn'); showToast('🔒 Connectez-vous pour contribuer'); return }
    showToast('🚀 ' + action + ' — bientôt disponible')
  }

  const togglePlay = (i) => {
    setPlaying((p) => (p === i ? null : i))
    if (playing !== i) showToast('🎙️ Lecture en cours...')
  }

  const doSearch = () => {
    if (!query.trim()) { showToast('✏️ Entrez un terme de recherche'); return }
    showToast('🔍 Recherche : ' + query)
  }

  const navGo = (label) => {
    setActiveNav(label)
    if (label === 'Accueil') return
    if (NAV_ROUTES[label]) { navigate(NAV_ROUTES[label]); return }
    showToast('🔗 ' + label + ' — bientôt disponible')
  }

  return (
    <div className="page-home">
      {ToastEl}

      <AuthModals
        modal={modal} setModal={setModal}
        lEmail={lEmail} setLEmail={setLEmail} onLogin={login}
        rNom={rNom} setRNom={setRNom} onRegister={register}
      />

      <SiteHeader connected={connected} userName={userName} onLogin={() => setModal('conn')} />

      <Hero query={query} setQuery={setQuery} onSearch={doSearch} />

      <Progression connected={connected} pf1={pf1} pf2={pf2} />
      <Recommandations connected={connected} />
      <Aujourdhui offlineSaved={offlineSaved} onOffline={saveOffline} />
      <Citation />
      <RegionsSection onSelect={(r) => navigate('/region/' + r.slug)} />
      <ChronoStrip active={activeChrono} onSelect={(c) => { setActiveChrono(c.nom); showToast('⏳ ' + c.nom) }} />
      <RecitsSection playing={playing} onToggle={togglePlay} />
      <Cta onContribute={requireAuth} />

      <BottomNav connected={connected} active={activeNav} onGo={navGo} onIA={() => navigate('/ia')} />
    </div>
  )
}
