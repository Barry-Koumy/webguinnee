import { heroChips } from '../../../data/heroChips.js'
import { stats } from '../../../data/stats.js'

// Bannière d'accueil : titre, recherche, suggestions, statistiques
export default function Hero({ query, setQuery, onSearch }) {
  return (
    <section className="hero">
      <div className="hero-eyebrow">Patrimoine Guinéen</div>
      <h1>Explorer <em>l'âme</em><br />de la Guinée.</h1>
      <p className="hero-sub">Histoire, peuples, cultures et récits — une plateforme pour préserver notre héritage commun.</p>

      <div className="search-wrap">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder="Alpha Yaya, Fouta Djallon, 1958..."
        />
        <button className="search-btn" onClick={onSearch}>Rechercher</button>
      </div>

      <div className="chips">
        {heroChips.map((c) => (
          <span key={c} className="chip" onClick={() => setQuery(c)}>{c}</span>
        ))}
      </div>

      <div className="hero-bottom">
        <div className="stat"><div className="stat-n">{stats.nbLivres}</div><div className="stat-l">Œuvres</div></div>
        <div className="stat"><div className="stat-n">{stats.nbAuteurs}</div><div className="stat-l">Auteurs</div></div>
        <div className="stat"><div className="stat-n">{stats.nbRegions}</div><div className="stat-l">Régions</div></div>
      </div>
    </section>
  )
}
