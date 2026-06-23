// Document en vue liste (ligne)
export default function DocRow({ doc, onAction }) {
  return (
    <div className="doc-card">
      <div className={'doc-cover ' + doc.cover}>
        <span>{doc.icon}</span>
        <span className="doc-type-badge">{doc.badge}</span>
      </div>
      <div className="doc-info">
        <div className="doc-titre">{doc.titre}</div>
        <div className="doc-auteur">{doc.auteur}</div>
        <div className="doc-chips">
          {doc.chips.map((c, i) => <span className="doc-chip" key={c + i}>{c}</span>)}
        </div>
        <div className="doc-meta">{doc.meta}</div>
      </div>
      <button className="doc-action" onClick={() => onAction(doc)}>{doc.action}</button>
    </div>
  )
}
