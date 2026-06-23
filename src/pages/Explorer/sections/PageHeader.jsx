import { stats } from '../../../data/stats.js'

// Bandeau de titre + barre de recherche de l'Explorer
export default function PageHeader({ search, onSearch }) {
  return (
    <section className="page-header">
      <div className="page-title-wrap">
        <div>
          <div className="page-eyebrow">Archives & Documents</div>
          <h1 className="page-title">Explorer <em>l'histoire</em></h1>
          <p className="page-count"><strong>{stats.nbLivres}</strong> œuvres · {stats.nbAuteurs} auteurs</p>
        </div>
      </div>
      <div style={{ height: 18 }}></div>

      <div className="search-zone">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Chercher un document, auteur, thème..."
        />
        <button className="search-btn">🔍</button>
      </div>
    </section>
  )
}
