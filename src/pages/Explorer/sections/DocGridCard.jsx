// Document en vue grille (vignette)
export default function DocGridCard({ doc, onAction }) {
  return (
    <div className="doc-grid-card" onClick={() => onAction?.(doc)} style={{ cursor: 'pointer' }}>
      <div className={'dgc-cover ' + doc.cover}>{doc.icon}</div>
      <div className="dgc-body">
        <div className="dgc-titre">{doc.titre}</div>
        <div className="dgc-meta">{doc.meta}</div>
      </div>
    </div>
  )
}
