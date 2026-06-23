import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home/Home.jsx'
import Explorer from './pages/Explorer/Explorer.jsx'
import Chronologie from './pages/Chronologie/Chronologie.jsx'
import Recits from './pages/Recits/Recits.jsx'
import Bibliotheque from './pages/Bibliotheque/Bibliotheque.jsx'
import Livre from './pages/Livre/Livre.jsx'
import Region from './pages/Region/Region.jsx'
import Theme from './pages/Theme/Theme.jsx'
import Profil from './pages/Profil/Profil.jsx'
import IA from './pages/IA/IA.jsx'

// Base du déploiement (ex: "/webguinnee" sur GitHub Pages, "" en local)
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/chronologie" element={<Chronologie />} />
        <Route path="/recits" element={<Recits />} />
        <Route path="/bibliotheque" element={<Bibliotheque />} />
        <Route path="/region/:slug" element={<Region />} />
        <Route path="/theme/:slug" element={<Theme />} />
        <Route path="/livre/:slug" element={<Livre />} />
        <Route path="/livre/:slug/chapitre/:chapId" element={<Livre />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/ia" element={<IA />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
