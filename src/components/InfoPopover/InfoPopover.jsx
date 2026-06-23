import { useEffect } from 'react'
import './InfoPopover.css'

// Petite fiche informative affichée en bottom-sheet (mobile-first) au clic
// sur une entité (personnage / lieu) dans le texte d'un livre.
//   entity : objet enrichi { slug, type, nom, avatar|emoji, role|type, region, description, livres }
//   onClose, onOpenLivre(slug)
export default function InfoPopover({ entity, onClose, onOpenLivre }) {
  useEffect(() => {
    if (!entity) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [entity, onClose])

  if (!entity) return null

  const isPerso = entity.kind === 'personnage'
  const pastille = entity.avatar || entity.emoji || (isPerso ? '👤' : '📍')
  const sousTitre = isPerso ? entity.role : labelType(entity)

  return (
    <div className="ip-overlay" onClick={onClose}>
      <div className="ip-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={entity.nom}>
        <div className="ip-handle" />
        <button className="ip-close" onClick={onClose} aria-label="Fermer">✕</button>

        <div className="ip-head">
          <div className={'ip-avatar ' + (isPerso ? 'is-perso' : 'is-lieu')}>{pastille}</div>
          <div>
            <div className="ip-kind">{isPerso ? 'Personnage' : 'Lieu'}</div>
            <h3 className="ip-nom">{entity.nom}</h3>
            {sousTitre && <div className="ip-sub">{sousTitre}</div>}
          </div>
        </div>

        {entity.region && <div className="ip-region">📍 {entity.region}</div>}

        <p className="ip-desc">{entity.description}</p>

        {entity.livres?.length > 0 && (
          <div className="ip-livres">
            <span className="ip-livres-lbl">Cité dans</span>
            {entity.livres.map((s) => (
              <button key={s} className="ip-livre-chip" onClick={() => onOpenLivre?.(s)}>
                📖 {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function labelType(e) {
  const map = {
    region: 'Région', ville: 'Ville', province: 'Province',
    'cours-eau': "Cours d'eau", pays: 'Pays',
  }
  return map[e.type] || 'Lieu'
}
