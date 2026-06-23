import { useNavigate } from 'react-router-dom'
import { documentsListe, documentsGrille } from '../../../data/documents.js'
import DocRow from './DocRow.jsx'
import DocGridCard from './DocGridCard.jsx'

// Mots-clés extraits d'un libellé de chip (ex: '🏔️ Fouta Djallon' → 'fouta djallon')
function chipKeyword(label) {
  return label.replace(/[^\w\s]/gu, '').trim().toLowerCase()
}

function filterDocs(docs, tabFilter, activeChips, allowedSlugs) {
  let list = docs

  // Filtre par catégorie sélectionnée (« Parcourir par catégorie »)
  if (allowedSlugs) {
    const set = new Set(allowedSlugs)
    list = list.filter((d) => set.has(d.slug))
  }

  // Filtre par onglet
  if (tabFilter === 'docs') {
    list = list.filter((d) => d.cover !== 'audio')
  } else if (tabFilter === 'audio') {
    list = list.filter((d) => d.cover === 'audio')
  }

  // Filtre par QuickChips actifs (hors "✨ Récents" qui est le défaut)
  const active = [...activeChips].filter((c) => !c.includes('Récents'))
  if (active.length > 0) {
    list = list.filter((d) => {
      const docText = [d.titre, d.auteur, ...(d.chips || [])].join(' ').toLowerCase()
      return active.some((chip) => docText.includes(chipKeyword(chip)))
    })
  }

  return list
}

export default function DocumentsSection({ view, onView, onAction, tabFilter = 'all', activeChips = new Set(), filtre = null, onClearFiltre }) {
  const navigate = useNavigate()
  const allowedSlugs = filtre ? filtre.livreSlugs : null
  const listeFiltered = filterDocs(documentsListe, tabFilter, activeChips, allowedSlugs)
  const grilleFiltered = filterDocs(documentsGrille, tabFilter, activeChips, allowedSlugs)

  return (
    <div className="docs-section anim anim-d3">
      <div className="section-label">
        <h3>
          {filtre ? `${filtre.icon} ${filtre.nom}` : '📄 Bibliothèque'} ({listeFiltered.length} œuvre{listeFiltered.length > 1 ? 's' : ''})
        </h3>
        {filtre
          ? <span className="see-all" onClick={onClearFiltre} style={{ cursor: 'pointer' }}>✕ Toutes</span>
          : <span className="see-all" onClick={() => navigate('/bibliotheque')} style={{ cursor: 'pointer' }}>Tout voir →</span>}
      </div>

      <div className="view-mode-bar">
        <div className="result-count">
          Affichage : <strong>{listeFiltered.length > 0 ? listeFiltered.length : '–'}</strong> résultat{listeFiltered.length > 1 ? 's' : ''}
        </div>
        <div className="view-toggle">
          <button className={'vbtn' + (view === 'list' ? ' on' : '')} onClick={() => onView('list')} title="Liste">☰</button>
          <button className={'vbtn' + (view === 'grid' ? ' on' : '')} onClick={() => onView('grid')} title="Grille">⊞</button>
        </div>
      </div>

      {listeFiltered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--muted, #888)', fontSize: '0.9rem' }}>
          Aucun document pour ce filtre.
        </div>
      )}

      {view === 'list' && listeFiltered.length > 0 && (
        <div className="doc-list">
          {listeFiltered.map((d) => <DocRow key={d.slug || d.titre} doc={d} onAction={onAction} />)}
        </div>
      )}

      {view === 'grid' && grilleFiltered.length > 0 && (
        <div className="doc-grid">
          {grilleFiltered.map((d) => <DocGridCard key={d.slug || d.titre} doc={d} onAction={onAction} />)}
        </div>
      )}
    </div>
  )
}
