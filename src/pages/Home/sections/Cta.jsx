// Section finale d'appel à contribution
export default function Cta({ onContribute }) {
  return (
    <section className="cta-section fade-up">
      <div className="cta-card">
        <div className="cta-title">Contribuez à la<br />mémoire collective</div>
        <p className="cta-sub">Partagez vos archives, photos et témoignages. Ensemble, préservons l'histoire de la Guinée.</p>
        <div className="cta-btns">
          <button className="cta-btn-p" onClick={() => onContribute('📄 Ajouter un document')}>📄 Ajouter un doc</button>
          <button className="cta-btn-s" onClick={() => onContribute('🎙️ Enregistrer un récit')}>🎙️ Récit oral</button>
        </div>
      </div>
    </section>
  )
}
