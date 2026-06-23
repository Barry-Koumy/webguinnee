// Section « Reprendre la lecture » (visible une fois connecté)
export default function Progression({ connected, pf1, pf2 }) {
  return (
    <section className={'prog-section fade-up' + (connected ? ' on' : '')}>
      <div className="prog-label">📚 Reprendre la lecture</div>
      <div className="prog-item">
        <div className="prog-cover">📜</div>
        <div className="prog-info">
          <div className="prog-titre">Histoire du Fouta Djallon des origines à 1897</div>
          <div className="prog-bar"><div className="prog-fill" ref={pf1} style={{ width: 0 }}></div></div>
        </div>
        <div className="prog-pct">67%</div>
      </div>
      <div className="prog-item">
        <div className="prog-cover">👤</div>
        <div className="prog-info">
          <div className="prog-titre">Alpha Yaya Diallo et son époque</div>
          <div className="prog-bar"><div className="prog-fill" ref={pf2} style={{ width: 0 }}></div></div>
        </div>
        <div className="prog-pct">23%</div>
      </div>
    </section>
  )
}
