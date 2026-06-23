import { useNavigate } from 'react-router-dom'
import { recommandations } from '../../../data/recommandations.js'

// Section « Pour vous » (visible une fois connecté) — œuvres réelles, cliquables
export default function Recommandations({ connected }) {
  const navigate = useNavigate()
  return (
    <section className={'reco-section fade-up' + (connected ? ' on' : '')}>
      <div className="section-eye" style={{ paddingRight: 22 }}>✨ Pour vous</div>
      <div className="reco-scroll">
        {recommandations.map((r) => (
          <div
            className="reco-card"
            key={r.slug || r.titre}
            onClick={() => r.slug && navigate('/livre/' + r.slug)}
            style={{ cursor: r.slug ? 'pointer' : 'default' }}
          >
            <div className="reco-cat">{r.cat}</div>
            <div className="reco-titre">{r.titre}</div>
            <div className="reco-region">{r.region}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
